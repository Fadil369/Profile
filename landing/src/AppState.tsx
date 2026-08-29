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
  const stored = window.localStorage.getItem(key);
  return (allowed as string[]).includes(stored || "") ? (stored as T) : fallback;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => readInitial("elfadil-lang", ["ar", "en"], "ar"));
  const [theme, setTheme] = useState<ThemeName>(() => readInitial("elfadil-theme", ["dark", "light"], "dark"));

  useEffect(() => {
    window.localStorage.setItem("elfadil-lang", lang);
    window.localStorage.setItem("elfadil-theme", theme);
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
      toggleLang: () => withViewTransition(() => setLang((l) => (l === "ar" ? "en" : "ar"))),
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
