# 🦉 NightOwl - Dark Mode Extension

A modern Chrome extension that transforms any webpage into a beautiful dark mode experience with just one click.

![NightOwl Preview](preview.png)

## ✨ Features

- **One-Click Dark Mode** - Instantly toggle dark mode on any website
- **Smart Image Preservation** - Images, videos, and media stay true to their original colors
- **Customizable Filters** - Adjust brightness, contrast, sepia, and grayscale
- **Quick Themes** - Pre-built themes like Midnight, Eclipse, Sepia Night, and Mono Dark
- **Site Whitelist** - Exclude specific websites from dark mode
- **Auto Mode** - Automatically follow your system's dark/light preference
- **Persistent Settings** - Your preferences are saved across browser sessions
- **SPA Support** - Works with Single Page Applications (React, Vue, Angular)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Google Chrome browser

### Installation

1. **Clone and install dependencies:**

```bash
cd darkmode-extension
yarn install
```

2. **Build the extension:**

```bash
yarn build
```

3. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development

Run the development server with hot reload:

```bash
yarn dev
```

The extension will rebuild automatically when you make changes. You may need to reload the extension in Chrome to see updates.

## 🎨 Usage

### Toggle Dark Mode

- Click the NightOwl icon in your browser toolbar to open the popup
- Use the main toggle switch to enable/disable dark mode
- Or simply click the extension icon for quick toggle

### Quick Themes

Choose from preset themes:

- **Midnight** - Violet-tinted dark mode with slight warmth
- **Eclipse** - Pure dark mode with enhanced contrast
- **Sepia Night** - Warm, amber-tinted dark mode (easier on eyes)
- **Mono Dark** - Grayscale dark mode for minimal distractions

### Custom Adjustments

Fine-tune your experience with sliders:

- **Brightness** (50-150%) - Control overall page brightness
- **Contrast** (50-150%) - Adjust contrast levels
- **Sepia** (0-100%) - Add warm tones
- **Grayscale** (0-100%) - Remove colors

### Whitelisting Sites

Some sites already have dark mode or look better in light mode:

1. Visit the site you want to whitelist
2. Open NightOwl popup
3. Click "Whitelist" button next to the current site
4. The site will be excluded from dark mode

## 🏗️ Project Structure

```
darkmode-extension/
├── manifest.json          # Chrome extension manifest v3
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── public/
│   └── icons/             # Extension icons
└── src/
    ├── popup/             # React popup UI
    │   ├── index.html
    │   ├── main.tsx
    │   ├── App.tsx
    │   └── styles.css
    ├── content/           # Content scripts (injected into pages)
    │   ├── index.ts
    │   └── darkmode.css
    └── background/        # Service worker
        └── index.ts
```

## 🛠️ Tech Stack

- **Vite** - Fast build tool with HMR
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Beautiful icons
- **CRXJS** - Chrome extension Vite plugin

## 📦 Building for Production

```bash
yarn build
```

The built extension will be in the `dist` folder, ready to be:

- Loaded as an unpacked extension for testing
- Zipped and submitted to the Chrome Web Store

## 🔧 Configuration

### Keyboard Shortcuts

You can set up a keyboard shortcut for quick toggle:

1. Go to `chrome://extensions/shortcuts`
2. Find "NightOwl - Dark Mode"
3. Set your preferred shortcut (e.g., `Alt+D`)

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Credits

Made with 🦉 by NightOwl Team

---

**Enjoy browsing in the dark! 🌙**
# darkmode-extension
