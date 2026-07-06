import { expect, test, type Page } from "@playwright/test";

export async function clearAuthState(page: Page) {
  await page.context().clearCookies();
}

export function navbar(page: Page) {
  return page.getByRole("banner");
}

export function passwordInput(page: Page) {
  return page.locator('input[name="password"]');
}

export function confirmPasswordInput(page: Page) {
  return page.locator('input[name="confirm_password"]');
}

export async function expectLoggedOutNavbar(page: Page) {
  const header = navbar(page);
  await expect(header.getByRole("link", { name: "Sign In" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Get Started" })).toBeVisible();
}

export async function goToRegisterStep2(page: Page) {
  await page.goto("/register");
  await page.getByRole("button", { name: /Community Member/ }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
}
