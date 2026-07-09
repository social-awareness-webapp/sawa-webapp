import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getProfileActivity } from "@/lib/profile/get-profile";
import { getBusinessProfile } from "@/lib/business-profile/get-business-profile";
import type { AdminUserDetail } from "@/types/admin";
import type { AppRole } from "@/types/auth";

type UserDetailRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  role: string | null;
  is_archived: boolean | null;
  created_at: string;
};

function isAppRole(value: string | null): value is AppRole {
  return (
    value === "user" || value === "business_owner" || value === "super_admin"
  );
}

export async function getAdminUserDetail(
  userId: string
): Promise<AdminUserDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      "id, first_name, last_name, full_name, email, phone, location, bio, role, is_archived, created_at"
    )
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    console.error("[getAdminUserDetail]", error?.message);
    return null;
  }

  const row = data as UserDetailRow;

  if (!isAppRole(row.role) || row.role === "super_admin") {
    return null;
  }

  const [activity, businessProfile] = await Promise.all([
    getProfileActivity(userId),
    row.role === "business_owner"
      ? getBusinessProfile(userId)
      : Promise.resolve(null),
  ]);

  return {
    id: row.id,
    email: row.email ?? "",
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    fullName: row.full_name?.trim() || row.email || "Unknown user",
    phone: row.phone ?? "",
    location: row.location ?? "",
    bio: row.bio ?? "",
    role: row.role,
    isArchived: row.is_archived ?? false,
    joinedAt: row.created_at.slice(0, 10),
    activity,
    businessProfile,
  };
}
