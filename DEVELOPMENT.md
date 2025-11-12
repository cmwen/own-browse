# Development Guide

This guide is for developers who want to contribute to or modify the Own Browse extension.

## Project Structure

```
own-browse/
├── public/              # Static assets
│   ├── manifest.json    # Extension manifest file
│   └── icon*.png        # Extension icons
├── src/                 # Source code
│   ├── App.tsx          # Main React component
│   ├── App.css          # Component styles
│   ├── popup.tsx        # Extension popup entry point
│   ├── historyService.ts # Browser history API integration
│   └── types.ts         # TypeScript type definitions
├── scripts/             # Build scripts
│   └── generate-icons.js # Icon generation script
├── dist/                # Build output (generated)
├── popup.html           # Extension popup HTML
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── package.json         # Project dependencies
```

## Technology Stack

- **TypeScript**: Type-safe JavaScript
- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Chart.js**: Data visualization library
- **react-chartjs-2**: React wrapper for Chart.js
- **Chrome Extension API**: Browser integration

## Development Workflow

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Generate icons (if needed):
```bash
node scripts/generate-icons.js
```

### Development Mode

**Note**: This extension does not have a traditional dev server mode because it relies on the Chrome Extension API, which is only available when the extension is loaded in a browser.

To develop and test:
1. Build the extension (see Building section)
2. Load it in Chrome as an unpacked extension (see Loading in Browser section)
3. Make code changes
4. Run `pnpm run build` to rebuild
5. Click the refresh icon in `chrome://extensions/` for your extension

### Building

Build the extension:
```bash
pnpm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Bundle React components with Vite
3. Copy manifest and icons to the `dist/` folder

### Loading in Browser

After building, load the `dist/` folder as an unpacked extension in Chrome:
1. Navigate to `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `dist/` folder

## Key Components

### historyService.ts

Core service for interacting with browser history:
- `fetchHistory()`: Retrieves browsing history from Chrome API
- `processHistoryData()`: Analyzes and aggregates history data
- `exportToCSV()`: Converts data to CSV format
- `downloadCSV()`: Triggers CSV file download

### App.tsx

Main React component:
- Displays charts and statistics
- Handles time range selection
- Manages data export actions
- Shows loading and error states

### types.ts

TypeScript type definitions:
- `HistoryItem`: Browser history item structure
- `DomainStats`: Domain visit statistics
- `DayOfWeekStats`: Day-based visit statistics
- `ProcessedHistoryData`: Aggregated history data

## Data Processing

The extension processes browsing history as follows:

1. **Fetch**: Retrieves history items from Chrome API based on selected time range
2. **Extract**: Parses domain names from URLs
3. **Aggregate**: Counts visits per domain and per day of week
4. **Estimate**: Calculates estimated time spent (simple heuristic: 1 min per visit)
5. **Sort**: Ranks domains by visit count, keeps top 10
6. **Visualize**: Renders data in Chart.js charts

## Adding Features

### Adding a New Chart

1. Create data processing logic in `historyService.ts`
2. Update `ProcessedHistoryData` type in `types.ts`
3. Add chart rendering in `App.tsx`
4. Register required Chart.js components
5. Add export functionality if needed

### Adding New Time Ranges

Update the time range selector in `App.tsx`:
```tsx
<select value={daysBack} onChange={(e) => setDaysBack(Number(e.target.value))}>
  <option value={1}>Last 24 hours</option>
  <option value={7}>Last 7 days</option>
  <option value={30}>Last 30 days</option>
  <option value={90}>Last 90 days</option>
  <option value={365}>Last year</option> {/* New option */}
</select>
```

### Modifying Data Export

Update `exportToCSV()` in `historyService.ts` to add new export formats:
```typescript
export function exportToCSV(data: ProcessedHistoryData, type: 'domains' | 'days' | 'custom'): string {
  // Add custom export logic
}
```

## Styling

The extension uses vanilla CSS with a gradient theme. Key styles are in `App.css`:

- Background: Purple gradient (`#667eea` to `#764ba2`)
- Charts: White cards with rounded corners
- Buttons: Blue accent color (`#4A90E2`)
- Typography: System font stack

To modify the theme, update CSS custom properties or modify colors directly in `App.css`.

## Browser Compatibility

The extension is built for Chromium-based browsers:
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Brave
- ✅ Opera

For Firefox support, the manifest would need to be updated to use Firefox-specific extension APIs.

## Testing

Currently, the project doesn't have automated tests. To test:

1. Load the extension in Chrome
2. Verify history permission is requested
3. Check that charts render correctly
4. Test CSV export functionality
5. Verify different time ranges work
6. Test error handling (revoke permissions)

## Performance Considerations

- The extension processes up to 10,000 history items (configurable in `fetchHistory()`)
- Processing happens in the main thread (consider Web Workers for large datasets)
- Charts are rendered with Chart.js (canvas-based, performant)
- CSV generation is synchronous (may block for very large datasets)

## Security

- The extension only requests `history` permission
- No external API calls or network requests
- All data processing happens locally
- No user data is stored or transmitted
- CodeQL security scanning: ✅ No issues

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -am 'Add new feature'`
6. Push: `git push origin feature/new-feature`
7. Create a Pull Request

## License

MIT License - see LICENSE file for details.
