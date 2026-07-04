import type { Campaign, StatItem } from "@/types/campaign";

export const homepageStats: StatItem[] = [
  { value: "2,400+", label: "Community Members" },
  { value: "141", label: "Active Campaigns" },
  { value: "38", label: "Partner Businesses" },
  { value: "12,000+", label: "Lives Reached" },
];

export const campaignCategories = [
  "All",
  "Environment",
  "Health",
  "Education",
  "Community",
] as const;

export type CampaignFilterCategory = (typeof campaignCategories)[number];

export const mockCampaigns: Campaign[] = [
  {
    slug: "clean-water-rural-schools",
    title: "Clean Water for Rural Schools",
    organization: "Green Earth Foundation",
    description:
      "Help install water filtration systems in 12 rural schools, giving over 3,000 children access to safe drinking water.",
    category: "Environment",
    progressPercent: 72,
    daysLeft: 14,
  },
  {
    slug: "mental-health-awareness-week",
    title: "Mental Health Awareness Week",
    organization: "MindWell Coalition",
    description:
      "Fund community workshops and resources to reduce stigma and improve access to mental health support.",
    category: "Health",
    progressPercent: 58,
    daysLeft: 21,
  },
  {
    slug: "after-school-reading-program",
    title: "After-School Reading Program",
    organization: "Books for All",
    description:
      "Provide books, tutors, and learning spaces for underserved students to build literacy skills after school.",
    category: "Education",
    progressPercent: 85,
    daysLeft: 7,
  },
  {
    slug: "neighborhood-clean-up-drive",
    title: "Neighborhood Clean-Up Drive",
    organization: "City Voices Network",
    description:
      "Organize monthly community clean-ups and recycling drives to keep local parks and streets safe and beautiful.",
    category: "Community",
    progressPercent: 45,
    daysLeft: 30,
  },
  {
    slug: "vaccination-awareness-campaign",
    title: "Vaccination Awareness Campaign",
    organization: "Public Health Trust",
    description:
      "Spread accurate information about vaccinations through town halls, flyers, and trusted community ambassadors.",
    category: "Health",
    progressPercent: 91,
    daysLeft: 5,
  },
  {
    slug: "tree-planting-initiative",
    title: "Tree Planting Initiative",
    organization: "EcoFuture Alliance",
    description:
      "Plant 5,000 native trees across urban neighborhoods to improve air quality and create greener public spaces.",
    category: "Environment",
    progressPercent: 63,
    daysLeft: 18,
  },
];
