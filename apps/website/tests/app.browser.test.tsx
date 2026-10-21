import { emptySnapshot } from "@fillasap/domain";
import { sampleSnapshot } from "@fillasap/domain/testing";
import { render } from "preact";
import { expect, test } from "vite-plus/test";
import { App } from "@/app/App";
import type { ExtensionGateway } from "@/services/extension";
import { INSTALL_GUIDE_URL } from "@/ui/InstallBanner";
import { installedGateway, missingGateway } from "./fake-gateway.ts";

function mount(gateway: ExtensionGateway) {
  const root = document.createElement("div");
  document.body.replaceChildren(root);
  render(<App gateway={gateway} />, root);
  return root;
}

test("asks to install the extension when it is missing", async () => {
  const root = mount(missingGateway);
  await expect
    .poll(() => root.querySelector(".banner h2")?.textContent)
    .toBe("Install the Fill ASAP extension");
  expect(root.querySelector("a.button")?.getAttribute("href")).toBe(INSTALL_GUIDE_URL);
});

test("shows every workspace with its flows, fragments, datasets, and suites", async () => {
  const root = mount(installedGateway(sampleSnapshot()));
  await expect.poll(() => root.querySelectorAll("article.workspace").length).toBe(2);
  const shop = root.querySelector("article.workspace");
  expect(shop?.querySelector("h2")?.textContent).toBe("Shop Admin");
  const items = [...(shop?.querySelectorAll("li") ?? [])].map((item) => item.textContent);
  expect(items).toContain("Fragment: Log in");
  expect(items).toContain("Admin users 2 rows");
  expect(items).toContain("Orders by feature, 1 flow");
  expect(root.querySelector('[data-testid="extension-version"]')?.textContent).toBe(
    "Extension 0.1.0",
  );
});

test("explains that an empty extension has no workspaces yet", async () => {
  const root = mount(installedGateway(emptySnapshot()));
  await expect
    .poll(() => root.querySelector(".empty-state h2")?.textContent)
    .toBe("No workspaces yet");
});

test("reports why the data could not be read", async () => {
  const root = mount(installedGateway(new Error("Quota exceeded")));
  await expect.poll(() => root.querySelector(".empty-state p")?.textContent).toBe("Quota exceeded");
});
