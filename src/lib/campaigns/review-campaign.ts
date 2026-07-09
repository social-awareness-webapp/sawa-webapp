import type { SupabaseClient } from "@supabase/supabase-js";

export type CampaignReviewDecision = "approved" | "rejected";

type ReviewCampaignInput = {
  campaignId: string;
  decision: CampaignReviewDecision;
  reviewerId: string;
  notes?: string;
};

export async function reviewCampaignRecord(
  supabase: SupabaseClient,
  { campaignId, decision, reviewerId, notes }: ReviewCampaignInput
) {
  const status = decision === "approved" ? "approved" : "rejected";

  const { data: campaign, error: updateError } = await supabase
    .from("campaigns")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select("id, status")
    .maybeSingle();

  if (updateError) {
    return { error: updateError.message, status: 500 as const };
  }

  if (!campaign) {
    return { error: "Campaign not found.", status: 404 as const };
  }

  const { error: approvalError } = await supabase.from("campaign_approvals").insert({
    campaign_id: campaignId,
    reviewed_by: reviewerId,
    decision,
    notes: notes || null,
  });

  if (approvalError) {
    return { error: approvalError.message, status: 500 as const };
  }

  return { campaign, status: 200 as const };
}
