import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AdminCategorySlice, AdminDailySubmission } from "@/types/admin";

const CATEGORY_COLORS: Record<string, string> = {
  Environment: "#059669",
  Health: "#0284c7",
  Education: "#7c3aed",
  Community: "#d97706",
  "Animal Welfare": "#db2777",
  Uncategorized: "#94a3b8",
};

const FALLBACK_COLORS = [
  "#1A365D",
  "#2B6CB0",
  "#38a169",
  "#d69e2e",
  "#e53e3e",
  "#805ad5",
];

function formatChartDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);

  return date.toLocaleDateString("en-ZA", {
    month: "short",
    day: "numeric",
  });
}

function getCategoryColor(category: string, index: number) {
  return (
    CATEGORY_COLORS[category] ??
    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  );
}

export async function getAdminSubmissionChartData(): Promise<AdminDailySubmission[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 29);

  const { data, error } = await supabase
    .from("campaigns")
    .select("created_at")
    .gte("created_at", since.toISOString())
    .or("is_archived.is.null,is_archived.eq.false");

  if (error) {
    console.error("[getAdminSubmissionChartData]", error.message);
  }

  const counts = new Map<string, number>();

  for (let index = 0; index < 30; index += 1) {
    const day = new Date(since);
    day.setDate(since.getDate() + index);
    counts.set(day.toISOString().slice(0, 10), 0);
  }

  for (const row of data ?? []) {
    const day = row.created_at.slice(0, 10);

    if (counts.has(day)) {
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries()).map(([date, count]) => ({
    date,
    label: formatChartDate(date),
    count,
  }));
}

export async function getAdminCategoryChartData(): Promise<AdminCategorySlice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("category")
    .or("is_archived.is.null,is_archived.eq.false");

  if (error) {
    console.error("[getAdminCategoryChartData]", error.message);
    return [];
  }

  const counts = new Map<string, number>();

  for (const row of data ?? []) {
    const category = row.category?.trim() || "Uncategorized";
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, value], index) => ({
      category,
      value,
      fill: getCategoryColor(category, index),
    }))
    .sort((left, right) => right.value - left.value);
}
