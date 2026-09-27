import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import DashboardResults from './components/DashboardResults';

function App() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleReset = () => {
    setAnalysisData(null);
    setAnalyzing(false);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1 className="header-title">Graph fraud analysis</h1>
          <p className="header-subtitle">Temporal Graph Neural Network Dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>EvolveGCN Model Active</span>
          </div>
        </div>
      </header>

      {!analysisData ? (
        <UploadSection 
          onResults={setAnalysisData} 
          onAnalyzeStart={() => setAnalyzing(true)} 
          analyzing={analyzing} 
        />
      ) : (
        <DashboardResults 
          analysisData={analysisData} 
          onReset={handleReset} 
        />
      )}

      {/* Global CSS for spinner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

export default App;
