import { expect, test } from "@playwright/test";

import { clearAuthState } from "./helpers";

test.describe("S3 — Campaign detail", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthState(page);
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/campaigns/clean-water-rural-schools");

    await expect(page).toHaveURL(/\/login\?redirect=/);
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
  });
});
