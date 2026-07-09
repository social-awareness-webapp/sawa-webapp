import { NextResponse } from "next/server";

import { businessCampaignPayloadSchema } from "@/lib/campaigns/business-campaign-schema";
import { campaignPayloadSchema } from "@/lib/campaigns/campaign-schema";
import { upsertBusinessProfile } from "@/lib/business-profile/upsert-business-profile";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isBusinessPayload(body: unknown): body is { campaignType: "business" } {
  return (
    typeof body === "object" &&
    body !== null &&
    "campaignType" in body &&
    (body as { campaignType: string }).campaignType === "business"
  );
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to update a campaign." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (isBusinessPayload(body)) {
    const parsed = businessCampaignPayloadSchema.safeParse(body);

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
    const profile = input.businessProfile;

    try {
      await upsertBusinessProfile(supabase, user.id, {
        businessName: profile.businessName,
        description: profile.description,
        contactEmail: profile.contactEmail,
        logoUrl: profile.logoUrl,
        brandAccentColor: profile.brandAccentColor,
        website: profile.website,
        socialMediaHandle: profile.socialMediaHandle,
      });
    } catch (profileError) {
      const message =
        profileError instanceof Error
          ? profileError.message
          : "Failed to save your business profile.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("campaigns")
      .update({
        title: input.title,
        description: input.description,
        category: input.category ?? null,
        status: input.status,
        goal: input.goal || null,
        starts_at: input.startDate || null,
        ends_at: input.endDate || null,
        organization: profile.businessName || null,
        sponsorship_tier: input.sponsorshipTier ?? null,
        preferred_duration: input.preferredDuration || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("created_by", user.id)
      .select("id, slug, status")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Campaign not found or you do not have access to it." },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign: data });
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
    .update({
      title: input.title,
      description: input.description,
      category: input.category ?? null,
      status: input.status,
      goal: input.goal || null,
      target_audience: input.targetAudience || null,
      starts_at: input.startDate || null,
      ends_at: input.endDate || null,
      banner_image_url: input.bannerImageUrl || null,
      supporting_documents:
        input.supportingDocuments && input.supportingDocuments.length > 0
          ? input.supportingDocuments
          : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("created_by", user.id)
    .select("id, slug, status")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Campaign not found or you do not have access to it." },
      { status: 404 }
    );
  }

  return NextResponse.json({ campaign: data });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to delete a campaign." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("campaigns")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("created_by", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Campaign not found or you do not have access to it." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
