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

export type DashboardCampaignStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "draft";

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
  category: string | null;
  created_at: string;
  ends_at: string | null;
  slug: string | null;
};

// Richer per-owner campaign shape used by the "My Campaigns" screen.
export type OwnerCampaign = {
  id: string;
  title: string;
  category: string | null;
  status: DashboardCampaignStatus;
  submittedDate: string;
  endDate: string | null;
  supporters: number | null;
  slug: string | null;
};
