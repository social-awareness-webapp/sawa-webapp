"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Briefcase,
  Crown,
  Info,
  Star,
  XCircle,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CAMPAIGN_CATEGORIES,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/campaigns/campaign-schema";
import {
  PREFERRED_DURATIONS,
  SPONSORSHIP_TIERS,
  type SponsorshipTier,
} from "@/lib/campaigns/business-campaign-schema";
import { cn } from "@/lib/utils";
import type {
  BusinessCampaignDraftInput,
  BusinessCampaignMediaFiles,
} from "@/types/campaign";

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

const formSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
      .max(TITLE_MAX_LENGTH, `Title must be ${TITLE_MAX_LENGTH} characters or less`),
    category: z.string().min(1, "Please select a category"),
    description: z
      .string()
      .trim()
      .min(
        DESCRIPTION_MIN_LENGTH,
        `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`
      ),
    goal: z.string().optional(),
    businessName: z.string().trim().min(1, "Business name is required"),
    brandAccentColor: z
      .string()
      .optional()
      .refine(
        (value) => !value || HEX_COLOR_REGEX.test(value),
        "Enter a valid hex colour (e.g. #2B6CB0)"
      ),
    businessWebsite: z.string().optional(),
    socialMediaHandle: z.string().optional(),
    sponsorshipTier: z.enum(SPONSORSHIP_TIERS, {
      message: "Please select a sponsorship tier",
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    preferredDuration: z.string().min(1, "Please select a preferred duration"),
    confirmBusinessPolicy: z.boolean(),
    authorizeBrandDisplay: z.boolean(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  })
  .refine((data) => data.confirmBusinessPolicy, {
    message: "Please confirm compliance with the Business Campaign Policy",
    path: ["confirmBusinessPolicy"],
  })
  .refine((data) => data.authorizeBrandDisplay, {
    message: "Please authorise SAWA to display your business branding",
    path: ["authorizeBrandDisplay"],
  });

type BusinessFormValues = z.infer<typeof formSchema>;

export type BusinessFormInitialValues = Partial<BusinessFormValues>;

const SPONSORSHIP_OPTIONS: {
  value: SponsorshipTier;
  title: string;
  description: string;
  price: string;
  priceClassName: string;
  icon: typeof Star;
}[] = [
  {
    value: "standard",
    title: "Standard Listing",
    description: "Campaign listed in the main feed.",
    price: "Free",
    priceClassName: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: Star,
  },
  {
    value: "featured",
    title: "Featured Campaign",
    description: "Pinned to homepage and category tops for 7 days.",
    price: "R 499 / campaign",
    priceClassName: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Zap,
  },
  {
    value: "premium",
    title: "Premium Spotlight",
    description:
      "Homepage hero placement, email newsletter, analytics dashboard.",
    price: "R 1,299 / campaign",
    priceClassName: "bg-[#1A365D] text-white ring-[#1A365D]",
    icon: Crown,
  },
];

function toDraftInput(
  values: BusinessFormValues,
  options?: { includeCompliance?: boolean }
): BusinessCampaignDraftInput {
  return {
    title: values.title.trim(),
    category: values.category as BusinessCampaignDraftInput["category"],
    description: values.description.trim(),
    goal: values.goal?.trim() || undefined,
    sponsorshipTier: values.sponsorshipTier,
    preferredDuration: values.preferredDuration,
    startDate: values.startDate,
    endDate: values.endDate,
    businessProfile: {
      businessName: values.businessName.trim(),
      brandAccentColor: values.brandAccentColor?.trim() || undefined,
      website: values.businessWebsite?.trim() || undefined,
      socialMediaHandle: values.socialMediaHandle?.trim() || undefined,
    },
    ...(options?.includeCompliance
      ? {
          confirmBusinessPolicy: values.confirmBusinessPolicy,
          authorizeBrandDisplay: values.authorizeBrandDisplay,
        }
      : {}),
  };
}

type BusinessPostCampaignFormProps = {
  contactEmail: string;
  initialValues?: BusinessFormInitialValues;
  existingLogoUrl?: string | null;
  submitLabel?: string;
  submittingLabel?: string;
  onSubmit: (
    input: BusinessCampaignDraftInput,
    media: BusinessCampaignMediaFiles,
    logoUrl?: string
  ) => void;
  onSaveDraft: (
    input: BusinessCampaignDraftInput,
    media: BusinessCampaignMediaFiles,
    logoUrl?: string
  ) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
};

function buildDefaultValues(
  initialValues?: BusinessFormInitialValues
): BusinessFormValues {
  return {
    title: initialValues?.title ?? "",
    category: initialValues?.category ?? "",
    description: initialValues?.description ?? "",
    goal: initialValues?.goal ?? "",
    businessName: initialValues?.businessName ?? "",
    brandAccentColor: initialValues?.brandAccentColor ?? "",
    businessWebsite: initialValues?.businessWebsite ?? "",
    socialMediaHandle: initialValues?.socialMediaHandle ?? "",
    sponsorshipTier: initialValues?.sponsorshipTier ?? "standard",
    startDate: initialValues?.startDate ?? "",
    endDate: initialValues?.endDate ?? "",
    preferredDuration: initialValues?.preferredDuration ?? "",
    confirmBusinessPolicy: initialValues?.confirmBusinessPolicy ?? false,
    authorizeBrandDisplay: initialValues?.authorizeBrandDisplay ?? false,
  };
}

export function BusinessPostCampaignForm({
  contactEmail,
  initialValues,
  existingLogoUrl = null,
  submitLabel = "Submit Campaign for Review",
  submittingLabel = "Submitting...",
  onSubmit,
  onSaveDraft,
  onCancel,
  isSubmitting,
  error,
}: BusinessPostCampaignFormProps) {
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaultValues(initialValues),
  });

  const [logoFile, setLogoFile] = useState<File[]>([]);

  const titleLength = form.watch("title")?.length ?? 0;
  const selectedTier = form.watch("sponsorshipTier");

  const collectMedia = (): BusinessCampaignMediaFiles => ({
    businessLogo: logoFile[0] ?? null,
  });

  const buildInput = (
    values: BusinessFormValues,
    includeCompliance = false
  ): BusinessCampaignDraftInput => {
    const input = toDraftInput(values, { includeCompliance });
    input.businessProfile.contactEmail = contactEmail;
    if (existingLogoUrl && logoFile.length === 0) {
      input.businessProfile.logoUrl = existingLogoUrl;
    }
    return input;
  };

  const handleSaveDraft = () => {
    const values = form.getValues();

    if (!values.title.trim()) {
      form.setError("title", {
        message: "Add a title before saving a draft",
      });
      return;
    }

    if (!values.businessName.trim()) {
      form.setError("businessName", {
        message: "Add a business name before saving a draft",
      });
      return;
    }

    onSaveDraft(buildInput(values), collectMedia());
  };

  return (
    <Card className="border border-slate-100 bg-white shadow-sm ring-0">
      <CardContent className="space-y-8 p-6 sm:p-8">
        {error ? (
          <Alert variant="destructive">
            <XCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              onSubmit(buildInput(values, true), collectMedia())
            )}
            className="space-y-8"
          >
            <FormSection
              number={1}
              title="Campaign Basics"
              description="Tell the community about your awareness campaign."
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Campaign Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        maxLength={TITLE_MAX_LENGTH}
                        placeholder="e.g., GreenTech SA Environmental Drive"
                        className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormMessage className="text-xs text-red-600" />
                      <span className="ml-auto text-xs text-slate-400">
                        {titleLength} / {TITLE_MAX_LENGTH}
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      value={field.value || null}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 px-3 text-sm">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CAMPAIGN_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Campaign Description{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Describe your cause and its community impact."
                        className="rounded-lg border-slate-200 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Campaign Goal
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Raise awareness about renewable energy to 10,000 Gauteng residents."
                        className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              number={2}
              title="Business Branding"
              description="Your brand identity will be displayed alongside this campaign."
            >
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Business Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., GreenTech SA (Pty) Ltd"
                        className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#2D3748]">
                  Business Logo
                </p>
                {existingLogoUrl && logoFile.length === 0 ? (
                  <div className="space-y-1.5">
                    <img
                      src={existingLogoUrl}
                      alt="Current business logo"
                      className="size-20 rounded-lg border border-slate-100 bg-slate-50 object-contain p-2"
                    />
                    <p className="text-xs text-slate-400">
                      Current logo. Upload a new file below to replace it.
                    </p>
                  </div>
                ) : null}
                <FileDropzone
                  accept="image/png,image/svg+xml"
                  hint="PNG or SVG — min 200×200px"
                  maxFiles={1}
                  maxSizeMb={5}
                  files={logoFile}
                  onFilesChange={setLogoFile}
                />
              </div>

              <FormField
                control={form.control}
                name="brandAccentColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Brand Accent Colour
                    </FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input
                          placeholder="#2B6CB0"
                          className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <span
                        className="size-10 shrink-0 rounded-lg border border-slate-200"
                        style={{
                          backgroundColor: field.value || "#2B6CB0",
                        }}
                      />
                    </div>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Business Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://yourbusiness.co.za"
                        className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialMediaHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Social Media Handle{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@yourbusiness"
                        className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              number={3}
              title="Sponsorship Tier"
              description="Choose how prominently your campaign is featured."
            >
              <FormField
                control={form.control}
                name="sponsorshipTier"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      {SPONSORSHIP_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedTier === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "flex items-start gap-4 rounded-xl border p-4 text-left transition-colors",
                              isSelected
                                ? "border-[#1A365D] bg-[#1A365D]/5"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-10 shrink-0 place-items-center rounded-full",
                                isSelected
                                  ? "bg-[#1A365D] text-white"
                                  : "bg-slate-100 text-slate-500"
                              )}
                            >
                              <Icon className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-[#1A365D]">
                                  {option.title}
                                </span>
                                <span
                                  className={cn(
                                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                                    option.priceClassName
                                  )}
                                >
                                  {option.price}
                                </span>
                              </span>
                              <span className="mt-1 block text-sm text-slate-500">
                                {option.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              number={4}
              title="Campaign Scheduling"
              description="Set when your campaign should run."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#2D3748]">
                        Start Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#2D3748]">
                        End Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-10 rounded-lg border-slate-200 px-3 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferredDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Preferred Duration
                    </FormLabel>
                    <Select
                      value={field.value || null}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 px-3 text-sm">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PREFERRED_DURATIONS.map((duration) => (
                          <SelectItem key={duration} value={duration}>
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              number={5}
              title="Compliance Declaration"
              description="Confirm your campaign meets SAWA's business requirements."
            >
              <FormField
                control={form.control}
                name="confirmBusinessPolicy"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-slate-600">
                          I confirm this campaign complies with SAWA&apos;s
                          Business Campaign Policy.
                        </FormLabel>
                        <FormMessage className="text-xs text-red-600" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorizeBrandDisplay"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-slate-600">
                          I authorise SAWA to display my business name and logo
                          alongside this campaign.
                        </FormLabel>
                        <FormMessage className="text-xs text-red-600" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </FormSection>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-slate-200 px-5 text-slate-600 hover:bg-slate-50"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="rounded-lg px-5 text-[#1A365D] hover:bg-[#1A365D]/5"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f]"
                disabled={isSubmitting}
              >
                {isSubmitting ? submittingLabel : submitLabel}
              </Button>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                Business campaigns require additional verification. Approval may
                take up to 5 business days.
              </span>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-[#2B6CB0]/5 p-3 text-xs text-[#2B6CB0]">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                Your business branding is saved to your business profile and
                reused across future campaigns.
              </span>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          {number} — {title}
        </p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function BusinessCampaignHeader({ mode = "create" }: { mode?: "create" | "edit" }) {
  if (mode === "edit") {
    return (
      <div className="mb-6 space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2B6CB0]/10 px-3 py-1 text-xs font-semibold text-[#2B6CB0]">
          <Briefcase className="size-3.5" />
          Business Campaign
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#1A365D]">
            Edit Business Campaign
          </h1>
          <p className="text-sm text-slate-500">
            Update your campaign details. Saving will resubmit it for admin
            review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2B6CB0]/10 px-3 py-1 text-xs font-semibold text-[#2B6CB0]">
        <Briefcase className="size-3.5" />
        Business Campaign
      </span>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1A365D]">
          Launch a Business Awareness Campaign
        </h1>
        <p className="text-sm text-slate-500">
          Business campaigns are prominently featured and include your brand
          identity.
        </p>
      </div>
    </div>
  );
}
