import type { Snapshot } from "../src/index.ts";

/** A small but complete snapshot: two workspaces, with every entity type in the first. */
export function sampleSnapshot(): Snapshot {
  return {
    schemaVersion: 1,
    workspaces: [
      {
        id: "ws-shop",
        name: "Shop Admin",
        description: "Back office for the online shop",
        environments: [
          { id: "env-local", name: "Local", baseUrl: "http://localhost:3000" },
          { id: "env-staging", name: "Staging", baseUrl: "https://staging.shop.example" },
        ],
        settings: { locale: "en-US" },
      },
      { id: "ws-crm", name: "CRM", environments: [], settings: {} },
    ],
    actions: [
      {
        id: "act-open",
        workspaceId: "ws-shop",
        name: "Open login page",
        kind: "navigate",
        origin: "recorded",
        value: "/login",
      },
      {
        id: "act-user",
        workspaceId: "ws-shop",
        name: "Type user",
        kind: "fill",
        origin: "recorded",
        target: "#user",
        value: "{{user}}",
      },
      {
        id: "act-submit",
        workspaceId: "ws-shop",
        name: "Submit login",
        kind: "click",
        origin: "recorded",
        target: "button[type=submit]",
      },
      {
        id: "act-new-order",
        workspaceId: "ws-shop",
        name: "Click New order",
        kind: "click",
        origin: "manual",
        target: "#new-order",
      },
    ],
    fragments: [
      {
        id: "frag-login",
        workspaceId: "ws-shop",
        name: "Log in",
        actionIds: ["act-open", "act-user", "act-submit"],
      },
    ],
    flows: [
      {
        id: "flow-order",
        workspaceId: "ws-shop",
        name: "Create an order",
        goal: "Place an order for an existing customer",
        steps: [
          { type: "fragment", fragmentId: "frag-login" },
          { type: "action", actionId: "act-new-order" },
        ],
        variables: [{ name: "user", defaultValue: "admin" }],
      },
    ],
    datasets: [
      {
        id: "data-users",
        workspaceId: "ws-shop",
        name: "Admin users",
        flowId: "flow-order",
        rows: [{ user: "admin" }, { user: "manager" }],
      },
    ],
    suites: [
      {
        id: "suite-orders",
        workspaceId: "ws-shop",
        name: "Orders",
        groupedBy: "feature",
        flowIds: ["flow-order"],
      },
    ],
  };
}
