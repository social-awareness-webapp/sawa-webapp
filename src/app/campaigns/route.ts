import { NextResponse } from "next/server";

import { campaignPayloadSchema } from "@/lib/campaigns/campaign-schema";
import { slugifyCampaignTitle } from "@/lib/campaigns/slug";
import { createClient } from "@/lib/supabase/server";

const CAMPAIGN_TYPE_DEFAULT = "social";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to post a campaign." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = campaignPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the campaign details and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const input = parsed.data;

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      title: input.title,
      description: input.description,
      category: input.category ?? null,
      campaign_type: CAMPAIGN_TYPE_DEFAULT,
      status: input.status,
      created_by: user.id,
      goal: input.goal || null,
      target_audience: input.targetAudience || null,
      starts_at: input.startDate || null,
      ends_at: input.endDate || null,
      slug: slugifyCampaignTitle(input.title),
      progress_percent: 0,
    })
    .select("id, slug, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaign: data }, { status: 201 });
}
