import { expect, test } from "@playwright/test";

import { expectLoggedOutNavbar, navbar } from "./helpers";

test.describe("S0 — Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero, stats, campaigns, how-it-works, CTA, and footer", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", {
        name: "Amplify Causes That Matter in Your Community",
      })
    ).toBeVisible();

    await expect(
      page.getByText("Community-Powered Awareness", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore Campaigns" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Start a Campaign" }).first()
    ).toHaveAttribute("href", "/register");

    await expect(page.getByText("2,400+")).toBeVisible();
    await expect(page.getByText("Community Members", { exact: true })).toBeVisible();
    await expect(page.getByText("141")).toBeVisible();
    await expect(page.getByText("Active Campaigns", { exact: true })).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Featured Campaigns" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "View All →" })).toBeVisible();
    await expect(
      page.getByText("Reviewed and approved by SAWA administrators.")
    ).toBeVisible();

    for (const category of [
      "All",
      "Environment",
      "Health",
      "Education",
      "Community",
    ]) {
      await expect(page.getByRole("button", { name: category })).toBeVisible();
    }

    await expect(
      page.getByRole("heading", { name: "How It Works" })
    ).toBeVisible();
    await expect(page.getByText("Create an Account")).toBeVisible();
    await expect(page.getByText("Submit a Campaign")).toBeVisible();
    await expect(page.getByText("Spread Awareness")).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Ready to Make a Difference?" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Get Started Free" })
    ).toBeVisible();

    await expect(page.getByText("© 2026 SAWA. All rights reserved.")).toBeVisible();
  });

  test("filters campaigns by category pill", async ({ page }) => {
    await page.getByRole("button", { name: "Health" }).click();
    await expect(
      page.getByRole("heading", { name: "Mental Health Awareness Week" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Clean Water for Rural Schools" })
    ).not.toBeVisible();
  });

  test("shows public navbar auth actions when logged out", async ({ page }) => {
    await expectLoggedOutNavbar(page);
  });
});
