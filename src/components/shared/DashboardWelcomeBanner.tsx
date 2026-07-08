import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";

type DashboardWelcomeBannerProps = {
  greeting: string;
  firstName: string;
  summary: DashboardSummary;
};

const pillBaseClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

export function DashboardWelcomeBanner({
  greeting,
  firstName,
  summary,
}: DashboardWelcomeBannerProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-[#1A365D]">
          {greeting}, {firstName} {"\u{1F44B}"}
        </h1>
        <p className="text-sm text-slate-500">
          You have <span className="font-semibold">{summary.activeCount}</span>{" "}
          active campaigns and{" "}
          <span className="font-semibold">{summary.pendingCount}</span> pending
          review.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className={cn(pillBaseClass, "bg-[#1A365D] text-white")}>
            {summary.activeCount} Active
          </span>
          <span className={cn(pillBaseClass, "bg-amber-100 text-amber-700")}>
            {summary.pendingCount} Pending
          </span>
          <span className={cn(pillBaseClass, "bg-slate-200 text-slate-600")}>
            {summary.supporterCount} Supporters
          </span>
        </div>
      </div>
      <Link
        href="#"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "gap-2 self-start bg-[#1A365D] px-4 text-white hover:bg-[#2a4a7f] sm:self-auto"
        )}
      >
        <Plus className="size-4" />
        New Campaign
      </Link>
    </section>
  );
}
