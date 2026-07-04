import Link from "next/link";

import { CampaignCard } from "@/components/shared/CampaignCard";
import { CategoryFilterPills } from "@/components/shared/CategoryFilterPills";
import type { CampaignFilterCategory } from "@/data/mock-campaigns";
import type { Campaign } from "@/types/campaign";

type FeaturedCampaignsProps = {
  campaigns: Campaign[];
  categories: readonly CampaignFilterCategory[];
  activeCategory: CampaignFilterCategory;
  onCategoryChange: (category: CampaignFilterCategory) => void;
};

export function FeaturedCampaigns({
  campaigns,
  categories,
  activeCategory,
  onCategoryChange,
}: FeaturedCampaignsProps) {
  return (
    <section id="featured-campaigns" className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-[#2D3748]">
                Featured Campaigns
              </h2>
              <Link
                href="/campaigns"
                className="text-sm font-medium text-[#2B6CB0] hover:underline"
              >
                View All →
              </Link>
            </div>
            <p className="text-sm text-slate-500">
              Reviewed and approved by SAWA administrators.
            </p>
          </div>
        </div>
        <div className="mb-8">
          <CategoryFilterPills
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.slug} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}
