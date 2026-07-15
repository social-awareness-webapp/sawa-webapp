import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig, devices } from "@playwright/test";

import {
  SMOKE_AUTH_ADMIN,
  SMOKE_AUTH_BUSINESS,
  SMOKE_AUTH_COMMUNITY,
  smokeCredentialsFor,
} from "./tests/smoke/helpers";

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!(key in process.env) || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const baseURL = (
  process.env.SMOKE_BASE_URL ?? "https://sawa-webapp-six.vercel.app"
).replace(/\/$/, "");

const hasAdmin = smokeCredentialsFor("admin").ok;
const hasCommunity = smokeCredentialsFor("community").ok;
const hasBusiness = smokeCredentialsFor("business").ok;

const chrome = devices["Desktop Chrome"];

/**
 * Production smoke. Role projects are included only when matching credentials
 * exist in `.env` / the shell.
 */
export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report-smoke" }],
  ],
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "public",
      testMatch: /public\.spec\.ts/,
      use: {
        ...chrome,
        storageState: { cookies: [], origins: [] },
      },
    },
    ...(hasAdmin
      ? [
          {
            name: "setup-admin",
            testMatch: /auth\.setup\.ts/,
            grep: /authenticate admin/,
            use: { ...chrome },
          },
          {
            name: "admin",
            testMatch: /authenticated\.spec\.ts/,
            dependencies: ["setup-admin"],
            use: {
              ...chrome,
              storageState: SMOKE_AUTH_ADMIN,
            },
          },
        ]
      : []),
    ...(hasCommunity
      ? [
          {
            name: "setup-community",
            testMatch: /auth\.setup\.ts/,
            grep: /authenticate community/,
            use: { ...chrome },
          },
          {
            name: "community",
            testMatch: /community\.spec\.ts/,
            dependencies: ["setup-community"],
            use: {
              ...chrome,
              storageState: SMOKE_AUTH_COMMUNITY,
            },
          },
        ]
      : []),
    ...(hasBusiness
      ? [
          {
            name: "setup-business",
            testMatch: /auth\.setup\.ts/,
            grep: /authenticate business/,
            use: { ...chrome },
          },
          {
            name: "business",
            testMatch: /business\.spec\.ts/,
            dependencies: ["setup-business"],
            use: {
              ...chrome,
              storageState: SMOKE_AUTH_BUSINESS,
            },
          },
        ]
      : []),
  ],
});
