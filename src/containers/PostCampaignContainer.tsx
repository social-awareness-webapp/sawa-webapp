"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { PostCampaignForm } from "@/components/shared/PostCampaignForm";
import { createCampaign } from "@/services/campaigns.service";
import type { CampaignDraftInput, CampaignStatus } from "@/types/campaign";

export function PostCampaignContainer() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (input: CampaignDraftInput, status: CampaignStatus) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createCampaign({ ...input, status });
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
        onSubmit={(input) => submit(input, "pending")}
        onSaveDraft={(input) => submit(input, "draft")}
        onCancel={() => router.push("/dashboard")}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
