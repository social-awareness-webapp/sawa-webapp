import { mapCampaignRow } from "@/lib/campaigns/map-campaign";
import { createClient } from "@/lib/supabase/client";
import type {
  CampaignRow,
  FetchCampaignsParams,
  PaginatedCampaigns,
} from "@/types/campaign";

export async function fetchCampaigns(
  params: FetchCampaignsParams = {}
): Promise<PaginatedCampaigns> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 6;
  const category = params.category ?? "All";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createClient();

  let query = supabase
    .from("campaigns")
    .select(
      `
        id,
        title,
        description,
        category,
        campaign_type,
        status,
        created_by,
        created_at,
        updated_at,
        slug,
        organization,
        progress_percent,
        ends_at,
        users!created_by (
          full_name
        )
      `,
      { count: "exact" }
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  const total = count ?? 0;
  const rows = (data ?? []) as CampaignRow[];

  return {
    campaigns: rows.map(mapCampaignRow),
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
}
