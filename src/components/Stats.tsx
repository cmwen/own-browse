import React from 'react';
import { ProcessedHistoryData } from '../types';

interface StatsProps {
    historyData: ProcessedHistoryData;
}

export const Stats: React.FC<StatsProps> = ({ historyData }) => {
    return (
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
    );
};
