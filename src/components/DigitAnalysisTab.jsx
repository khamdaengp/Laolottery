import React, { useMemo } from 'react';
import { useLottery } from '../context/LotteryContext';
import CopyButton from './CopyButton';
import {
  formatPercent,
  buildComboLists
} from '../utils/lottery';

const TAB_CONFIGS = {
  3: {
    badge: 'LAO LOTTERY · 3D ANALYSIS',
    h1: 'ວິເຄາະສະຖິຕິ 3 ຕົວ (3D)',
    sub: '',
    lastTitle: 'TOP 20 LAST 3D',
    firstTitle: 'TOP 20 FIRST 3D',
    hasFirst: true
  },
  4: {
    badge: 'LAO LOTTERY · 4D ANALYSIS',
    h1: 'ວິເຄາະສະຖິຕິ 4 ຕົວ (4D)',
    sub: '',
    lastTitle: 'TOP 20 LAST 4D',
    firstTitle: 'TOP 20 FIRST 4D',
    hasFirst: true
  },
  5: {
    badge: 'LAO LOTTERY · 5D ANALYSIS',
    h1: 'ວິເຄາະສະຖິຕິ 5 ຕົວ (5D)',
    sub: '',
    lastTitle: 'TOP 20 LAST 5D',
    firstTitle: 'TOP 20 FIRST 5D',
    hasFirst: true
  },
  6: {
    badge: 'LAO LOTTERY · 6D ANALYSIS',
    h1: 'ວິເຄາະສະຖິຕິ 6 ຕົວ (6D)',
    sub: '',
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

  return (
    <div>
      <div className="section-header">
        <div className="badge">{config.badge}</div>
        <h1>{config.h1}</h1>
      </div>

      {analysisResult && (
        <div>
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
                          <th style={{ width: '65px', textAlign: 'center' }}># ອັນດັບ</th>
                          <th>ຕົວເລກ</th>
                          <th style={{ textAlign: 'center' }}>ອອກ (ຄັ້ງ)</th>
                          <th style={{ textAlign: 'right' }}>ຄວາມຖີ່ (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.lastList.map((row, idx) => (
                          <tr key={row.value}>
                            <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                            <td className="td-num">{row.value}</td>
                            <td style={{ textAlign: 'center' }}>{row.count}</td>
                            <td className="td-pct" style={{ textAlign: 'right' }}>{formatPercent(row.probability)}</td>
                          </tr>
                        ))}
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
                          <th style={{ width: '65px', textAlign: 'center' }}># ອັນດັບ</th>
                          <th>ຕົວເລກ</th>
                          <th style={{ textAlign: 'center' }}>ອອກ (ຄັ້ງ)</th>
                          <th style={{ textAlign: 'right' }}>ຄວາມຖີ່ (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.firstList.map((row, idx) => (
                          <tr key={row.value}>
                            <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                            <td className="td-num">{row.value}</td>
                            <td style={{ textAlign: 'center' }}>{row.count}</td>
                            <td className="td-pct" style={{ textAlign: 'right' }}>{formatPercent(row.probability)}</td>
                          </tr>
                        ))}
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
                        <th style={{ width: '65px', textAlign: 'center' }}># ອັນດັບ</th>
                        <th>ຕົວເລກ</th>
                        <th style={{ textAlign: 'center' }}>ອອກ (ຄັ້ງ)</th>
                        <th style={{ textAlign: 'right' }}>ຄວາມຖີ່ (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.lastList.map((row, idx) => (
                        <tr key={row.value}>
                          <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                          <td className="td-num">{row.value}</td>
                          <td style={{ textAlign: 'center' }}>{row.count}</td>
                          <td className="td-pct" style={{ textAlign: 'right' }}>{formatPercent(row.probability)}</td>
                        </tr>
                      ))}
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
                      <th>ຫຼັກເລກ</th>
                      <th style={{ textAlign: 'right' }}>ອັດຕາອອກ (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.posList.map(row => (
                      <tr key={row.value}>
                        <td>{row.value}</td>
                        <td className="td-pct" style={{ textAlign: 'right' }}>{formatPercent(row.probability)}</td>
                      </tr>
                    ))}
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
                      <th style={{ width: '65px', textAlign: 'center' }}># ອັນດັບ</th>
                      <th>ຫຼັກເລກ</th>
                      <th style={{ textAlign: 'right' }}>ຄວາມຖີ່ (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.topDigits.map((row, idx) => (
                      <tr key={row.value}>
                        <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                        <td className="td-num">{row.value}</td>
                        <td className="td-pct" style={{ textAlign: 'right' }}>{formatPercent(row.probability)}</td>
                      </tr>
                    ))}
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
                        {comboState.sampleCombos.map(n => (
                          <span key={n} className="num-tag">
                            {n}
                          </span>
                        ))}
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
                        {comboState.fullCombos.map(n => (
                          <span key={n} className="num-tag">
                            {n}
                          </span>
                        ))}
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
        </div>
      )}
    </div>
  );
}
