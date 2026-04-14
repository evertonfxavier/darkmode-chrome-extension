import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Palette,
  Settings,
  Zap,
  Eye,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";

interface DarkModeSettings {
  enabled: boolean;
  brightness: number;
  contrast: number;
  sepia: number;
  grayscale: number;
  mode: "auto" | "dark" | "light";
  whitelistedDomains: string[];
}

const DEFAULT_SETTINGS: DarkModeSettings = {
  enabled: false,
  brightness: 100,
  contrast: 100,
  sepia: 0,
  grayscale: 0,
  mode: "dark",
  whitelistedDomains: [],
};

const PRESET_THEMES = [
  {
    name: "Midnight",
    brightness: 90,
    contrast: 105,
    sepia: 10,
    grayscale: 0,
    color: "from-violet-600 to-indigo-600",
  },
  {
    name: "Eclipse",
    brightness: 85,
    contrast: 110,
    sepia: 0,
    grayscale: 0,
    color: "from-slate-700 to-slate-900",
  },
  {
    name: "Sepia Night",
    brightness: 95,
    contrast: 100,
    sepia: 30,
    grayscale: 0,
    color: "from-amber-700 to-orange-900",
  },
  {
    name: "Mono Dark",
    brightness: 90,
    contrast: 105,
    sepia: 0,
    grayscale: 100,
    color: "from-gray-600 to-gray-800",
  },
];

function App() {
  const [settings, setSettings] = useState<DarkModeSettings>(DEFAULT_SETTINGS);
  const [currentTab, setCurrentTab] = useState<"main" | "settings">("main");
  const [currentDomain, setCurrentDomain] = useState<string>("");
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(["darkModeSettings"], (result) => {
      if (result.darkModeSettings) {
        setSettings(result.darkModeSettings);
      }
    });

    // Get current tab domain
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        try {
          const url = new URL(tabs[0].url);
          setCurrentDomain(url.hostname);
        } catch {
          setCurrentDomain("");
        }
      }
    });
  }, []);

  useEffect(() => {
    setIsWhitelisted(settings.whitelistedDomains.includes(currentDomain));
  }, [currentDomain, settings.whitelistedDomains]);

  const saveSettings = (newSettings: DarkModeSettings) => {
    setSettings(newSettings);
    chrome.storage.sync.set({ darkModeSettings: newSettings });

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "UPDATE_SETTINGS",
          settings: newSettings,
        });
      }
    });
  };

  const toggleDarkMode = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    saveSettings(newSettings);
  };

  const updateSetting = <K extends keyof DarkModeSettings>(
    key: K,
    value: DarkModeSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const applyPreset = (preset: (typeof PRESET_THEMES)[0]) => {
    const newSettings = {
      ...settings,
      brightness: preset.brightness,
      contrast: preset.contrast,
      sepia: preset.sepia,
      grayscale: preset.grayscale,
      enabled: true,
    };
    saveSettings(newSettings);
  };

  const toggleWhitelist = () => {
    const newWhitelist = isWhitelisted
      ? settings.whitelistedDomains.filter((d) => d !== currentDomain)
      : [...settings.whitelistedDomains, currentDomain];
    updateSetting("whitelistedDomains", newWhitelist);
  };

  return (
    <div className="w-[360px] min-h-[480px] bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 text-white p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg ${
                settings.enabled ? "animate-glow" : ""
              }`}
            >
              <Moon className="w-5 h-5 text-white" />
            </div>
            {settings.enabled && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-900" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-accent-300 bg-clip-text text-transparent">
              NightOwl
            </h1>
            <p className="text-xs text-dark-400">Dark Mode Extension</p>
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentTab(currentTab === "main" ? "settings" : "main")
          }
          className="p-2 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 transition-colors"
        >
          <Settings className="w-5 h-5 text-dark-400" />
        </button>
      </header>

      {currentTab === "main" ? (
        <>
          {/* Main Toggle */}
          <div className="bg-dark-800/40 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-dark-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    settings.enabled
                      ? "bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-500/30"
                      : "bg-dark-700"
                  }`}
                >
                  {settings.enabled ? (
                    <Moon className="w-6 h-6 text-white" />
                  ) : (
                    <Sun className="w-6 h-6 text-dark-400" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-white">Dark Mode</h2>
                  <p className="text-sm text-dark-400">
                    {settings.enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  settings.enabled
                    ? "bg-gradient-to-r from-accent-500 to-accent-600"
                    : "bg-dark-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                    settings.enabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Current Site */}
          {currentDomain && (
            <div className="bg-dark-800/40 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-dark-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-dark-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-400">Current Site</p>
                    <p className="text-sm font-medium truncate">
                      {currentDomain}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleWhitelist}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isWhitelisted
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                  }`}
                >
                  {isWhitelisted ? "Whitelisted" : "Whitelist"}
                </button>
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-dark-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Quick Themes
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="group relative overflow-hidden rounded-xl p-3 bg-dark-800/40 border border-dark-700/50 hover:border-accent-500/50 transition-all"
                >
                  <div
                    className={`absolute inset-0 opacity-20 bg-gradient-to-br ${preset.color}`}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-medium">{preset.name}</span>
                    <ChevronRight className="w-4 h-4 text-dark-500 group-hover:text-accent-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div className="bg-dark-800/40 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/50">
            <h3 className="text-sm font-medium text-dark-400 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Adjustments
            </h3>

            <div className="space-y-4">
              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-300">Brightness</span>
                  <span className="text-xs text-accent-400 font-mono">
                    {settings.brightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.brightness}
                  onChange={(e) =>
                    updateSetting("brightness", Number(e.target.value))
                  }
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-300">Contrast</span>
                  <span className="text-xs text-accent-400 font-mono">
                    {settings.contrast}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.contrast}
                  onChange={(e) =>
                    updateSetting("contrast", Number(e.target.value))
                  }
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>

              {/* Sepia */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-300">Sepia</span>
                  <span className="text-xs text-accent-400 font-mono">
                    {settings.sepia}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sepia}
                  onChange={(e) =>
                    updateSetting("sepia", Number(e.target.value))
                  }
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>

              {/* Grayscale */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-300">Grayscale</span>
                  <span className="text-xs text-accent-400 font-mono">
                    {settings.grayscale}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.grayscale}
                  onChange={(e) =>
                    updateSetting("grayscale", Number(e.target.value))
                  }
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Settings Tab */
        <div className="space-y-4">
          <div className="bg-dark-800/40 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/50">
            <h3 className="text-sm font-medium text-white mb-4">
              Mode Selection
            </h3>
            <div className="space-y-2">
              {(["auto", "dark", "light"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting("mode", mode)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    settings.mode === mode
                      ? "bg-accent-500/20 border border-accent-500/50"
                      : "bg-dark-700/50 border border-transparent hover:border-dark-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {mode === "auto" && (
                      <Zap className="w-5 h-5 text-accent-400" />
                    )}
                    {mode === "dark" && (
                      <Moon className="w-5 h-5 text-accent-400" />
                    )}
                    {mode === "light" && (
                      <Sun className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="capitalize">{mode}</span>
                  </div>
                  {settings.mode === mode && (
                    <Check className="w-5 h-5 text-accent-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-dark-800/40 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/50">
            <h3 className="text-sm font-medium text-white mb-3">
              Whitelisted Sites
            </h3>
            {settings.whitelistedDomains.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {settings.whitelistedDomains.map((domain) => (
                  <div
                    key={domain}
                    className="flex items-center justify-between p-2 rounded-lg bg-dark-700/50"
                  >
                    <span className="text-sm truncate">{domain}</span>
                    <button
                      onClick={() => {
                        const newWhitelist = settings.whitelistedDomains.filter(
                          (d) => d !== domain
                        );
                        updateSetting("whitelistedDomains", newWhitelist);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">No whitelisted sites yet.</p>
            )}
          </div>

          <button
            onClick={() => saveSettings(DEFAULT_SETTINGS)}
            className="w-full p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all text-sm font-medium"
          >
            Reset to Defaults
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-6 text-center">
        <p className="text-xs text-dark-500">Made with 🦉 by NightOwl Team</p>
      </footer>
    </div>
  );
}

export default App;
