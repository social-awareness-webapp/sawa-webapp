import { cn } from "@/lib/utils";
import type { AdminCampaignStatus } from "@/types/admin";
import type { AppRole } from "@/types/auth";

export function AdminCampaignStatusBadge({
  status,
}: {
  status: AdminCampaignStatus;
}) {
  const styles: Record<AdminCampaignStatus, { label: string; className: string }> =
    {
      approved: {
        label: "Approved",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      },
      pending: {
        label: "Pending Review",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-50 text-red-700 ring-red-200",
      },
      draft: {
        label: "Draft",
        className: "bg-slate-100 text-slate-600 ring-slate-200",
      },
    };

  const { label, className } = styles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        className
      )}
    >
      {label}
    </span>
  );
}

export function AdminCategoryBadge({ category }: { category: string | null }) {
  const styles: Record<string, string> = {
    Environment: "bg-emerald-50 text-emerald-700",
    Health: "bg-sky-50 text-sky-700",
    Education: "bg-violet-50 text-violet-700",
    Community: "bg-amber-50 text-amber-700",
  };

  if (!category) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[category] ?? "bg-slate-100 text-slate-600"
      )}
    >
      {category}
    </span>
  );
}

export function AdminOrganiserRoleBadge({
  role,
  campaignType,
}: {
  role: AppRole | null;
  campaignType: string;
}) {
  const isBusiness = campaignType === "business" || role === "business_owner";
  const label = isBusiness ? "Business" : "Community";

  return (
    <span
      className={cn(
        "text-xs font-medium",
        isBusiness ? "text-sky-700" : "text-slate-500"
      )}
    >
      {label}
    </span>
  );
}

export function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
