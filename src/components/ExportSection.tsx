import React from 'react';
import { ProcessedHistoryData } from '../types';
import { exportToCSV, downloadCSV } from '../historyService';

interface ExportSectionProps {
    historyData: ProcessedHistoryData;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ historyData }) => {
    const handleExportDomains = () => {
        const csv = exportToCSV(historyData, 'domains');
        downloadCSV(csv, `browsing-history-domains-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const handleExportDays = () => {
        const csv = exportToCSV(historyData, 'days');
        downloadCSV(csv, `browsing-history-days-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const handleExportDetailed = () => {
        const csv = exportToCSV(historyData, 'detailed');
        downloadCSV(csv, `browsing-history-detailed-${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
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
    );
};
