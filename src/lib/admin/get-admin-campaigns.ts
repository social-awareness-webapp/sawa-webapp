import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type {
  AdminActivityItem,
  AdminCampaignRow,
  AdminCampaignStatus,
  AdminNavCounts,
  AdminOverviewStats,
  AdminReviewStats,
} from "@/types/admin";
import type { AppRole } from "@/types/auth";

type CampaignListRow = {
  id: string;
  title: string;
  category: string | null;
  status: string;
  campaign_type: string | null;
  created_at: string;
  sponsorship_tier: string | null;
  created_by: string;
  users:
    | { full_name: string; role: string | null; email: string | null }
    | { full_name: string; role: string | null; email: string | null }[]
    | null;
};

type BusinessProfileNameRow = {
  user_id: string;
  business_name: string;
};

function isAdminCampaignStatus(value: string): value is AdminCampaignStatus {
  return (
    value === "pending" ||
    value === "approved" ||
    value === "rejected" ||
    value === "draft"
  );
}

function isAppRole(value: string | null | undefined): value is AppRole {
  return (
    value === "user" ||
    value === "business_owner" ||
    value === "super_admin"
  );
}

function resolveUserRelation(
  users: CampaignListRow["users"]
): { fullName: string; role: AppRole | null; email: string } {
  const relation = Array.isArray(users) ? users[0] : users;

  return {
    fullName: relation?.full_name ?? "Unknown",
    role: isAppRole(relation?.role) ? relation.role : null,
    email: relation?.email ?? "",
  };
}

function mapCampaignRow(
  row: CampaignListRow,
  businessNames: Map<string, string>
): AdminCampaignRow {
  const organiser = resolveUserRelation(row.users);

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    status: isAdminCampaignStatus(row.status) ? row.status : "pending",
    campaignType: row.campaign_type ?? "social",
    createdAt: row.created_at,
    organiserName:
      row.campaign_type === "business"
        ? businessNames.get(row.created_by) ?? organiser.fullName
        : organiser.fullName,
    organiserRole: organiser.role,
    organiserEmail: organiser.email,
    businessName: businessNames.get(row.created_by) ?? null,
    sponsorshipTier: row.sponsorship_tier,
  };
}

async function fetchBusinessNameMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[]
) {
  if (userIds.length === 0) {
    return new Map<string, string>();
  }

  const { data } = await supabase
    .from("business_profiles")
    .select("user_id, business_name")
    .in("user_id", userIds);

  const rows = (data ?? []) as BusinessProfileNameRow[];

  return new Map(rows.map((row) => [row.user_id, row.business_name]));
}

const CAMPAIGN_LIST_SELECT = `
  id,
  title,
  category,
  status,
  campaign_type,
  created_at,
  sponsorship_tier,
  created_by,
  users!created_by (
    full_name,
    role,
    email
  )
`;

export async function getAdminCampaigns(options?: {
  status?: AdminCampaignStatus | AdminCampaignStatus[];
}): Promise<AdminCampaignRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("campaigns")
    .select(CAMPAIGN_LIST_SELECT)
    .or("is_archived.is.null,is_archived.eq.false")
    .order("created_at", { ascending: false });

  if (options?.status) {
    const statuses = Array.isArray(options.status)
      ? options.status
      : [options.status];
    query = query.in("status", statuses);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getAdminCampaigns]", error.message);
    return [];
  }

  const rows = (data ?? []) as CampaignListRow[];
  const businessNames = await fetchBusinessNameMap(
    supabase,
    rows
      .filter((row) => row.campaign_type === "business")
      .map((row) => row.created_by)
  );

  return rows.map((row) => mapCampaignRow(row, businessNames));
}

export const getAdminNavCounts = cache(async (): Promise<AdminNavCounts> => {
  const supabase = await createClient();

  const { count } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .or("is_archived.is.null,is_archived.eq.false");

  return { pendingCampaigns: count ?? 0 };
});

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() + diff);
  return copy;
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const supabase = await createClient();
  const weekStart = startOfWeek(new Date()).toISOString();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setHours(0, 0, 0, 0);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const [
    pendingRes,
    approvedWeekRes,
    rejectedWeekRes,
    activeRes,
    usersRes,
    businessRes,
    newUsersRes,
    draftRes,
    submissionsRes,
    progressRes,
  ] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("updated_at", weekStart)
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected")
      .gte("updated_at", weekStart)
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .in("role", ["user", "business_owner"])
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "business_owner")
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .in("role", ["user", "business_owner"])
      .gte("created_at", weekStart)
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft")
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString())
      .or("is_archived.is.null,is_archived.eq.false"),
    supabase
      .from("campaigns")
      .select("progress_percent")
      .eq("status", "approved")
      .or("is_archived.is.null,is_archived.eq.false"),
  ]);

  const progressRows = (progressRes.data ?? []) as {
    progress_percent: number | null;
  }[];
  const totalCampaignProgress = progressRows.reduce(
    (sum, row) => sum + (row.progress_percent ?? 0),
    0
  );

  return {
    pendingReview: pendingRes.count ?? 0,
    approvedThisWeek: approvedWeekRes.count ?? 0,
    rejectedThisWeek: rejectedWeekRes.count ?? 0,
    totalActive: activeRes.count ?? 0,
    totalUsers: usersRes.count ?? 0,
    businessAccounts: businessRes.count ?? 0,
    newUsersThisWeek: newUsersRes.count ?? 0,
    draftCampaigns: draftRes.count ?? 0,
    submissionsLast30Days: submissionsRes.count ?? 0,
    totalCampaignProgress,
  };
}

export async function getAdminReviewStats(): Promise<AdminReviewStats> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase.from("campaign_approvals").select(`
      decision,
      reviewed_at,
      campaigns (
        created_at
      )
    `);

  if (error) {
    console.error("[getAdminReviewStats]", error.message);
    return { approvedToday: 0, rejectedToday: 0, avgReviewDays: null };
  }

  type ApprovalRow = {
    decision: string;
    reviewed_at: string;
    campaigns:
      | { created_at: string }
      | { created_at: string }[]
      | null;
  };

  const rows = (data ?? []) as ApprovalRow[];
  let approvedToday = 0;
  let rejectedToday = 0;
  const reviewDurations: number[] = [];

  for (const row of rows) {
    const reviewedDate = row.reviewed_at?.slice(0, 10);

    if (reviewedDate === today) {
      if (row.decision === "approved") {
        approvedToday += 1;
      }

      if (row.decision === "rejected") {
        rejectedToday += 1;
      }
    }

    const campaign = Array.isArray(row.campaigns)
      ? row.campaigns[0]
      : row.campaigns;

    if (campaign?.created_at && row.reviewed_at) {
      const durationMs =
        new Date(row.reviewed_at).getTime() -
        new Date(campaign.created_at).getTime();

      if (durationMs > 0) {
        reviewDurations.push(durationMs / (1000 * 60 * 60 * 24));
      }
    }
  }

  const avgReviewDays =
    reviewDurations.length > 0
      ? reviewDurations.reduce((sum, value) => sum + value, 0) /
        reviewDurations.length
      : null;

  return { approvedToday, rejectedToday, avgReviewDays };
}

export async function getAdminRecentActivity(): Promise<AdminActivityItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("campaign_approvals")
    .select(
      `
      id,
      decision,
      reviewed_at,
      campaigns (
        title
      )
    `
    )
    .order("reviewed_at", { ascending: false })
    .limit(6);

  type ApprovalRow = {
    id: string;
    decision: string;
    reviewed_at: string;
    campaigns:
      | { title: string }
      | { title: string }[]
      | null;
  };

  const rows = (data ?? []) as ApprovalRow[];

  return rows.map((row) => {
    const campaign = Array.isArray(row.campaigns)
      ? row.campaigns[0]
      : row.campaigns;
    const title = campaign?.title ?? "Campaign";

    if (row.decision === "approved") {
      return {
        id: row.id,
        tone: "success" as const,
        message: `Admin approved "${title}"`,
        timestamp: row.reviewed_at,
      };
    }

    return {
      id: row.id,
      tone: "danger" as const,
      message: `Admin rejected "${title}"`,
      timestamp: row.reviewed_at,
    };
  });
}
