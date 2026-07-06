import { expect, test } from "@playwright/test";

test.describe("S2 — Register wizard", () => {
  test("step 1 choose role screen", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByText("Already have an account?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in →" })).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "How will you use SAWA?" })
    ).toBeVisible();
    await expect(page.getByText("Choose Role")).toBeVisible();
    await expect(page.getByText("Your Details")).toBeVisible();
    await expect(page.getByText("Confirmed")).toBeVisible();

    await expect(page.getByText("Community Member")).toBeVisible();
    await expect(page.getByText("Small Business Owner")).toBeVisible();
    await expect(page.getByText("Administrator (Invite only)")).toBeVisible();

    const continueButton = page.getByRole("button", { name: "Continue →" });
    await expect(continueButton).toBeDisabled();

    await page.getByRole("button", { name: /Community Member/ }).click();
    await expect(continueButton).toBeEnabled();
  });

  test("step 2 your details screen", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: /Community Member/ }).click();
    await page.getByRole("button", { name: "Continue →" }).click();

    await expect(
      page.getByRole("heading", { name: "Create Your Account" })
    ).toBeVisible();
    await expect(page.getByText("Signing up as a")).toBeVisible();
    await expect(page.getByText("Community Member")).toBeVisible();

    await expect(page.getByLabel("First Name *")).toBeVisible();
    await expect(page.getByLabel("Last Name *")).toBeVisible();
    await expect(page.getByLabel("Email Address *")).toBeVisible();
    await expect(page.getByLabel("Password *")).toBeVisible();
    await expect(page.getByLabel("Confirm Password *")).toBeVisible();
    await expect(page.getByText("I agree to SAWA's")).toBeVisible();
    await expect(page.getByRole("link", { name: "Terms of Service" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible();

    await page.getByLabel("Password *").fill("weak");
    await expect(page.getByText("Too short — minimum 8 characters")).toBeVisible();

    await page.getByLabel("Password *").fill("Password1");
    await expect(page.getByText("Fair — add numbers or symbols to strengthen")).toBeVisible();

    await expect(page.getByRole("button", { name: "← Back" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
  });

  test("step 1 back navigation from step 2", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: /Small Business Owner/ }).click();
    await page.getByRole("button", { name: "Continue →" }).click();
    await page.getByRole("button", { name: "← Back" }).click();

    await expect(
      page.getByRole("heading", { name: "How will you use SAWA?" })
    ).toBeVisible();
  });
});
