import {
  buildCsv,
  csvFilename,
  downloadCsv,
} from "@/lib/csv/export-csv";
import type {
  AdminCampaignRow,
  AdminCampaignStatus,
  AdminUserRow,
} from "@/types/admin";

function formatCampaignStatus(status: AdminCampaignStatus) {
  const labels: Record<AdminCampaignStatus, string> = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    draft: "Draft",
  };

  return labels[status];
}

function formatOrganiserType(campaign: AdminCampaignRow) {
  return campaign.campaignType === "business" ? "Business" : "Community";
}

function formatUserRole(role: AdminUserRow["role"]) {
  return role === "business_owner" ? "Business" : "Community";
}

function formatUserStatus(isArchived: boolean) {
  return isArchived ? "Suspended" : "Active";
}

export function exportAdminCampaignsCsv(
  campaigns: AdminCampaignRow[],
  mode: "pending" | "all"
) {
  const csv = buildCsv(
    [
      "Campaign Title",
      "Organiser",
      "Organiser Email",
      "Organiser Type",
      "Category",
      "Status",
      "Submitted",
      "Campaign ID",
    ],
    campaigns.map((campaign) => [
      campaign.title,
      campaign.organiserName,
      campaign.organiserEmail,
      formatOrganiserType(campaign),
      campaign.category ?? "",
      formatCampaignStatus(campaign.status),
      campaign.createdAt.slice(0, 10),
      campaign.id,
    ])
  );

  const filename = csvFilename(
    mode === "pending" ? "pending-campaigns" : "all-campaigns"
  );
  downloadCsv(filename, csv);

  return { filename, count: campaigns.length };
}

export function exportAdminUsersCsv(users: AdminUserRow[]) {
  const csv = buildCsv(
    [
      "Full Name",
      "Email",
      "Role",
      "Campaigns",
      "Joined",
      "Status",
      "User ID",
    ],
    users.map((user) => [
      user.fullName,
      user.email,
      formatUserRole(user.role),
      user.campaignCount,
      user.joinedAt.slice(0, 10),
      formatUserStatus(user.isArchived),
      user.id,
    ])
  );

  const filename = csvFilename("users");
  downloadCsv(filename, csv);

  return { filename, count: users.length };
}
