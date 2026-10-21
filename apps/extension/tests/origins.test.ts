import { expect, test } from "vite-plus/test";
import { contentScriptMatches } from "@/config/origins";

const PRODUCTION = ["https://fillasap.ai/*", "https://fillasap.dev/*", "https://fillasap.io/*"];

test("production builds match only the Fill ASAP domains", () => {
  expect(contentScriptMatches("production")).toEqual(PRODUCTION);
});

test("unknown modes fall back to the production origins", () => {
  expect(contentScriptMatches("staging")).toEqual(PRODUCTION);
});

test("development and test builds also match local servers on any port", () => {
  for (const mode of ["development", "test"]) {
    expect(contentScriptMatches(mode)).toEqual([
      ...PRODUCTION,
      "http://localhost/*",
      "http://127.0.0.1/*",
    ]);
  }
});
