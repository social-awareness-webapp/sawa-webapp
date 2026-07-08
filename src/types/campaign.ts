export type CampaignCategory =
  | "Environment"
  | "Health"
  | "Education"
  | "Community";

export type Campaign = {
  slug: string;
  title: string;
  organization: string;
  description: string;
  category: CampaignCategory;
  progressPercent: number;
  daysLeft: number;
  bannerImageUrl: string | null;
};

export type StatItem = {
  value: string;
  label: string;
};

export type CampaignUserRelation = {
  full_name: string;
};

export type CampaignRow = {
  id: string;
  title: string;
  description: string;
  category: CampaignCategory | null;
  campaign_type: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  slug: string | null;
  organization: string | null;
  progress_percent: number | null;
  ends_at: string | null;
  banner_image_url: string | null;
  users: CampaignUserRelation | CampaignUserRelation[] | null;
};

export type FetchCampaignsParams = {
  page?: number;
  pageSize?: number;
  category?: CampaignCategory | "All";
};

export type CampaignStatus = "pending" | "draft";

export type CreateCampaignInput = {
  title: string;
  category?: CampaignCategory;
  description?: string;
  goal?: string;
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
  bannerImageUrl?: string;
  supportingDocuments?: string[];
  status: CampaignStatus;
};

export type CampaignDraftInput = Omit<CreateCampaignInput, "status">;

export type CampaignMediaFiles = {
  banner: File | null;
  supportingDocuments: File[];
};

// Full single-campaign shape used by the detail (view) and edit screens.
export type CampaignDetail = {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  category: CampaignCategory | null;
  organization: string | null;
  status: string;
  progressPercent: number;
  goal: string | null;
  targetAudience: string | null;
  startDate: string | null;
  endDate: string | null;
  bannerImageUrl: string | null;
  supportingDocuments: string[];
  createdBy: string;
  isArchived: boolean;
};

export type PaginatedCampaigns = {
  campaigns: Campaign[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
