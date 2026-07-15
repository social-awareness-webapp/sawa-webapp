import { expect, test } from "@playwright/test";

import { expectHealthyPage } from "./helpers";

async function signOut(page: import("@playwright/test").Page) {
  await page.locator('button[aria-haspopup="menu"]').first().click();
  await page.getByRole("menuitem", { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: 30_000 });
}

test.describe("SAWA-57 — Authenticated smoke", () => {
  test("session restores to post-login home", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/(dashboard|admin)(\/|$)/, {
      timeout: 30_000,
    });
    await expectHealthyPage(page);
  });

  test("admin can navigate core console screens", async ({ page }) => {
    await page.goto("/admin");
    await expectHealthyPage(page);

    if (!/\/admin/.test(page.url())) {
      test.skip(true, "Smoke user is not a super_admin; admin nav skipped");
    }

    await expect(
      page.getByRole("heading", { name: "Admin Overview" })
    ).toBeVisible();
    await expect(page.getByRole("main").getByText("Pending Review").first()).toBeVisible();
    await expect(page.getByRole("main").getByText("Total Users").first()).toBeVisible();

    await page.getByRole("link", { name: "Pending Campaigns" }).click();
    await expect(page).toHaveURL(/\/admin\/pending-campaigns/);
    await expect(
      page.getByRole("heading", { name: "Pending Campaigns" })
    ).toBeVisible();
    await expectHealthyPage(page);

    await page.getByRole("link", { name: "All Campaigns" }).click();
    await expect(page).toHaveURL(/\/admin\/campaigns/);
    await expect(
      page.getByRole("heading", { name: "All Campaigns" })
    ).toBeVisible();
    await expectHealthyPage(page);

    await page.getByRole("link", { name: "User Management" }).click();
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(
      page.getByRole("heading", { name: "User Management" })
    ).toBeVisible();
    await expectHealthyPage(page);

    await page.getByRole("link", { name: "Business Accounts" }).click();
    await expect(page).toHaveURL(/\/admin\/business-accounts/);
    await expect(
      page.getByRole("heading", { name: "Business Accounts" })
    ).toBeVisible();
    await expectHealthyPage(page);

    await page.getByRole("link", { name: "Overview" }).click();
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expect(
      page.getByRole("heading", { name: "Admin Overview" })
    ).toBeVisible();
  });

  test("community or business user can navigate dashboard screens", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expectHealthyPage(page);

    if (!/\/dashboard/.test(page.url())) {
      test.skip(
        true,
        "Smoke user is not a community/business account; dashboard nav skipped"
      );
    }

    await expect(
      page.getByRole("link", { name: "SAWA", exact: true })
    ).toBeVisible();

    await page.getByRole("link", { name: "My Campaigns" }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/my-campaigns/);
    await expectHealthyPage(page);
    await expect(page.getByRole("heading").first()).toBeVisible();

    await page.getByRole("link", { name: "Profile" }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await expectHealthyPage(page);
    await expect(page.getByRole("heading").first()).toBeVisible();

    await page.getByRole("link", { name: "Dashboard" }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/?$/);
    await expectHealthyPage(page);
  });

  test("can sign out and loses protected access", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/(dashboard|admin)(\/|$)/);
    await signOut(page);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expectHealthyPage(page);
  });
});
