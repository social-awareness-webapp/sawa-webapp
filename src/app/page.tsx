import type { Metadata } from "next";

import { CtaSection } from "@/components/shared/CtaSection";
import { HeroSection } from "@/components/shared/HeroSection";
import { HowItWorksSection } from "@/components/shared/HowItWorksSection";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StatsStrip } from "@/components/shared/StatsStrip";
import { FeaturedCampaignsContainer } from "@/containers/FeaturedCampaignsContainer";
import { homepageStats, mockCampaigns } from "@/data/mock-campaigns";

export const metadata: Metadata = {
  title: "SAWA | Community-Powered Awareness",
  description:
    "Amplify causes that matter in your community. Discover and support awareness campaigns on SAWA.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <HeroSection />
      <StatsStrip stats={homepageStats} />
      <FeaturedCampaignsContainer campaigns={mockCampaigns} />
      <HowItWorksSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
