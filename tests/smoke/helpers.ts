import { expect, type Page } from "@playwright/test";

export const SMOKE_AUTH_FILE = "playwright/.auth/smoke-user.json";

export function passwordInput(page: Page) {
  return page.locator('input[name="password"]');
}

/** Assert the page did not render the common Supabase misconfig / crash UI. */
export async function expectHealthyPage(page: Page) {
  await expect(
    page.getByText("Your project's URL and Key are required")
  ).toHaveCount(0);
  await expect(page.getByText("Application error")).toHaveCount(0);
  await expect(page.getByText("Internal Server Error")).toHaveCount(0);
}

export async function expectLoggedOutNavbar(page: Page) {
  const header = page.getByRole("banner");
  await expect(
    header.getByRole("link", { name: "SAWA", exact: true })
  ).toBeVisible();
  await expect(header.getByRole("link", { name: "Sign In" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Get Started" })).toBeVisible();
}

export function smokeCredentials() {
  const email = process.env.SMOKE_USER_EMAIL?.trim() ?? "";
  const password = process.env.SMOKE_USER_PASSWORD?.trim() ?? "";
  return { email, password, ok: Boolean(email && password) };
}

export async function loginWithSmokeCredentials(page: Page) {
  const { email, password, ok } = smokeCredentials();
  if (!ok) {
    throw new Error(
      "Missing SMOKE_USER_EMAIL / SMOKE_USER_PASSWORD (add them to .env)"
    );
  }

  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await passwordInput(page).fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/(dashboard|admin)(\/|$)/, {
    timeout: 30_000,
  });
  await expectHealthyPage(page);
}
