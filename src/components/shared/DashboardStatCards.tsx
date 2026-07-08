import {
  Clock,
  Megaphone,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetricKey, DashboardStat } from "@/types/dashboard";

type DashboardStatCardsProps = {
  stats: DashboardStat[];
};

const metricVisuals: Record<
  DashboardMetricKey,
  { icon: LucideIcon; colorClass: string }
> = {
  myCampaigns: { icon: Megaphone, colorClass: "text-[#2B6CB0]" },
  pendingReview: { icon: Clock, colorClass: "text-[#D69E2E]" },
  totalSupporters: { icon: Users, colorClass: "text-emerald-500" },
  reachThisMonth: { icon: TrendingUp, colorClass: "text-[#D53F8C]" },
};

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const { icon: Icon, colorClass } = metricVisuals[stat.key];

        return (
          <Card
            key={stat.key}
            className="border border-slate-100 bg-white shadow-sm ring-0"
          >
            <CardContent className="space-y-3 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 sm:text-sm">
                  {stat.label}
                </span>
                <Icon className={`size-5 shrink-0 ${colorClass}`} />
              </div>
              <p className="text-2xl font-bold text-[#1A365D] sm:text-3xl">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
