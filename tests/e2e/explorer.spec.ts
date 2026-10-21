import { sampleSnapshot } from "../../packages/domain/tests/fixtures.ts";
import { expect, test } from "./fixtures/extension.ts";

test("shows the workspaces stored in the extension", async ({ page, seedSnapshot }) => {
  await seedSnapshot(sampleSnapshot());
  await page.goto("/");

  const shop = page.getByRole("article", { name: "Shop Admin" });
  await expect(shop).toBeVisible();
  await expect(page.getByRole("article", { name: "CRM" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Install the Fill ASAP extension" })).toHaveCount(
    0,
  );
  await expect(page.getByTestId("extension-version")).toHaveText("Extension 0.1.0");

  const flows = shop.getByRole("region", { name: "Flows" });
  await expect(flows.getByText("Create an order")).toBeVisible();
  await expect(flows.getByRole("listitem").filter({ hasText: /^Fragment: Log in$/ })).toBeVisible();
  await expect(shop.getByRole("region", { name: "Datasets" })).toContainText("Admin users 2 rows");
  await expect(shop.getByRole("region", { name: "Suites" })).toContainText("by feature, 1 flow");
});

test("explains an empty extension instead of asking to install it", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "No workspaces yet" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Install the Fill ASAP extension" })).toHaveCount(
    0,
  );
});
