import { notFound, redirect } from "next/navigation";

import { DashboardShell } from "@/components/shared/DashboardShell";
import { EditCampaignContainer } from "@/containers/EditCampaignContainer";
import { getBusinessProfile } from "@/lib/business-profile/get-business-profile";
import { getCampaignByIdOrSlug } from "@/lib/campaigns/get-campaign";
import { getCurrentUserProfile } from "@/lib/supabase/server";

type EditCampaignPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCampaignPage({
  params,
}: EditCampaignPageProps) {
  const { id } = await params;

  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  const campaign = await getCampaignByIdOrSlug(id);

  if (!campaign || campaign.isArchived || campaign.createdBy !== profile.id) {
    notFound();
  }

  const businessProfile =
    campaign.campaignType === "business"
      ? await getBusinessProfile(profile.id)
      : null;

  return (
    <DashboardShell>
      <EditCampaignContainer
        campaign={campaign}
        businessProfile={businessProfile}
        contactEmail={profile.email}
      />
    </DashboardShell>
  );
}
