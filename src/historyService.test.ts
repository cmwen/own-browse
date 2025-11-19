import { describe, it, expect } from 'vitest';
import { processHistoryData, extractDomain } from './historyService';
import { HistoryItem } from './types';

describe('historyService', () => {
    describe('extractDomain', () => {
        it('should extract domain from a standard URL', () => {
            expect(extractDomain('https://www.google.com/search?q=test')).toBe('www.google.com');
        });

        it('should extract domain from a URL without www', () => {
            expect(extractDomain('https://github.com/')).toBe('github.com');
        });

        it('should handle subdomains', () => {
            expect(extractDomain('https://api.example.co.uk/v1')).toBe('api.example.co.uk');
        });

        it('should return "unknown" for invalid URLs', () => {
            expect(extractDomain('invalid-url')).toBe('unknown');
        });
    });

    describe('processHistoryData', () => {
        it('should correctly process history items', () => {
            const mockHistory: HistoryItem[] = [
                {
                    id: '1',
                    url: 'https://www.google.com/search',
                    title: 'Google Search',
                    lastVisitTime: new Date('2023-10-27T10:00:00').getTime(),
                    visitCount: 5,
                    typedCount: 1
                },
                {
                    id: '2',
                    url: 'https://www.google.com/maps',
                    title: 'Google Maps',
                    lastVisitTime: new Date('2023-10-27T10:30:00').getTime(),
                    visitCount: 2,
                    typedCount: 0
                },
                {
                    id: '3',
                    url: 'https://github.com/dashboard',
                    title: 'GitHub',
                    lastVisitTime: new Date('2023-10-27T11:00:00').getTime(),
                    visitCount: 10,
                    typedCount: 5
                }
            ];

            const result = processHistoryData(mockHistory);

            expect(result.totalVisits).toBe(3);
            expect(result.domainStats).toHaveLength(2);

            const googleStats = result.domainStats.find(s => s.domain === 'www.google.com');
            expect(googleStats).toBeDefined();
            expect(googleStats?.visitCount).toBe(2);
            expect(googleStats?.urls).toHaveLength(2);

            const githubStats = result.domainStats.find(s => s.domain === 'github.com');
            expect(githubStats).toBeDefined();
            expect(githubStats?.visitCount).toBe(1);
        });

        it('should handle empty history', () => {
            const result = processHistoryData([]);
            expect(result.totalVisits).toBe(0);
            expect(result.domainStats).toHaveLength(0);
            expect(result.dayOfWeekStats).toHaveLength(7); // Should still have 7 days
        });
    });
});
