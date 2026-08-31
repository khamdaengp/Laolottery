import React from 'react';
import { useLottery } from '../context/LotteryContext';

const TABS = [
  {
    id: 'predict',
    label: 'ທຳນາຍ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.35" />
      </svg>
    )
  },
  {
    id: 'results',
    label: 'ຜົນຫວຍ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
        <path d="M6 4h12v7a6 6 0 0 1-12 0V4Z" fill="currentColor" fillOpacity="0.25" />
      </svg>
    )
  },
  {
    id: 'analyze',
    label: 'ສະຖິຕິ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <rect x="7" y="10" width="3" height="7" rx="1" fill="currentColor" fillOpacity="0.4" />
        <rect x="12" y="6" width="3" height="11" rx="1" fill="currentColor" fillOpacity="0.7" />
        <rect x="17" y="13" width="3" height="4" rx="1" fill="currentColor" fillOpacity="0.3" />
      </svg>
    )
  },
  {
    id: 'multidigit',
    label: 'ເລກຊຸດ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" fill="currentColor" fillOpacity="0.3" />
        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
      </svg>
    )
  }
];

export default function Tabs() {
  const { activeTab, setActiveTab } = useLottery();

  const currentTab = ['top3d', 'top4d', 'top5d', 'top6d', 'multidigit'].includes(activeTab)
    ? 'multidigit'
    : activeTab;

  return (
    <nav className="mobile-app-bottom-bar" aria-label="Mobile App Navigation">
      <div className="bottom-bar-inner">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`bottom-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              type="button"
            >
              <span className="tab-icon-svg">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
