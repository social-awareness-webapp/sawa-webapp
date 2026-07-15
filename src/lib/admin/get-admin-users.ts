import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AdminUserRow } from "@/types/admin";
import type { AppRole } from "@/types/auth";

type UserListRow = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  is_archived: boolean | null;
};

function isAppRole(value: string): value is AppRole {
  return (
    value === "user" || value === "business_owner" || value === "super_admin"
  );
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, created_at, is_archived")
    .in("role", ["user", "business_owner"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAdminUsers]", error.message);
    return [];
  }

  const rows = (users ?? []) as UserListRow[];

  const { data: campaignRows } = await supabase
    .from("campaigns")
    .select("created_by")
    .or("is_archived.is.null,is_archived.eq.false");

  const counts = new Map<string, number>();

  for (const row of campaignRows ?? []) {
    const creatorId = (row as { created_by: string }).created_by;
    counts.set(creatorId, (counts.get(creatorId) ?? 0) + 1);
  }

  return rows
    .filter((row): row is UserListRow & { role: AppRole } => isAppRole(row.role))
    .map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      campaignCount: counts.get(row.id) ?? 0,
      joinedAt: row.created_at.slice(0, 10),
      isArchived: row.is_archived ?? false,
    }));
}
