import { useEffect, useState } from "react";
import { useAppState } from "../../AppState";
import { useWorkspace } from "../../WorkspaceContext";
import { CodeIcon } from "../../Icons";

// The hero already offers the workspace; the floating button appears only once the hero is out of view.
export function WorkspaceFab() {
  const { t } = useAppState();
  const { open } = useWorkspace();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button className={`workspace-fab${show ? " is-visible" : ""}`} onClick={() => open()} title={t.workspaceHint} tabIndex={show ? 0 : -1}>
      <CodeIcon size={18} />
      <span>{t.workspaceCta}</span>
    </button>
  );
}
