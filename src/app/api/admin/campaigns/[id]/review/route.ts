import { NextResponse } from "next/server";
import { z } from "zod";

import { assertSuperAdmin } from "@/lib/campaigns/assert-super-admin";
import { reviewCampaignRecord } from "@/lib/campaigns/review-campaign";
import { createClient } from "@/lib/supabase/server";

const reviewSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  notes: z.string().trim().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;
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

  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review payload." }, { status: 422 });
  }

  const result = await reviewCampaignRecord(supabase, {
    campaignId: id,
    decision: parsed.data.decision,
    reviewerId: auth.user!.id,
    notes: parsed.data.notes,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true, status: result.campaign.status });
}
