export interface HistoryItem extends chrome.history.HistoryItem {
  url: string;
  title?: string;
  lastVisitTime?: number;
  visitCount?: number;
  typedCount?: number;
}

export interface DomainStats {
  domain: string;
  visitCount: number;
  timeSpent: number; // in minutes (estimated)
  urls: HistoryItem[]; // Detailed history items for this domain
}

export interface DayOfWeekStats {
  day: string;
  visitCount: number;
  timeSpent: number; // in minutes (estimated)
}

export interface ProcessedHistoryData {
  domainStats: DomainStats[];
  dayOfWeekStats: DayOfWeekStats[];
  totalVisits: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  allHistory: HistoryItem[]; // Keep all history items for detailed export
}
