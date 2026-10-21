import { stepLabel, workspaceContents } from "@fillasap/domain";
import type { Snapshot, Workspace } from "@fillasap/domain";

export interface WorkspaceView {
  id: string;
  name: string;
  description?: string;
  environments: string[];
  flows: { id: string; name: string; goal: string; steps: string[]; variables: string[] }[];
  fragments: { id: string; name: string; actionCount: number }[];
  suites: { id: string; name: string; groupedBy: string; flowCount: number }[];
  datasets: { id: string; name: string; rowCount: number }[];
  actionCount: number;
}

/** Flattens one workspace into the labels the explorer shows. */
export function toWorkspaceView(snapshot: Snapshot, workspace: Workspace): WorkspaceView {
  const contents = workspaceContents(snapshot, workspace.id);
  return {
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    environments: workspace.environments.map((env) => `${env.name}: ${env.baseUrl}`),
    flows: contents.flows.map((flow) => ({
      id: flow.id,
      name: flow.name,
      goal: flow.goal,
      steps: flow.steps.map((step) => stepLabel(step, contents)),
      variables: flow.variables.map((variable) => variable.name),
    })),
    fragments: contents.fragments.map(({ id, name, actionIds }) => ({
      id,
      name,
      actionCount: actionIds.length,
    })),
    suites: contents.suites.map(({ id, name, groupedBy, flowIds }) => ({
      id,
      name,
      groupedBy,
      flowCount: flowIds.length,
    })),
    datasets: contents.datasets.map(({ id, name, rows }) => ({ id, name, rowCount: rows.length })),
    actionCount: contents.actions.length,
  };
}
