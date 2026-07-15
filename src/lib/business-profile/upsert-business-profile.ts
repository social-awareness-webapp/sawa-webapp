import type { createClient } from "@/lib/supabase/server";

type UpsertBusinessProfileInput = {
  businessName: string;
  description?: string;
  contactEmail?: string;
  logoUrl?: string;
  brandAccentColor?: string;
  website?: string;
  socialMediaHandle?: string;
};

export async function upsertBusinessProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  profile: UpsertBusinessProfileInput
) {
  const { data: existing } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const row = {
    business_name: profile.businessName,
    description: profile.description || null,
    contact_email: profile.contactEmail || null,
    logo_url: profile.logoUrl || null,
    brand_accent_color: profile.brandAccentColor || null,
    website: profile.website || null,
    social_media_handle: profile.socialMediaHandle || null,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("business_profiles")
      .update(row)
      .eq("id", existing.id);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase.from("business_profiles").insert({
    user_id: userId,
    ...row,
  });

  if (error) {
    throw error;
  }
}
