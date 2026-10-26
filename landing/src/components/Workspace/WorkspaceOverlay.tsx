import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useAppState } from "../../AppState";
import { useWorkspace, type WorkspaceAppId } from "../../WorkspaceContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { isWebGLAvailable } from "../../webglSupport";
import { DesktopShell } from "./DesktopShell";
import { CloseIcon } from "../../Icons";
import { BPR_TEXT, bprModules, type BprAppId } from "../../bpr/modules";
import { BprIcon } from "../../bpr/BprIcon";
import { useRiyadhClock, type DayPhase } from "./riyadhClock";

const PHASE: Record<"en" | "ar", Record<DayPhase, string>> = {
  en: { night: "night", dawn: "dawn", day: "day", dusk: "sunset" },
  ar: { night: "ليل", dawn: "فجر", day: "نهار", dusk: "غروب" }
};

// three.js + @react-three/fiber are ~800kB — only fetched once someone
// actually opens the workspace, never part of the standard site's bundle.
const Scene3D = lazy(() => import("./Scene3D").then((m) => ({ default: m.Scene3D })));

type Stage = "scene" | "entering" | "desktop";

export function WorkspaceOverlay() {
  const { isOpen, initialApp, close } = useWorkspace();
  const { t, lang, isDark, toggleTheme } = useAppState();
  const reducedMotion = usePrefersReducedMotion();
  const [webglOk] = useState(() => isWebGLAvailable());
  const [stage, setStage] = useState<Stage>(webglOk ? "scene" : "desktop");
  const [app, setApp] = useState<WorkspaceAppId | null>(initialApp);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [returning, setReturning] = useState(false);
  const { hour, phase } = useRiyadhClock();
  const clock = `${String(Math.floor(hour)).padStart(2, "0")}:${String(Math.floor((hour % 1) * 60)).padStart(2, "0")}`;
  const T = BPR_TEXT[lang];
  const modules = bprModules(lang);
  const rootRef = useRef<HTMLDivElement>(null);

  // While the workspace is open the page behind it is inert (not focusable, not read out),
  // focus moves into the workspace, and returns to where it was when the workspace closes.
  useEffect(() => {
    if (!isOpen) return;
    const behind = [...document.querySelectorAll<HTMLElement>(".app-root > :not(.workspace-overlay):not(.booking-backdrop)")];
    behind.forEach((el) => el.setAttribute("inert", ""));
    const returnTo = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => rootRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus(), 60);
    return () => {
      window.clearTimeout(id);
      behind.forEach((el) => el.removeAttribute("inert"));
      returnTo?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      // 1–8 open a BPR system straight from the desk
      if (stage === "scene" && /^[1-8]$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const m = modules[Number(e.key) - 1];
        if (m) openApp(m.id);
        return;
      }
      if (e.key !== "Escape") return;
      if (document.querySelector(".booking-backdrop")) return;
      if (stage === "desktop" && webglOk) backToDesk();
      else close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, stage, webglOk, close, lang]);

  useEffect(() => {
    if (!isOpen) return;
    setApp(initialApp);
    setHoverLabel(null);
    setReturning(false);
    setStage(initialApp || !webglOk ? "desktop" : "scene");
  }, [isOpen, initialApp, webglOk]);

  if (!isOpen) return null;

  function backToDesk() {
    setReturning(true);
    setStage("scene");
  }

  function openApp(id: BprAppId | null) {
    setApp(id);
    setHoverLabel(null);
    if (reducedMotion) {
      setStage("desktop");
      return;
    }
    setStage("entering");
    window.setTimeout(() => setStage("desktop"), 900);
  }

  return (
    <div className="workspace-overlay" role="dialog" aria-modal="true" aria-label={T.workspaceTitle} ref={rootRef}>
      {stage !== "desktop" && webglOk && (
        <>
          {/* The canvas is a picture of the desk; the module bar below is its keyboard and screen-reader equivalent. */}
          <div className="workspace-canvas" aria-hidden="true">
          <Suspense fallback={<div className="workspace-scene-loading" aria-hidden="true" />}>
            <Scene3D
              isDark={isDark}
              lang={lang}
              modules={bprModules(lang)}
              reducedMotion={reducedMotion}
              entering={stage === "entering"}
              returning={returning}
              onOpenApp={openApp}
              onToggleLamp={toggleTheme}
              onHoverLabel={setHoverLabel}
            />
          </Suspense>
          </div>
          <div className="workspace-scene-chrome">
            <div className="workspace-scene-top">
              <div className="workspace-scene-brand">
                <span>
                  <span className="grad">BPR</span> OS
                </span>
                <span className="workspace-scene-sub" dir="ltr">
                  {lang === "ar" ? "الرياض" : "Riyadh"} {clock} · {PHASE[lang][phase]}
                </span>
                <span className="workspace-scene-sub">{T.hint3d}</span>
              </div>
              <button className="icon-btn square workspace-close" aria-label={t.workspaceStandard} onClick={close}>
                <CloseIcon size={16} />
              </button>
            </div>
            {stage === "entering" && <div className="workspace-flash" aria-hidden="true" />}
            <div className={`workspace-hover-label${hoverLabel ? " is-on" : ""}`} aria-live="polite">
              {hoverLabel}
            </div>
            <nav className="workspace-modules" aria-label={T.workspaceTitle}>
              {modules.map((m, i) => (
                <button
                  key={m.id}
                  className="workspace-module"
                  style={{ "--mod": m.color } as React.CSSProperties}
                  onClick={() => openApp(m.id)}
                  aria-keyshortcuts={String(i + 1)}
                >
                  <BprIcon name={m.icon} size={15} />
                  <span>{m.title}</span>
                  <kbd aria-hidden="true">{i + 1}</kbd>
                </button>
              ))}
            </nav>
            <div className="workspace-scene-hints">
              <button className="workspace-hint-btn" onClick={() => openApp(null)}>
                {T.enter3d}
              </button>
              <button className="workspace-hint-btn workspace-hint-btn--ghost" onClick={toggleTheme} aria-label="theme">
                {isDark ? "☀" : "☾"}
              </button>
            </div>
          </div>
        </>
      )}
      {stage === "desktop" && (
        <DesktopShell initialApp={app} onBack={() => (webglOk ? backToDesk() : close())} onExit={close} />
      )}
    </div>
  );
}
