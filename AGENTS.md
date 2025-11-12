# AI Agent Guide for Own Browse

This document provides guidance for AI coding agents (like GitHub Copilot, Claude, ChatGPT) working with the Own Browse browser extension codebase. It includes architectural patterns, common tasks, and best practices specific to this project.

## Project Overview

**Own Browse** is a Chrome extension that analyzes and exports browsing history. It's a privacy-focused tool that processes all data locally using React, TypeScript, and Chart.js.

**Core Value Proposition**:
- Visualize browsing patterns (top domains, weekly activity)
- Export browsing data for external analysis
- Filter and analyze domain-specific history
- 100% local processing, no external servers

## Architecture

### Technology Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Charting**: Chart.js + react-chartjs-2
- **APIs**: Chrome Extension API (history)
- **Package Manager**: pnpm

### Key Design Patterns

1. **Service Layer Pattern**: `historyService.ts` handles all Chrome API interactions
2. **Type-First Development**: All data structures defined in `types.ts`
3. **Single Page Component**: `App.tsx` is the main UI component
4. **Local-First**: No network requests, all processing in-browser

### File Structure
```
src/
├── App.tsx              # Main React component with UI logic
├── App.css              # Styling
├── popup.tsx            # Extension entry point
├── historyService.ts    # Chrome API integration & data processing
└── types.ts             # TypeScript type definitions
```

## Common Development Tasks

### Adding a New Chart

**Steps**:
1. Update `types.ts` with new data structure
2. Add processing logic to `processHistoryData()` in `historyService.ts`
3. Register required Chart.js components in `App.tsx`
4. Add chart rendering in `App.tsx`
5. Add export functionality if needed

**Example**: Adding an hourly activity chart
```typescript
// 1. types.ts
export interface HourlyStats {
  hour: number;
  visitCount: number;
}

export interface ProcessedHistoryData {
  // ...existing fields
  hourlyStats: HourlyStats[];
}

// 2. historyService.ts
export function processHistoryData(historyItems: HistoryItem[]): ProcessedHistoryData {
  const hourMap = new Map<number, number>();
  
  historyItems.forEach((item) => {
    if (!item.lastVisitTime) return;
    const date = new Date(item.lastVisitTime);
    const hour = date.getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
  });
  
  const hourlyStats: HourlyStats[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    visitCount: hourMap.get(i) || 0
  }));
  
  return {
    // ...existing data
    hourlyStats
  };
}

// 3. App.tsx
import { LineElement, PointElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, /* ...other elements */);

// In component:
const hourlyChartData = {
  labels: historyData.hourlyStats.map(s => `${s.hour}:00`),
  datasets: [{
    label: 'Visits by Hour',
    data: historyData.hourlyStats.map(s => s.visitCount),
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

<Line data={hourlyChartData} />
```

### Adding a New Export Format

**Steps**:
1. Add export type to `exportToCSV()` function
2. Create CSV generation logic
3. Add export button in `App.tsx`
4. Wire up button to call export functions

**Example**: Exporting hourly activity
```typescript
// historyService.ts
export function exportToCSV(
  data: ProcessedHistoryData, 
  type: 'domains' | 'days' | 'detailed' | 'hourly'
): string {
  if (type === 'hourly') {
    const headers = ['Hour', 'Visit Count'];
    const rows = data.hourlyStats.map(stat => [
      `${stat.hour}:00`,
      stat.visitCount.toString()
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  // ...existing export types
}

// App.tsx
const handleExportHourly = () => {
  if (!historyData) return;
  const csv = exportToCSV(historyData, 'hourly');
  downloadCSV(csv, `browsing-history-hourly-${new Date().toISOString().split('T')[0]}.csv`);
};

<button onClick={handleExportHourly}>Export Hourly Activity</button>
```

### Adding a New Time Range

**Location**: `App.tsx` in the time range selector

**Example**:
```tsx
<select value={daysBack} onChange={(e) => setDaysBack(Number(e.target.value))}>
  <option value={1}>Last 24 hours</option>
  <option value={7}>Last 7 days</option>
  <option value={30}>Last 30 days</option>
  <option value={90}>Last 90 days</option>
  <option value={365}>Last year</option> {/* New option */}
</select>
```

### Modifying Domain Filtering

**Current Implementation**: Users can select a domain from a dropdown to view detailed visit history.

**Location**: `App.tsx` - `selectedDomain` state and filtering logic

**Enhancement Example**: Add URL pattern filtering
```typescript
const [urlPattern, setUrlPattern] = useState('');

const filteredUrls = selectedDomainStats.urls.filter(item => 
  item.url?.toLowerCase().includes(urlPattern.toLowerCase())
);

<input 
  type="text" 
  placeholder="Filter by URL pattern..."
  value={urlPattern}
  onChange={(e) => setUrlPattern(e.target.value)}
/>
```

## Chrome Extension API Integration

### History API Usage

The extension uses `chrome.history.search()` to fetch browsing data:

```typescript
chrome.history.search(
  {
    text: '',           // Empty = all history
    startTime: startTime, // Unix timestamp in milliseconds
    maxResults: 10000    // Default limit
  },
  (results) => {
    // Process results
  }
);
```

**Important Notes**:
- Requires `"history"` permission in `manifest.json`
- API only available in extension context (not in regular web pages)
- Returns `HistoryItem[]` with URL, title, lastVisitTime, visitCount
- `lastVisitTime` is Unix timestamp in milliseconds
- `visitCount` is total visits across all time (not just the query range)

### Permissions

Current permissions in `public/manifest.json`:
```json
{
  "permissions": ["history"]
}
```

**If you need additional APIs**:
- `tabs`: Access open tabs
- `bookmarks`: Access bookmarks
- `storage`: Store settings/data
- `downloads`: Trigger file downloads programmatically

## Data Processing Pipeline

### Flow
```
Chrome History API
    ↓
fetchHistory(daysBack) → HistoryItem[]
    ↓
processHistoryData(historyItems) → ProcessedHistoryData
    ↓
React State (historyData)
    ↓
Chart.js Visualization / CSV Export
```

### Key Processing Logic

**Domain Extraction**:
```typescript
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'unknown';
  }
}
```

**Time Estimation**:
- Current heuristic: 1 minute per visit
- Room for improvement: Calculate based on time between visits

**Aggregation**:
- Domains: Top 10 by visit count
- Days: All 7 days of the week
- Detailed URLs: Grouped by domain

## Styling Guidelines

### Current Theme
- **Background**: Purple gradient (`#667eea` to `#764ba2`)
- **Cards**: White with `border-radius: 12px`
- **Buttons**: Blue (`#4A90E2`) with white text
- **Font**: System font stack for native look

### Responsive Design
- Container: `max-width: 1200px`
- Charts: Responsive to container width
- Mobile-friendly: Stacks vertically on small screens

### Making Style Changes

**To change theme colors**:
```css
/* App.css */
.app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.button {
  background-color: #4A90E2; /* Change primary button color */
}

.card {
  background-color: white; /* Card background */
}
```

## Testing Strategy

### No Automated Tests (Yet)
The project currently lacks automated tests. Manual testing is required.

### Manual Testing Checklist
1. **Build**: Run `pnpm run build` successfully
2. **Load Extension**: Load `dist/` folder in Chrome
3. **Permission**: Verify history permission is requested
4. **Charts**: Check that charts render correctly
5. **Time Ranges**: Test all time range options
6. **Domain Filter**: Select domains and verify detailed view
7. **Export**: Test all CSV export functions
8. **Error Handling**: Revoke permission and verify error message

### Testing in Chrome
```bash
# 1. Build
pnpm run build

# 2. Load in Chrome
# Navigate to chrome://extensions/
# Enable Developer mode
# Click "Load unpacked"
# Select the dist/ folder

# 3. Test
# Click extension icon in toolbar
# Interact with UI
# Check browser console for errors
```

## Common Issues and Solutions

### Issue: Chrome API not available
**Symptom**: `chrome is not defined` error
**Solution**: Ensure code is running in extension context (not in dev server). Build and load extension properly.

### Issue: Charts not rendering
**Symptom**: Blank chart areas
**Solution**: 
- Verify Chart.js components are registered in `App.tsx`
- Check that data format matches chart type requirements
- Ensure data exists (check loading state)

### Issue: Export not working
**Symptom**: CSV download not triggering
**Solution**:
- Check that `historyData` is not null
- Verify CSV generation logic
- Ensure `downloadCSV()` function is called correctly

### Issue: Build fails
**Symptom**: TypeScript or Vite errors
**Solution**:
- Run `pnpm install` to ensure dependencies are installed
- Check `tsconfig.json` for correct configuration
- Verify all imports are correct

## Best Practices for AI Agents

### When Modifying Code

1. **Type Safety First**: Always update `types.ts` before changing data structures
2. **Test Chrome API Changes**: Chrome APIs are async - handle promises correctly
3. **Preserve Styling**: Maintain consistent design patterns from `App.css`
4. **Update Docs**: If adding features, update `README.md` and `DEVELOPMENT.md`
5. **Build Before Testing**: Always rebuild after changes (`pnpm run build`)

### When Adding Features

1. **Start with Types**: Define interfaces in `types.ts`
2. **Service Layer**: Add Chrome API logic to `historyService.ts`
3. **UI Component**: Update `App.tsx` for visualization
4. **Export Support**: Add CSV export if data should be exportable
5. **Error Handling**: Add try-catch blocks and user-friendly error messages

### When Refactoring

1. **Maintain API Contracts**: Don't break existing function signatures
2. **Preserve Privacy**: Keep all processing local, no external calls
3. **Performance**: Consider Web Workers for heavy processing (future enhancement)
4. **Backwards Compatibility**: Ensure existing exports still work

## Performance Considerations

### Current Limitations
- Processes up to 10,000 history items (configurable in `fetchHistory()`)
- Processing happens in main thread (can block UI for large datasets)
- CSV generation is synchronous

### Optimization Opportunities
1. **Web Workers**: Offload data processing to worker threads
2. **Pagination**: Process history in chunks rather than all at once
3. **Caching**: Cache processed data to avoid recomputing on UI updates
4. **Lazy Loading**: Load detailed URL data only when domain is selected

### Memory Management
- Clear large data structures when not needed
- Limit chart data points to reasonable amounts
- Consider limiting history fetch to prevent memory issues

## Security Considerations

### Current Security Posture
- ✅ No external network requests
- ✅ No data storage or transmission
- ✅ Minimal permissions (only `history`)
- ✅ No third-party analytics or tracking
- ✅ CodeQL security scanning passed

### When Adding Features
- **Never** send browsing data to external servers
- **Avoid** storing sensitive data in `localStorage` or `chrome.storage`
- **Validate** all user inputs if adding form fields
- **Sanitize** URLs and domains before display to prevent XSS
- **Request** only necessary permissions

## Extension Manifest (V3)

Current manifest version: **Manifest V3** (latest)

### Key Manifest Properties
```json
{
  "manifest_version": 3,
  "name": "Own Browse",
  "version": "1.0.0",
  "permissions": ["history"],
  "action": {
    "default_popup": "popup.html"
  }
}
```

### Adding New Permissions
If you need additional functionality:
- `tabs`: `"permissions": ["history", "tabs"]`
- `bookmarks`: `"permissions": ["history", "bookmarks"]`
- `storage`: `"permissions": ["history", "storage"]`

**Note**: Adding permissions requires user consent on extension update.

## Useful Code Snippets

### Fetching All History (No Time Limit)
```typescript
export async function fetchAllHistory(): Promise<HistoryItem[]> {
  return new Promise((resolve, reject) => {
    chrome.history.search(
      {
        text: '',
        startTime: 0, // Beginning of time
        maxResults: 0 // 0 = unlimited
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
```

### Getting Visit Details for a URL
```typescript
async function getVisitDetails(url: string): Promise<chrome.history.VisitItem[]> {
  return new Promise((resolve, reject) => {
    chrome.history.getVisits({ url }, (visits) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(visits);
      }
    });
  });
}
```

### Calculating Actual Time Spent (Advanced)
```typescript
function calculateTimeSpent(visits: chrome.history.VisitItem[]): number {
  let totalMinutes = 0;
  const sortedVisits = visits.sort((a, b) => 
    (a.visitTime || 0) - (b.visitTime || 0)
  );
  
  for (let i = 0; i < sortedVisits.length - 1; i++) {
    const current = sortedVisits[i].visitTime || 0;
    const next = sortedVisits[i + 1].visitTime || 0;
    const diff = (next - current) / (1000 * 60); // Convert to minutes
    
    // If next visit is within 30 minutes, count as continuous
    if (diff <= 30) {
      totalMinutes += diff;
    } else {
      totalMinutes += 1; // Default 1 minute for isolated visits
    }
  }
  
  return totalMinutes;
}
```

## Future Enhancement Ideas

### High Priority
- [ ] Add more time range options (6 months, all time)
- [ ] Implement better time estimation algorithm
- [ ] Add search/filter functionality for domains
- [ ] Dark mode support
- [ ] Export to JSON format

### Medium Priority
- [ ] Hourly activity chart
- [ ] Compare time periods (this week vs last week)
- [ ] Category tagging for domains (social media, work, entertainment)
- [ ] Visit duration visualization (not just visit count)
- [ ] Browser-based settings/preferences

### Low Priority / Nice to Have
- [ ] Automated testing suite
- [ ] Firefox compatibility
- [ ] Safari extension port
- [ ] Bookmark integration
- [ ] Tab management features

## Contributing

When contributing to this project:
1. Follow TypeScript best practices
2. Maintain consistent code style
3. Add types for all new data structures
4. Test thoroughly in Chrome
5. Update documentation (README, DEVELOPMENT, AGENTS)
6. Ensure privacy-first approach is maintained

## Resources

### Documentation
- [Chrome Extension API - History](https://developer.chrome.com/docs/extensions/reference/history/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

### Project Files
- [README.md](./README.md) - User-facing documentation
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Developer guide
- [INSTALLATION.md](./INSTALLATION.md) - Installation instructions
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

## License

MIT License - See [LICENSE](./LICENSE) file for details.
