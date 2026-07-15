
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
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

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const accounts = [
  {
    email: process.env.SMOKE_COMMUNITY_EMAIL || "smoke.community@sawa.app",
    password: process.env.SMOKE_COMMUNITY_PASSWORD || "SmokeUser@123",
    fullName: "Smoke Community",
    role: "user",
  },
  {
    email: process.env.SMOKE_BUSINESS_EMAIL || "smoke.business@sawa.app",
    password: process.env.SMOKE_BUSINESS_PASSWORD || "SmokeBiz@123",
    fullName: "Smoke Business",
    role: "business_owner",
  },
];

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to seed smoke accounts."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(targetEmail) {
  const normalizedEmail = targetEmail.toLowerCase();
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail
    );
    if (match) return match;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function ensureAccount({ email, password, fullName, role }) {
  let user = await findUserByEmail(email);

  if (user) {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        full_name: fullName,
        role,
      },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Updated ${role}: ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Created ${role}: ${email}`);
  }

  const { error: profileError } = await supabase.from("users").upsert(
    {
      id: user.id,
      email,
      full_name: fullName,
      role,
    },
    { onConflict: "id" }
  );
  if (profileError) throw profileError;

  if (role === "business_owner") {
    const { error: businessError } = await supabase
      .from("business_profiles")
      .upsert(
        {
          user_id: user.id,
          business_name: "Smoke Test Business Pty Ltd",
          website: "https://example.com",
        },
        { onConflict: "user_id" }
      );
    if (businessError) {
      console.warn(
        `business_profiles upsert skipped/failed for ${email}:`,
        businessError.message
      );
    }
  }
}

async function main() {
  for (const account of accounts) {
    await ensureAccount(account);
  }

  console.log("\nAdd these to .env for smoke tests:\n");
  for (const account of accounts) {
    if (account.role === "user") {
      console.log(`SMOKE_COMMUNITY_EMAIL=${account.email}`);
      console.log(`SMOKE_COMMUNITY_PASSWORD=${account.password}`);
    } else {
      console.log(`SMOKE_BUSINESS_EMAIL=${account.email}`);
      console.log(`SMOKE_BUSINESS_PASSWORD=${account.password}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
