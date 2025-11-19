import React from 'react';
import { ProcessedHistoryData } from '../types';
import { exportToCSV, downloadCSV } from '../historyService';

interface DomainFilterProps {
    historyData: ProcessedHistoryData;
    selectedDomain: string;
    setSelectedDomain: (domain: string) => void;
}

export const DomainFilter: React.FC<DomainFilterProps> = ({
    historyData,
    selectedDomain,
    setSelectedDomain
}) => {
    const handleExportDomainDetail = (domain: string) => {
        const csv = exportToCSV(historyData, 'domain-detail', domain);
        downloadCSV(csv, `browsing-history-${domain.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
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
    );
};
