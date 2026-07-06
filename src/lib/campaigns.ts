import { mockCampaigns } from "@/data/mock-campaigns";
import type { Campaign } from "@/types/campaign";

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return mockCampaigns.find((campaign) => campaign.slug === slug);
}

export function getAllCampaignSlugs(): string[] {
  return mockCampaigns.map((campaign) => campaign.slug);
}
