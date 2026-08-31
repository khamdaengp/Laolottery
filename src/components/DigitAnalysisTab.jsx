import React, { useState, useMemo } from 'react';
import { useLottery } from '../context/LotteryContext';
import CopyButton from './CopyButton';
import {
  formatPercent,
  buildComboLists
} from '../utils/lottery';

const TAB_CONFIGS = {
  3: {
    badge: 'LAO LOTTERY · 3D ANALYSIS',
    h1: '3D Top / Position Analysis',
    sub: 'ດຶງຂໍ້ມູນລ່າສຸດແລະວິເຄາະ 3 ຕົວຫຼັງ, 3 ຕົວນ້ອຍ ແລະ ຕຳແໜ່ງຕົວເລກ 3',
    lastTitle: 'TOP 20 LAST 3D',
    firstTitle: 'TOP 20 FIRST 3D',
    hasFirst: true
  },
  4: {
    badge: 'LAO LOTTERY · 4D ANALYSIS',
    h1: '4D Top / Position Analysis',
    sub: 'ດຶງຂໍ້ມູນລ່າສຸດແລະວິເຄາະ 4 ຕົວຫຼັງ, 4 ຕົວໜ້າ ແລະ ຕຳແໜ່ງຕົວເລກ',
    lastTitle: 'TOP 20 LAST 4D',
    firstTitle: 'TOP 20 FIRST 4D',
    hasFirst: true
  },
  5: {
    badge: 'LAO LOTTERY · 5D ANALYSIS',
    h1: '5D Top / Position Analysis',
    sub: 'ດຶງຂໍ້ມູນລ່າສຸດແລະວິເຄາະ 5 ຕົວຫຼັງ, 5 ຕົວໜ້າ ແລະ ຕຳແໜ່ງຕົວເລກ',
    lastTitle: 'TOP 20 LAST 5D',
    firstTitle: 'TOP 20 FIRST 5D',
    hasFirst: true
  },
  6: {
    badge: 'LAO LOTTERY · 6D ANALYSIS',
    h1: '6D (Full Number) Analysis',
    sub: 'ດຶງຂໍ້ມູນລ່າສຸດແລະວິເຄາະຕົວເລກເຕັມ 6 ຫຼັກ ແລະ ຕຳແໜ່ງຕົວເລກ',
    lastTitle: 'TOP 20 FULL 6D',
    firstTitle: '',
    hasFirst: false
  }
};

export default function DigitAnalysisTab({ width }) {
  const config = TAB_CONFIGS[width];
  const {
    allAnalysisData,
    matchList,
    isSyncing,
    lastSyncTime
  } = useLottery();

  const [searchQuery, setSearchQuery] = useState('');

  // Directly retrieve analysis data for this width from context/localStorage
  const analysisResult = allAnalysisData?.[`d${width}`] || null;

  // Recompute combo lists reactively whenever analysisResult or matchList updates
  const comboState = useMemo(() => {
    if (!analysisResult || width < 4) {
      return { sampleCombos: [], fullCombos: [], sampleSuffix: '' };
    }
    const topDigitValues = analysisResult.topDigits.map(r => r.value);
    return buildComboLists(width, topDigitValues, analysisResult.innerDigits, matchList);
  }, [analysisResult, width, matchList]);

  const lastItemsToCopy = analysisResult?.lastList?.map(r => r.value) || [];
  const firstItemsToCopy = analysisResult?.firstList?.map(r => r.value) || [];
  const topDigitsForNote = analysisResult?.topDigits?.map(r => r.value) || [];

  const formattedTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const isMatchedBySearch = (numStr) => {
    if (!searchQuery) return false;
    return String(numStr).includes(searchQuery);
  };

  return (
    <div>
      <div className="section-header">
        <div className="badge">{config.badge}</div>
        <h1>{config.h1}</h1>
        <p className="header-sub">{config.sub}</p>
        <div style={{ marginTop: '0.75rem', fontSize: '11px', color: 'var(--gold-dim)', fontFamily: 'var(--mono)', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.18)', padding: '3px 12px', borderRadius: '20px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: isSyncing ? 'var(--gold)' : 'var(--green)', boxShadow: isSyncing ? '0 0 6px var(--gold)' : '0 0 6px var(--green)' }} />
          {isSyncing ? 'ກຳລັງອັບເດດ...' : formattedTime ? `Auto-Reload 8:30 (20:30) & 4x/ມື້ · ${formattedTime} (${analysisResult?.totalDraws || 0} ງວດ)` : `Auto-Reload 8:30 (20:30)`}
        </div>
      </div>

      {analysisResult && (
        <>
          {/* SEARCH BAR */}
          <div className="search-wrap-bar">
            <span className="search-icon-symbol">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              className="search-input-field"
              type="text"
              placeholder={`ຄົ້ນຫາຕົວເລກໃນຕາຕະລາງ & ຊຸດ ${width}D (Search numbers)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.trim())}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                type="button"
              >
                ✕ ລ້າງ
              </button>
            )}
          </div>

          <div>
            {config.hasFirst ? (
              <div className="grid-2">
                {/* Last N digits card */}
                <div className="card">
                  <div className="card-head">
                    <span className="card-title">{config.lastTitle}</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="card-count">{analysisResult.totalDraws} ຕົວ</span>
                      <CopyButton items={lastItemsToCopy} />
                    </div>
                  </div>
                  <div className="card-body table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Number</th>
                          <th>Count</th>
                          <th>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.lastList.map((row, idx) => {
                          const isSearched = isMatchedBySearch(row.value);
                          return (
                            <tr key={row.value} className={isSearched ? 'search-matched' : ''}>
                              <td>{idx + 1}</td>
                              <td className="td-num">{row.value}</td>
                              <td>{row.count}</td>
                              <td className="td-pct">{formatPercent(row.probability)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* First N digits card */}
                <div className="card">
                  <div className="card-head">
                    <span className="card-title">{config.firstTitle}</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="card-count">{analysisResult.totalDraws} ຕົວ</span>
                      <CopyButton items={firstItemsToCopy} />
                    </div>
                  </div>
                  <div className="card-body table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Number</th>
                          <th>Count</th>
                          <th>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.firstList.map((row, idx) => {
                          const isSearched = isMatchedBySearch(row.value);
                          return (
                            <tr key={row.value} className={isSearched ? 'search-matched' : ''}>
                              <td>{idx + 1}</td>
                              <td className="td-num">{row.value}</td>
                              <td>{row.count}</td>
                              <td className="td-pct">{formatPercent(row.probability)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* 6D (Full Number) Single Table Card */
              <div className="card" style={{ marginBottom: '1rem' }}>
                <div className="card-head">
                  <span className="card-title">{config.lastTitle}</span>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className="card-count">{analysisResult.totalDraws} ຕົວ</span>
                    <CopyButton items={lastItemsToCopy} />
                  </div>
                </div>
                <div className="card-body table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Number</th>
                        <th>Count</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.lastList.map((row, idx) => {
                        const isSearched = isMatchedBySearch(row.value);
                        return (
                          <tr key={row.value} className={isSearched ? 'search-matched' : ''}>
                            <td>{idx + 1}</td>
                            <td className="td-num">{row.value}</td>
                            <td>{row.count}</td>
                            <td className="td-pct">{formatPercent(row.probability)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Position Distribution Card */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-head">
                <span className="card-title">POSITION DISTRIBUTION</span>
                <span className="card-count">{analysisResult.totalDraws} ຕົວ</span>
              </div>
              <div className="card-body table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Digit</th>
                      <th>Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.posList.map(row => {
                      const isSearched = isMatchedBySearch(row.value);
                      return (
                        <tr key={row.value} className={isSearched ? 'search-matched' : ''}>
                          <td>{row.value}</td>
                          <td className="td-pct">{formatPercent(row.probability)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Digits Card */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-head">
                <span className="card-title">TOP DIGITS</span>
                <span className="card-count">{analysisResult.topDigits.length} ຕົວ</span>
              </div>
              <div className="card-body table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Digit</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.topDigits.map((row, idx) => {
                      const isSearched = isMatchedBySearch(row.value);
                      return (
                        <tr key={row.value} className={isSearched ? 'search-matched' : ''}>
                          <td>{idx + 1}</td>
                          <td className="td-num">{row.value}</td>
                          <td className="td-pct">{formatPercent(row.probability)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Combos for 4D / 5D / 6D */}
            {width >= 4 && (
              <>
                {/* Sample Combos */}
                {comboState.sampleCombos.length > 0 && (
                  <div className="card" style={{ marginBottom: '1rem' }}>
                    <div className="card-head">
                      <span className="card-title">{`${width}D SAMPLE COMBOS (TOP5)`}</span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="card-count">{comboState.sampleCombos.length} ຕົວ</span>
                        <CopyButton items={comboState.sampleCombos} />
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="nums-grid">
                        {comboState.sampleCombos.map(n => {
                          const isSearched = isMatchedBySearch(n);
                          return (
                            <span key={n} className={`num-tag ${isSearched ? 'search-matched' : ''}`}>
                              {n}
                            </span>
                          );
                        })}
                      </div>
                      <div className="empty-msg">
                        {`Top digits (${topDigitsForNote.join(',')}) + ຕົວເລກທີ່ຢູ່ທັງ Top 20 ແລະ ອອກຊ້ຳ ≥ 2 ຄັ້ງ (${comboState.sampleSuffix})`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Combos */}
                {comboState.fullCombos.length > 0 && (
                  <div className="card" style={{ marginBottom: '1rem' }}>
                    <div className="card-head">
                      <span className="card-title">{`${width}D FULL COMBOS (0-9)`}</span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="card-count">{comboState.fullCombos.length} ຕົວ</span>
                        <CopyButton items={comboState.fullCombos} />
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="nums-grid">
                        {comboState.fullCombos.map(n => {
                          const isSearched = isMatchedBySearch(n);
                          return (
                            <span key={n} className={`num-tag ${isSearched ? 'search-matched' : ''}`}>
                              {n}
                            </span>
                          );
                        })}
                      </div>
                      <div className="empty-msg">
                        {`All digits (0-9) + ຕົວເລກທີ່ຢູ່ທັງ Top 20 ແລະ ອອກຊ້ຳ ≥ 2 ຄັ້ງ (${comboState.sampleSuffix})`}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
