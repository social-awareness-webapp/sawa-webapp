import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { expect, test as setup } from "@playwright/test";

import {
  expectHealthyPage,
  loginAs,
  SMOKE_AUTH_ADMIN,
  SMOKE_AUTH_BUSINESS,
  SMOKE_AUTH_COMMUNITY,
} from "./helpers";

setup("authenticate admin", async ({ page }) => {
  mkdirSync(dirname(SMOKE_AUTH_ADMIN), { recursive: true });
  await loginAs(page, "admin");
  await expectHealthyPage(page);
  await page.context().storageState({ path: SMOKE_AUTH_ADMIN });
});

setup("authenticate community", async ({ page }) => {
  mkdirSync(dirname(SMOKE_AUTH_COMMUNITY), { recursive: true });
  await loginAs(page, "community");
  await expect(page).toHaveURL(/\/dashboard/);
  await expectHealthyPage(page);
  await page.context().storageState({ path: SMOKE_AUTH_COMMUNITY });
});

setup("authenticate business", async ({ page }) => {
  mkdirSync(dirname(SMOKE_AUTH_BUSINESS), { recursive: true });
  await loginAs(page, "business");
  await expect(page).toHaveURL(/\/dashboard/);
  await expectHealthyPage(page);
  await page.context().storageState({ path: SMOKE_AUTH_BUSINESS });
});
