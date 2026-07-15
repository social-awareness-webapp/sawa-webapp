export type BusinessProfile = {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  contactEmail: string;
  logoUrl: string;
  brandAccentColor: string;
  website: string;
  socialMediaHandle: string;
};

export type BusinessProfileInput = {
  businessName: string;
  description?: string;
  contactEmail?: string;
  logoUrl?: string;
  brandAccentColor?: string;
  website?: string;
  socialMediaHandle?: string;
};

export type BusinessProfileRow = {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  contact_email: string | null;
  logo_url: string | null;
  brand_accent_color: string | null;
  website: string | null;
  social_media_handle: string | null;
};
