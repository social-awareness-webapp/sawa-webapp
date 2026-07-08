import type {
  DashboardCampaign,
  DashboardCampaignStatus,
  OwnerCampaign,
  OwnerCampaignRow,
} from "@/types/dashboard";

export function toDashboardStatus(status: string): DashboardCampaignStatus {
  if (status === "approved") {
    return "approved";
  }

  if (status === "rejected") {
    return "rejected";
  }

  if (status === "draft") {
    return "draft";
  }

  return "pending";
}

export function mapOwnerCampaignRow(row: OwnerCampaignRow): OwnerCampaign {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    status: toDashboardStatus(row.status),
    submittedDate: row.created_at ? row.created_at.slice(0, 10) : "",
    endDate: row.ends_at ? row.ends_at.slice(0, 10) : null,
    // No supporters/analytics data source exists yet.
    supporters: null,
    slug: row.slug,
  };
}

export function toDashboardCampaign(campaign: OwnerCampaign): DashboardCampaign {
  return {
    id: campaign.id,
    title: campaign.title,
    status: campaign.status,
    startDate: campaign.submittedDate,
  };
}
