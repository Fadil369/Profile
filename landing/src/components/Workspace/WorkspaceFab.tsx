import { useAppState } from "../../AppState";
import { useWorkspace } from "../../WorkspaceContext";
import { CodeIcon } from "../../Icons";

export function WorkspaceFab() {
  const { t } = useAppState();
  const { open } = useWorkspace();

  return (
    <button className="workspace-fab" onClick={open} title={t.workspaceHint}>
      <CodeIcon size={18} />
      <span>{t.workspaceCta}</span>
    </button>
  );
}
