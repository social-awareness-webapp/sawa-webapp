import { expect, test } from "@playwright/test";

import {
  expectHealthyPage,
  formControl,
  isoDateOffset,
  LONG_DESCRIPTION,
  selectComboboxOption,
  uniqueSmokeTitle,
} from "./helpers";

test.describe("SAWA-57 — Business owner smoke", () => {
  test("dashboard shell loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    await expectHealthyPage(page);
    await expect(
      page.getByRole("link", { name: "Post a Campaign" }).first()
    ).toBeVisible();
  });

  test("can open business campaign form and submit for review", async ({
    page,
  }) => {
    await page.goto("/campaigns/new");
    await expect(page).toHaveURL(/\/campaigns\/new/);
    await expectHealthyPage(page);

    await expect(
      page.getByRole("heading", {
        name: "Launch a Business Awareness Campaign",
      })
    ).toBeVisible();
    await expect(
      page.getByText("Business Campaign", { exact: true }).first()
    ).toBeVisible();

    const title = uniqueSmokeTitle("Business Smoke");
    await formControl(page, "title").fill(title);
    await selectComboboxOption(page, /category/i, "Community");
    await formControl(page, "description").fill(LONG_DESCRIPTION);
    await formControl(page, "businessName").fill("Smoke Test Business Pty Ltd");
    await page.getByRole("button", { name: /Standard Listing/i }).click();
    await formControl(page, "startDate").fill(isoDateOffset(1));
    await formControl(page, "endDate").fill(isoDateOffset(30));
    await selectComboboxOption(page, /preferred duration/i, "30 days");

    await page
      .getByText(/complies with SAWA.*Business Campaign Policy/i)
      .click();
    await page
      .getByText(/authorise SAWA to display my business name/i)
      .click();

    await page
      .getByRole("button", { name: "Submit Campaign for Review" })
      .click();

    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 45_000 });
    await expectHealthyPage(page);

    await page.goto("/dashboard/my-campaigns");
    await expect(page.getByText(title)).toBeVisible({ timeout: 15_000 });
  });

  test("can save a business campaign draft", async ({ page }) => {
    await page.goto("/campaigns/new");
    await expect(
      page.getByRole("heading", {
        name: "Launch a Business Awareness Campaign",
      })
    ).toBeVisible();

    const title = uniqueSmokeTitle("Business Draft");
    await page.getByRole("textbox", { name: "Campaign Title *" }).fill(title);
    await selectComboboxOption(page, /category/i, "Health");
    await page
      .getByRole("textbox", { name: "Business Name", exact: true })
      .fill("Smoke Draft Biz");

    await expect(
      page.getByRole("textbox", { name: "Business Name", exact: true })
    ).toHaveValue("Smoke Draft Biz");

    await page.getByRole("button", { name: "Save as Draft" }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 45_000 });
    await expectHealthyPage(page);

    await page.goto("/dashboard/my-campaigns");
    await expect(page.getByText(title)).toBeVisible({ timeout: 15_000 });
  });
});
