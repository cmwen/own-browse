import { HistoryItem, DomainStats, DayOfWeekStats, ProcessedHistoryData } from './types';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
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
  const domainMap = new Map<string, { visitCount: number; timeSpent: number }>();
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
    const domainData = domainMap.get(domain) || { visitCount: 0, timeSpent: 0 };
    domainData.visitCount += 1;
    domainData.timeSpent += estimatedTime;
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
      timeSpent: stats.timeSpent
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
    }
  };
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: ProcessedHistoryData, type: 'domains' | 'days'): string {
  if (type === 'domains') {
    const header = 'Domain,Visit Count,Time Spent (minutes)\n';
    const rows = data.domainStats
      .map(stat => `"${stat.domain}",${stat.visitCount},${stat.timeSpent}`)
      .join('\n');
    return header + rows;
  } else {
    const header = 'Day of Week,Visit Count,Time Spent (minutes)\n';
    const rows = data.dayOfWeekStats
      .map(stat => `"${stat.day}",${stat.visitCount},${stat.timeSpent}`)
      .join('\n');
    return header + rows;
  }
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
