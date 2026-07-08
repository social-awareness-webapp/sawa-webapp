import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileActivityCard } from "@/components/shared/ProfileActivityCard";
import { ProfileChangePasswordForm } from "@/components/shared/ProfileChangePasswordForm";
import { ProfileDangerZone } from "@/components/shared/ProfileDangerZone";
import { ProfileHeaderCard } from "@/components/shared/ProfileHeaderCard";
import { ProfilePersonalInfoForm } from "@/components/shared/ProfilePersonalInfoForm";
import { getProfileActivity, getProfileDetail } from "@/lib/profile/get-profile";

export const metadata: Metadata = {
  title: "My Profile | SAWA",
  description: "Manage your personal information and account settings.",
};

export default async function ProfilePage() {
  const profile = await getProfileDetail();

  if (!profile) {
    redirect("/login");
  }

  const activity = await getProfileActivity(profile.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#1A365D] sm:text-2xl">
          My Profile
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal information and account settings.
        </p>
      </div>

      <ProfileHeaderCard profile={profile} />
      <ProfilePersonalInfoForm profile={profile} />
      <ProfileActivityCard activity={activity} />
      <ProfileChangePasswordForm email={profile.email} />
      <ProfileDangerZone userId={profile.id} />
    </div>
  );
}
