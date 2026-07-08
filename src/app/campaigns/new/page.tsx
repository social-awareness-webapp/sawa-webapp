import type { Metadata } from "next";

import { DashboardShell } from "@/components/shared/DashboardShell";
import { PostCampaignContainer } from "@/containers/PostCampaignContainer";

export const metadata: Metadata = {
  title: "Post a Campaign | SAWA",
  description: "Create a new awareness campaign for admin review.",
};

export default function NewCampaignPage() {
  return (
    <DashboardShell>
      <PostCampaignContainer />
    </DashboardShell>
  );
}
