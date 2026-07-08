"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

import { PostCampaignForm } from "@/components/shared/PostCampaignForm";
import { useAuth } from "@/providers/AuthProvider";
import { uploadCampaignMedia } from "@/services/campaign-media.service";
import { updateCampaign } from "@/services/campaigns.service";
import type {
  CampaignDetail,
  CampaignDraftInput,
  CampaignMediaFiles,
  CampaignStatus,
} from "@/types/campaign";

type EditCampaignContainerProps = {
  campaign: CampaignDetail;
};

export function EditCampaignContainer({ campaign }: EditCampaignContainerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
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

      // Keep existing media unless the user picked new files.
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

      // Refresh the client cache that powers the My Campaigns list so the
      // update shows immediately, then refresh server components.
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard/my-campaigns"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#1A365D]"
      >
        <ChevronLeft className="size-4" />
        Back to My Campaigns
      </Link>

      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-[#1A365D]">Edit Campaign</h1>
        <p className="text-sm text-slate-500">
          Update your campaign details. Saving will resubmit it for admin
          review.
        </p>
      </div>

      <PostCampaignForm
        onSubmit={(input, media) => submit(input, media, "pending")}
        onSaveDraft={(input, media) => submit(input, media, "draft")}
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
    </div>
  );
}
