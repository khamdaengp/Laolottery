import React from 'react';
import { useLottery } from '../context/LotteryContext';

export default function Header() {
  const { isSyncing, lastSyncTime, syncLotteryData, theme, toggleTheme } = useLottery();

  const formattedTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="app-top-header">
      <div className="app-brand">
        <img src="/logo.png" alt="Lao Lottery Logo" className="app-header-logo" />
        <div className="app-brand-text">
          <span className="app-brand-title">ຫວຍລາວ ພັດທະນາ</span>
          <span className="app-brand-sub">LAO LOTTERY · v2.3.0</span>
        </div>
      </div>
      <div className="app-header-actions">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          type="button"
          title={theme === 'dark' ? 'ປ່ຽນເປັນ Light Mode' : 'ປ່ຽນເປັນ Dark Mode'}
          aria-label="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" fillOpacity="0.2" />
            </svg>
          )}
        </button>
        <button
          className="header-sync-btn"
          onClick={() => syncLotteryData(true, true, 'Header')}
          disabled={isSyncing}
          type="button"
          title="ກົດເພື່ອອັບເດດຂໍ້ມູນ"
        >
          <span className={`sync-indicator ${isSyncing ? 'syncing' : ''}`} />
          <span className="sync-text">{isSyncing ? 'ອັບເດດ...' : formattedTime ? `8:30 · ${formattedTime}` : '8:30 Sync'}</span>
        </button>
      </div>
    </header>
  );
}
