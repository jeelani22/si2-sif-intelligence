import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import CommandCenter from './components/CommandCenter';
import AnalyzeReport from './components/AnalyzeReport';
import BulkIntelligence from './components/BulkIntelligence';
import Cases from './components/Cases';
import RiskEvolution from './components/RiskEvolution';

export default function App() {
  const getInitialTab = () => {
    // 1. Check query parameter e.g. ?tab=risk-evolution
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['command-center', 'analyze-report', 'bulk-intelligence', 'cases', 'risk-evolution'].includes(tabParam)) {
      return tabParam;
    }
    // 2. Check hash e.g. #risk-evolution
    const hash = window.location.hash.replace('#', '');
    if (['command-center', 'analyze-report', 'bulk-intelligence', 'cases', 'risk-evolution'].includes(hash)) {
      return hash;
    }
    return 'command-center';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [selectedCaseId, setSelectedCaseId] = useState('SIF-0241');
  const [toastMessage, setToastMessage] = useState('');

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['command-center', 'analyze-report', 'bulk-intelligence', 'cases', 'risk-evolution'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleSelectCase = (id) => {
    setSelectedCaseId(id);
    setActiveTab('cases');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased">
      {/* Top Navbar */}
      <TopNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* View Switcher */}
      <main className="flex-grow flex flex-col">
        {activeTab === 'command-center' && (
          <CommandCenter onSelectCase={handleSelectCase} onNavigate={setActiveTab} />
        )}
        {activeTab === 'analyze-report' && (
          <AnalyzeReport onNotification={showToast} />
        )}
        {activeTab === 'bulk-intelligence' && (
          <BulkIntelligence onNotification={showToast} />
        )}
        {activeTab === 'cases' && (
          <Cases 
            selectedCaseId={selectedCaseId} 
            setSelectedCaseId={setSelectedCaseId} 
            onNavigate={setActiveTab}
            onNotification={showToast}
          />
        )}
        {activeTab === 'risk-evolution' && (
          <RiskEvolution onNavigate={setActiveTab} onNotification={showToast} />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-primary text-on-primary px-4 py-2.5 rounded shadow-lg text-xs font-mono-label z-50 border border-outline-variant animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
