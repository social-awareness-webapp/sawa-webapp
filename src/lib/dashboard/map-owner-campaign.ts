import type {
  DashboardCampaign,
  DashboardCampaignStatus,
  OwnerCampaignRow,
} from "@/types/dashboard";

function toDashboardStatus(status: string): DashboardCampaignStatus {
  if (status === "approved") {
    return "approved";
  }

  if (status === "rejected") {
    return "rejected";
  }

  return "pending";
}

export function mapOwnerCampaignRow(row: OwnerCampaignRow): DashboardCampaign {
  return {
    id: row.id,
    title: row.title,
    status: toDashboardStatus(row.status),
    startDate: row.created_at.slice(0, 10),
  };
}
