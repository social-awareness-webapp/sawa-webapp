import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/types/auth";
import type { ProfileActivity, ProfileDetail } from "@/types/profile";

function isAppRole(value: unknown): value is AppRole {
  return (
    value === "user" || value === "business_owner" || value === "super_admin"
  );
}

type UserProfileRow = {
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  role: string | null;
  is_archived: boolean | null;
};

export const getProfileDetail = cache(
  async (): Promise<ProfileDetail | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: row } = await supabase
      .from("users")
      .select(
        "first_name, last_name, full_name, email, phone, location, bio, role, is_archived"
      )
      .eq("id", user.id)
      .single();

    const data = row as UserProfileRow | null;
    const fullName = data?.full_name?.trim() ?? "";

    return {
      id: user.id,
      email: data?.email ?? user.email ?? "",
      firstName: data?.first_name ?? "",
      lastName: data?.last_name ?? "",
      fullName: fullName || (user.email ?? "there"),
      phone: data?.phone ?? "",
      location: data?.location ?? "",
      bio: data?.bio ?? "",
      role: isAppRole(data?.role) ? data.role : null,
      isArchived: data?.is_archived ?? false,
      verified: Boolean(user.email_confirmed_at),
    };
  }
);

export async function getProfileActivity(
  userId: string
): Promise<ProfileActivity> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("campaigns")
    .select("status")
    .eq("created_by", userId)
    .or("is_archived.is.null,is_archived.eq.false");

  const rows = (data ?? []) as { status: string | null }[];

  let pending = 0;
  let approved = 0;

  for (const row of rows) {
    if (row.status === "pending") {
      pending += 1;
    } else if (row.status === "approved") {
      approved += 1;
    }
  }

  return { posted: rows.length, pending, approved };
}
