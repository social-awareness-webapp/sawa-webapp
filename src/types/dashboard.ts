export type DashboardMetricKey =
  | "myCampaigns"
  | "pendingReview"
  | "totalSupporters"
  | "reachThisMonth";

export type DashboardStat = {
  key: DashboardMetricKey;
  label: string;
  value: string;
};

export type DashboardCampaignStatus = "approved" | "pending" | "rejected";

export type DashboardCampaign = {
  id: string;
  title: string;
  status: DashboardCampaignStatus;
  startDate: string;
};

export type DashboardSummary = {
  activeCount: number;
  pendingCount: number;
  supporterCount: number;
};

export type OwnerCampaignRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  slug: string | null;
};
