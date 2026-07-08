import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CampaignCategory, CampaignDetail } from "@/types/campaign";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type CampaignUserRelation = { full_name: string };

type CampaignDetailRow = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  category: CampaignCategory | null;
  organization: string | null;
  status: string;
  progress_percent: number | null;
  goal: string | null;
  target_audience: string | null;
  starts_at: string | null;
  ends_at: string | null;
  banner_image_url: string | null;
  supporting_documents: string[] | null;
  created_by: string;
  is_archived: boolean | null;
  users: CampaignUserRelation | CampaignUserRelation[] | null;
};

const CAMPAIGN_DETAIL_COLUMNS = `
  id,
  slug,
  title,
  description,
  category,
  organization,
  status,
  progress_percent,
  goal,
  target_audience,
  starts_at,
  ends_at,
  banner_image_url,
  supporting_documents,
  created_by,
  is_archived,
  users!created_by (
    full_name
  )
`;

function resolveOrganization(row: CampaignDetailRow) {
  if (row.organization) {
    return row.organization;
  }

  const relation = Array.isArray(row.users) ? row.users[0] : row.users;
  return relation?.full_name ?? null;
}

function toCampaignDetail(row: CampaignDetailRow): CampaignDetail {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    category: row.category,
    organization: resolveOrganization(row),
    status: row.status,
    progressPercent: row.progress_percent ?? 0,
    goal: row.goal,
    targetAudience: row.target_audience,
    startDate: row.starts_at ? row.starts_at.slice(0, 10) : null,
    endDate: row.ends_at ? row.ends_at.slice(0, 10) : null,
    bannerImageUrl: row.banner_image_url,
    supportingDocuments: row.supporting_documents ?? [],
    createdBy: row.created_by,
    isArchived: row.is_archived ?? false,
  };
}

export async function getCampaignByIdOrSlug(
  idOrSlug: string
): Promise<CampaignDetail | null> {
  const supabase = await createClient();

  const query = supabase.from("campaigns").select(CAMPAIGN_DETAIL_COLUMNS);

  const { data, error } = UUID_RE.test(idOrSlug)
    ? await query.eq("id", idOrSlug).maybeSingle()
    : await query.eq("slug", idOrSlug).maybeSingle();

  if (error || !data) {
    return null;
  }

  return toCampaignDetail(data as CampaignDetailRow);
}
