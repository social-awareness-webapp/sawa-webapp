import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  Clock3,
  Flag,
  Megaphone,
  RefreshCw,
  TrendingUp,
  Users,
  Briefcase,
} from "lucide-react";

import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  formatRelativeTime,
} from "@/components/admin/admin-badges";
import { Card } from "@/components/ui/card";
import {
  getAdminOverviewStats,
  getAdminRecentActivity,
} from "@/lib/admin/get-admin-campaigns";
import { getAdminBusinessAccounts } from "@/lib/admin/get-admin-business-accounts";
import { cn } from "@/lib/utils";

const activityToneStyles = {
  success: "text-emerald-600",
  danger: "text-red-600",
  info: "text-sky-600",
  warning: "text-amber-600",
};

export default async function AdminOverviewPage() {
  const [stats, activity, businessAccounts] = await Promise.all([
    getAdminOverviewStats(),
    getAdminRecentActivity(),
    getAdminBusinessAccounts(),
  ]);

  const pendingBusinessVerifications = businessAccounts.filter(
    (account) => !account.isVerified
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#1A365D]">Admin Overview</h1>
          <p className="text-sm text-slate-500">
            Platform health and activity at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
          <Link
            href="/admin/pending-campaigns"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A365D] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a4a7f]"
          >
            <Clock3 className="size-4" />
            Review Pending
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Pending Review"
          value={stats.pendingReview}
          subtext={`${stats.pendingReview} awaiting action`}
          icon={Clock3}
          iconClassName="text-amber-600"
        />
        <AdminStatCard
          label="Approved This Week"
          value={stats.approvedThisWeek}
          subtext="Campaigns approved"
          icon={CheckCircle2}
          iconClassName="text-emerald-600"
        />
        <AdminStatCard
          label="Rejected This Week"
          value={stats.rejectedThisWeek}
          subtext="Campaigns rejected"
          icon={Ban}
          iconClassName="text-red-600"
        />
        <AdminStatCard
          label="Total Active"
          value={stats.totalActive}
          subtext="Across all categories"
          icon={Megaphone}
          iconClassName="text-sky-600"
        />
        <AdminStatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtext={`+${stats.newUsersThisWeek} this week`}
          icon={Users}
          iconClassName="text-violet-600"
        />
        <AdminStatCard
          label="Business Accounts"
          value={stats.businessAccounts}
          subtext={`${pendingBusinessVerifications} pending verification`}
          icon={Briefcase}
          iconClassName="text-amber-600"
        />
        <AdminStatCard
          label="Active Reports"
          value={0}
          subtext="Requires attention"
          icon={Flag}
          iconClassName="text-pink-600"
        />
        <AdminStatCard
          label="Platform Reach"
          value={stats.totalActive * 88}
          subtext="Estimated this month"
          icon={TrendingUp}
          iconClassName="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
          <h2 className="text-base font-semibold text-[#1A365D]">
            Campaign Submissions (Last 30 Days)
          </h2>
          <div className="mt-6 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
            Bar chart — submissions per day
          </div>
        </Card>
        <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
          <h2 className="text-base font-semibold text-[#1A365D]">
            Campaigns by Category
          </h2>
          <div className="mt-6 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
            Donut chart — category distribution
          </div>
        </Card>
      </div>

      <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1A365D]">
            Recent Admin Activity
          </h2>
        </div>
        <ul className="mt-4 space-y-4">
          {activity.length === 0 ? (
            <li className="text-sm text-slate-500">
              No recent approval activity yet.
            </li>
          ) : (
            activity.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0"
              >
                <p
                  className={cn(
                    "text-sm",
                    activityToneStyles[item.tone]
                  )}
                >
                  {item.message}
                </p>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
