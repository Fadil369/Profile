import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { withViewTransition } from "./viewTransition";
import type { BprAppId } from "./bpr/modules";

export type WorkspaceAppId = BprAppId | "about" | "projects";

interface WorkspaceContextValue {
  isOpen: boolean;
  /** App to show on arrival; null starts at the 3D scene. */
  initialApp: WorkspaceAppId | null;
  open: (app?: WorkspaceAppId) => void;
  close: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const APP_IDS: WorkspaceAppId[] = ["verify", "ledger", "identity", "join", "research", "toolkit", "emr", "fhir", "about", "projects"];

/** Shareable address for the workspace, or one app in it: /?open=verify, /ar/?open=desk … */
export function workspaceLink(app: WorkspaceAppId | null) {
  const u = new URL(window.location.href);
  u.hash = "";
  u.searchParams.set("open", app ?? "desk");
  return u.toString();
}

function setOpenParam(value: string | null) {
  const u = new URL(window.location.href);
  if (value) u.searchParams.set("open", value);
  else u.searchParams.delete("open");
  window.history.replaceState(null, "", u.pathname + u.search + u.hash);
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialApp, setInitialApp] = useState<WorkspaceAppId | null>(null);

  // Arriving with ?open=… opens the workspace straight away.
  useEffect(() => {
    const want = new URLSearchParams(window.location.search).get("open");
    if (want === "desk") setIsOpen(true);
    else if (want && (APP_IDS as string[]).includes(want)) {
      setInitialApp(want as WorkspaceAppId);
      setIsOpen(true);
    }
  }, []);
  const value: WorkspaceContextValue = {
    isOpen,
    initialApp,
    open: (app) =>
      withViewTransition(() => {
        setInitialApp(app ?? null);
        setIsOpen(true);
        setOpenParam(app ?? "desk");
      }),
    close: () =>
      withViewTransition(() => {
        setIsOpen(false);
        setOpenParam(null);
      })
  };
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
