import type { Snapshot } from "@fillasap/domain";
import { EmptyState } from "@/ui/EmptyState";
import { toWorkspaceView } from "@/features/explorer/workspace-view";
import { WorkspaceCard } from "@/features/explorer/WorkspaceCard";

export function Explorer({ snapshot }: { snapshot: Snapshot }) {
  if (snapshot.workspaces.length === 0) {
    return (
      <EmptyState
        title="No workspaces yet"
        message="Open the application you want to automate and record a flow with the extension."
      />
    );
  }
  return (
    <div class="workspaces">
      {snapshot.workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={toWorkspaceView(snapshot, workspace)} />
      ))}
    </div>
  );
}
