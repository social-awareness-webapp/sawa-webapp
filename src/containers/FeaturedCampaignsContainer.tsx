"use client";

import { useMemo, useState } from "react";

import { FeaturedCampaigns } from "@/components/shared/FeaturedCampaigns";
import {
  campaignCategories,
  type CampaignFilterCategory,
} from "@/data/mock-campaigns";
import type { Campaign } from "@/types/campaign";

type FeaturedCampaignsContainerProps = {
  campaigns: Campaign[];
};

export function FeaturedCampaignsContainer({
  campaigns,
}: FeaturedCampaignsContainerProps) {
  const [activeCategory, setActiveCategory] =
    useState<CampaignFilterCategory>("All");

  const filteredCampaigns = useMemo(() => {
    if (activeCategory === "All") {
      return campaigns;
    }

    return campaigns.filter(
      (campaign) => campaign.category === activeCategory
    );
  }, [activeCategory, campaigns]);

  return (
    <FeaturedCampaigns
      campaigns={filteredCampaigns}
      categories={campaignCategories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
    />
  );
}
