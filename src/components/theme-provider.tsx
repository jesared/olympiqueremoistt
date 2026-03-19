"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<
  ThemeProviderContextValue | undefined
>(undefined);

const STORAGE_KEY = "theme";

function getSystemTheme() {
  if (typeof window === "undefined") return "light" as const;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme: Theme, attribute: "class") {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  }

  return resolved;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light",
  );

  React.useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = storedTheme ?? defaultTheme;
    const safeTheme =
      !enableSystem && initialTheme === "system" ? "light" : initialTheme;

    setThemeState(safeTheme);
    const resolved = applyThemeClass(safeTheme, attribute);
    setResolvedTheme(resolved);
  }, [attribute, defaultTheme, enableSystem]);

  React.useEffect(() => {
    if (!enableSystem) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme !== "system") return;
      const resolved = applyThemeClass("system", attribute);
      setResolvedTheme(resolved);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [attribute, enableSystem, theme]);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      const safeTheme =
        !enableSystem && nextTheme === "system" ? "light" : nextTheme;

      if (disableTransitionOnChange) {
        const style = document.createElement("style");
        style.appendChild(
          document.createTextNode("*{transition:none!important}"),
        );
        document.head.appendChild(style);
        void document.body.offsetHeight;
        requestAnimationFrame(() => document.head.removeChild(style));
      }

      localStorage.setItem(STORAGE_KEY, safeTheme);
      setThemeState(safeTheme);
      const resolved = applyThemeClass(safeTheme, attribute);
      setResolvedTheme(resolved);
    },
    [attribute, disableTransitionOnChange, enableSystem],
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
