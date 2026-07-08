"use client";

import { useQuery } from "@tanstack/react-query";

import { DashboardEmptyCampaigns } from "@/components/shared/DashboardEmptyCampaigns";
import { DashboardRecentCampaigns } from "@/components/shared/DashboardRecentCampaigns";
import { DashboardStatCards } from "@/components/shared/DashboardStatCards";
import { DashboardWelcomeBanner } from "@/components/shared/DashboardWelcomeBanner";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { fetchMyCampaigns } from "@/services/campaigns.service";
import type { DashboardStat, DashboardSummary } from "@/types/dashboard";

const RECENT_CAMPAIGNS_LIMIT = 5;

type DashboardContainerProps = {
  greeting: string;
  firstName: string;
};

export function DashboardContainer({
  greeting,
  firstName,
}: DashboardContainerProps) {
  const { user } = useAuth();
  const userId = user?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["campaigns", "mine", userId],
    queryFn: () => fetchMyCampaigns(userId as string),
    enabled: Boolean(userId),
  });

  const campaigns = data ?? [];
  const approvedCount = campaigns.filter(
    (campaign) => campaign.status === "approved"
  ).length;
  const pendingCount = campaigns.filter(
    (campaign) => campaign.status === "pending"
  ).length;

  const summary: DashboardSummary = {
    activeCount: approvedCount,
    pendingCount,
    // No supporters/analytics data source exists yet, so this stays 0 until
    // one is available.
    supporterCount: 0,
  };

  const stats: DashboardStat[] = [
    { key: "myCampaigns", label: "My Campaigns", value: String(campaigns.length) },
    { key: "pendingReview", label: "Pending Review", value: String(pendingCount) },
    { key: "totalSupporters", label: "Total Supporters", value: "0" },
    { key: "reachThisMonth", label: "Reach This Month", value: "0" },
  ];

  const isBusy = isLoading || !userId;

  return (
    <div className="space-y-6">
      <DashboardWelcomeBanner
        greeting={greeting}
        firstName={firstName}
        summary={summary}
      />

      {isBusy ? (
        <DashboardCampaignsLoading />
      ) : isError ? (
        <DashboardCampaignsError />
      ) : campaigns.length === 0 ? (
        <DashboardEmptyCampaigns />
      ) : (
        <>
          <DashboardStatCards stats={stats} />
          <DashboardRecentCampaigns
            campaigns={campaigns.slice(0, RECENT_CAMPAIGNS_LIMIT)}
          />
        </>
      )}
    </div>
  );
}

function DashboardCampaignsLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="h-24 animate-pulse border border-slate-100 bg-slate-50 shadow-sm ring-0"
          />
        ))}
      </div>
      <Card className="h-64 animate-pulse border border-slate-100 bg-slate-50 shadow-sm ring-0" />
    </div>
  );
}

function DashboardCampaignsError() {
  return (
    <Card className="border border-slate-100 bg-white p-8 text-center shadow-sm ring-0">
      <p className="text-sm text-slate-500">
        We couldn&apos;t load your campaigns right now. Please try again in a
        moment.
      </p>
    </Card>
  );
}
