import { lazy, Suspense, useEffect, useState } from "react";
import { useAppState } from "../../AppState";
import { useWorkspace } from "../../WorkspaceContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { isWebGLAvailable } from "../../webglSupport";
import { DesktopShell } from "./DesktopShell";
import { CloseIcon } from "../../Icons";

// three.js + @react-three/fiber are ~800kB — only fetched once someone
// actually opens the workspace, never part of the standard site's bundle.
const Scene3D = lazy(() => import("./Scene3D").then((m) => ({ default: m.Scene3D })));

type Stage = "scene" | "entering" | "desktop";

export function WorkspaceOverlay() {
  const { isOpen, close } = useWorkspace();
  const { t, isDark, toggleTheme } = useAppState();
  const reducedMotion = usePrefersReducedMotion();
  const [webglOk] = useState(() => isWebGLAvailable());
  const [stage, setStage] = useState<Stage>(webglOk ? "scene" : "desktop");

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
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
    if (isOpen) setStage(webglOk ? "scene" : "desktop");
  }, [isOpen, webglOk]);

  if (!isOpen) return null;

  const openComputer = () => {
    if (reducedMotion) {
      setStage("desktop");
      return;
    }
    setStage("entering");
    window.setTimeout(() => setStage("desktop"), 650);
  };

  return (
    <div className="workspace-overlay">
      {stage !== "desktop" && webglOk && (
        <>
          <Suspense fallback={<div className="workspace-scene-loading" aria-hidden="true" />}>
            <Scene3D
              isDark={isDark}
              reducedMotion={reducedMotion}
              entering={stage === "entering"}
              onOpenComputer={openComputer}
              onToggleLamp={toggleTheme}
            />
          </Suspense>
          <div className="workspace-scene-chrome">
            <button className="icon-btn square workspace-close" aria-label={t.workspaceStandard} onClick={close}>
              <CloseIcon size={16} />
            </button>
            <div className="workspace-scene-hints">
              <button className="workspace-hint-btn" onClick={openComputer}>
                {t.workspaceCta}
              </button>
              <button className="workspace-hint-btn workspace-hint-btn--ghost" onClick={toggleTheme}>
                {isDark ? "☀" : "☾"}
              </button>
            </div>
          </div>
        </>
      )}
      {stage === "desktop" && (
        <DesktopShell onBack={() => (webglOk ? setStage("scene") : close())} onExit={close} />
      )}
    </div>
  );
}
