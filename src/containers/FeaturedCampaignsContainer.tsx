"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { FeaturedCampaigns } from "@/components/shared/FeaturedCampaigns";
import {
  campaignCategories,
  type CampaignFilterCategory,
} from "@/data/mock-campaigns";
import { fetchCampaigns } from "@/services/campaigns.service";

const HOMEPAGE_PAGE_SIZE = 6;

export function FeaturedCampaignsContainer() {
  const [activeCategory, setActiveCategory] =
    useState<CampaignFilterCategory>("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["campaigns", { page, category: activeCategory }],
    queryFn: () =>
      fetchCampaigns({
        page,
        pageSize: HOMEPAGE_PAGE_SIZE,
        category: activeCategory,
      }),
  });

  return (
    <FeaturedCampaigns
      campaigns={data?.campaigns ?? []}
      categories={campaignCategories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      isLoading={isLoading}
      isError={isError}
      page={data?.page ?? page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
    />
  );
}
