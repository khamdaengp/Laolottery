import React, { useState, useMemo } from 'react';
import { useLottery } from '../context/LotteryContext';
import CopyButton from './CopyButton';
import { pad } from '../utils/lottery';

export default function ResultsTab() {
  const { rawHistory, isSyncing, lastSyncTime } = useLottery();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out any upcoming/empty rounds and sort by roundDate desc
  const validDraws = useMemo(() => {
    if (!Array.isArray(rawHistory)) return [];
    return rawHistory.filter(item => item && item.winNumber && String(item.winNumber).trim() !== '');
  }, [rawHistory]);

  const latestDraw = validDraws[0] || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return validDraws;
    const q = searchQuery.trim().toLowerCase();
    return validDraws.filter(item => {
      const num = pad(item.winNumber, 6);
      const round = String(item.roundNumber || item.lotNumber || '');
      const date = formatDate(item.roundDate);
      return num.includes(q) || round.includes(q) || date.includes(q);
    });
  }, [validDraws, searchQuery]);

  const formattedSyncTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const latest6D = latestDraw ? pad(latestDraw.winNumber, 6) : '000000';

  return (
    <div>
      <div className="section-header">
        <div className="badge">LAO LOTTERY · RESULTS</div>
        <h1>ຜົນຫວຍລາວລ່າສຸດ</h1>
      </div>

      {/* LATEST DRAW HERO CARD */}
      {latestDraw && (
        <div className="latest-hero-card">
          <div className="latest-hero-head">
            <div className="latest-round-tag">
              <span className="live-pulse-dot" />
              <span>ງວດທີ {latestDraw.roundNumber || latestDraw.lotNumber || '—'}</span>
            </div>
            <div className="latest-date-text">
              <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '4px', verticalAlign: 'middle' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              ວັນທີ: <strong>{formatDate(latestDraw.roundDate)}</strong>
            </div>
          </div>

          <div className="latest-ball-row">
            {latest6D.split('').map((digit, idx) => (
              <div key={idx} className="lottery-ball">
                <span className="ball-digit">{digit}</span>
                <span className="ball-pos-label">{`ຫຼັກ ${6 - idx}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRAW HISTORY SECTION */}
      <div className="full-card" style={{ marginTop: '1.75rem' }}>
        <div className="full-head-vertical">
          <div className="full-head-top">
            <div className="full-head-title-wrap">
              <span className="full-head-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v5h5" />
                  <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                  <path d="M12 7v5l4 2" />
                </svg>
              </span>
              <div>
                <h3 className="full-title">ປະຫວັດຜົນຫວຍຍ້ອນຫຼັງ</h3>
                <span className="full-subtitle">ຜົນອອກລາງວັນທັງໝົດ</span>
              </div>
            </div>
            <span className="card-count-badge">
              {filteredHistory.length} ງວດ
            </span>
          </div>

          <div className="history-search-bar">
            <div className="history-search-inner">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="history-search-icon">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="history-search-input"
                type="text"
                placeholder="ຄົ້ນຫາຕາມເລກ (ເຊັ່ນ: 89, 589) ຫຼື ວັນທີ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="history-search-clear"
                  title="ລຶບຄຳຄົ້ນຫາ"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="table-scroll-container">
          <table className="results-history-table">
            <thead>
              <tr>
                <th style={{ width: '32px', textAlign: 'center' }}>No</th>
                <th style={{ textAlign: 'center' }}>ວັນທີ</th>
                <th style={{ textAlign: 'center' }}>ເລກ 6 ຕົວ</th>
                <th style={{ textAlign: 'center' }}>5 ຕົວ</th>
                <th style={{ textAlign: 'center' }}>4 ຕົວ</th>
                <th style={{ textAlign: 'center' }}>3 ຕົວ</th>
                <th style={{ textAlign: 'center' }}>2 ຕົວ</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((draw) => {
                const fullNum = pad(draw.winNumber, 6);
                const d5 = fullNum.slice(1);
                const d4 = fullNum.slice(2);
                const d3 = fullNum.slice(3);
                const d2 = fullNum.slice(4);

                return (
                  <tr key={draw.id || draw.lotNumber || draw.roundNumber}>
                    <td className="draw-no-text" style={{ textAlign: 'center' }}>
                      {draw.roundNumber || draw.lotNumber}
                    </td>
                    <td className="draw-date-text" style={{ textAlign: 'center' }}>
                      {formatDate(draw.roundDate)}
                    </td>
                    <td className="td-num td-highlight" style={{ textAlign: 'center' }}>
                      {fullNum}
                    </td>
                    <td className="td-num" style={{ textAlign: 'center' }}>{d5}</td>
                    <td className="td-num" style={{ textAlign: 'center' }}>{d4}</td>
                    <td className="td-num" style={{ textAlign: 'center' }}>{d3}</td>
                    <td className="td-num td-highlight-2d" style={{ textAlign: 'center' }}>
                      {d2}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
