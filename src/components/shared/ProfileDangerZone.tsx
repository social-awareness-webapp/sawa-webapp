"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Card } from "@/components/ui/card";
import { archiveAccount } from "@/services/profile.service";

type ProfileDangerZoneProps = {
  userId: string;
};

export function ProfileDangerZone({ userId }: ProfileDangerZoneProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await archiveAccount(userId);
      router.refresh();
      router.push("/");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Something went wrong while deleting your account."
      );
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border border-red-200 bg-white p-6 shadow-sm ring-0">
      <h3 className="text-base font-semibold text-red-600">Danger Zone</h3>
      <p className="mt-1 text-sm text-slate-500">
        Permanently delete your account and all associated data. This action
        cannot be undone.
      </p>

      <button
        type="button"
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
        className="mt-4 inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        Delete My Account
      </button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleConfirm}
        title="Delete your account?"
        description="This will permanently deactivate your account and you will be signed out. This action cannot be undone."
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        errorMessage={error}
        tone="danger"
      />
    </Card>
  );
}
