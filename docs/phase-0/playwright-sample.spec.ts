/**
 * Sample UAT script — not installed in package.json.
 * Copy into a Playwright project after `npm i -D @playwright/test`.
 */
import { test, expect } from "@playwright/test";

test("register page loads", async ({ page }) => {
  await page.goto("/auth/register");
  await expect(page.locator("body")).toBeVisible();
});

test("professionals does not claim a live booking", async ({ page }) => {
  await page.goto("/services/professionals");
  await expect(page.getByText(/Live verified roster/i)).toBeVisible();
  await expect(page.getByText("0")).toBeVisible();
});

test("equipment fleet is empty", async ({ page }) => {
  await page.goto("/services/equipment-hire");
  await expect(page.getByText(/Live insured fleet/i)).toBeVisible();
});

test("academy construction literacy is workplace prep", async ({ page }) => {
  await page.goto("/training/learn?program=construction-literacy");
  await expect(page.getByText(/Not a NAQAA/i)).toBeVisible();
});
