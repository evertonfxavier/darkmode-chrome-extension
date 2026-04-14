// Background service worker

interface DarkModeSettings {
  enabled: boolean;
  brightness: number;
  contrast: number;
  sepia: number;
  grayscale: number;
  mode: "auto" | "dark" | "light";
  whitelistedDomains: string[];
}

// Handle extension icon click (toggle dark mode)
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  const result = await chrome.storage.sync.get(["darkModeSettings"]);
  const settings: DarkModeSettings = result.darkModeSettings || {
    enabled: false,
    brightness: 100,
    contrast: 100,
    sepia: 0,
    grayscale: 0,
    mode: "dark",
    whitelistedDomains: [],
  };

  // Toggle enabled state
  settings.enabled = !settings.enabled;
  await chrome.storage.sync.set({ darkModeSettings: settings });

  // Update icon badge
  updateBadge(settings.enabled);

  // Send message to content script
  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: "UPDATE_SETTINGS",
      settings,
    });
  } catch {
    // Content script might not be loaded yet
    console.log("Could not send message to content script");
  }
});

// Update badge based on dark mode state
function updateBadge(enabled: boolean): void {
  chrome.action.setBadgeText({
    text: enabled ? "ON" : "",
  });
  chrome.action.setBadgeBackgroundColor({
    color: enabled ? "#8b5cf6" : "#64748b",
  });
}

// Initialize badge on startup
chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.sync.get(["darkModeSettings"]);
  if (result.darkModeSettings) {
    updateBadge(result.darkModeSettings.enabled);
  }
});

// Also initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(["darkModeSettings"]);
  if (result.darkModeSettings) {
    updateBadge(result.darkModeSettings.enabled);
  } else {
    // Set default settings
    const defaultSettings: DarkModeSettings = {
      enabled: false,
      brightness: 100,
      contrast: 100,
      sepia: 0,
      grayscale: 0,
      mode: "dark",
      whitelistedDomains: [],
    };
    await chrome.storage.sync.set({ darkModeSettings: defaultSettings });
  }
});

// Listen for storage changes to update badge
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.darkModeSettings) {
    const newSettings = changes.darkModeSettings.newValue as DarkModeSettings;
    updateBadge(newSettings.enabled);
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-dark-mode") {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      const result = await chrome.storage.sync.get(["darkModeSettings"]);
      const settings: DarkModeSettings = result.darkModeSettings || {
        enabled: false,
        brightness: 100,
        contrast: 100,
        sepia: 0,
        grayscale: 0,
        mode: "dark",
        whitelistedDomains: [],
      };

      settings.enabled = !settings.enabled;
      await chrome.storage.sync.set({ darkModeSettings: settings });
      updateBadge(settings.enabled);

      try {
        await chrome.tabs.sendMessage(tabs[0].id, {
          type: "UPDATE_SETTINGS",
          settings,
        });
      } catch {
        console.log("Could not send message to content script");
      }
    }
  }
});
