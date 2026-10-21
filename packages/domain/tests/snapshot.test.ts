import * as v from "valibot";
import { describe, expect, test } from "vite-plus/test";
import { emptySnapshot, SnapshotSchema, stepLabel, workspaceContents } from "../src/index.ts";
import { sampleSnapshot } from "./fixtures.ts";

describe("SnapshotSchema", () => {
  test("accepts the sample and the empty snapshot", () => {
    expect(v.is(SnapshotSchema, sampleSnapshot())).toBe(true);
    expect(v.is(SnapshotSchema, emptySnapshot())).toBe(true);
  });

  test("rejects an unknown schema version", () => {
    expect(v.is(SnapshotSchema, { ...emptySnapshot(), schemaVersion: 2 })).toBe(false);
  });

  test("rejects an invalid environment URL and a blank name", () => {
    const snapshot = sampleSnapshot();
    const [shop] = snapshot.workspaces;
    const badUrl = {
      ...snapshot,
      workspaces: [{ ...shop, environments: [{ id: "e", name: "E", baseUrl: "nope" }] }],
    };
    const blankName = { ...snapshot, workspaces: [{ ...shop, name: "   " }] };
    expect(v.is(SnapshotSchema, badUrl)).toBe(false);
    expect(v.is(SnapshotSchema, blankName)).toBe(false);
  });

  test("rejects an action kind outside the catalog", () => {
    const snapshot = sampleSnapshot();
    const actions = [{ ...snapshot.actions[0], kind: "hover" }];
    expect(v.is(SnapshotSchema, { ...snapshot, actions })).toBe(false);
  });
});

describe("workspaceContents", () => {
  test("keeps only the entities owned by the workspace", () => {
    const shop = workspaceContents(sampleSnapshot(), "ws-shop");
    expect(shop.flows.map((flow) => flow.id)).toEqual(["flow-order"]);
    expect(shop.actions).toHaveLength(4);
    expect(shop.suites).toHaveLength(1);

    const crm = workspaceContents(sampleSnapshot(), "ws-crm");
    expect(Object.values(crm).every((items) => items.length === 0)).toBe(true);
  });
});

describe("stepLabel", () => {
  const contents = workspaceContents(sampleSnapshot(), "ws-shop");

  test("names steps after their fragment or action", () => {
    expect(stepLabel({ type: "fragment", fragmentId: "frag-login" }, contents)).toBe(
      "Fragment: Log in",
    );
    expect(stepLabel({ type: "action", actionId: "act-new-order" }, contents)).toBe(
      "Click New order",
    );
  });

  test("flags references that no longer resolve", () => {
    expect(stepLabel({ type: "fragment", fragmentId: "gone" }, contents)).toBe(
      "Missing fragment gone",
    );
    expect(stepLabel({ type: "action", actionId: "gone" }, contents)).toBe("Missing action gone");
  });
});
