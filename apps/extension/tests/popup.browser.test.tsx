import { emptySnapshot } from "@fillasap/domain";
import { sampleSnapshot } from "@fillasap/domain/testing";
import { render } from "preact";
import { expect, test } from "vite-plus/test";
import { Popup } from "@/popup/Popup";

function mount(loadSnapshot: () => Promise<ReturnType<typeof emptySnapshot>>) {
  const root = document.createElement("div");
  document.body.append(root);
  render(<Popup loadSnapshot={loadSnapshot} />, root);
  return root.querySelector('[role="status"]');
}

test("shows the workspace count once the snapshot loads", async () => {
  const status = mount(async () => sampleSnapshot());
  await expect.poll(() => status?.textContent).toBe("2 workspaces");
});

test("uses the singular for one workspace", async () => {
  const [first] = sampleSnapshot().workspaces;
  const status = mount(async () => ({ ...emptySnapshot(), workspaces: first ? [first] : [] }));
  await expect.poll(() => status?.textContent).toBe("1 workspace");
});

test("explains a storage failure", async () => {
  const status = mount(() => Promise.reject(new Error("Quota exceeded")));
  await expect.poll(() => status?.textContent).toBe("Could not read your data: Quota exceeded");
});
