import React, { useRef, useState } from 'react';
import { useLottery } from '../context/LotteryContext';
import CopyButton from './CopyButton';

export default function PredictTab() {
  const {
    n1,
    setN1,
    n2,
    setN2,
    predictState,
    matchList,
    sampleCombos,
    fullCombos,
    runPredict,
    isSyncing,
    lastSyncTime,
    analyzeData,
    topDigitsList
  } = useLottery();

  const [searchQuery, setSearchQuery] = useState('');
  const resultRef = useRef(null);
  const n1Ref = useRef(null);

  const handleInputChange = (setter) => (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setter(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRunPredict();
    }
  };

  const handleRunPredict = () => {
    if (!n1 || !n2) {
      if (n1Ref.current) n1Ref.current.focus();
      return;
    }
    const success = runPredict(n1, n2);
    if (success) {
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const { allList, dupList, lucky, hasPredicted } = predictState;
  const matchSet = new Set(matchList);
  const dupSet = new Set(dupList);
  const sortedMatches = [...matchList].sort((a, b) => Number(a) - Number(b));
  const sampleSuffix = sortedMatches.join(',');

  const formattedTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const isMatchedBySearch = (numStr) => {
    if (!searchQuery) return false;
    return String(numStr).includes(searchQuery);
  };

  // Search match counters
  const allMatchCount = searchQuery ? allList.filter(isMatchedBySearch).length : 0;
  const dupMatchCount = searchQuery ? dupList.filter(isMatchedBySearch).length : 0;
  const matchCardCount = searchQuery ? matchList.filter(isMatchedBySearch).length : 0;
  const sampleMatchCount = searchQuery ? sampleCombos.filter(isMatchedBySearch).length : 0;
  const fullMatchCount = searchQuery ? fullCombos.filter(isMatchedBySearch).length : 0;
  const totalSearchMatches = allMatchCount + dupMatchCount + matchCardCount + sampleMatchCount + fullMatchCount;

  return (
    <div>
      <div className="section-header">
        <div className="badge">✦ LAO LOTTERY · PREDICT</div>
        <h1>ທຳນາຍຫວຍລາວ</h1>
      </div>

      <div className="input-section">
        <div className="input-header-row">
          <div className="input-title-tag">
            <span className="tag-sparkle">✦</span>
            <span>ປ້ອນຕົວເລກວິເຄາະ</span>
          </div>
          <div className="input-sync-badge">
            <span className={`sync-dot ${isSyncing ? 'pulse' : ''}`} />
            <span>{isSyncing ? 'ອັບເດດ...' : formattedTime ? `Auto · ${formattedTime}` : 'Auto 8:30 (20:30)'}</span>
          </div>
        </div>

        <div className="inputs-row">
          <div className="num-input-wrap">
            <label htmlFor="n1">
              <span>ຕົວເລກທີ 01</span>
              <span className="label-hint">2 ຕົວ</span>
            </label>
            <input
              ref={n1Ref}
              className="num-input"
              type="text"
              id="n1"
              maxLength={2}
              placeholder="00"
              inputMode="numeric"
              autoComplete="off"
              value={n1}
              onChange={handleInputChange(setN1)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="input-sep">×</div>
          <div className="num-input-wrap">
            <label htmlFor="n2">
              <span>ຕົວເລກທີ 02</span>
              <span className="label-hint">2 ຕົວ</span>
            </label>
            <input
              className="num-input"
              type="text"
              id="n2"
              maxLength={2}
              placeholder="00"
              inputMode="numeric"
              autoComplete="off"
              value={n2}
              onChange={handleInputChange(setN2)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <button
            className="predict-btn"
            style={{ width: '100%' }}
            onClick={handleRunPredict}
            type="button"
          >
            <span className="btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.3" />
              </svg>
            </span>
            <span>ເລີ່ມຕົ້ນທຳນາຍ / GENERATE PREDICTION</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR FOR NUMBERS ON DISPLAY */}
      {hasPredicted && (
        <>
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
              placeholder="ຄົ້ນຫາຕົວເລກທີ່ສະແດງ (Search displayed numbers)..."
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

          {searchQuery && (
            <div className="search-match-summary">
              <span>ຜົນການຄົ້ນຫາ "<strong>{searchQuery}</strong>":</span>
              <span>ພົບ <strong>{totalSearchMatches}</strong> ຈຸດ</span>
              {allMatchCount > 0 && <span className="hot-tag">All: {allMatchCount}</span>}
              {dupMatchCount > 0 && <span className="hot-tag">Dup: {dupMatchCount}</span>}
              {matchCardCount > 0 && (
                <span className="hot-tag" style={{ background: 'var(--gold)', color: '#000', borderColor: 'var(--gold)' }}>
                  Match: {matchCardCount}
                </span>
              )}
              {sampleMatchCount > 0 && <span className="hot-tag">TOP5: {sampleMatchCount}</span>}
              {fullMatchCount > 0 && <span className="hot-tag">FULL: {fullMatchCount}</span>}
            </div>
          )}
        </>
      )}

      {hasPredicted && (
        <div className="predict-result" ref={resultRef}>
          {/* All list */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">ລາຍການລວມທັງໝົດ</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className="card-count">{allList.length} ຕົວ</span>
                <CopyButton items={allList} />
              </div>
            </div>
            <div className="card-body">
              <div className="nums-grid">
                {allList.map(n => {
                  const isSearched = isMatchedBySearch(n);
                  return (
                    <span
                      key={n}
                      className={`num-tag ${isSearched ? 'search-matched' : matchSet.has(n) ? 'match' : dupSet.has(n) ? 'hot' : ''}`}
                    >
                      {n}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dup list */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">ອອກຊ້ຳ ≥ 2 ຄັ້ງ</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className="card-count">{dupList.length} ຕົວ</span>
                <CopyButton items={dupList} />
              </div>
            </div>
            <div className="card-body">
              <div className="nums-grid">
                {dupList.length > 0 ? (
                  dupList.map(n => {
                    const isSearched = isMatchedBySearch(n);
                    return (
                      <span
                        key={n}
                        className={`num-tag ${isSearched ? 'search-matched' : matchSet.has(n) ? 'match' : 'hot'}`}
                      >
                        {n}
                      </span>
                    );
                  })
                ) : (
                  <span className="empty-msg">ບໍ່ມີ</span>
                )}
              </div>
            </div>
          </div>

          {/* MATCH CARD: Top 20 ∩ Dup */}
          {analyzeData.apiTop10.length > 0 && (
            <div className="match-card">
              <div className="match-head">
                <div>
                  <div className="match-title">ລາຍການ MATCH — Top 20 ∩ ອອກຊ້ຳ</div>
                  <div className="match-label">ຕົວເລກທີ່ຢູ່ທັງ Top 20 ແລະ ອອກຊ້ຳ ≥ 2 ຄັ້ງ</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className="card-count">{matchList.length} ຕົວ</span>
                  <CopyButton items={matchList} />
                </div>
              </div>
              <div className="card-body">
                <div className="nums-grid">
                  {matchList.length > 0 ? (
                    matchList.map(n => {
                      const isSearched = isMatchedBySearch(n);
                      return (
                        <span key={n} className={`num-tag match ${isSearched ? 'search-matched' : ''}`}>
                          {n}
                        </span>
                      );
                    })
                  ) : (
                    <span className="empty-msg">ບໍ່ມີ cross match</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SAMPLE COMBOS: Top digits + MATCH suffix */}
          {sampleCombos.length > 0 && (
            <div className="card">
              <div className="card-head">
                <span className="card-title">TOP5 COMBOS</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className="card-count">{sampleCombos.length} ຕົວ</span>
                  <CopyButton items={sampleCombos} />
                </div>
              </div>
              <div className="card-body">
                <div className="nums-grid">
                  {sampleCombos.map(num => {
                    const isSearched = isMatchedBySearch(num);
                    return (
                      <span key={num} className={`num-tag ${isSearched ? 'search-matched' : ''}`}>
                        {num}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* FULL COMBOS (0-9): All digits + MATCH suffix */}
          {fullCombos.length > 0 && (
            <div className="card">
              <div className="card-head">
                <span className="card-title">FULL COMBOS (0-9)</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className="card-count">{fullCombos.length} ຕົວ</span>
                  <CopyButton items={fullCombos} />
                </div>
              </div>
              <div className="card-body">
                <div className="nums-grid">
                  {fullCombos.map(num => {
                    const isSearched = isMatchedBySearch(num);
                    return (
                      <span key={num} className={`num-tag ${isSearched ? 'search-matched' : ''}`}>
                        {num}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
