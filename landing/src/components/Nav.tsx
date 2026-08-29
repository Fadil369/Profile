import { useState } from "react";
import { useAppState } from "../AppState";
import { GlobeIcon, MenuIcon, MoonIcon, SunIcon } from "../Icons";
import { scrollToSection } from "../scrollTo";
import { withViewTransition } from "../viewTransition";

const SECTION_IDS = ["about", "experience", "skills", "projects", "ecosystem", "contact"] as const;

export function Nav() {
  const { t, isDark, toggleLang, toggleTheme } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = SECTION_IDS.map((id) => ({ id, label: t.nav[id] }));

  const go = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="nav">
        <button className="nav-brand" onClick={() => scrollToSection("top")}>
          {t.brand}
        </button>

        <div className="nav-links">
          {navItems.map((item) => (
            <button key={item.id} className="nav-link" onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="language" onClick={toggleLang}>
            <GlobeIcon />
            {t.langToggle}
          </button>
          <button className="icon-btn square" aria-label="theme" onClick={toggleTheme}>
            {isDark ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            className="icon-btn square menu-toggle"
            aria-label="menu"
            onClick={() => withViewTransition(() => setMenuOpen((v) => !v))}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {menuOpen && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div className="drawer-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => (
              <button key={item.id} className="drawer-link" onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
