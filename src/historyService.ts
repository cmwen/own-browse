import { HistoryItem, DomainStats, DayOfWeekStats, ProcessedHistoryData } from './types';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Fetch browsing history from Chrome API
 */
export async function fetchHistory(daysBack: number = 7): Promise<HistoryItem[]> {
  const startTime = Date.now() - (daysBack * 24 * 60 * 60 * 1000);

  // Mock data for development/testing outside of extension environment
  if (typeof chrome === 'undefined' || !chrome.history) {
    console.warn('Chrome API not found, using mock data');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', url: 'https://www.google.com/search?q=react', title: 'React - Google Search', lastVisitTime: Date.now() - 100000, visitCount: 5, typedCount: 1 },
          { id: '2', url: 'https://github.com/facebook/react', title: 'facebook/react: The library for web and native user interfaces', lastVisitTime: Date.now() - 200000, visitCount: 10, typedCount: 3 },
          { id: '3', url: 'https://stackoverflow.com/questions/123/how-to-react', title: 'How to React? - Stack Overflow', lastVisitTime: Date.now() - 300000, visitCount: 2, typedCount: 0 },
          { id: '4', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', lastVisitTime: Date.now() - 400000, visitCount: 20, typedCount: 0 },
          { id: '5', url: 'https://news.ycombinator.com/', title: 'Hacker News', lastVisitTime: Date.now() - 500000, visitCount: 15, typedCount: 5 },
          { id: '6', url: 'https://www.typescriptlang.org/docs/', title: 'Documentation - TypeScript', lastVisitTime: Date.now() - 600000, visitCount: 8, typedCount: 2 },
          { id: '7', url: 'https://vitejs.dev/guide/', title: 'Getting Started | Vite', lastVisitTime: Date.now() - 700000, visitCount: 6, typedCount: 1 },
        ]);
      }, 500);
    });
  }

  return new Promise((resolve, reject) => {
    chrome.history.search(
      {
        text: '',
        startTime: startTime,
        maxResults: 10000
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(results as HistoryItem[]);
        }
      }
    );
  });
}

/**
 * Process history data to generate statistics
 */
export function processHistoryData(historyItems: HistoryItem[]): ProcessedHistoryData {
  const domainMap = new Map<string, { visitCount: number; timeSpent: number; urls: HistoryItem[] }>();
  const dayMap = new Map<string, { visitCount: number; timeSpent: number }>();

  let minTime = Infinity;
  let maxTime = 0;

  historyItems.forEach((item) => {
    if (!item.url || !item.lastVisitTime) return;

    const domain = extractDomain(item.url);
    const visitTime = item.lastVisitTime;
    const date = new Date(visitTime);
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];

    // Update time range
    minTime = Math.min(minTime, visitTime);
    maxTime = Math.max(maxTime, visitTime);

    // Estimate time spent (1 minute per visit as a simple heuristic)
    const estimatedTime = 1;

    // Update domain stats
    const domainData = domainMap.get(domain) || { visitCount: 0, timeSpent: 0, urls: [] };
    domainData.visitCount += 1;
    domainData.timeSpent += estimatedTime;
    domainData.urls.push(item);
    domainMap.set(domain, domainData);

    // Update day of week stats
    const dayData = dayMap.get(dayOfWeek) || { visitCount: 0, timeSpent: 0 };
    dayData.visitCount += 1;
    dayData.timeSpent += estimatedTime;
    dayMap.set(dayOfWeek, dayData);
  });

  // Convert maps to arrays and sort
  const domainStats: DomainStats[] = Array.from(domainMap.entries())
    .map(([domain, stats]) => ({
      domain,
      visitCount: stats.visitCount,
      timeSpent: stats.timeSpent,
      urls: stats.urls
    }))
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 10); // Top 10 domains

  // Ensure all days of the week are represented
  const dayOfWeekStats: DayOfWeekStats[] = DAYS_OF_WEEK.map((day) => {
    const stats = dayMap.get(day) || { visitCount: 0, timeSpent: 0 };
    return {
      day,
      visitCount: stats.visitCount,
      timeSpent: stats.timeSpent
    };
  });

  return {
    domainStats,
    dayOfWeekStats,
    totalVisits: historyItems.length,
    dateRange: {
      start: new Date(minTime === Infinity ? Date.now() : minTime),
      end: new Date(maxTime || Date.now())
    },
    allHistory: historyItems
  };
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: ProcessedHistoryData, type: 'domains' | 'days' | 'detailed' | 'domain-detail', domain?: string): string {
  if (type === 'domains') {
    const header = 'Domain,Visit Count,Time Spent (minutes)\n';
    const rows = data.domainStats
      .map(stat => `"${stat.domain}",${stat.visitCount},${stat.timeSpent}`)
      .join('\n');
    return header + rows;
  } else if (type === 'days') {
    const header = 'Day of Week,Visit Count,Time Spent (minutes)\n';
    const rows = data.dayOfWeekStats
      .map(stat => `"${stat.day}",${stat.visitCount},${stat.timeSpent}`)
      .join('\n');
    return header + rows;
  } else if (type === 'detailed') {
    // Export all history with full details
    const header = 'Title,URL,Domain,Visit Time,Visit Count,Typed Count\n';
    const rows = data.allHistory
      .map(item => {
        const domain = extractDomain(item.url);
        const title = (item.title || 'Untitled').replace(/"/g, '""');
        const url = item.url.replace(/"/g, '""');
        const visitTime = item.lastVisitTime ? new Date(item.lastVisitTime).toISOString() : '';
        return `"${title}","${url}","${domain}","${visitTime}",${item.visitCount || 0},${item.typedCount || 0}`;
      })
      .join('\n');
    return header + rows;
  } else if (type === 'domain-detail' && domain) {
    // Export detailed history for a specific domain
    const domainStat = data.domainStats.find(stat => stat.domain === domain);
    if (!domainStat) return '';

    const header = 'Title,URL,Visit Time,Visit Count,Typed Count\n';
    const rows = domainStat.urls
      .sort((a, b) => (b.lastVisitTime || 0) - (a.lastVisitTime || 0))
      .map(item => {
        const title = (item.title || 'Untitled').replace(/"/g, '""');
        const url = item.url.replace(/"/g, '""');
        const visitTime = item.lastVisitTime ? new Date(item.lastVisitTime).toISOString() : '';
        return `"${title}","${url}","${visitTime}",${item.visitCount || 0},${item.typedCount || 0}`;
      })
      .join('\n');
    return header + rows;
  }
  return '';
}

/**
 * Trigger CSV download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
