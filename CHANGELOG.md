# Changelog

All notable changes to the Own Browse extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-12

### Added
- Initial release of Own Browse browser extension
- Browser history visualization with interactive charts
  - Pie chart showing top 10 domains by visit count
  - Bar chart displaying browsing activity by day of week
- Flexible time range selection (24 hours, 7 days, 30 days, 90 days)
- CSV export functionality for both domain and day-based statistics
- Privacy-first design with local-only data processing
- Modern React-based UI with gradient theme
- TypeScript for type safety
- Vite for fast development and bundling
- Chrome Extension Manifest V3 support

### Technical Details
- React 19 for UI components
- Chart.js with react-chartjs-2 for data visualization
- TypeScript for type-safe code
- Vite for build tooling
- Chrome Extension API for history access
- No external dependencies or API calls
- All data processing happens locally in the browser

### Security
- CodeQL security scanning: ✅ No vulnerabilities
- Dependency security check: ✅ No vulnerabilities
- Only requests necessary `history` permission
- No data transmission to external servers

[1.0.0]: https://github.com/cmwen/own-browse/releases/tag/v1.0.0
