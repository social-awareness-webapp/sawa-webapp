export const campaignCategories = [
  "All",
  "Environment",
  "Health",
  "Education",
  "Community",
] as const;

export type CampaignFilterCategory = (typeof campaignCategories)[number];
