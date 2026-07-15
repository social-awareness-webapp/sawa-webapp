import { mapCampaignRow } from "@/lib/campaigns/map-campaign";
import { mapOwnerCampaignRow } from "@/lib/dashboard/map-owner-campaign";
import { createClient } from "@/lib/supabase/client";
import type {
  CampaignRow,
  FetchCampaignsParams,
  PaginatedCampaigns,
} from "@/types/campaign";
import type {
  BusinessCampaignInput,
  CreateCampaignInput,
} from "@/types/campaign";
import type { OwnerCampaign, OwnerCampaignRow } from "@/types/dashboard";

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
        banner_image_url,
        users!created_by (
          full_name
        )
      `,
      { count: "exact" }
    )
    .eq("status", "approved")
    // Treat null as "not archived" so rows created before the backfill still show.
    .or("is_archived.is.null,is_archived.eq.false")
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

export async function fetchMyCampaigns(
  ownerId: string
): Promise<OwnerCampaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("id, title, status, category, created_at, ends_at, slug")
    .eq("created_by", ownerId)
    .or("is_archived.is.null,is_archived.eq.false")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as OwnerCampaignRow[];

  return rows.map(mapOwnerCampaignRow);
}

export type CreateCampaignResult = {
  campaign: { id: string; slug: string | null; status: string };
};

export async function createCampaign(
  input: CreateCampaignInput
): Promise<CreateCampaignResult> {
  const response = await fetch("/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, campaignType: "social" }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error ?? "Something went wrong while posting your campaign."
    );
  }

  return result as CreateCampaignResult;
}

export async function createBusinessCampaign(
  input: BusinessCampaignInput
): Promise<CreateCampaignResult> {
  const response = await fetch("/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, campaignType: "business" }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error ?? "Something went wrong while posting your campaign."
    );
  }

  return result as CreateCampaignResult;
}

export async function updateBusinessCampaign(
  id: string,
  input: BusinessCampaignInput
): Promise<CreateCampaignResult> {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, campaignType: "business" }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error ?? "Something went wrong while updating your campaign."
    );
  }

  return result as CreateCampaignResult;
}

export async function updateCampaign(
  id: string,
  input: CreateCampaignInput
): Promise<CreateCampaignResult> {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error ?? "Something went wrong while updating your campaign."
    );
  }

  return result as CreateCampaignResult;
}

export async function archiveCampaign(id: string): Promise<void> {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error ?? "Failed to delete the campaign.");
  }
}
