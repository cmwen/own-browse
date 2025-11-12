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
}
