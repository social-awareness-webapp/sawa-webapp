import { expect, test } from "@playwright/test";

import {
  expectHealthyPage,
  expectLoggedOutNavbar,
  passwordInput,
} from "./helpers";

test.describe("SAWA-57 — Public smoke", () => {
  test("homepage loads without errors", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBeTruthy();

    await expectHealthyPage(page);
    await expectLoggedOutNavbar(page);

    await expect(
      page.getByRole("heading", {
        name: "Amplify Causes That Matter in Your Community",
      })
    ).toBeVisible();
    await expect(
      page.getByText("Community-Powered Awareness", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Featured Campaigns" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How It Works" })
    ).toBeVisible();
    await expect(
      page.getByText("Community Members", { exact: true })
    ).toBeVisible();
  });

  test("login page is reachable and renders form", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.ok()).toBeTruthy();

    await expectHealthyPage(page);
    await expect(
      page.getByRole("heading", { name: "Welcome Back" })
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(passwordInput(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("link", { name: /join sawa/i })).toBeVisible();
  });

  test("register page is reachable and starts role step", async ({ page }) => {
    const response = await page.goto("/register");
    expect(response?.ok()).toBeTruthy();

    await expectHealthyPage(page);
    await expect(
      page.getByRole("button", { name: /community member/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /business/i })).toBeVisible();
  });

  test("unauthenticated dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expectHealthyPage(page);
    await expect(
      page.getByRole("heading", { name: "Welcome Back" })
    ).toBeVisible();
  });

  test("unauthenticated admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
    await expectHealthyPage(page);
  });

  test("login rejects invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("smoke-invalid@example.com");
    await passwordInput(page).fill("DefinitelyWrongPassword1!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.getByText(/invalid|incorrect|credentials|error|failed/i).first()
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("can open an approved campaign detail from homepage when available", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Featured Campaigns" })
    ).toBeVisible();

    // Wait for featured campaigns to finish loading (spinner/skeletons go away).
    const emptyState = page.getByRole("heading", { name: /no .*campaigns yet/i });
    const campaignLink = page.locator('a[href^="/campaigns/"]').filter({
      hasNot: page.locator('[href="/campaigns/new"]'),
    });

    await expect(emptyState.or(campaignLink.first())).toBeVisible({
      timeout: 30_000,
    });

    if (await emptyState.isVisible()) {
      return;
    }

    await campaignLink.first().click();
    await expect(page).toHaveURL(/\/campaigns\/[^/]+/);
    await expectHealthyPage(page);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
