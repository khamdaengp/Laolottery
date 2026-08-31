import React from 'react';
import { LotteryProvider, useLottery } from './context/LotteryContext';
import Header from './components/Header';
import Tabs from './components/Tabs';
import PredictTab from './components/PredictTab';
import ResultsTab from './components/ResultsTab';
import AnalyzeTab from './components/AnalyzeTab';
import MultiDigitTab from './components/MultiDigitTab';
import Footer from './components/Footer';

function MainApp() {
  const { activeTab } = useLottery();

  // Normalize active tab for 4-item menu
  const isMultiDigit = ['multidigit', 'top3d', 'top4d', 'top5d', 'top6d'].includes(activeTab);

  return (
    <div className="page">
      <Header />

      {/* Tab 1 · Predict (ທຳນາຍ) */}
      <div className={`tab-panel ${activeTab === 'predict' ? 'active' : ''}`} id="tab-predict">
        <PredictTab />
      </div>

      {/* Tab 2 · Latest Results (ຜົນຫວຍ) */}
      <div className={`tab-panel ${activeTab === 'results' ? 'active' : ''}`} id="tab-results">
        <ResultsTab />
      </div>

      {/* Tab 3 · Analyze 2D (ສະຖິຕິ) */}
      <div className={`tab-panel ${activeTab === 'analyze' ? 'active' : ''}`} id="tab-analyze">
        <AnalyzeTab />
      </div>

      {/* Tab 4 · 3D-6D Multi-Digit (ເລກ 3D-6D) */}
      <div className={`tab-panel ${isMultiDigit ? 'active' : ''}`} id="tab-multidigit">
        <MultiDigitTab />
      </div>

      <Footer />
      <Tabs />
    </div>
  );
}

export default function App() {
  return (
    <LotteryProvider>
      <MainApp />
    </LotteryProvider>
  );
}
