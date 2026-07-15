import type { Campaign, CampaignCategory, CampaignRow } from "@/types/campaign";

function computeDaysLeft(endsAt: string) {
  const endDate = new Date(endsAt);
  const now = new Date();
  const millisecondsRemaining = endDate.getTime() - now.getTime();

  return Math.max(0, Math.ceil(millisecondsRemaining / (1000 * 60 * 60 * 24)));
}

function isCampaignCategory(value: string | null): value is CampaignCategory {
  return (
    value === "Environment" ||
    value === "Health" ||
    value === "Education" ||
    value === "Community"
  );
}

function getCreatorName(row: CampaignRow) {
  if (!row.users) {
    return null;
  }

  if (Array.isArray(row.users)) {
    return row.users[0]?.full_name ?? null;
  }

  return row.users.full_name;
}

export function mapCampaignRow(row: CampaignRow): Campaign {
  const creatorName = getCreatorName(row);

  return {
    slug: row.slug ?? row.id,
    title: row.title,
    organization: row.organization ?? creatorName ?? "Unknown",
    description: row.description,
    category: isCampaignCategory(row.category) ? row.category : "Community",
    progressPercent: row.progress_percent ?? 0,
    daysLeft: row.ends_at ? computeDaysLeft(row.ends_at) : 0,
    bannerImageUrl: row.banner_image_url,
  };
}
