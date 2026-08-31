import React, { useState } from 'react';
import DigitAnalysisTab from './DigitAnalysisTab';

const DIGIT_OPTIONS = [
  {
    width: 3,
    label: '3 ຕົວ (3D)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    )
  },
  {
    width: 4,
    label: '4 ຕົວ (4D)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="4" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
        <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    width: 5,
    label: '5 ຕົວ (5D)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    )
  },
  {
    width: 6,
    label: '6 ຕົວ (6D)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="currentColor" fillOpacity="0.25" />
        <path d="M5 19h14v2H5z" fill="currentColor" />
      </svg>
    )
  }
];

export default function MultiDigitTab() {
  const [activeWidth, setActiveWidth] = useState(3);

  return (
    <div className="multidigit-page">
      {/* RENDER CURRENT SELECTED DIGIT ANALYSIS */}
      <DigitAnalysisTab width={activeWidth} />

      {/* BOTTOM-DOCKED SUB-NAV SWITCHER BAR */}
      <div className="bottom-digit-bar-wrap">
        <div className="digit-segmented-bar">
          {DIGIT_OPTIONS.map((opt) => {
            const isSelected = activeWidth === opt.width;
            return (
              <button
                key={opt.width}
                className={`digit-segment-btn ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setActiveWidth(opt.width);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                type="button"
              >
                <span className="segment-icon-svg">{opt.icon}</span>
                <span className="segment-label">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
