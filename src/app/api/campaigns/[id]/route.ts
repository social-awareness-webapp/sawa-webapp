import { NextResponse } from "next/server";

import { campaignPayloadSchema } from "@/lib/campaigns/campaign-schema";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
