"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

import {
  BusinessCampaignHeader,
  BusinessPostCampaignForm,
} from "@/components/shared/BusinessPostCampaignForm";
import { PostCampaignForm } from "@/components/shared/PostCampaignForm";
import { useAuth } from "@/providers/AuthProvider";
import { uploadCampaignMedia } from "@/services/campaign-media.service";
import {
  updateBusinessCampaign,
  updateCampaign,
} from "@/services/campaigns.service";
import type { BusinessProfile } from "@/types/business-profile";
import type {
  BusinessCampaignDraftInput,
  BusinessCampaignMediaFiles,
  CampaignDetail,
  CampaignDraftInput,
  CampaignMediaFiles,
  CampaignStatus,
} from "@/types/campaign";

type EditCampaignContainerProps = {
  campaign: CampaignDetail;
  businessProfile: BusinessProfile | null;
  contactEmail: string;
};

export function EditCampaignContainer({
  campaign,
  businessProfile,
  contactEmail,
}: EditCampaignContainerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBusinessCampaign = campaign.campaignType === "business";

  const submitSocial = async (
    input: CampaignDraftInput,
    media: CampaignMediaFiles,
    status: CampaignStatus
  ) => {
    if (!user) {
      setError("You must be signed in to edit a campaign.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const uploaded = await uploadCampaignMedia({
        userId: user.id,
        banner: media.banner,
        supportingFiles: media.supportingDocuments,
      });

      const bannerImageUrl =
        uploaded.bannerImageUrl ?? campaign.bannerImageUrl ?? undefined;
      const supportingDocuments =
        uploaded.supportingDocuments ??
        (campaign.supportingDocuments.length > 0
          ? campaign.supportingDocuments
          : undefined);

      await updateCampaign(campaign.id, {
        ...input,
        bannerImageUrl,
        supportingDocuments,
        status,
      });

      await queryClient.invalidateQueries({
        queryKey: ["campaigns", "mine", user.id],
      });
      router.refresh();
      router.push("/dashboard/my-campaigns");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while updating your campaign."
      );
      setIsSubmitting(false);
    }
  };

  const submitBusiness = async (
    input: BusinessCampaignDraftInput,
    media: BusinessCampaignMediaFiles,
    status: CampaignStatus
  ) => {
    if (!user) {
      setError("You must be signed in to edit a campaign.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { businessLogoUrl } = await uploadCampaignMedia({
        userId: user.id,
        businessLogo: media.businessLogo,
      });

      await updateBusinessCampaign(campaign.id, {
        ...input,
        businessProfile: {
          ...input.businessProfile,
          contactEmail: input.businessProfile.contactEmail || contactEmail,
          logoUrl:
            businessLogoUrl ??
            input.businessProfile.logoUrl ??
            businessProfile?.logoUrl,
        },
        status,
      });

      await queryClient.invalidateQueries({
        queryKey: ["campaigns", "mine", user.id],
      });
      router.refresh();
      router.push("/dashboard/my-campaigns");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while updating your campaign."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={
        isBusinessCampaign
          ? "mx-auto max-w-3xl px-4 py-8 sm:px-6"
          : "mx-auto max-w-2xl px-4 py-8 sm:px-6"
      }
    >
      <Link
        href="/dashboard/my-campaigns"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#1A365D]"
      >
        <ChevronLeft className="size-4" />
        Back to My Campaigns
      </Link>

      {isBusinessCampaign ? (
        <>
          <BusinessCampaignHeader mode="edit" />
          <BusinessPostCampaignForm
            contactEmail={contactEmail}
            existingLogoUrl={businessProfile?.logoUrl}
            initialValues={{
              title: campaign.title,
              category: campaign.category ?? "",
              description: campaign.description,
              goal: campaign.goal ?? "",
              businessName:
                businessProfile?.businessName ?? campaign.organization ?? "",
              brandAccentColor:
                businessProfile?.brandAccentColor || "#2B6CB0",
              businessWebsite: businessProfile?.website ?? "",
              socialMediaHandle: businessProfile?.socialMediaHandle ?? "",
              sponsorshipTier: campaign.sponsorshipTier ?? "standard",
              startDate: campaign.startDate ?? "",
              endDate: campaign.endDate ?? "",
              preferredDuration: campaign.preferredDuration ?? "",
              confirmBusinessPolicy: true,
              authorizeBrandDisplay: true,
            }}
            onSubmit={(input, media) => submitBusiness(input, media, "pending")}
            onSaveDraft={(input, media) => submitBusiness(input, media, "draft")}
            onCancel={() => router.push("/dashboard/my-campaigns")}
            isSubmitting={isSubmitting}
            error={error}
            submitLabel="Save Changes"
            submittingLabel="Saving..."
          />
        </>
      ) : (
        <>
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-bold text-[#1A365D]">Edit Campaign</h1>
            <p className="text-sm text-slate-500">
              Update your campaign details. Saving will resubmit it for admin
              review.
            </p>
          </div>

          <PostCampaignForm
            onSubmit={(input, media) => submitSocial(input, media, "pending")}
            onSaveDraft={(input, media) => submitSocial(input, media, "draft")}
            onCancel={() => router.push("/dashboard/my-campaigns")}
            isSubmitting={isSubmitting}
            error={error}
            initialValues={{
              title: campaign.title,
              category: campaign.category ?? "",
              description: campaign.description,
              goal: campaign.goal ?? "",
              targetAudience: campaign.targetAudience ?? "",
              startDate: campaign.startDate ?? "",
              endDate: campaign.endDate ?? "",
              confirmGuidelines: false,
            }}
            existingBannerUrl={campaign.bannerImageUrl}
            existingDocuments={campaign.supportingDocuments}
            submitLabel="Save Changes"
            submittingLabel="Saving..."
          />
        </>
      )}
    </div>
  );
}
