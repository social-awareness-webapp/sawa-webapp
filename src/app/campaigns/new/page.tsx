import type { Metadata } from "next";

import { DashboardShell } from "@/components/shared/DashboardShell";
import { PostCampaignContainer } from "@/containers/PostCampaignContainer";
import { getBusinessProfile } from "@/lib/business-profile/get-business-profile";
import { getCurrentUserProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Post a Campaign | SAWA",
  description: "Create a new awareness campaign for admin review.",
};

export default async function NewCampaignPage() {
  const profile = await getCurrentUserProfile();
  const businessProfile =
    profile?.role === "business_owner" && profile.id
      ? await getBusinessProfile(profile.id)
      : null;

  return (
    <DashboardShell>
      <PostCampaignContainer
        userRole={profile?.role ?? null}
        businessProfile={businessProfile}
        contactEmail={profile?.email ?? ""}
      />
    </DashboardShell>
  );
}
