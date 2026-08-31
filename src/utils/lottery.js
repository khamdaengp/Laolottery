export const API_URL = 'https://laodl.com/api/website/laolot/WinPrizeHistory?type=1';

/**
 * Pads a numeric/string value with leading zeros
 */
export function pad(value, width) {
  return String(value).padStart(width, '0');
}

/**
 * Counts the frequency of each element in an array
 */
export function countFrequency(list) {
  return list.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Calculates percentage probability from counter and total, sorted desc
 */
export function calculateProbability(counter, total) {
  return Object.entries(counter)
    .map(([value, count]) => ({
      value,
      count,
      probability: total > 0 ? (count / total) * 100 : 0
    }))
    .sort((a, b) => b.probability - a.probability || b.count - a.count || a.value.localeCompare(b.value));
}

/**
 * Formats a number as a 2-decimal percentage string
 */
export function formatPercent(value) {
  const num = Number(value);
  return (isNaN(num) ? 0 : num).toFixed(2) + '%';
}

/**
 * Returns the most frequent single digit at a specific position index across padded 6-digit numbers
 */
export function getPositionTopDigit(nums, posIndex) {
  const cnt = countFrequency(nums.map(num => num[posIndex]));
  const list = calculateProbability(cnt, nums.length);
  return list.length ? list[0].value : '0';
}

/**
 * Builds predicted combo lists (Sample TOP5 and Full 0-9)
 */
export function buildComboLists(width, topDigits, innerDigits = '', matchList = []) {
  const state = { sampleCombos: [], fullCombos: [], sampleSuffix: '' };
  if (!matchList || !matchList.length) return state;

  const sortedMatches = [...matchList].sort((a, b) => Number(a) - Number(b));
  state.sampleSuffix = sortedMatches.join(',');

  sortedMatches.forEach(suffix => {
    topDigits.forEach(d => {
      state.sampleCombos.push(`${d}${innerDigits}${suffix}`);
    });
  });

  const allDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  sortedMatches.forEach(suffix => {
    allDigits.forEach(d => {
      state.fullCombos.push(`${d}${innerDigits}${suffix}`);
    });
  });

  return state;
}

/**
 * Runs the prediction algorithm using two 2-digit numbers and optional top20 hot numbers
 */
export function runPredictAlgorithm(s1, s2, apiTop10 = []) {
  if (!s1 || !s2) return null;

  const d = s1.slice(0, Math.floor(s1.length / 2)) + '028';
  const b = s1.slice(Math.floor(s1.length / 2)) + '159';
  const c = s2.slice(0, Math.floor(s2.length / 2)) + '260';
  const a = s2.slice(Math.floor(s2.length / 2)) + '371';

  let combined = [];
  for (const ca of a) {
    for (const cb of b) { combined.push(ca + cb, cb + ca); }
    for (const cc of c) { combined.push(ca + cc, cc + ca); }
    for (const cd of d) { combined.push(ca + cd, cd + ca); }
  }
  for (const cc of c) {
    for (const cb of b) { combined.push(cb + cc, cc + cb); }
    for (const cd of d) { combined.push(cc + cd, cd + cc); }
  }

  const seen = new Set();
  const allList = combined.filter(x => {
    if (seen.has(x)) return false;
    seen.add(x);
    return true;
  });

  const counts = {};
  combined.forEach(x => {
    counts[x] = (counts[x] || 0) + 1;
  });
  const dupList = Object.keys(counts).filter(x => counts[x] >= 2);

  // MATCH: apiTop10 (Top 20 Hot from analyzer) ∩ dupList
  const top10Set = new Set(apiTop10);
  const matchList = apiTop10.length > 0 ? dupList.filter(n => top10Set.has(n)) : [];

  const lucky = Math.floor(Math.random() * 100).toString().padStart(2, '0');

  return {
    allList,
    dupList,
    matchList,
    lucky
  };
}

/**
 * Computes all lottery analyses (2D, 3D, 4D, 5D, 6D) in a single pass for caching in localStorage
 */
export function computeAllLotteryAnalyses(validEntries) {
  if (!Array.isArray(validEntries) || validEntries.length === 0) return null;

  const nums = validEntries.map(d => pad(d.winNumber, 6));
  const totalDraws = nums.length;

  // 1. 2D Analysis
  const nums2D = nums.map(n => n.slice(-2));
  const counts2D = countFrequency(nums2D);
  const table2D = {};
  for (let i = 0; i < 100; i++) {
    const k = String(i).padStart(2, '0');
    const cnt = counts2D[k] || 0;
    table2D[k] = {
      count: cnt,
      prob: totalDraws > 0 ? +((cnt / totalDraws) * 100).toFixed(2) : 0
    };
  }
  const sorted2D = Object.entries(table2D).sort((a, b) => b[1].prob - a[1].prob);
  const topHot = sorted2D.slice(0, 20);
  const topCold = [...sorted2D].sort((a, b) => a[1].prob - b[1].prob).slice(0, 20);
  const maxP = topHot[0]?.[1].prob || 1;
  const hotNumbers = topHot.map(e => e[0]);
  const coldNumbers = topCold.map(e => e[0]);
  const tableData = sorted2D.map(([num, { count, prob }]) => ({
    num,
    count,
    prob,
    maxCount: topHot[0]?.[1].count || 1
  }));

  const d2 = {
    total: totalDraws,
    statHot: topHot[0]?.[0] || '—',
    statCold: topCold[0]?.[0] || '—',
    hotMax: maxP.toFixed(2) + '%',
    coldMin: (topCold[0]?.[1].prob || 0).toFixed(2) + '%',
    topHot,
    topCold,
    apiTop10: hotNumbers,
    apiTop20Hot: hotNumbers,
    apiTop20Cold: coldNumbers,
    tableData,
    hasAnalyzed: true
  };

  // Helper for N-digit analysis (3D, 4D, 5D, 6D)
  const computeDigitData = (width, hasFirst) => {
    const lastN = nums.map(num => num.slice(-width));
    const lastCnt = countFrequency(lastN);
    const lastList = calculateProbability(lastCnt, lastN.length).slice(0, 20);

    let firstList = [];
    if (hasFirst) {
      const firstN = nums.map(num => num.slice(0, width));
      const firstCnt = countFrequency(firstN);
      firstList = calculateProbability(firstCnt, firstN.length).slice(0, 20);
    }

    const posIndex = 6 - width;
    const posN = nums.map(num => num[posIndex]);
    const posCnt = countFrequency(posN);
    const posList = calculateProbability(posCnt, posN.length);
    const topDigits = posList.slice(0, 5);

    let innerDigits = '';
    if (width >= 4) {
      for (let idx = posIndex + 1; idx <= 3; idx++) {
        innerDigits += getPositionTopDigit(nums, idx);
      }
    }

    return {
      totalDraws,
      lastList,
      firstList,
      posList,
      topDigits,
      innerDigits,
      hasAnalyzed: true
    };
  };

  const d3 = computeDigitData(3, true);
  const d4 = computeDigitData(4, true);
  const d5 = computeDigitData(5, true);
  const d6 = computeDigitData(6, false);

  return {
    lastUpdated: Date.now(),
    totalDraws,
    d2,
    d3,
    d4,
    d5,
    d6
  };
}

/**
 * Copies text to clipboard with fallback
 */
export async function copyToClipboard(text) {
  if (!text) return false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback below
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    alert('Failed to copy: ' + err.message);
    return false;
  }
}

/**
 * Storage keys for localStorage caching
 */
export const STORAGE_KEYS = {
  HISTORY: 'lao_lottery_history',
  LAST_UPDATED: 'lao_lottery_last_updated',
  N1: 'lao_lottery_n1',
  N2: 'lao_lottery_n2',
  TOP_DIGITS: 'lao_lottery_top_digits',
  ANALYZE_DATA: 'lao_lottery_analyze_data'
};

/**
 * Safely saves data to localStorage
 */
export function saveToStorage(key, value) {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
    return false;
  }
}

/**
 * Safely loads data from localStorage
 */
export function loadFromStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (err) {
    console.warn(`Failed to load ${key} from localStorage:`, err);
    return fallback;
  }
}

/**
 * Removes an item from localStorage
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`Failed to remove ${key} from localStorage:`, err);
    return false;
  }
}
