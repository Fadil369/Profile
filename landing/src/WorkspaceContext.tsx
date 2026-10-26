import { createContext, useContext, useState, type ReactNode } from "react";
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

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialApp, setInitialApp] = useState<WorkspaceAppId | null>(null);
  const value: WorkspaceContextValue = {
    isOpen,
    initialApp,
    open: (app) =>
      withViewTransition(() => {
        setInitialApp(app ?? null);
        setIsOpen(true);
      }),
    close: () => withViewTransition(() => setIsOpen(false))
  };
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
