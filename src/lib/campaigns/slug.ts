export function slugifyCampaignTitle(title: string) {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "campaign";

  const suffix = Math.random().toString(36).slice(2, 8);

  return `${base}-${suffix}`;
}
