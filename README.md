# Angular Version Detector Extension

A cross-browser extension that detects Angular framework on websites and displays the version information in the bottom-right corner of the browser.

## Features

- ✅ **Cross-browser compatibility** - Works in Chrome, Firefox, and other Chromium-based browsers
- ✅ **Angular detection** - Detects both AngularJS (1.x) and Angular (2+)
- ✅ **Version display** - Shows Angular logo with version number
- ✅ **Deprecated version warning** - Highlights deprecated versions in red
- ✅ **Non-intrusive UI** - Small, elegant display that doesn't interfere with website content
- ✅ **Responsive design** - Adapts to different screen sizes

## Installation

### Chrome/Chromium browsers:
1. Download all the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension files

### Firefox:
1. Download all the extension files
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file

## Files Structure

```
angular-detector/
├── manifest.json       # Extension configuration
├── content.js         # Main detection logic
├── styles.css         # Styling for the version display
└── README.md         # Documentation
```

## How it works

The extension uses multiple detection methods:

1. **Global objects** - Checks for `window.ng`, `window.angular`
2. **DOM attributes** - Looks for Angular-specific attributes like `ng-app`, `ng-version`
3. **DOM elements** - Searches for Angular components like `app-root`, `router-outlet`
4. **Script tags** - Examines loaded scripts for Angular libraries
5. **Angular-specific content** - Detects Angular-generated attributes in HTML

## Version Classification

- **Current versions** (Angular 15+): Displayed in black
- **Deprecated versions** (Angular 1-14): Displayed in red with "(deprecated version)" label

## Customization

You can modify the extension by editing:

- `content.js` - Change detection logic or deprecated version list
- `styles.css` - Modify the appearance and positioning
- `manifest.json` - Update extension metadata or permissions

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Edge 88+
- ✅ Opera 74+
- ✅ Safari 14+ (with minor modifications)

## Permissions

The extension only requires:
- `activeTab` - To access the current webpage content for Angular detection

No data is collected or transmitted. All processing happens locally in your browser.

## Troubleshooting

**Extension not detecting Angular:**
- Make sure the website has fully loaded
- Some Angular apps load dynamically - try refreshing the page
- Check if the site uses a custom Angular build

**Version not showing:**
- Some Angular apps don't expose version information
- The extension will show "Detected" when Angular is found but version is unknown

## Contributing

Feel free to submit issues or pull requests to improve the extension's detection capabilities or add new features.