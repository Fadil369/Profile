import type { ReactNode } from "react";
import { CloseIcon } from "../../Icons";

export function AppWindow({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="app-window" role="dialog" aria-label={title}>
      <div className="app-window-bar">
        <span className="app-window-title">{title}</span>
        <button className="app-window-close" aria-label={title} onClick={onClose}>
          <CloseIcon size={16} />
        </button>
      </div>
      <div className="app-window-body">{children}</div>
    </div>
  );
}
