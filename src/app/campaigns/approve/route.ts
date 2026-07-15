import { NextResponse } from "next/server";
import { z } from "zod";

import { assertSuperAdmin } from "@/lib/campaigns/assert-super-admin";
import { reviewCampaignRecord } from "@/lib/campaigns/review-campaign";
import { createClient } from "@/lib/supabase/server";

const approveSchema = z.object({
  campaignId: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
  notes: z.string().trim().optional(),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const auth = await assertSuperAdmin(supabase);

  if ("error" in auth && auth.error) {
    return auth.error;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = approveSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review payload." }, { status: 422 });
  }

  const { campaignId, decision, notes } = parsed.data;

  const result = await reviewCampaignRecord(supabase, {
    campaignId,
    decision,
    reviewerId: auth.user!.id,
    notes,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    success: true,
    campaignId: result.campaign.id,
    status: result.campaign.status,
  });
}
