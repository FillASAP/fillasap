import type { Snapshot } from "@fillasap/domain";
import { useEffect, useState } from "preact/hooks";

type PopupState =
  | { status: "loading" }
  | { status: "ready"; workspaces: number }
  | { status: "failed"; message: string };

function summary(state: PopupState): string {
  switch (state.status) {
    case "loading":
      return "Loading…";
    case "ready":
      return state.workspaces === 1 ? "1 workspace" : `${state.workspaces} workspaces`;
    case "failed":
      return `Could not read your data: ${state.message}`;
  }
}

export function Popup({ loadSnapshot }: { loadSnapshot: () => Promise<Snapshot> }) {
  const [state, setState] = useState<PopupState>({ status: "loading" });

  useEffect(() => {
    loadSnapshot().then(
      (snapshot) => setState({ status: "ready", workspaces: snapshot.workspaces.length }),
      (error: unknown) =>
        setState({
          status: "failed",
          message: error instanceof Error ? error.message : String(error),
        }),
    );
  }, [loadSnapshot]);

  return (
    <main class="popup">
      <h1>Fill ASAP</h1>
      <p role="status">{summary(state)}</p>
      <a href="https://fillasap.ai" target="_blank" rel="noreferrer">
        Open fillasap.ai
      </a>
    </main>
  );
}
