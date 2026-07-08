import type { Metadata } from "next";

import { PostCampaignContainer } from "@/containers/PostCampaignContainer";

export const metadata: Metadata = {
  title: "Post a Campaign | SAWA",
  description: "Create a new awareness campaign for admin review.",
};

export default function NewCampaignPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PostCampaignContainer />
    </div>
  );
}
