import { lazy, Suspense, useEffect, useState } from "react";
import { useAppState } from "../../AppState";
import { useWorkspace, type WorkspaceAppId } from "../../WorkspaceContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { isWebGLAvailable } from "../../webglSupport";
import { DesktopShell } from "./DesktopShell";
import { CloseIcon } from "../../Icons";
import { BPR_TEXT, bprModules, type BprAppId } from "../../bpr/modules";

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
  const T = BPR_TEXT[lang];

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.querySelector(".booking-backdrop")) return;
      if (stage === "desktop" && webglOk) setStage("scene");
      else close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, stage, webglOk, close]);

  useEffect(() => {
    if (!isOpen) return;
    setApp(initialApp);
    setHoverLabel(null);
    setStage(initialApp || !webglOk ? "desktop" : "scene");
  }, [isOpen, initialApp, webglOk]);

  if (!isOpen) return null;

  const openApp = (id: BprAppId | null) => {
    setApp(id);
    setHoverLabel(null);
    if (reducedMotion) {
      setStage("desktop");
      return;
    }
    setStage("entering");
    window.setTimeout(() => setStage("desktop"), 650);
  };

  return (
    <div className="workspace-overlay" role="dialog" aria-modal="true" aria-label={T.workspaceTitle}>
      {stage !== "desktop" && webglOk && (
        <>
          <Suspense fallback={<div className="workspace-scene-loading" aria-hidden="true" />}>
            <Scene3D
              isDark={isDark}
              lang={lang}
              modules={bprModules(lang)}
              reducedMotion={reducedMotion}
              entering={stage === "entering"}
              onOpenApp={openApp}
              onToggleLamp={toggleTheme}
              onHoverLabel={setHoverLabel}
            />
          </Suspense>
          <div className="workspace-scene-chrome">
            <div className="workspace-scene-top">
              <div className="workspace-scene-brand">
                <span>
                  <span className="grad">BPR</span> OS
                </span>
                <span className="workspace-scene-sub">{T.hint3d}</span>
              </div>
              <button className="icon-btn square workspace-close" aria-label={t.workspaceStandard} onClick={close}>
                <CloseIcon size={16} />
              </button>
            </div>
            <div className={`workspace-hover-label${hoverLabel ? " is-on" : ""}`} aria-live="polite">
              {hoverLabel}
            </div>
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
        <DesktopShell initialApp={app} onBack={() => (webglOk ? setStage("scene") : close())} onExit={close} />
      )}
    </div>
  );
}
