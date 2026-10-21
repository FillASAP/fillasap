import { plural } from "@/ui/plural";
import { Section } from "@/ui/Section";
import type { WorkspaceView } from "@/features/explorer/workspace-view";

type FlowView = WorkspaceView["flows"][number];

function FlowItem({ flow }: { flow: FlowView }) {
  return (
    <li>
      <strong>{flow.name}</strong> <span class="muted">{flow.goal}</span>
      <ol>
        {flow.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      {flow.variables.length > 0 && <p class="muted">Variables: {flow.variables.join(", ")}</p>}
    </li>
  );
}

function Detail({ name, detail }: { name: string; detail: string }) {
  return (
    <li>
      {name} <span class="muted">{detail}</span>
    </li>
  );
}

function ReusableParts({ workspace }: { workspace: WorkspaceView }) {
  return (
    <>
      <Section title="Fragments" count={workspace.fragments.length}>
        {workspace.fragments.map((fragment) => (
          <Detail
            key={fragment.id}
            name={fragment.name}
            detail={plural(fragment.actionCount, "action")}
          />
        ))}
      </Section>
      <Section title="Datasets" count={workspace.datasets.length}>
        {workspace.datasets.map((dataset) => (
          <Detail key={dataset.id} name={dataset.name} detail={plural(dataset.rowCount, "row")} />
        ))}
      </Section>
      <Section title="Suites" count={workspace.suites.length}>
        {workspace.suites.map((suite) => (
          <Detail
            key={suite.id}
            name={suite.name}
            detail={`by ${suite.groupedBy}, ${plural(suite.flowCount, "flow")}`}
          />
        ))}
      </Section>
    </>
  );
}

export function WorkspaceCard({ workspace }: { workspace: WorkspaceView }) {
  return (
    <article class="workspace" aria-labelledby={`workspace-${workspace.id}`}>
      <header>
        <h2 id={`workspace-${workspace.id}`}>{workspace.name}</h2>
        {workspace.description && <p class="muted">{workspace.description}</p>}
        <p class="muted">{plural(workspace.actionCount, "action")}</p>
      </header>
      <Section title="Environments" count={workspace.environments.length}>
        {workspace.environments.map((environment) => (
          <li key={environment}>{environment}</li>
        ))}
      </Section>
      <Section title="Flows" count={workspace.flows.length}>
        {workspace.flows.map((flow) => (
          <FlowItem key={flow.id} flow={flow} />
        ))}
      </Section>
      <ReusableParts workspace={workspace} />
    </article>
  );
}
