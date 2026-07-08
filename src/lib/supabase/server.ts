import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

import type { AppRole } from "@/types/auth";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    }
  );
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export type CurrentUserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: AppRole | null;
};

function isAppRole(value: unknown): value is AppRole {
  return (
    value === "user" || value === "business_owner" || value === "super_admin"
  );
}

// Wrapped in React cache so repeated calls within a single request (e.g. layout
// + page) reuse the same Supabase round-trip instead of refetching.
export const getCurrentUserProfile = cache(
  async (): Promise<CurrentUserProfile | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    const metadataName =
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : undefined;

    return {
      id: user.id,
      email: user.email ?? "",
      fullName: profile?.full_name ?? metadataName ?? user.email ?? "there",
      role: isAppRole(profile?.role) ? profile.role : null,
    };
  }
);
