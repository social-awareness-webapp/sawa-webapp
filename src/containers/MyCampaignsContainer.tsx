"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MyCampaignsView } from "@/components/shared/MyCampaignsView";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAuth } from "@/providers/AuthProvider";
import { archiveCampaign, fetchMyCampaigns } from "@/services/campaigns.service";
import type { OwnerCampaign } from "@/types/dashboard";

export function MyCampaignsContainer() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [pendingCampaign, setPendingCampaign] = useState<OwnerCampaign | null>(
    null
  );

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
      setPendingCampaign(null);
    },
  });

  const confirmDelete = () => {
    if (pendingCampaign) {
      deleteMutation.mutate(pendingCampaign.id);
    }
  };

  const requestDelete = (campaign: OwnerCampaign) => {
    deleteMutation.reset();
    setPendingCampaign(campaign);
  };

  return (
    <>
      <MyCampaignsView
        campaigns={data ?? []}
        isLoading={isLoading || !userId}
        isError={isError}
        deletingId={
          deleteMutation.isPending ? (pendingCampaign?.id ?? null) : null
        }
        onDelete={requestDelete}
      />

      <ConfirmDialog
        open={pendingCampaign !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingCampaign(null);
          }
        }}
        onConfirm={confirmDelete}
        title="Delete campaign"
        description="Are you sure you want to delete this campaign?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={deleteMutation.isPending}
        errorMessage={
          deleteMutation.isError
            ? (deleteMutation.error as Error).message
            : null
        }
        tone="danger"
      />
    </>
  );
}
