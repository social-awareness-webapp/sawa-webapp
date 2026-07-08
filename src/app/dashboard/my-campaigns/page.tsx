import type { Metadata } from "next";

import { MyCampaignsContainer } from "@/containers/MyCampaignsContainer";

export const metadata: Metadata = {
  title: "My Campaigns | SAWA",
};

export default function MyCampaignsPage() {
  return <MyCampaignsContainer />;
}
