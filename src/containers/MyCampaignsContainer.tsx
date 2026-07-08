"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MyCampaignsView } from "@/components/shared/MyCampaignsView";
import { useAuth } from "@/providers/AuthProvider";
import { archiveCampaign, fetchMyCampaigns } from "@/services/campaigns.service";
import type { OwnerCampaign } from "@/types/dashboard";

export function MyCampaignsContainer() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const queryKey = ["campaigns", "mine", userId];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchMyCampaigns(userId as string),
    enabled: Boolean(userId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => archiveCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleDelete = (campaign: OwnerCampaign) => {
    const confirmed = window.confirm(
      `Delete "${campaign.title}"? This removes it from your campaigns.`
    );

    if (confirmed) {
      deleteMutation.mutate(campaign.id);
    }
  };

  return (
    <MyCampaignsView
      campaigns={data ?? []}
      isLoading={isLoading || !userId}
      isError={isError}
      deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
      onDelete={handleDelete}
    />
  );
}
