import { expect, type Page } from "@playwright/test";

export const AUTH_DIR = "playwright/.auth";
export const SMOKE_AUTH_ADMIN = `${AUTH_DIR}/admin.json`;
export const SMOKE_AUTH_COMMUNITY = `${AUTH_DIR}/community.json`;
export const SMOKE_AUTH_BUSINESS = `${AUTH_DIR}/business.json`;

/** @deprecated Use SMOKE_AUTH_ADMIN */
export const SMOKE_AUTH_FILE = SMOKE_AUTH_ADMIN;

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

export type SmokeRole = "admin" | "community" | "business";

export function smokeCredentialsFor(role: SmokeRole) {
  if (role === "admin") {
    const email =
      process.env.SMOKE_ADMIN_EMAIL?.trim() ||
      process.env.SMOKE_USER_EMAIL?.trim() ||
      "";
    const password =
      process.env.SMOKE_ADMIN_PASSWORD?.trim() ||
      process.env.SMOKE_USER_PASSWORD?.trim() ||
      "";
    return { email, password, ok: Boolean(email && password) };
  }

  if (role === "community") {
    const email = process.env.SMOKE_COMMUNITY_EMAIL?.trim() || "";
    const password = process.env.SMOKE_COMMUNITY_PASSWORD?.trim() || "";
    return { email, password, ok: Boolean(email && password) };
  }

  const email = process.env.SMOKE_BUSINESS_EMAIL?.trim() || "";
  const password = process.env.SMOKE_BUSINESS_PASSWORD?.trim() || "";
  return { email, password, ok: Boolean(email && password) };
}

/** @deprecated Prefer smokeCredentialsFor("admin") */
export function smokeCredentials() {
  return smokeCredentialsFor("admin");
}

export async function loginAs(page: Page, role: SmokeRole) {
  const { email, password, ok } = smokeCredentialsFor(role);
  if (!ok) {
    throw new Error(
      `Missing smoke credentials for ${role}. Add SMOKE_* email/password to .env`
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

export async function loginWithSmokeCredentials(page: Page) {
  await loginAs(page, "admin");
}

export function formControl(
  page: Page,
  name: string
) {
  return page.locator(`input[name="${name}"], textarea[name="${name}"]`).first();
}

export async function selectComboboxOption(
  page: Page,
  comboboxName: RegExp,
  optionName: string
) {
  const combobox = page.getByRole("combobox", { name: comboboxName }).first();
  await combobox.click();
  await page.getByRole("option", { name: optionName, exact: true }).click();
}


export function isoDateOffset(daysFromToday: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

export function uniqueSmokeTitle(prefix: string) {
  return `${prefix} ${Date.now()}`;
}

export const LONG_DESCRIPTION =
  "This is an automated smoke-test campaign description for SAWA. ".repeat(3);
