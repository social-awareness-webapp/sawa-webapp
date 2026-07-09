import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AdminBusinessAccountRow } from "@/types/admin";

type BusinessOwnerRow = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  is_archived: boolean | null;
};

type BusinessProfileRow = {
  id: string;
  user_id: string;
  business_name: string;
  contact_email: string | null;
  website: string | null;
  created_at: string;
};

export async function getAdminBusinessAccounts(): Promise<
  AdminBusinessAccountRow[]
> {
  const supabase = await createClient();

  const { data: owners, error } = await supabase
    .from("users")
    .select("id, email, full_name, created_at, is_archived")
    .eq("role", "business_owner")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAdminBusinessAccounts]", error.message);
    return [];
  }

  const ownerRows = (owners ?? []) as BusinessOwnerRow[];
  const ownerIds = ownerRows.map((owner) => owner.id);

  const { data: profiles } =
    ownerIds.length > 0
      ? await supabase
          .from("business_profiles")
          .select(
            "id, user_id, business_name, contact_email, website, created_at"
          )
          .in("user_id", ownerIds)
      : { data: [] };

  const profileMap = new Map(
    ((profiles ?? []) as BusinessProfileRow[]).map((profile) => [
      profile.user_id,
      profile,
    ])
  );

  const { data: campaignRows } = await supabase
    .from("campaigns")
    .select("created_by, sponsorship_tier")
    .eq("campaign_type", "business")
    .or("is_archived.is.null,is_archived.eq.false");

  const campaignCounts = new Map<string, number>();
  const latestTier = new Map<string, string>();

  for (const row of campaignRows ?? []) {
    const typed = row as {
      created_by: string;
      sponsorship_tier: string | null;
    };
    campaignCounts.set(
      typed.created_by,
      (campaignCounts.get(typed.created_by) ?? 0) + 1
    );
    if (typed.sponsorship_tier) {
      latestTier.set(typed.created_by, typed.sponsorship_tier);
    }
  }

  return ownerRows.map((owner) => {
    const profile = profileMap.get(owner.id);

    return {
      id: profile?.id ?? owner.id,
      userId: owner.id,
      businessName: profile?.business_name ?? owner.full_name,
      contactEmail: profile?.contact_email ?? owner.email,
      website: profile?.website ?? null,
      sponsorshipTier: latestTier.get(owner.id) ?? "standard",
      campaignCount: campaignCounts.get(owner.id) ?? 0,
      joinedAt: owner.created_at.slice(0, 10),
      isVerified: Boolean(profile?.website || profile?.contact_email),
    };
  });
}
