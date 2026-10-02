import { createContext, useContext, useState, type ReactNode } from "react";
import { withViewTransition } from "./viewTransition";

interface WorkspaceContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value: WorkspaceContextValue = {
    isOpen,
    open: () => withViewTransition(() => setIsOpen(true)),
    close: () => withViewTransition(() => setIsOpen(false))
  };
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
