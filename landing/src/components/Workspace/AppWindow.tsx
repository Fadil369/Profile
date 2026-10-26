import { useState, type ReactNode } from "react";
import { useAppState } from "../../AppState";
import { workspaceLink, type WorkspaceAppId } from "../../WorkspaceContext";
import { CloseIcon, LinkIcon } from "../../Icons";

export function AppWindow({ title, appId, onClose, children }: { title: string; appId: WorkspaceAppId; onClose: () => void; children: ReactNode }) {
  const { isAr } = useAppState();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(workspaceLink(appId));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(isAr ? "انسخ الرابط" : "Copy the link", workspaceLink(appId));
    }
  };
  return (
    <div className="app-window" role="dialog" aria-label={title}>
      <div className="app-window-bar">
        <span className="app-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="app-window-title">{title}</span>
        <button className="app-window-link" onClick={copy} aria-live="polite">
          <LinkIcon size={14} />
          {copied ? (isAr ? "نُسخ الرابط" : "Link copied") : isAr ? "نسخ الرابط" : "Copy link"}
        </button>
        <button className="app-window-close" aria-label={(isAr ? "إغلاق " : "Close ") + title} onClick={onClose}>
          <CloseIcon size={16} />
        </button>
      </div>
      <div className="app-window-body">{children}</div>
    </div>
  );
}
