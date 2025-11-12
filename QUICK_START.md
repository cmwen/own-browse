# Quick Start Guide

Get up and running with Own Browse in 5 minutes.

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/cmwen/own-browse.git
cd own-browse

# 2. Install dependencies
npm install

# 3. Build the extension
npm run build
```

## 📦 Load in Browser

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `dist` folder
5. Done! Click the extension icon to open

## 🎯 First Use

1. Click the extension icon in your toolbar
2. Grant history permission when prompted
3. See your browsing data visualized
4. Select time range: 24h, 7d, 30d, or 90d
5. Export data by clicking CSV buttons

## 📊 What You'll See

- **Pie Chart**: Top 10 domains you visit most
- **Bar Chart**: Browsing activity by day of week
- **Stats**: Total visits and date range
- **Export Buttons**: Download CSV files

## 💾 Exporting Data

Click either export button to download:
- `browsing-history-domains-YYYY-MM-DD.csv` - Domain statistics
- `browsing-history-days-YYYY-MM-DD.csv` - Day of week statistics

## 🤖 Using with AI

1. Export your CSV data
2. Open ChatGPT, Claude, or similar AI tool
3. Upload the CSV file
4. Ask: "Analyze my browsing patterns and give me insights"

See [AI_ANALYSIS.md](AI_ANALYSIS.md) for detailed examples.

## 🔧 Development

```bash
# Start dev server (for UI development)
npm run dev

# View demo with mock data
# Navigate to: http://localhost:5173/demo.html

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

## 📚 Documentation

- [README.md](README.md) - Project overview
- [INSTALLATION.md](INSTALLATION.md) - Detailed setup
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
- [AI_ANALYSIS.md](AI_ANALYSIS.md) - AI integration guide
- [CHANGELOG.md](CHANGELOG.md) - Version history

## 🐛 Troubleshooting

**Extension shows error:**
- Make sure you granted history permission
- Click "Retry" button
- Check browser console for errors

**No data showing:**
- Wait a few seconds for data to load
- Try a different time range
- Ensure you have browsing history

**Build fails:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js 16+ is installed

## 🔒 Privacy

- All data stays in your browser
- No external servers or API calls
- You control what to export
- Extension only accesses history when open

## ⚡ Quick Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build extension
npm run preview      # Preview production build
node scripts/generate-icons.js  # Regenerate icons
```

## 🎨 Customization

To change colors, edit `src/App.css`:
- Background gradient: lines 18-19
- Chart colors: `src/App.tsx` lines 83-89
- Button color: line 132 in App.css

## 📝 Key Files

- `src/App.tsx` - Main UI component
- `src/historyService.ts` - Browser API integration
- `src/types.ts` - TypeScript types
- `public/manifest.json` - Extension configuration
- `vite.config.ts` - Build configuration

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🆘 Need Help?

- Check [DEVELOPMENT.md](DEVELOPMENT.md) for detailed docs
- Review existing issues on GitHub
- Open a new issue with your question

## ⭐ Next Steps

1. Try exporting your data
2. Analyze it with AI tools
3. Track changes over time
4. Customize the UI to your liking
5. Share feedback or contribute!

---

Built with ❤️ using TypeScript, React, and Vite
