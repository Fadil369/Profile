import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CONTENT, THEMES, type Lang, type LangContent, type ThemeName } from "./content";
import { withViewTransition } from "./viewTransition";

interface AppStateValue {
  lang: Lang;
  theme: ThemeName;
  isAr: boolean;
  isDark: boolean;
  t: LangContent;
  toggleLang: () => void;
  toggleTheme: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function readInitial<T extends string>(key: string, allowed: T[], fallback: T): T {
  if (typeof window === "undefined") return fallback;
  let stored: string | null = null;
  try { stored = window.localStorage.getItem(key); } catch { /* Storage may be blocked. */ }
  return (allowed as string[]).includes(stored || "") ? (stored as T) : fallback;
}

export function AppStateProvider({ children, initialPath = "/" }: { children: ReactNode; initialPath?: string }) {
  const [lang] = useState<Lang>(initialPath === "/en" || initialPath.startsWith("/en/") ? "en" : "ar");
  const [theme, setTheme] = useState<ThemeName>("dark");
  useEffect(() => { setTheme(readInitial<ThemeName>("elfadil-theme", ["dark", "light"], "dark")); }, []);

  useEffect(() => {
    try { window.localStorage.setItem("elfadil-theme", theme); } catch { /* Keep preferences in memory. */ }
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    root.dataset.theme = theme;
  }, [lang, theme]);

  const value = useMemo<AppStateValue>(() => {
    const isAr = lang === "ar";
    return {
      lang,
      theme,
      isAr,
      isDark: theme === "dark",
      t: CONTENT[lang],
      toggleLang: () => {
        const next = lang === "ar" ? "en" : "ar";
        const path = window.location.pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
        window.location.assign(`/${next}${path === "/" ? "" : path}${window.location.search}${window.location.hash}`);
      },
      toggleTheme: () => withViewTransition(() => setTheme((th) => (th === "dark" ? "light" : "dark")))
    };
  }, [lang, theme]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function useThemeTokens() {
  const { theme } = useAppState();
  return THEMES[theme];
}
