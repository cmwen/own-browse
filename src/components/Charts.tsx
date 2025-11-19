import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ProcessedHistoryData } from '../types';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartsProps {
    historyData: ProcessedHistoryData;
}

export const Charts: React.FC<ChartsProps> = ({ historyData }) => {
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
    );
};
