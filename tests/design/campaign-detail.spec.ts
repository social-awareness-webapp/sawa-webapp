import { expect, test } from "@playwright/test";

test.describe("S3 — Campaign detail", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/campaigns/clean-water-rural-schools");

    await expect(page).toHaveURL(/\/login\?redirect=/);
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
  });
});
