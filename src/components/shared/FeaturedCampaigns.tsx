import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

import { CampaignCard } from "@/components/shared/CampaignCard";
import { CategoryFilterPills } from "@/components/shared/CategoryFilterPills";
import { buttonVariants } from "@/components/ui/button";
import type { CampaignFilterCategory } from "@/data/mock-campaigns";
import { cn } from "@/lib/utils";
import type { Campaign } from "@/types/campaign";

type FeaturedCampaignsProps = {
  campaigns: Campaign[];
  categories: readonly CampaignFilterCategory[];
  activeCategory: CampaignFilterCategory;
  onCategoryChange: (category: CampaignFilterCategory) => void;
  isLoading?: boolean;
  isError?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

function CampaignCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 h-5 w-24 rounded-full bg-slate-200" />
      <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
      <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
      <div className="mb-4 h-16 rounded bg-slate-200" />
      <div className="h-2 rounded-full bg-slate-200" />
    </div>
  );
}

export function FeaturedCampaigns({
  campaigns,
  categories,
  activeCategory,
  onCategoryChange,
  isLoading = false,
  isError = false,
  page = 1,
  totalPages = 0,
  onPageChange,
}: FeaturedCampaignsProps) {
  const showPagination = totalPages > 1 && onPageChange;

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
              Discover awareness campaigns from across the community.
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

        {isError ? (
          <p className="text-sm text-red-600">
            Unable to load campaigns. Please try again later.
          </p>
        ) : null}

        {!isError && isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CampaignCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!isError && !isLoading && campaigns.length === 0 ? (
          <EmptyCampaigns category={activeCategory} />
        ) : null}

        {!isError && !isLoading && campaigns.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.slug} campaign={campaign} />
            ))}
          </div>
        ) : null}

        {showPagination ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" })}
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EmptyCampaigns({ category }: { category: CampaignFilterCategory }) {
  const isFiltered = category !== "All";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[#2B6CB0]/10 text-[#2B6CB0]">
        <Megaphone className="size-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[#2D3748]">
        {isFiltered
          ? `No ${category} campaigns yet`
          : "No campaigns yet"}
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {isFiltered
          ? "There aren't any campaigns in this category right now. Check back soon or explore other categories."
          : "Be the first to rally your community. Start a campaign and it will show up right here."}
      </p>
      <Link
        href="/campaigns/new"
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-6 gap-2 bg-[#1A365D] px-4 text-white hover:bg-[#2a4a7f]"
        )}
      >
        <Plus className="size-4" />
        Start a Campaign
      </Link>
    </div>
  );
}
