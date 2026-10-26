import { useEffect, useState } from "react";
import { useAppState } from "../../AppState";
import { useBooking } from "../../BookingContext";
import type { WorkspaceAppId } from "../../WorkspaceContext";
import { GlobeIcon, MoonIcon, SunIcon, UsersIcon, BriefcaseIcon, BrainIcon, ArrowUpIcon, HomeIcon, CalendarIcon } from "../../Icons";
import { BprIcon } from "../../bpr/BprIcon";
import { ReleaseChip } from "../../bpr/ReleaseChip";
import { BPR_TEXT, bprModules, type BprAppId } from "../../bpr/modules";
import { AppWindow } from "./AppWindow";
import { AboutApp } from "./apps/AboutApp";
import { ProjectsApp } from "./apps/ProjectsApp";
import { BprHome, FhirApp, LedgerApp, ModuleApp, ResearchApp, ToolkitApp, VerifyApp } from "./apps/BprApps";

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

function AppBody({ id }: { id: WorkspaceAppId }) {
  switch (id) {
    case "about":
      return <AboutApp />;
    case "projects":
      return <ProjectsApp />;
    case "verify":
      return <VerifyApp />;
    case "ledger":
      return <LedgerApp />;
    case "research":
      return <ResearchApp />;
    case "toolkit":
      return <ToolkitApp />;
    case "fhir":
      return <FhirApp />;
    default:
      return <ModuleApp id={id} />;
  }
}

export function DesktopShell({
  initialApp,
  onBack,
  onExit
}: {
  initialApp: WorkspaceAppId | null;
  onBack: () => void;
  onExit: () => void;
}) {
  const { t, lang, isDark, isAr, toggleLang, toggleTheme } = useAppState();
  const { open: openBooking } = useBooking();
  const [activeApp, setActiveApp] = useState<WorkspaceAppId | null>(initialApp);
  const riyadhTime = useRiyadhClock();
  const T = BPR_TEXT[lang];
  const modules = bprModules(lang);
  const titleOf = (id: WorkspaceAppId) =>
    id === "about" ? t.workspaceDock.about : id === "projects" ? t.workspaceDock.projects : modules.find((m) => m.id === id)!.title;

  useEffect(() => setActiveApp(initialApp), [initialApp]);

  return (
    <div className="desktop-shell">
      <div className="desktop-statusbar">
        <button className="desktop-status-brand" onClick={onBack}>
          <BrainIcon size={16} />
          {T.workspaceTitle}
          <span className="desktop-status-sub">{t.brand}</span>
        </button>
        <div className="desktop-status-clock">{riyadhTime} — {isAr ? "الرياض" : "Riyadh"}</div>
        <div className="desktop-status-actions">
          <ReleaseChip />
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

      <div className={`desktop-canvas-area${activeApp ? "" : " is-home"}`}>
        {activeApp ? (
          <AppWindow title={titleOf(activeApp)} appId={activeApp} onClose={() => setActiveApp(null)}>
            <AppBody id={activeApp} />
          </AppWindow>
        ) : (
          <div className="desktop-home">
            <BprHome onOpen={(id: BprAppId) => setActiveApp(id)} />
            <button className="desktop-back-hint" onClick={onBack}>
              <ArrowUpIcon size={16} />
              {t.workspaceBack}
            </button>
          </div>
        )}
      </div>

      <nav className="desktop-dock" aria-label={T.workspaceTitle}>
        <button className={`dock-item${activeApp === null ? " is-active" : ""}`} onClick={() => setActiveApp(null)}>
          <HomeIcon size={20} />
          <span>{T.home}</span>
        </button>
        <span className="dock-sep" aria-hidden="true" />
        {modules.map((m) => (
          <button
            key={m.id}
            className={`dock-item${activeApp === m.id ? " is-active" : ""}`}
            style={{ "--mod": m.color } as React.CSSProperties}
            onClick={() => setActiveApp(m.id)}
            title={m.title}
          >
            <BprIcon name={m.icon} size={20} />
            <span>{m.title}</span>
          </button>
        ))}
        <span className="dock-sep" aria-hidden="true" />
        <button className={`dock-item${activeApp === "about" ? " is-active" : ""}`} onClick={() => setActiveApp("about")}>
          <UsersIcon size={20} />
          <span>{t.workspaceDock.about}</span>
        </button>
        <button className={`dock-item${activeApp === "projects" ? " is-active" : ""}`} onClick={() => setActiveApp("projects")}>
          <BriefcaseIcon size={20} />
          <span>{t.workspaceDock.projects}</span>
        </button>
        <button className="dock-item" onClick={openBooking}>
          <CalendarIcon size={20} />
          <span>{t.workspaceDock.collaborate}</span>
        </button>
      </nav>
    </div>
  );
}
