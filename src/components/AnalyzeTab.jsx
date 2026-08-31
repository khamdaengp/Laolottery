import React, { useState } from 'react';
import { useLottery } from '../context/LotteryContext';
import CopyButton from './CopyButton';

const RANK_CLASSES = ['gold', 'gold', 'gold', 'silver', 'silver', 'silver', 'bronze', 'bronze', 'bronze'];

export default function AnalyzeTab() {
  const {
    analyzeData,
    analyzeCrossMatchList,
    predictState,
    isSyncing,
    lastSyncTime
  } = useLottery();

  const [searchQuery, setSearchQuery] = useState('');

  const {
    total,
    statHot,
    statCold,
    hotMax,
    coldMin,
    topHot,
    topCold,
    apiTop20Hot,
    apiTop20Cold,
    tableData,
    hasAnalyzed
  } = analyzeData;

  const { dupList } = predictState;
  const dupSet = new Set(dupList);
  const top10Set = new Set(analyzeData.apiTop10);

  const filteredTableData = searchQuery.trim()
    ? tableData.filter(r => r.num.startsWith(searchQuery.trim()))
    : tableData;

  const maxColdProb = topCold.length ? Math.max(...topCold.map(e => e[1].prob)) || 1 : 1;
  const maxHotProb = topHot.length ? topHot[0][1].prob || 1 : 1;

  const formattedTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div>
      <div className="section-header">
        <div className="badge">✦ LAO LOTTERY · STATS & FREQUENCY</div>
        <h1>ວິເຄາະສະຖິຕິ 2 ຕົວ</h1>
        <div style={{ marginTop: '0.75rem', fontSize: '11px', color: 'var(--gold-dim)', fontFamily: 'var(--mono)', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.18)', padding: '4px 14px', borderRadius: '20px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: isSyncing ? 'var(--gold)' : 'var(--green)', boxShadow: isSyncing ? '0 0 6px var(--gold)' : '0 0 6px var(--green)' }} />
          {isSyncing ? 'ກຳລັງອັບເດດ...' : formattedTime ? `Auto 8:30 (20:30) & 4x/ມື້ · ${formattedTime} (${total || 0} ງວດ)` : `Auto 8:30 (20:30)`}
        </div>
      </div>

      {hasAnalyzed && (
        <div>
          {/* Stats row */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">TOTAL DRAWS</div>
              <div className="stat-val">{total}</div>
              <div className="stat-sub">ຈຳນວນງວດທັງໝົດ</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">HOT NUMBER</div>
              <div className="stat-val hot">{statHot}</div>
              <div className="stat-sub">ອອກຫຼາຍທີ່ສຸດ</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">COLD NUMBER</div>
              <div className="stat-val cold">{statCold}</div>
              <div className="stat-sub">ອອກໜ້ອຍທີ່ສຸດ</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">AVG FREQ</div>
              <div className="stat-val">1.00%</div>
              <div className="stat-sub">ຄ່າສະເລ່ຍມາດຕະຖານ</div>
            </div>
          </div>

          {/* Top 20 Hot + Cold */}
          <div className="two-col">
            <div className="card">
              <div className="card-head">
                <span className="card-title">TOP 20 ອອກຫຼາຍສຸດ (HOT)</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="card-count">{hotMax}</span>
                  <CopyButton items={apiTop20Hot} />
                </div>
              </div>
              <div className="card-body">
                <ul className="top-list">
                  {topHot.map(([num, { prob }], i) => {
                    const isMatch = dupSet.has(num) && dupList.length > 0;
                    return (
                      <li key={num} className="top-item">
                        <span className={`rank ${RANK_CLASSES[i] || ''}`}>
                          #{String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="top-num"
                          style={
                            isMatch
                              ? { color: 'var(--gold)', textShadow: '0 0 8px rgba(232,184,75,0.5)' }
                              : {}
                          }
                        >
                          {num}
                        </span>
                        <div className="bar-wrap">
                          <div
                            className="bar-fill"
                            style={{ width: `${maxHotProb > 0 ? (prob / maxHotProb) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="pct">{prob.toFixed(2)}%</span>
                        {isMatch && (
                          <div className="match-dot" title="ກົງກັບ ອອກຊ້ຳ" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <span className="card-title">TOP 20 ອອກໜ້ອຍສຸດ (COLD)</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="card-count">{coldMin}</span>
                  <CopyButton items={apiTop20Cold} />
                </div>
              </div>
              <div className="card-body">
                <ul className="top-list">
                  {topCold.map(([num, { prob }], i) => {
                    const isMatch = dupSet.has(num) && dupList.length > 0;
                    return (
                      <li key={num} className="top-item">
                        <span className={`rank ${RANK_CLASSES[i] || ''}`}>
                          #{String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="top-num"
                          style={
                            isMatch
                              ? { color: 'var(--gold)', textShadow: '0 0 8px rgba(232,184,75,0.5)' }
                              : {}
                          }
                        >
                          {num}
                        </span>
                        <div className="bar-wrap">
                          <div
                            className="bar-fill"
                            style={{ width: `${maxColdProb > 0 ? (prob / maxColdProb) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="pct">{prob.toFixed(2)}%</span>
                        {isMatch && (
                          <div className="match-dot" title="ກົງກັບ ອອກຊ້ຳ" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* ANALYZE MATCH: Top 20 ∩ latest predict dup */}
          {analyzeData.apiTop10.length > 0 && dupList.length > 0 && (
            <div className="match-card">
              <div className="match-head">
                <div className="match-head-info">
                  <div className="match-title">CROSS MATCH (TOP 20 ∩ ອອກຊ້ຳ)</div>
                  <div className="match-label">ຕົວເລກ Top 20 ທີ່ກົງກັບລາຍການອອກຊ້ຳ</div>
                </div>
                <div className="match-head-action">
                  <span className="card-count">{analyzeCrossMatchList.length} ຕົວ</span>
                  <CopyButton items={analyzeCrossMatchList} />
                </div>
              </div>
              <div className="card-body">
                <div className="nums-grid">
                  {analyzeCrossMatchList.length > 0 ? (
                    analyzeCrossMatchList.map(n => (
                      <span key={n} className="num-tag match">
                        {n}
                      </span>
                    ))
                  ) : (
                    <span className="empty-msg">ບໍ່ມີ cross match</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Full table 00-99 */}
          <div className="full-card">
            <div className="full-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="full-title">ຕາຕະລາງ 00–99</span>
                <span className="card-count" style={{ fontSize: '12px' }}>({filteredTableData.length})</span>
              </div>
              <div className="table-search-inline">
                <input
                  className="search-input"
                  type="text"
                  placeholder="ຄົ້ນຫາ 00–99..."
                  maxLength={2}
                  inputMode="numeric"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.slice(0, 2))}
                  title="ຄົ້ນຫາເລກ"
                />
                {searchQuery && (
                  <button
                    className="search-clear-btn"
                    style={{ marginLeft: '6px' }}
                    onClick={() => setSearchQuery('')}
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr>
                    <th>ຕົວເລກ</th>
                    <th>ຈຳນວນ</th>
                    <th>%</th>
                    <th>ຄວາມຖີ່</th>
                    <th>ສະຖານະ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableData.map(({ num, count, prob, maxCount }) => {
                    const barW = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
                    const isMatch = dupSet.has(num) && top10Set.has(num) && dupList.length > 0;
                    const tag = isMatch ? (
                      <span
                        className="hot-tag"
                        style={{
                          background: 'rgba(232,184,75,0.25)',
                          color: 'var(--gold)',
                          borderColor: 'var(--gold)'
                        }}
                      >
                        MATCH
                      </span>
                    ) : prob >= 2 ? (
                      <span className="hot-tag">HOT</span>
                    ) : prob === 0 ? (
                      <span className="cold-tag">COLD</span>
                    ) : null;

                    return (
                      <tr key={num}>
                        <td
                          className="td-num"
                          style={
                            isMatch
                              ? { textShadow: '0 0 8px rgba(232,184,75,0.5)' }
                              : {}
                          }
                        >
                          {num}
                        </td>
                        <td>{count}</td>
                        <td className="td-pct">{prob.toFixed(2)}%</td>
                        <td style={{ width: '100px' }}>
                          <div className="mini-bar">
                            <div className="mini-fill" style={{ width: `${barW}%` }} />
                          </div>
                        </td>
                        <td>{tag}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
