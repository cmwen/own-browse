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

  const handleExportDetailed = () => {
    if (!historyData) return;
    const csv = exportToCSV(historyData, 'detailed');
    downloadCSV(csv, `browsing-history-detailed-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportDomainDetail = (domain: string) => {
    if (!historyData) return;
    const csv = exportToCSV(historyData, 'domain-detail', domain);
    downloadCSV(csv, `browsing-history-${domain.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.csv`);
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

      <div className="export-section">
        <h2>📥 Export Options</h2>
        <div className="export-buttons">
          <button className="export-btn" onClick={handleExportDetailed}>
            📊 Export Complete History (All Details)
          </button>
          <button className="export-btn" onClick={handleExportDomains}>
            🌐 Export Top Domains Summary
          </button>
          <button className="export-btn" onClick={handleExportDays}>
            📅 Export Weekly Activity
          </button>
        </div>
      </div>

      <div className="domain-filter-section">
        <h2>🔍 Filter by Domain</h2>
        <p className="hint">Select a domain to see detailed visits and export specific data (e.g., analyze your YouTube watch history)</p>
        <select 
          className="domain-select"
          value={selectedDomain} 
          onChange={(e) => setSelectedDomain(e.target.value)}
        >
          <option value="">-- Select a domain --</option>
          {historyData.domainStats.map((stat) => (
            <option key={stat.domain} value={stat.domain}>
              {stat.domain} ({stat.visitCount} visits)
            </option>
          ))}
        </select>

        {selectedDomain && (
          <div className="domain-details">
            <h3>Details for: {selectedDomain}</h3>
            {(() => {
              const domainStat = historyData.domainStats.find(s => s.domain === selectedDomain);
              if (!domainStat) return null;
              
              return (
                <>
                  <div className="domain-stats">
                    <p><strong>Total Visits:</strong> {domainStat.visitCount}</p>
                    <p><strong>Unique Pages:</strong> {domainStat.urls.length}</p>
                    <p><strong>Est. Time Spent:</strong> {domainStat.timeSpent} minutes</p>
                  </div>
                  
                  <div className="domain-urls">
                    <h4>Recent Pages ({domainStat.urls.slice(0, 10).length} of {domainStat.urls.length})</h4>
                    <ul>
                      {domainStat.urls
                        .sort((a, b) => (b.lastVisitTime || 0) - (a.lastVisitTime || 0))
                        .slice(0, 10)
                        .map((item, idx) => (
                          <li key={idx}>
                            <strong>{item.title || 'Untitled'}</strong>
                            <br />
                            <small>{item.url}</small>
                            <br />
                            <small>Visits: {item.visitCount || 0} • Last: {item.lastVisitTime ? new Date(item.lastVisitTime).toLocaleString() : 'Unknown'}</small>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <button 
                    className="export-btn domain-export" 
                    onClick={() => handleExportDomainDetail(selectedDomain)}
                  >
                    📥 Export All {selectedDomain} History (CSV)
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <div className="charts">
        <div className="chart-container">
          <h2>Top Domains by Visits</h2>
          <div className="chart-wrapper">
            <Pie data={domainChartData} options={{ maintainAspectRatio: true }} />
          </div>
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
        </div>
      </div>

      <footer className="footer">
        <p>Your data stays private. All processing happens locally in your browser.</p>
      </footer>
    </div>
  );
}

export default App;
