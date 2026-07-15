import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { test as setup } from "@playwright/test";

import {
  expectHealthyPage,
  loginWithSmokeCredentials,
  SMOKE_AUTH_FILE,
} from "./helpers";

setup("authenticate smoke user", async ({ page }) => {
  mkdirSync(dirname(SMOKE_AUTH_FILE), { recursive: true });
  await loginWithSmokeCredentials(page);
  await expectHealthyPage(page);
  await page.context().storageState({ path: SMOKE_AUTH_FILE });
});
