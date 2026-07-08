"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

import { PostCampaignForm } from "@/components/shared/PostCampaignForm";
import { useAuth } from "@/providers/AuthProvider";
import { uploadCampaignMedia } from "@/services/campaign-media.service";
import { createCampaign } from "@/services/campaigns.service";
import type {
  CampaignDraftInput,
  CampaignMediaFiles,
  CampaignStatus,
} from "@/types/campaign";

export function PostCampaignContainer() {
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
      setError("You must be signed in to post a campaign.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { bannerImageUrl, supportingDocuments } = await uploadCampaignMedia({
        userId: user.id,
        banner: media.banner,
        supportingFiles: media.supportingDocuments,
      });

      await createCampaign({
        ...input,
        bannerImageUrl,
        supportingDocuments,
        status,
      });

      await queryClient.invalidateQueries({
        queryKey: ["campaigns", "mine", user.id],
      });
      router.refresh();
      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while posting your campaign."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#1A365D]"
      >
        <ChevronLeft className="size-4" />
        Back to My Campaigns
      </Link>

      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-[#1A365D]">
          Post a New Campaign
        </h1>
        <p className="text-sm text-slate-500">
          Complete all required fields and submit for admin review.
        </p>
      </div>

      <PostCampaignForm
        onSubmit={(input, media) => submit(input, media, "pending")}
        onSaveDraft={(input, media) => submit(input, media, "draft")}
        onCancel={() => router.push("/dashboard")}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
