import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ProcessedHistoryData } from './types';
import { exportToCSV, downloadCSV } from './historyService';
import './App.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data for demonstration
const mockData: ProcessedHistoryData = {
  domainStats: [
    { domain: 'github.com', visitCount: 145, timeSpent: 145 },
    { domain: 'stackoverflow.com', visitCount: 89, timeSpent: 89 },
    { domain: 'google.com', visitCount: 67, timeSpent: 67 },
    { domain: 'youtube.com', visitCount: 54, timeSpent: 54 },
    { domain: 'reddit.com', visitCount: 43, timeSpent: 43 },
    { domain: 'twitter.com', visitCount: 38, timeSpent: 38 },
    { domain: 'linkedin.com', visitCount: 29, timeSpent: 29 },
    { domain: 'medium.com', visitCount: 24, timeSpent: 24 },
    { domain: 'dev.to', visitCount: 19, timeSpent: 19 },
    { domain: 'npmjs.com', visitCount: 15, timeSpent: 15 },
  ],
  dayOfWeekStats: [
    { day: 'Sunday', visitCount: 45, timeSpent: 45 },
    { day: 'Monday', visitCount: 98, timeSpent: 98 },
    { day: 'Tuesday', visitCount: 105, timeSpent: 105 },
    { day: 'Wednesday', visitCount: 112, timeSpent: 112 },
    { day: 'Thursday', visitCount: 87, timeSpent: 87 },
    { day: 'Friday', visitCount: 76, timeSpent: 76 },
    { day: 'Saturday', visitCount: 54, timeSpent: 54 },
  ],
  totalVisits: 523,
  dateRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
  }
};

function DemoApp() {
  const [historyData] = useState<ProcessedHistoryData>(mockData);
  const [daysBack, setDaysBack] = useState(7);

  const handleExportDomains = () => {
    const csv = exportToCSV(historyData, 'domains');
    downloadCSV(csv, `browsing-history-domains-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportDays = () => {
    const csv = exportToCSV(historyData, 'days');
    downloadCSV(csv, `browsing-history-days-${new Date().toISOString().split('T')[0]}.csv`);
  };

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
        <p style={{ marginTop: '8px', fontSize: '0.85rem', opacity: 0.8 }}>
          This is a demo with mock data. Install the extension to see your real browsing history.
        </p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
);
