export type CampaignCategory =
  | "Environment"
  | "Health"
  | "Education"
  | "Community";

export type Campaign = {
  slug: string;
  title: string;
  organization: string;
  description: string;
  category: CampaignCategory;
  progressPercent: number;
  daysLeft: number;
};

export type StatItem = {
  value: string;
  label: string;
};
