import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { ProfileActivityCard } from "@/components/shared/ProfileActivityCard";
import { Card } from "@/components/ui/card";
import { getInitials, getRoleLabel } from "@/lib/user";
import { cn } from "@/lib/utils";
import type { AdminUserDetail } from "@/types/admin";

type AdminUserDetailViewProps = {
  user: AdminUserDetail;
  backHref: string;
  backLabel: string;
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </p>
      <p className="text-sm text-slate-700">{value || "—"}</p>
    </div>
  );
}

export function AdminUserDetailView({
  user,
  backHref,
  backLabel,
}: AdminUserDetailViewProps) {
  const initials = getInitials(user.fullName);
  const roleLabel = getRoleLabel(user.role);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-[#2B6CB0] hover:underline"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1A365D]">User Profile</h1>
        <p className="text-sm text-slate-500">
          Review account details and campaign activity.
        </p>
      </div>

      <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#1A365D] text-xl font-semibold text-white">
            {initials}
          </span>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#1A365D]">{user.fullName}</h2>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="size-4" />
              {user.email}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
                <BadgeCheck className="size-3.5" />
                {roleLabel}
              </span>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                  user.isArchived
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-700"
                )}
              >
                {user.isArchived ? "Suspended" : "Active"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
        <h3 className="text-base font-semibold text-[#1A365D]">
          Personal Information
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <DetailField label="First Name" value={user.firstName} />
          <DetailField label="Last Name" value={user.lastName} />
          <DetailField label="Joined" value={user.joinedAt} />
          <DetailField
            label="Phone"
            value={user.phone}
          />
          <DetailField label="Location" value={user.location} />
          <div className="space-y-1 sm:col-span-2">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Bio
            </p>
            <p className="text-sm whitespace-pre-line text-slate-700">
              {user.bio || "—"}
            </p>
          </div>
        </div>
      </Card>

      {user.role === "business_owner" ? (
        <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
          <h3 className="text-base font-semibold text-[#1A365D]">
            Business Profile
          </h3>
          {user.businessProfile ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                {user.businessProfile.logoUrl ? (
                  <img
                    src={user.businessProfile.logoUrl}
                    alt={`${user.businessProfile.businessName} logo`}
                    className="size-14 rounded-full border border-slate-100 object-cover"
                  />
                ) : (
                  <span className="grid size-14 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-[#1A365D]">
                    {getInitials(user.businessProfile.businessName)}
                  </span>
                )}
                <div>
                  <p className="font-semibold text-[#1A365D]">
                    {user.businessProfile.businessName}
                  </p>
                  {user.businessProfile.contactEmail ? (
                    <p className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Mail className="size-4" />
                      {user.businessProfile.contactEmail}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField
                  label="Website"
                  value={user.businessProfile.website}
                />
                <DetailField
                  label="Social Handle"
                  value={user.businessProfile.socialMediaHandle}
                />
                <DetailField
                  label="Brand Color"
                  value={user.businessProfile.brandAccentColor}
                />
              </div>
              {user.businessProfile.website ? (
                <a
                  href={user.businessProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#2B6CB0] hover:underline"
                >
                  <Globe className="size-4" />
                  Visit website
                </a>
              ) : null}
              {user.businessProfile.description ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    Description
                  </p>
                  <p className="text-sm whitespace-pre-line text-slate-700">
                    {user.businessProfile.description}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No business profile has been created yet.
            </p>
          )}
        </Card>
      ) : null}

      <ProfileActivityCard activity={user.activity} />

      <Card className="border border-slate-100 bg-white p-6 shadow-sm ring-0">
        <h3 className="text-base font-semibold text-[#1A365D]">Contact</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <Mail className="size-4 text-slate-400" />
            {user.email}
          </p>
          {user.phone ? (
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-slate-400" />
              {user.phone}
            </p>
          ) : null}
          {user.location ? (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-slate-400" />
              {user.location}
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
