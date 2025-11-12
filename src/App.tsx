import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { fetchHistory, processHistoryData, exportToCSV, downloadCSV } from './historyService';
import { ProcessedHistoryData } from './types';
import './App.css';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [historyData, setHistoryData] = useState<ProcessedHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysBack, setDaysBack] = useState(7);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportDomains = () => {
    if (!historyData) return;
    const csv = exportToCSV(historyData, 'domains');
    downloadCSV(csv, `browsing-history-domains-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportDays = () => {
    if (!historyData) return;
    const csv = exportToCSV(historyData, 'days');
    downloadCSV(csv, `browsing-history-days-${new Date().toISOString().split('T')[0]}.csv`);
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

  // Prepare chart data
  const domainChartData = {
    labels: historyData.domainStats.map(stat => stat.domain),
    datasets: [
      {
        label: 'Visit Count',
        data: historyData.domainStats.map(stat => stat.visitCount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 1,
      },
    ],
  };

  const dayChartData = {
    labels: historyData.dayOfWeekStats.map(stat => stat.day),
    datasets: [
      {
        label: 'Visits',
        data: historyData.dayOfWeekStats.map(stat => stat.visitCount),
        backgroundColor: '#4A90E2',
      },
    ],
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🕐 Own Browse</h1>
        <p>Your browsing history, visualized</p>
      </header>

      <div className="controls">
        <label>
          Time Range:
          <select value={daysBack} onChange={(e) => setDaysBack(Number(e.target.value))}>
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </label>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Visits</h3>
          <p className="stat-value">{historyData.totalVisits.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Date Range</h3>
          <p className="stat-value-small">
            {historyData.dateRange.start.toLocaleDateString()} - {historyData.dateRange.end.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h2>Top Domains by Visits</h2>
          <div className="chart-wrapper">
            <Pie data={domainChartData} options={{ maintainAspectRatio: true }} />
          </div>
          <button className="export-btn" onClick={handleExportDomains}>
            📥 Export Domains Data (CSV)
          </button>
        </div>

        <div className="chart-container">
          <h2>Browsing Activity by Day of Week</h2>
          <div className="chart-wrapper">
            <Bar 
              data={dayChartData} 
              options={{
                maintainAspectRatio: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
          <button className="export-btn" onClick={handleExportDays}>
            📥 Export Days Data (CSV)
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>Your data stays private. All processing happens locally in your browser.</p>
      </footer>
    </div>
  );
}

export default App;
