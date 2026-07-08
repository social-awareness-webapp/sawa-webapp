import { notFound, redirect } from "next/navigation";

import { EditCampaignContainer } from "@/containers/EditCampaignContainer";
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

  return <EditCampaignContainer campaign={campaign} />;
}
