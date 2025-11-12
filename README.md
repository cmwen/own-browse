# Own Browse - Browser History Visualizer

A privacy-focused browser extension that visualizes your browsing history with interactive charts and allows you to export your data in CSV format.

## Features

- 📊 **Visual Analytics**: View your browsing habits through interactive charts
  - Pie chart showing top domains by visit count
  - Bar chart displaying browsing activity by day of the week
- 📥 **Data Export**: Export your browsing data in CSV format for further analysis
- 🔒 **Privacy First**: All data processing happens locally in your browser
- ⏱️ **Flexible Time Ranges**: Analyze data from the last 24 hours, 7 days, 30 days, or 90 days
- 🎨 **Beautiful UI**: Clean, modern interface built with React

## Tech Stack

- **TypeScript**: Type-safe code
- **React**: Modern UI framework
- **Vite**: Fast development and bundling
- **Chart.js**: Interactive data visualizations
- **Chrome Extension API**: Browser history access

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/cmwen/own-browse.git
cd own-browse
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in your browser:
   - Open Chrome/Edge and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Usage

1. Click the extension icon in your browser toolbar
2. Grant permission to access browsing history (if prompted)
3. View your browsing statistics in the popup window
4. Use the time range selector to adjust the analysis period
5. Click "Export" buttons to download CSV files of your data

## Data Export

You can export two types of data:

1. **Domains Data**: Top domains by visit count with estimated time spent
2. **Days Data**: Browsing activity broken down by day of the week

Export your data to use with AI tools or spreadsheet applications for deeper analysis.

## Privacy

- All data processing happens locally in your browser
- No data is sent to external servers
- You control what data to export
- The extension only requests necessary permissions

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.