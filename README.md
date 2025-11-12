# Own Browse - Browser History Analyzer & Exporter

A powerful, privacy-focused Chrome extension that helps you analyze and export your browsing history. Perfect for understanding your online habits, tracking time spent on specific sites, and exporting data for further analysis with AI tools or spreadsheets.

## ✨ Features

### 📊 Visual Analytics
- **Top Domains Chart**: Pie chart showing your most visited websites
- **Weekly Activity**: Bar chart displaying browsing patterns by day of the week
- **Smart Statistics**: Total visits and date range summaries

### 🔍 Domain-Specific Analysis
- **Filter by Domain**: Select any domain to see detailed visit history
- **Detailed View**: See all pages visited on a specific domain (e.g., which YouTube videos you watched most)
- **Visit Statistics**: Track visit counts, unique pages, and estimated time spent per domain

### 📥 Powerful Export Options
- **Complete History Export**: Export all browsing data with titles, URLs, timestamps, and visit counts
- **Top Domains Summary**: CSV export of your most visited domains
- **Weekly Activity Report**: Export browsing patterns by day of week
- **Domain-Specific Export**: Export detailed history for a single domain (perfect for analyzing YouTube watch history, GitHub activity, etc.)

### 🔒 Privacy First
- **100% Local Processing**: All data analysis happens in your browser
- **No External Servers**: Your data never leaves your device
- **No Tracking**: We don't collect or store any of your browsing data
- **Open Source**: Full transparency - review the code yourself

### ⏱️ Flexible Time Ranges
- Last 24 hours
- Last 7 days
- Last 30 days
- Last 90 days

## 🛠️ Tech Stack

- **TypeScript**: Type-safe code for reliability
- **React 19**: Modern UI framework
- **Vite**: Lightning-fast build tool
- **Chart.js**: Beautiful interactive charts
- **Chrome Extension API**: Native browser history access
- **pnpm**: Fast, efficient package management

## 📦 Installation

### Prerequisites
- Node.js 20+ and pnpm installed
- Chrome or Chromium-based browser (Chrome, Edge, Brave, etc.)

### Build from Source

1. **Clone the repository:**
```bash
git clone https://github.com/cmwen/own-browse.git
cd own-browse
```

2. **Install pnpm** (if not already installed):
```bash
npm install -g pnpm
# or use corepack
corepack enable
```

3. **Install dependencies:**
```bash
pnpm install
```

4. **Build the extension:**
```bash
pnpm run build
```

5. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - The extension icon will appear in your toolbar

## 🚀 Usage

### Basic Usage

1. **Open the Extension**: Click the Own Browse icon in your browser toolbar
2. **Grant Permissions**: Allow history access when prompted (required for the extension to work)
3. **View Analytics**: See your browsing patterns visualized in interactive charts
4. **Adjust Time Range**: Use the dropdown to analyze different time periods

### Domain-Specific Analysis

Perfect for answering questions like:
- "Which YouTube videos did I watch most this month?"
- "How much time do I spend on Reddit vs Twitter?"
- "What articles did I read on Medium?"

1. **Select Time Range**: Choose your analysis period (24 hours to 90 days)
2. **Select Domain**: Use the domain filter dropdown (e.g., "youtube.com")
3. **View Details**: See all pages visited, visit counts, and timestamps
4. **Export**: Click "Export All [domain] History" to download detailed CSV

### Export Options

#### 📊 Complete History Export
Exports ALL browsing data with full details:
- Page titles
- Full URLs
- Exact timestamps
- Visit counts
- Typed counts (how many times you typed the URL)

**Use cases:**
- Import into AI tools for pattern analysis
- Create custom reports in Excel/Google Sheets
- Archive your browsing history
- Data science projects

#### 🌐 Top Domains Summary
Quick overview of your most visited sites with visit counts and estimated time.

#### 📅 Weekly Activity Report
Understand which days you browse most actively.

#### 🎯 Domain-Specific Export
Export complete history for a single domain - perfect for:
- YouTube watch history analysis
- GitHub project tracking
- Research paper collection (arXiv, papers, etc.)
- Shopping behavior analysis

## 💡 Use Cases

- **Personal Analytics**: Understand your browsing habits and time management
- **Research Tracking**: Export visited academic papers and articles
- **Content Analysis**: Track which videos, articles, or posts you engage with
- **Time Management**: Identify time-consuming websites
- **AI Analysis**: Export data for ChatGPT, Claude, or other AI tools to analyze your browsing patterns
- **Academic Research**: Study your own digital behavior
- **Productivity Insights**: See when you're most active online

## 🔒 Privacy & Security

Your privacy is our top priority:

- ✅ **100% Local Processing**: All data analysis happens in your browser
- ✅ **Zero External Requests**: No data sent to servers, no analytics, no tracking
- ✅ **No Data Collection**: We don't see, store, or have access to your browsing history
- ✅ **Open Source**: Full code transparency - audit it yourself
- ✅ **Minimal Permissions**: Only requests necessary Chrome history API access
- ✅ **You Control Exports**: You decide what to export and where

The extension is a pure client-side tool. Your browsing data stays on your device.

## 🏗️ Development

### Build for Production
```bash
pnpm run build
```

### Project Structure
```
own-browse/
├── src/
│   ├── App.tsx              # Main application UI
│   ├── historyService.ts    # Chrome history API & data processing
│   ├── types.ts             # TypeScript type definitions
│   ├── popup.tsx            # Extension popup entry point
│   └── App.css              # Styles
├── public/
│   ├── manifest.json        # Extension manifest
│   └── *.png                # Extension icons
└── dist/                    # Built extension (generated)
```

### CI/CD

GitHub Actions automatically:
- ✅ Runs TypeScript type checking
- ✅ Builds the extension
- ✅ Runs CodeQL security scanning
- ✅ Dependabot keeps dependencies updated
- ✅ Uploads build artifacts

All builds use pnpm for fast, reliable builds.

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Icons from browser emoji

## 📮 Support

If you encounter issues or have suggestions:
- Open an [Issue](https://github.com/cmwen/own-browse/issues)
- Star ⭐ the repo if you find it useful!

---

**Made with ❤️ for privacy-conscious users who want to understand their digital habits.**