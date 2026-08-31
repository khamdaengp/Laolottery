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
      const year = d.getFullYear();
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
        <p className="header-sub">ຜົນການອອກລາງວັນຫວຍພັດທະນາ ແລະ ປະຫວັດຍ້ອນຫຼັງ</p>
        <div style={{ marginTop: '0.75rem', fontSize: '11px', color: 'var(--gold-dim)', fontFamily: 'var(--mono)', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.18)', padding: '3px 12px', borderRadius: '20px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: isSyncing ? 'var(--gold)' : 'var(--green)', boxShadow: isSyncing ? '0 0 6px var(--gold)' : '0 0 6px var(--green)' }} />
          {isSyncing ? 'ກຳລັງອັບເດດ...' : formattedSyncTime ? `Auto-Reload 8:30 (20:30) & 4x/ມື້ · ${formattedSyncTime} (${validDraws.length} ງວດ)` : `Auto-Reload 8:30 (20:30)`}
        </div>
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
        <div className="full-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="full-title">ປະຫວັດຜົນຫວຍຍ້ອນຫຼັງ</span>
            <span className="card-count">{filteredHistory.length} ງວດ</span>
          </div>
          <div className="table-search-inline">
            <input
              className="search-input"
              style={{ width: '130px' }}
              type="text"
              placeholder="ຄົ້ນຫາງວດ/ເລກ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll-container">
          <table>
            <thead>
              <tr>
                <th>ງວດທີ</th>
                <th>ວັນທີ</th>
                <th>ເລກ 6 ຕົວ</th>
                <th>5 ຕົວ</th>
                <th>4 ຕົວ</th>
                <th>3 ຕົວ</th>
                <th>2 ຕົວ</th>
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
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: '700', color: 'var(--gold-dim)' }}>
                      #{draw.roundNumber || draw.lotNumber}
                    </td>
                    <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {formatDate(draw.roundDate)}
                    </td>
                    <td className="td-num" style={{ color: 'var(--gold)', fontWeight: '700' }}>
                      {fullNum}
                    </td>
                    <td className="td-num">{d5}</td>
                    <td className="td-num">{d4}</td>
                    <td className="td-num">{d3}</td>
                    <td className="td-num" style={{ color: 'var(--gold)', fontWeight: '700' }}>
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
