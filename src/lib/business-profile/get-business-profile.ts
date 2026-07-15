import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { BusinessProfile, BusinessProfileRow } from "@/types/business-profile";

function toBusinessProfile(row: BusinessProfileRow): BusinessProfile {
  return {
    id: row.id,
    userId: row.user_id,
    businessName: row.business_name,
    description: row.description ?? "",
    contactEmail: row.contact_email ?? "",
    logoUrl: row.logo_url ?? "",
    brandAccentColor: row.brand_accent_color ?? "",
    website: row.website ?? "",
    socialMediaHandle: row.social_media_handle ?? "",
  };
}

export const getBusinessProfile = cache(
  async (userId: string): Promise<BusinessProfile | null> => {
    const supabase = await createClient();

    const { data } = await supabase
      .from("business_profiles")
      .select(
        "id, user_id, business_name, description, contact_email, logo_url, brand_accent_color, website, social_media_handle"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) {
      return null;
    }

    return toBusinessProfile(data as BusinessProfileRow);
  }
);
