import { notFound } from "next/navigation";

import { AdminCampaignDetailView } from "@/components/admin/AdminCampaignDetailView";
import { getCampaignByIdOrSlug } from "@/lib/campaigns/get-campaign";
import { createClient } from "@/lib/supabase/server";

type AdminCampaignDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

function resolveBackNavigation(from?: string) {
  if (from === "campaigns") {
    return {
      backHref: "/admin/campaigns",
      backLabel: "Back to All Campaigns",
    };
  }

  return {
    backHref: "/admin/pending-campaigns",
    backLabel: "Back to Pending Campaigns",
  };
}

export default async function AdminCampaignDetailPage({
  params,
  searchParams,
}: AdminCampaignDetailPageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const campaign = await getCampaignByIdOrSlug(id);

  if (!campaign || campaign.isArchived) {
    notFound();
  }

  const supabase = await createClient();
  const { data: organiser } = await supabase
    .from("users")
    .select("full_name, email")
    .eq("id", campaign.createdBy)
    .maybeSingle();

  const navigation = resolveBackNavigation(from);

  return (
    <AdminCampaignDetailView
      campaign={campaign}
      organiserName={organiser?.full_name ?? campaign.organization ?? "Unknown"}
      organiserEmail={organiser?.email ?? "—"}
      backHref={navigation.backHref}
      backLabel={navigation.backLabel}
    />
  );
}
