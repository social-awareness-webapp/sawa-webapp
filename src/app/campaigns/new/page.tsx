import type { Metadata } from "next";

import { DashboardShell } from "@/components/shared/DashboardShell";
import { PostCampaignContainer } from "@/containers/PostCampaignContainer";
import { getCurrentUserProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Post a Campaign | SAWA",
  description: "Create a new awareness campaign for admin review.",
};

export default async function NewCampaignPage() {
  const profile = await getCurrentUserProfile();

  return (
    <DashboardShell>
      <PostCampaignContainer
        userRole={profile?.role ?? null}
        contactEmail={profile?.email ?? ""}
      />
    </DashboardShell>
  );
}
