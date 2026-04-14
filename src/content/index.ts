// Content script for applying dark mode to web pages
import "./darkmode.css";

interface DarkModeSettings {
  enabled: boolean;
  brightness: number;
  contrast: number;
  sepia: number;
  grayscale: number;
  mode: "auto" | "dark" | "light";
  whitelistedDomains: string[];
}

const STYLE_ID = "nightowl-dark-mode-style";

function createDarkModeCSS(settings: DarkModeSettings): string {
  const { brightness, contrast, sepia, grayscale } = settings;

  return `
    html {
      filter: invert(1) hue-rotate(180deg) brightness(${
        brightness / 100
      }) contrast(${contrast / 100}) sepia(${sepia / 100}) grayscale(${
    grayscale / 100
  }) !important;
      background-color: #1a1a2e !important;
    }

    /* Preserve images, videos, and media */
    img,
    picture,
    video,
    canvas,
    iframe,
    svg,
    [style*="background-image"],
    .emoji,
    [data-testid="tweetPhoto"],
    [class*="avatar"],
    [class*="Avatar"],
    [class*="logo"],
    [class*="Logo"],
    [class*="image"],
    [class*="Image"],
    [class*="icon"],
    [class*="Icon"]:not(i):not(span),
    [class*="thumbnail"],
    [class*="Thumbnail"],
    [class*="photo"],
    [class*="Photo"],
    [class*="poster"],
    [class*="Poster"],
    [class*="cover"],
    [class*="Cover"],
    [role="img"],
    figure img,
    article img {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Fix for background images in divs */
    [style*="background-image"]:not(html):not(body) {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Preserve specific elements that shouldn't be inverted */
    .nightowl-preserve,
    [data-nightowl-preserve] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Fix color pickers and similar controls */
    input[type="color"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Smooth transition */
    * {
      transition: background-color 0.1s ease, color 0.1s ease, filter 0.1s ease !important;
    }
  `;
}

function applyDarkMode(settings: DarkModeSettings): void {
  // Check if current domain is whitelisted
  const currentDomain = window.location.hostname;
  if (settings.whitelistedDomains.includes(currentDomain)) {
    removeDarkMode();
    return;
  }

  if (!settings.enabled) {
    removeDarkMode();
    return;
  }

  // Handle auto mode
  if (settings.mode === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (!prefersDark) {
      removeDarkMode();
      return;
    }
  } else if (settings.mode === "light") {
    removeDarkMode();
    return;
  }

  let styleElement = document.getElementById(STYLE_ID);

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.setAttribute("type", "text/css");

    // Insert at the beginning of head to allow overrides
    const head = document.head || document.documentElement;
    head.insertBefore(styleElement, head.firstChild);
  }

  styleElement.textContent = createDarkModeCSS(settings);
}

function removeDarkMode(): void {
  const styleElement = document.getElementById(STYLE_ID);
  if (styleElement) {
    styleElement.remove();
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "UPDATE_SETTINGS") {
    applyDarkMode(message.settings);
    sendResponse({ success: true });
  }
  return true;
});

// Load initial settings
chrome.storage.sync.get(["darkModeSettings"], (result) => {
  if (result.darkModeSettings) {
    applyDarkMode(result.darkModeSettings);
  }
});

// Listen for system theme changes in auto mode
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    chrome.storage.sync.get(["darkModeSettings"], (result) => {
      if (result.darkModeSettings && result.darkModeSettings.mode === "auto") {
        applyDarkMode(result.darkModeSettings);
      }
    });
  });

// Re-apply dark mode on DOM changes (for SPAs)
const observer = new MutationObserver(() => {
  const styleElement = document.getElementById(STYLE_ID);
  if (styleElement && !document.head.contains(styleElement)) {
    chrome.storage.sync.get(["darkModeSettings"], (result) => {
      if (result.darkModeSettings) {
        applyDarkMode(result.darkModeSettings);
      }
    });
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
