import type { AppRole } from "@/types/auth";

export type AdminCampaignStatus = "pending" | "approved" | "rejected" | "draft";

export type AdminCampaignRow = {
  id: string;
  title: string;
  category: string | null;
  status: AdminCampaignStatus;
  campaignType: string;
  createdAt: string;
  organiserName: string;
  organiserRole: AppRole | null;
  organiserEmail: string;
  businessName: string | null;
  sponsorshipTier: string | null;
};

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  role: AppRole;
  campaignCount: number;
  joinedAt: string;
  isArchived: boolean;
};

export type AdminBusinessAccountRow = {
  id: string;
  userId: string;
  businessName: string;
  contactEmail: string;
  website: string | null;
  sponsorshipTier: string | null;
  campaignCount: number;
  joinedAt: string;
  isVerified: boolean;
};

export type AdminOverviewStats = {
  pendingReview: number;
  approvedThisWeek: number;
  rejectedThisWeek: number;
  totalActive: number;
  totalUsers: number;
  businessAccounts: number;
  newUsersThisWeek: number;
};

export type AdminActivityItem = {
  id: string;
  tone: "success" | "danger" | "info" | "warning";
  message: string;
  timestamp: string;
};

export type AdminNavCounts = {
  pendingCampaigns: number;
};

export type AdminDailySubmission = {
  date: string;
  label: string;
  count: number;
};

export type AdminCategorySlice = {
  category: string;
  value: number;
  fill: string;
};
