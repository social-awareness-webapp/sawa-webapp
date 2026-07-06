import { expect, test } from "@playwright/test";

test.describe("S1 — Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders login card layout and form fields", async ({ page }) => {
    await expect(page.getByRole("link", { name: "SAWA" })).toBeVisible();
    await expect(page.getByRole("link", { name: "← Back to Home" })).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Welcome Back" })
    ).toBeVisible();
    await expect(
      page.getByText("Sign in to your SAWA account to continue.")
    ).toBeVisible();

    await expect(page.getByLabel("Email Address *")).toBeVisible();
    await expect(page.getByLabel("Password *")).toBeVisible();
    await expect(page.getByRole("link", { name: "Forgot password" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );

    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByText("— or continue with —")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue with Google" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Join SAWA →" })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  test("toggles password visibility", async ({ page }) => {
    const password = page.getByLabel("Password *");
    await password.fill("testpassword");
    await expect(password).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show password" }).click();
    await expect(password).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(password).toHaveAttribute("type", "password");
  });

  test("shows registration success banner from query param", async ({ page }) => {
    await page.goto("/login?registered=true");
    await expect(
      page.getByText("Your account has been created. Please sign in.")
    ).toBeVisible();
  });
});
