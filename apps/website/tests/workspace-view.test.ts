import { sampleSnapshot } from "@fillasap/domain/testing";
import { expect, test } from "vite-plus/test";
import { toWorkspaceView } from "@/features/explorer/workspace-view";

test("labels every entity of a populated workspace", () => {
  const snapshot = sampleSnapshot();
  const [shop] = snapshot.workspaces;
  if (!shop) throw new Error("The sample has workspaces.");
  expect(toWorkspaceView(snapshot, shop)).toEqual({
    id: "ws-shop",
    name: "Shop Admin",
    description: "Back office for the online shop",
    environments: ["Local: http://localhost:3000", "Staging: https://staging.shop.example"],
    flows: [
      {
        id: "flow-order",
        name: "Create an order",
        goal: "Place an order for an existing customer",
        steps: ["Fragment: Log in", "Click New order"],
        variables: ["user"],
      },
    ],
    fragments: [{ id: "frag-login", name: "Log in", actionCount: 3 }],
    suites: [{ id: "suite-orders", name: "Orders", groupedBy: "feature", flowCount: 1 }],
    datasets: [{ id: "data-users", name: "Admin users", rowCount: 2 }],
    actionCount: 4,
  });
});
