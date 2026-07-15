"use client";

import { BadgeCheck, Mail, Pencil } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getInitials, getRoleLabel } from "@/lib/user";
import type { ProfileDetail } from "@/types/profile";

type ProfileHeaderCardProps = {
  profile: ProfileDetail;
};

export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const initials = getInitials(profile.fullName);
  const roleLabel = getRoleLabel(profile.role);

  const scrollToPersonalInfo = () => {
    const section = document.getElementById("personal-information");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#1A365D] text-xl font-semibold text-white">
            {initials}
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#1A365D]">
              {profile.fullName}
            </h2>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="size-4" />
              {profile.email}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  <BadgeCheck className="size-3.5" />
                  Verified
                </span>
              ) : null}
              <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToPersonalInfo}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1A365D] transition-colors hover:bg-slate-50 sm:self-auto"
        >
          <Pencil className="size-4" />
          Edit Profile
        </button>
      </div>
    </Card>
  );
}
