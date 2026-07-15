import { expect, test } from "@playwright/test";

import {
  expectHealthyPage,
  formControl,
  isoDateOffset,
  LONG_DESCRIPTION,
  selectComboboxOption,
  uniqueSmokeTitle,
} from "./helpers";

test.describe("SAWA-57 — Community smoke", () => {
  test("dashboard shell loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    await expectHealthyPage(page);
    await expect(
      page.getByRole("link", { name: "SAWA", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Post a Campaign" }).first()
    ).toBeVisible();
  });

  test("can open post campaign form and submit for review", async ({
    page,
  }) => {
    await page.goto("/campaigns/new");
    await expect(page).toHaveURL(/\/campaigns\/new/);
    await expectHealthyPage(page);

    await expect(
      page.getByRole("heading", { name: "Post a New Campaign" })
    ).toBeVisible();

    const title = uniqueSmokeTitle("Community Smoke");
    await formControl(page, "title").fill(title);
    await selectComboboxOption(page, /category/i, "Environment");
    await formControl(page, "description").fill(LONG_DESCRIPTION);
    await formControl(page, "startDate").fill(isoDateOffset(1));
    await formControl(page, "endDate").fill(isoDateOffset(14));

    await page
      .getByText(/does not violate SAWA.*community guidelines/i)
      .click();

    await page.getByRole("button", { name: "Submit for Review" }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 45_000 });
    await expectHealthyPage(page);

    await page.goto("/dashboard/my-campaigns");
    await expect(page.getByText(title)).toBeVisible({ timeout: 15_000 });
  });

  test("can save a campaign draft", async ({ page }) => {
    await page.goto("/campaigns/new");
    const title = uniqueSmokeTitle("Community Draft");
    await formControl(page, "title").fill(title);
    await page.getByRole("button", { name: "Save as Draft" }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 45_000 });
    await expectHealthyPage(page);

    await page.goto("/dashboard/my-campaigns");
    await expect(page.getByText(title)).toBeVisible({ timeout: 15_000 });
  });
});
