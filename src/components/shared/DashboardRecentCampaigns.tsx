import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  DashboardCampaign,
  DashboardCampaignStatus,
} from "@/types/dashboard";

type DashboardRecentCampaignsProps = {
  campaigns: DashboardCampaign[];
};

const statusStyles: Record<
  DashboardCampaignStatus,
  { label: string; className: string }
> = {
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

function StatusBadge({ status }: { status: DashboardCampaignStatus }) {
  const { label, className } = statusStyles[status];

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

export function DashboardRecentCampaigns({
  campaigns,
}: DashboardRecentCampaignsProps) {
  return (
    <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1A365D]">
          Recent Campaigns
        </h2>
        <Link
          href="/dashboard/my-campaigns"
          className="text-sm font-medium text-[#2B6CB0] transition-colors hover:text-[#1A365D]"
        >
          View All →
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              <th className="py-3 pr-4 font-semibold">Campaign Title</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Start Date</th>
              <th className="py-3 pr-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-4 pr-4 text-sm font-medium text-[#2D3748]">
                  {campaign.title}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="py-4 pr-4 text-sm text-slate-500">
                  {campaign.startDate}
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      aria-label={`View ${campaign.title}`}
                      className="transition-colors hover:text-[#2B6CB0]"
                    >
                      <Eye className="size-4" />
                    </Link>
                    <Link
                      href={`/campaigns/${campaign.id}/edit`}
                      aria-label={`Edit ${campaign.title}`}
                      className="transition-colors hover:text-[#2B6CB0]"
                    >
                      <Pencil className="size-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
