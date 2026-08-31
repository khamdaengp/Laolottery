import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  API_URL,
  pad,
  runPredictAlgorithm,
  computeAllLotteryAnalyses,
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage
} from '../utils/lottery';

const LotteryContext = createContext(null);

// Daily schedule: 4 times per day, specifically synchronized at 08:30 and 20:30 (8:30 PM draw time)
const SCHEDULED_SYNC_TIMES = [
  { hour: 8, minute: 30, label: '08:30 AM' },
  { hour: 14, minute: 30, label: '02:30 PM' },
  { hour: 20, minute: 30, label: '08:30 PM (Draw Time)' },
  { hour: 23, minute: 0, label: '11:00 PM' }
];

const AUTO_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

export function LotteryProvider({ children }) {
  const [activeTab, setActiveTab] = useState('predict');

  // Theme: 'dark' | 'light'
  const [theme, setTheme] = useState(() => loadFromStorage('lao_lottery_theme', 'dark'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveToStorage('lao_lottery_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Predict Tab Inputs & State - restored from localStorage
  const [n1, setN1State] = useState(() => loadFromStorage(STORAGE_KEYS.N1, ''));
  const [n2, setN2State] = useState(() => loadFromStorage(STORAGE_KEYS.N2, ''));
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() =>
    loadFromStorage(STORAGE_KEYS.LAST_UPDATED, null)
  );
  const [lastSyncReason, setLastSyncReason] = useState('Init');

  const setN1 = useCallback((val) => {
    setN1State(val);
    saveToStorage(STORAGE_KEYS.N1, val);
  }, []);

  const setN2 = useCallback((val) => {
    setN2State(val);
    saveToStorage(STORAGE_KEYS.N2, val);
  }, []);

  const [predictState, setPredictState] = useState({
    allList: [],
    dupList: [],
    lucky: '—',
    hasPredicted: false
  });

  // All Analysis Data (2D, 3D, 4D, 5D, 6D) - restored from localStorage
  const [allAnalysisData, setAllAnalysisData] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ANALYZE_DATA, null)
  );

  // Status for 2D Analyzer Tab
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeStatus, setAnalyzeStatus] = useState({
    type: allAnalysisData?.d2?.hasAnalyzed ? 'ok' : '',
    message: allAnalysisData?.d2?.hasAnalyzed
      ? `✓ ໂຫຼດຈາກ Cache — ${allAnalysisData.totalDraws} ງວດ`
      : 'ກົດປຸ່ມເພື່ອເລີ່ມ'
  });

  // 2D Analyze Data
  const analyzeData = useMemo(() => {
    if (allAnalysisData?.d2) {
      return allAnalysisData.d2;
    }
    return {
      total: null,
      statHot: null,
      statCold: null,
      hotMax: null,
      coldMin: null,
      topHot: [],
      topCold: [],
      apiTop10: [],
      apiTop20Hot: [],
      apiTop20Cold: [],
      tableData: [],
      hasAnalyzed: false
    };
  }, [allAnalysisData]);

  // 3D Top Digits (shared with Predict tab) - from d3 analysis or localStorage
  const topDigitsList = useMemo(() => {
    if (allAnalysisData?.d3?.topDigits) {
      return allAnalysisData.d3.topDigits.map(r => r.value);
    }
    return loadFromStorage(STORAGE_KEYS.TOP_DIGITS, []);
  }, [allAnalysisData]);

  const setTopDigitsList = useCallback((digits) => {
    saveToStorage(STORAGE_KEYS.TOP_DIGITS, digits);
  }, []);

  // Store raw history data (in-memory + localStorage)
  const [rawHistory, setRawHistory] = useState(() =>
    loadFromStorage(STORAGE_KEYS.HISTORY, null)
  );

  // Derived Match List: dupList ∩ apiTop10
  const matchList = useMemo(() => {
    if (!predictState.dupList.length || !analyzeData.apiTop10.length) {
      return [];
    }
    const top10Set = new Set(analyzeData.apiTop10);
    return predictState.dupList.filter(n => top10Set.has(n));
  }, [predictState.dupList, analyzeData.apiTop10]);

  // Derived Cross Match for Analyze Tab
  const analyzeCrossMatchList = useMemo(() => {
    if (!analyzeData.apiTop10.length || !predictState.dupList.length) {
      return [];
    }
    const top10Set = new Set(analyzeData.apiTop10);
    return predictState.dupList.filter(n => top10Set.has(n));
  }, [analyzeData.apiTop10, predictState.dupList]);

  // Predict Tab: Sample Combos (from topDigitsList × matchList)
  const sampleCombos = useMemo(() => {
    if (!matchList.length || !topDigitsList.length) return [];
    const sortedMatches = [...matchList].sort((a, b) => Number(a) - Number(b));
    const combos = [];
    sortedMatches.forEach(suffix => {
      topDigitsList.forEach(digit => {
        combos.push(`${digit}${suffix}`);
      });
    });
    return combos;
  }, [matchList, topDigitsList]);

  // Predict Tab: Full Combos (0-9 × matchList)
  const fullCombos = useMemo(() => {
    if (!matchList.length) return [];
    const sortedMatches = [...matchList].sort((a, b) => Number(a) - Number(b));
    const allDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const combos = [];
    sortedMatches.forEach(suffix => {
      allDigits.forEach(digit => {
        combos.push(`${digit}${suffix}`);
      });
    });
    return combos;
  }, [matchList]);

  // Execute Predict
  const runPredict = useCallback((val1 = n1, val2 = n2) => {
    const s1 = String(val1).trim();
    const s2 = String(val2).trim();
    if (!s1 || !s2) return false;

    const res = runPredictAlgorithm(s1, s2, analyzeData.apiTop10);
    if (res) {
      setPredictState({
        allList: res.allList,
        dupList: res.dupList,
        lucky: res.lucky,
        hasPredicted: true
      });
      return true;
    }
    return false;
  }, [n1, n2, analyzeData.apiTop10]);

  // Process all tabs analysis (2D, 3D, 4D, 5D, 6D) and save to localStorage
  const processAndSaveAllAnalyses = useCallback((validEntries) => {
    const fullAnalysis = computeAllLotteryAnalyses(validEntries);
    if (fullAnalysis) {
      setAllAnalysisData(fullAnalysis);
      saveToStorage(STORAGE_KEYS.ANALYZE_DATA, fullAnalysis);
      if (fullAnalysis.d3?.topDigits) {
        saveToStorage(
          STORAGE_KEYS.TOP_DIGITS,
          fullAnalysis.d3.topDigits.map(r => r.value)
        );
      }
    }
    return fullAnalysis;
  }, []);

  // Fetch API Helper with localStorage cache integration
  const fetchLotteryData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      if (rawHistory && rawHistory.length >= 2) {
        return rawHistory;
      }
      const localData = loadFromStorage(STORAGE_KEYS.HISTORY, null);
      if (Array.isArray(localData) && localData.length >= 2) {
        setRawHistory(localData);
        return localData;
      }
    }

    // Fetch fresh data from API
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const data = json.resultData;
    const validEntries = Array.isArray(data) ? data.filter(d => d && d.winNumber && String(d.winNumber).trim() !== '') : [];

    if (validEntries.length > 0) {
      const now = Date.now();
      saveToStorage(STORAGE_KEYS.HISTORY, validEntries);
      saveToStorage(STORAGE_KEYS.LAST_UPDATED, now);
      setLastSyncTime(now);
      setRawHistory(validEntries);
    }

    return validEntries;
  }, [rawHistory]);

  // Master Auto-Sync Function
  const syncLotteryData = useCallback(async (force = false, autoFillInputs = false, reason = 'Schedule') => {
    const lastTime = loadFromStorage(STORAGE_KEYS.LAST_UPDATED, 0);
    const isExpired = !lastTime || (Date.now() - lastTime) >= AUTO_SYNC_INTERVAL_MS;

    if (!force && !isExpired && rawHistory && rawHistory.length >= 2) {
      return rawHistory;
    }

    setIsSyncing(true);
    setLastSyncReason(reason);
    try {
      const validEntries = await fetchLotteryData(true);
      if (validEntries.length >= 2) {
        // Calculate all 2D, 3D, 4D, 5D, 6D analyses & update localStorage
        const fullAnalysis = processAndSaveAllAnalyses(validEntries);

        const latest = pad(validEntries[0].winNumber, 6).slice(-2);
        const previous = pad(validEntries[1].winNumber, 6).slice(-2);

        // Auto-fill inputs if requested or if they are currently empty
        if (autoFillInputs || !n1 || !n2) {
          setN1(previous);
          setN2(latest);
          const predictResult = runPredictAlgorithm(previous, latest, fullAnalysis?.d2?.apiTop10 || []);
          if (predictResult) {
            setPredictState({
              allList: predictResult.allList,
              dupList: predictResult.dupList,
              lucky: predictResult.lucky,
              hasPredicted: true
            });
          }
        }

        setAnalyzeStatus({
          type: 'ok',
          message: `✓ ອັບເດດອັດຕະໂນມັດສຳເລັດ (${reason}) — ${validEntries.length} ງວດ`
        });
      }
      return validEntries;
    } catch (err) {
      console.warn('Auto-sync error:', err);
      setAnalyzeStatus({
        type: 'error',
        message: '✕ ' + err.message
      });
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [rawHistory, fetchLotteryData, processAndSaveAllAnalyses, n1, n2, setN1, setN2]);

  // Run 2D Analyzer (force refresh all analyses)
  const runAnalyze = useCallback(async () => {
    setAnalyzeLoading(true);
    setAnalyzeStatus({ type: 'loading', message: '⟳ ກຳລັງດຶງຂໍ້ມູນ...' });

    try {
      const validEntries = await syncLotteryData(true, true, 'Manual');
      if (validEntries && validEntries.length >= 2) {
        setAnalyzeStatus({
          type: 'ok',
          message: `✓ ໂຫຼດສຳເລັດ — ${validEntries.length} ງວດ`
        });
      }
    } catch (err) {
      setAnalyzeStatus({
        type: 'error',
        message: '✕ ' + err.message
      });
    } finally {
      setAnalyzeLoading(false);
    }
  }, [syncLotteryData]);

  // Track the last minute slot triggered to prevent multiple duplicate calls in the same minute
  const lastTriggeredSlotRef = useRef('');

  // Initial Mount & 8:30 Precise Clock Auto-Reload
  useEffect(() => {
    const lastTime = loadFromStorage(STORAGE_KEYS.LAST_UPDATED, 0);
    const isExpired = !lastTime || (Date.now() - lastTime) >= AUTO_SYNC_INTERVAL_MS;

    if (isExpired || !rawHistory || rawHistory.length < 2) {
      syncLotteryData(true, true, 'Initial');
    } else {
      if (n1 && n2 && !predictState.hasPredicted) {
        runPredict(n1, n2);
      }
    }

    // Precise Clock Checker (runs every 10 seconds to catch 8:30 / 20:30 immediately)
    const clockTimer = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const slotKey = `${now.toDateString()}-${currentHour}:${currentMinute}`;

      // Check if current time matches 08:30 or 20:30 (8:30 PM draw time) or other slots
      const isTargetSlot = SCHEDULED_SYNC_TIMES.some(
        slot => slot.hour === currentHour && slot.minute === currentMinute
      );

      // Also during the 20:30-20:45 draw window, check every 2 minutes for latest numbers
      const isDrawWindow = (currentHour === 20 && currentMinute >= 30 && currentMinute <= 45 && currentMinute % 2 === 0);

      if ((isTargetSlot || isDrawWindow) && lastTriggeredSlotRef.current !== slotKey) {
        lastTriggeredSlotRef.current = slotKey;
        const slotLabel = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        console.log(`[Auto-Reload] ⏰ Triggering scheduled lottery sync at ${slotLabel}`);
        syncLotteryData(true, true, `Auto ${slotLabel}`);
      }
    }, 10 * 1000);

    // On mobile app / tab visibility focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const checkTime = loadFromStorage(STORAGE_KEYS.LAST_UPDATED, 0);
        if (!checkTime || (Date.now() - checkTime) >= AUTO_SYNC_INTERVAL_MS) {
          syncLotteryData(true, false, 'Tab Focus');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(clockTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const value = {
    activeTab,
    setActiveTab,
    n1,
    setN1,
    n2,
    setN2,
    predictState,
    matchList,
    sampleCombos,
    fullCombos,
    runPredict,
    syncLotteryData,
    isSyncing,
    lastSyncTime,
    lastSyncReason,
    analyzeLoading,
    analyzeStatus,
    analyzeData,
    allAnalysisData,
    analyzeCrossMatchList,
    runAnalyze,
    topDigitsList,
    setTopDigitsList,
    fetchLotteryData,
    processAndSaveAllAnalyses,
    theme,
    toggleTheme,
    rawHistory
  };

  return (
    <LotteryContext.Provider value={value}>
      {children}
    </LotteryContext.Provider>
  );
}

export function useLottery() {
  const ctx = useContext(LotteryContext);
  if (!ctx) {
    throw new Error('useLottery must be used within a LotteryProvider');
  }
  return ctx;
}
