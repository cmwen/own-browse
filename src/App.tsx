import { useState, useEffect } from 'react';
import { fetchHistory, processHistoryData } from './historyService';
import { ProcessedHistoryData } from './types';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Stats } from './components/Stats';
import { ExportSection } from './components/ExportSection';
import { DomainFilter } from './components/DomainFilter';
import { Charts } from './components/Charts';
import './App.css';

function App() {
  const [historyData, setHistoryData] = useState<ProcessedHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysBack, setDaysBack] = useState(7);
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  useEffect(() => {
    loadHistoryData();
  }, [daysBack]);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await fetchHistory(daysBack);
      const processed = processHistoryData(history);
      setHistoryData(processed);
      setSelectedDomain(''); // Reset domain filter on reload
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading browsing history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
        <button onClick={loadHistoryData}>Retry</button>
      </div>
    );
  }

  if (!historyData) {
    return (
      <div className="app">
        <div className="error">No data available</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <Controls daysBack={daysBack} setDaysBack={setDaysBack} />

      <Stats historyData={historyData} />

      <ExportSection historyData={historyData} />

      <DomainFilter
        historyData={historyData}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
      />

      <Charts historyData={historyData} />

      <footer className="footer">
        <p>Your data stays private. All processing happens locally in your browser.</p>
      </footer>
    </div>
  );
}

export default App;
