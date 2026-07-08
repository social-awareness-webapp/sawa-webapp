import type { Metadata } from "next";

import { CtaSection } from "@/components/shared/CtaSection";
import { HeroSection } from "@/components/shared/HeroSection";
import { HowItWorksSection } from "@/components/shared/HowItWorksSection";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StatsStrip } from "@/components/shared/StatsStrip";
import { FeaturedCampaignsContainer } from "@/containers/FeaturedCampaignsContainer";
import { getLandingStats } from "@/lib/stats/get-landing-stats";
import type { StatItem } from "@/types/campaign";

export const metadata: Metadata = {
  title: "SAWA | Community-Powered Awareness",
  description:
    "Amplify causes that matter in your community. Discover and support awareness campaigns on SAWA.",
};

export default async function HomePage() {
  const stats = await getLandingStats();

  const statItems: StatItem[] = [
    {
      value: stats.communityMembers.toLocaleString(),
      label: "Community Members",
    },
    {
      value: stats.activeCampaigns.toLocaleString(),
      label: "Active Campaigns",
    },
    {
      value: stats.partnerBusinesses.toLocaleString(),
      label: "Partner Businesses",
    },
    // No data source yet for reach; kept as a static placeholder for now.
    // { value: "12,000+", label: "Lives Reached" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <PublicNavbar />
      <HeroSection />
      <StatsStrip stats={statItems} />
      <FeaturedCampaignsContainer />
      <HowItWorksSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
