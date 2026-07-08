import { z } from "zod";

export const CAMPAIGN_CATEGORIES = [
  "Environment",
  "Health",
  "Education",
  "Community",
] as const;

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MIN_LENGTH = 100;
export const TITLE_MIN_LENGTH = 5;

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "");

export const campaignPayloadSchema = z
  .object({
    title: z.string().trim().min(1).max(TITLE_MAX_LENGTH),
    category: z.enum(CAMPAIGN_CATEGORIES).optional(),
    description: optionalText,
    goal: optionalText,
    targetAudience: optionalText,
    startDate: optionalText,
    endDate: optionalText,
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

    if (data.status !== "pending") {
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
  });

export type CampaignPayload = z.infer<typeof campaignPayloadSchema>;
