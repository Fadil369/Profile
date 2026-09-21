import { useEffect, useState } from "react";
import { useAppState } from "../../AppState";
import { useBooking } from "../../BookingContext";
import { GlobeIcon, MoonIcon, SunIcon, UsersIcon, BriefcaseIcon, BrainIcon, ArrowUpIcon } from "../../Icons";
import { AppWindow } from "./AppWindow";
import { AboutApp } from "./apps/AboutApp";
import { ProjectsApp } from "./apps/ProjectsApp";

type AppId = "about" | "projects" | null;

function useRiyadhClock() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Riyadh",
      hour: "2-digit",
      minute: "2-digit"
    });
    const tick = () => setLabel(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return label;
}

export function DesktopShell({ onBack, onExit }: { onBack: () => void; onExit: () => void }) {
  const { t, isDark, isAr, toggleLang, toggleTheme } = useAppState();
  const { open: openBooking } = useBooking();
  const [activeApp, setActiveApp] = useState<AppId>(null);
  const riyadhTime = useRiyadhClock();

  return (
    <div className="desktop-shell">
      <div className="desktop-statusbar">
        <button className="desktop-status-brand" onClick={onBack}>
          <BrainIcon size={16} />
          {t.brand}
        </button>
        <div className="desktop-status-clock">{riyadhTime} — {isAr ? "الرياض" : "Riyadh"}</div>
        <div className="desktop-status-actions">
          <button className="icon-btn" aria-label="language" onClick={toggleLang}>
            <GlobeIcon size={14} />
            {t.langToggle}
          </button>
          <button className="icon-btn square" aria-label="theme" onClick={toggleTheme}>
            {isDark ? <MoonIcon size={14} /> : <SunIcon size={14} />}
          </button>
          <button className="desktop-exit-link" onClick={onExit}>
            {t.workspaceExit}
          </button>
        </div>
      </div>

      <div className="desktop-canvas-area">
        {activeApp === "about" && (
          <AppWindow title={t.workspaceDock.about} onClose={() => setActiveApp(null)}>
            <AboutApp />
          </AppWindow>
        )}
        {activeApp === "projects" && (
          <AppWindow title={t.workspaceDock.projects} onClose={() => setActiveApp(null)}>
            <ProjectsApp />
          </AppWindow>
        )}
        {!activeApp && (
          <button className="desktop-back-hint" onClick={onBack}>
            <ArrowUpIcon size={16} />
            {t.workspaceBack}
          </button>
        )}
      </div>

      <div className="desktop-dock">
        <button
          className={`dock-item${activeApp === "about" ? " is-active" : ""}`}
          onClick={() => setActiveApp("about")}
        >
          <UsersIcon size={20} />
          <span>{t.workspaceDock.about}</span>
        </button>
        <button
          className={`dock-item${activeApp === "projects" ? " is-active" : ""}`}
          onClick={() => setActiveApp("projects")}
        >
          <BriefcaseIcon size={20} />
          <span>{t.workspaceDock.projects}</span>
        </button>
        <button className="dock-item" onClick={openBooking}>
          <GlobeIcon size={20} />
          <span>{t.workspaceDock.collaborate}</span>
        </button>
      </div>
    </div>
  );
}
