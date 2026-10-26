import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CONTENT, type Lang, type LangContent, type ThemeName } from "./content";
import { withViewTransition } from "./viewTransition";
import { applyHead, langFromPath, PATHS } from "./seo";

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

function initialTheme(): ThemeName {
  try {
    const stored = window.localStorage.getItem("elfadil-theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* storage blocked — fall through to the system preference */
  }
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // The address decides the language (/ English, /ar/ Arabic), so every page is shareable as-is.
  const [lang, setLang] = useState<Lang>(() => langFromPath(window.location.pathname));
  const [theme, setTheme] = useState<ThemeName>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    root.dataset.theme = theme;
    applyHead(lang);
    try {
      window.localStorage.setItem("elfadil-lang", lang);
      window.localStorage.setItem("elfadil-theme", theme);
    } catch {
      /* private mode: nothing to remember */
    }
  }, [lang, theme]);

  useEffect(() => {
    const onPop = () => setLang(langFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const value = useMemo<AppStateValue>(() => {
    const isAr = lang === "ar";
    return {
      lang,
      theme,
      isAr,
      isDark: theme === "dark",
      t: CONTENT[lang],
      toggleLang: () =>
        withViewTransition(() => {
          const next: Lang = lang === "ar" ? "en" : "ar";
          window.history.pushState(null, "", PATHS[next] + window.location.search + window.location.hash);
          setLang(next);
        }),
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
