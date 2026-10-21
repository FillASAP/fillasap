import * as v from "valibot";
import { ActionSchema } from "./action.ts";
import { FlowSchema } from "./flow.ts";
import type { FlowStep } from "./flow.ts";
import { FragmentSchema } from "./fragment.ts";
import { SuiteSchema } from "./suite.ts";
import { DatasetSchema } from "./variables.ts";
import { WorkspaceSchema } from "./workspace.ts";

const SNAPSHOT_SCHEMA_VERSION = 1;

/** Everything the extension stores, as one versioned document. */
export const SnapshotSchema = v.object({
  schemaVersion: v.literal(SNAPSHOT_SCHEMA_VERSION),
  workspaces: v.array(WorkspaceSchema),
  flows: v.array(FlowSchema),
  fragments: v.array(FragmentSchema),
  actions: v.array(ActionSchema),
  datasets: v.array(DatasetSchema),
  suites: v.array(SuiteSchema),
});

export type Snapshot = v.InferOutput<typeof SnapshotSchema>;

export type WorkspaceContents = Omit<Snapshot, "schemaVersion" | "workspaces">;

export function emptySnapshot(): Snapshot {
  return {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    workspaces: [],
    flows: [],
    fragments: [],
    actions: [],
    datasets: [],
    suites: [],
  };
}

export function workspaceContents(snapshot: Snapshot, workspaceId: string): WorkspaceContents {
  const owned = <T extends { workspaceId: string }>(items: T[]) =>
    items.filter((item) => item.workspaceId === workspaceId);
  return {
    flows: owned(snapshot.flows),
    fragments: owned(snapshot.fragments),
    actions: owned(snapshot.actions),
    datasets: owned(snapshot.datasets),
    suites: owned(snapshot.suites),
  };
}

/** Names a flow step after the action or fragment it points to. */
export function stepLabel(step: FlowStep, contents: WorkspaceContents): string {
  if (step.type === "fragment") {
    const fragment = contents.fragments.find((item) => item.id === step.fragmentId);
    return fragment ? `Fragment: ${fragment.name}` : `Missing fragment ${step.fragmentId}`;
  }
  const action = contents.actions.find((item) => item.id === step.actionId);
  return action ? action.name : `Missing action ${step.actionId}`;
}
