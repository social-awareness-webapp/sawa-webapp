import "server-only";

import { createClient } from "@/lib/supabase/server";

export type LandingStats = {
  communityMembers: number;
  activeCampaigns: number;
  partnerBusinesses: number;
};

type LandingStatsRow = {
  communityMembers?: number | null;
  activeCampaigns?: number | null;
  partnerBusinesses?: number | null;
};

const EMPTY_STATS: LandingStats = {
  communityMembers: 0,
  activeCampaigns: 0,
  partnerBusinesses: 0,
};

export async function getLandingStats(): Promise<LandingStats> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_landing_stats");

  if (error) {
    console.error("[getLandingStats] RPC failed:", error.message);
    return EMPTY_STATS;
  }

  if (!data) {
    return EMPTY_STATS;
  }

  const row = data as LandingStatsRow;

  return {
    communityMembers: row.communityMembers ?? 0,
    activeCampaigns: row.activeCampaigns ?? 0,
    partnerBusinesses: row.partnerBusinesses ?? 0,
  };
}
