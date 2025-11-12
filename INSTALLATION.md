# Installation Guide

This guide will help you install the Own Browse extension in your browser.

## Prerequisites

- Node.js 16+ and npm installed on your system
- Google Chrome, Microsoft Edge, or any Chromium-based browser

## Building the Extension

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

This will create a `dist/` folder with the compiled extension files.

## Loading the Extension in Chrome/Edge

1. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`

2. Enable **Developer mode** using the toggle in the top-right corner

3. Click **Load unpacked**

4. Select the `dist` folder from the project directory

5. The extension should now appear in your extensions list

6. Click the extension icon in your toolbar to open the popup

## First Use

When you first open the extension:

1. The browser will request permission to access your browsing history
2. Click **Allow** to grant the necessary permissions
3. The extension will load and display your browsing history visualizations

## Features

Once installed, you can:

- View top domains by visit count in a pie chart
- See browsing activity by day of week in a bar chart
- Select different time ranges (24h, 7d, 30d, 90d)
- Export your data in CSV format for analysis
- All processing happens locally - your data never leaves your browser

## Troubleshooting

### Extension doesn't show data

- Make sure you granted history permission
- Try refreshing the extension by clicking the Retry button
- Check the browser console for any error messages

### Build fails

- Ensure you have Node.js 16 or higher installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure all dependencies are installed correctly

### Extension doesn't load

- Verify the `dist` folder contains all necessary files
- Check that Developer mode is enabled
- Try removing and reloading the extension

## Uninstalling

To remove the extension:

1. Go to your browser's extensions page
2. Find "Own Browse - History Visualizer"
3. Click **Remove** or the trash icon
4. Confirm the removal

## Privacy

- All data processing happens locally in your browser
- No data is sent to external servers
- You control what data to export
- The extension only accesses your browsing history when you open it
