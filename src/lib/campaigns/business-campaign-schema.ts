import { z } from "zod";

import {
  CAMPAIGN_CATEGORIES,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/campaigns/campaign-schema";

export const SPONSORSHIP_TIERS = ["standard", "featured", "premium"] as const;
export type SponsorshipTier = (typeof SPONSORSHIP_TIERS)[number];

export const PREFERRED_DURATIONS = [
  "7 days",
  "14 days",
  "30 days",
  "60 days",
  "90 days",
] as const;

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "");

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "")
  .refine((value) => value === "" || z.string().url().safeParse(value).success, {
    message: "Enter a valid URL",
  });

export const businessProfilePayloadSchema = z.object({
  businessName: optionalText,
  description: optionalText,
  contactEmail: optionalText,
  logoUrl: z.string().url().optional(),
  brandAccentColor: optionalText,
  website: optionalUrl,
  socialMediaHandle: optionalText,
});

export const businessCampaignPayloadSchema = z
  .object({
    campaignType: z.literal("business"),
    title: z.string().trim().min(1).max(TITLE_MAX_LENGTH),
    category: z.enum(CAMPAIGN_CATEGORIES).optional(),
    description: optionalText,
    goal: optionalText,
    sponsorshipTier: z.enum(SPONSORSHIP_TIERS).optional(),
    startDate: optionalText,
    endDate: optionalText,
    preferredDuration: optionalText,
    businessProfile: businessProfilePayloadSchema,
    confirmBusinessPolicy: z.boolean().optional(),
    authorizeBrandDisplay: z.boolean().optional(),
    status: z.enum(["pending", "draft"]),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && !isIsoDate(data.startDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Enter a valid start date",
      });
    }

    if (data.endDate && !isIsoDate(data.endDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Enter a valid end date",
      });
    }

    if (
      isIsoDate(data.startDate) &&
      isIsoDate(data.endDate) &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after the start date",
      });
    }

    if (
      data.businessProfile.brandAccentColor &&
      !HEX_COLOR_REGEX.test(data.businessProfile.brandAccentColor)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["businessProfile", "brandAccentColor"],
        message: "Enter a valid hex colour (e.g. #2B6CB0)",
      });
    }

    if (data.status !== "pending") {
      if (!data.businessProfile.businessName) {
        ctx.addIssue({
          code: "custom",
          path: ["businessProfile", "businessName"],
          message: "Add a business name before saving a draft",
        });
      }
      return;
    }

    if (data.title.length < TITLE_MIN_LENGTH) {
      ctx.addIssue({
        code: "custom",
        path: ["title"],
        message: `Title must be at least ${TITLE_MIN_LENGTH} characters`,
      });
    }

    if (!data.category) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "Please select a category",
      });
    }

    if (data.description.length < DESCRIPTION_MIN_LENGTH) {
      ctx.addIssue({
        code: "custom",
        path: ["description"],
        message: `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`,
      });
    }

    if (!data.businessProfile.businessName) {
      ctx.addIssue({
        code: "custom",
        path: ["businessProfile", "businessName"],
        message: "Business name is required",
      });
    }

    if (!data.sponsorshipTier) {
      ctx.addIssue({
        code: "custom",
        path: ["sponsorshipTier"],
        message: "Please select a sponsorship tier",
      });
    }

    if (!data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date is required",
      });
    }

    if (!data.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date is required",
      });
    }

    if (!data.preferredDuration) {
      ctx.addIssue({
        code: "custom",
        path: ["preferredDuration"],
        message: "Please select a preferred duration",
      });
    }

    if (!data.confirmBusinessPolicy) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmBusinessPolicy"],
        message: "Please confirm compliance with the Business Campaign Policy",
      });
    }

    if (!data.authorizeBrandDisplay) {
      ctx.addIssue({
        code: "custom",
        path: ["authorizeBrandDisplay"],
        message: "Please authorise SAWA to display your business branding",
      });
    }
  });

export type BusinessCampaignPayload = z.infer<
  typeof businessCampaignPayloadSchema
>;
