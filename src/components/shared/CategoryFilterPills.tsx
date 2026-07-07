"use client";

import type { CampaignFilterCategory } from "@/data/mock-campaigns";

type CategoryFilterPillsProps = {
  categories: readonly CampaignFilterCategory[];
  activeCategory: CampaignFilterCategory;
  onCategoryChange: (category: CampaignFilterCategory) => void;
};

export function CategoryFilterPills({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#1A365D] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
