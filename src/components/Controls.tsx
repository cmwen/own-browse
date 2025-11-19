import React from 'react';

interface ControlsProps {
    daysBack: number;
    setDaysBack: (days: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ daysBack, setDaysBack }) => {
    return (
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
    );
};
