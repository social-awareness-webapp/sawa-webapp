"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/services/profile.service";
import { toast } from "@/lib/toast";

type ProfileChangePasswordFormProps = {
  email: string;
};

const MIN_PASSWORD_LENGTH = 8;

export function ProfileChangePasswordForm({
  email,
}: ProfileChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!currentPassword) {
      const message = "Please enter your current password.";
      setError(message);
      toast.error(message);
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      const message = `Your new password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
      setError(message);
      toast.error(message);
      return;
    }

    if (newPassword !== confirmPassword) {
      const message = "Your new passwords do not match.";
      setError(message);
      toast.error(message);
      return;
    }

    setIsSaving(true);

    try {
      await changePassword({ email, currentPassword, newPassword });
      toast.success("Your password has been updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while updating your password.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
      <h3 className="text-base font-semibold text-[#1A365D]">Change Password</h3>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="h-10"
            autoComplete="current-password"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Create a new password"
            className="h-10"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            className="h-10"
            autoComplete="new-password"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1A365D] transition-colors hover:bg-slate-50 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSaving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </Card>
  );
}
