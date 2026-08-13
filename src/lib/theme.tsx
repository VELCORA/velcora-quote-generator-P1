import * as React from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  accent: string;
  setAccent: (c: string) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const THEME_KEY = "velcora.theme";
const ACCENT_KEY = "velcora.accent";
const DEFAULT_ACCENT = "#c08a2e";

function applyAccent(accent: string) {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--brand-accent", accent);
    document.documentElement.style.setProperty("--color-accent", accent);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");
  const [accent, setAccentState] = React.useState<string>(DEFAULT_ACCENT);

  React.useEffect(() => {
    let initialTheme: Theme = "light";
    let initialAccent = DEFAULT_ACCENT;
    try {
      const t = localStorage.getItem(THEME_KEY);
      if (t === "dark" || t === "light") initialTheme = t;
      const a = localStorage.getItem(ACCENT_KEY);
      if (a) initialAccent = a;
    } catch {
      /* ignore */
    }
    setThemeState(initialTheme);
    setAccentState(initialAccent);
  }, []);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  React.useEffect(() => {
    applyAccent(accent);
    try {
      localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      /* ignore */
    }
  }, [accent]);

  const value: ThemeContextValue = {
    theme,
    toggleTheme: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    setTheme: setThemeState,
    accent,
    setAccent: setAccentState,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
