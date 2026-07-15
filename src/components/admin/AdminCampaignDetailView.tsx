import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Target,
  User,
  Users,
} from "lucide-react";

import { AdminCampaignStatusBadge, AdminCategoryBadge } from "@/components/admin/admin-badges";
import { Card, CardContent } from "@/components/ui/card";
import type { CampaignDetail } from "@/types/campaign";

type AdminCampaignDetailViewProps = {
  campaign: CampaignDetail;
  organiserName: string;
  organiserEmail: string;
  backHref: string;
  backLabel: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function documentName(url: string, index: number) {
  try {
    const path = new URL(url).pathname;
    const last = decodeURIComponent(path.split("/").pop() ?? "");
    return last || `Document ${index + 1}`;
  } catch {
    return `Document ${index + 1}`;
  }
}

function tierLabel(tier: string | null) {
  if (tier === "premium") return "Premium";
  if (tier === "featured") return "Featured";
  if (tier === "standard") return "Standard";
  return "—";
}

export function AdminCampaignDetailView({
  campaign,
  organiserName,
  organiserEmail,
  backHref,
  backLabel,
}: AdminCampaignDetailViewProps) {
  const isBusiness = campaign.campaignType === "business";

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
        <h1 className="text-2xl font-bold text-[#1A365D]">Campaign Details</h1>
        <p className="text-sm text-slate-500">
          Review the full submission before approving or rejecting.
        </p>
      </div>

      <Card className="overflow-hidden border border-slate-100 py-0 shadow-sm ring-0">
        <div
          className="relative h-56 bg-slate-100 bg-cover bg-center"
          style={
            campaign.bannerImageUrl
              ? { backgroundImage: `url(${campaign.bannerImageUrl})` }
              : undefined
          }
        >
          {campaign.category ? (
            <div className="absolute top-4 left-4">
              <AdminCategoryBadge category={campaign.category} />
            </div>
          ) : null}
          <div className="absolute top-4 right-4">
            <AdminCampaignStatusBadge
              status={
                campaign.status as
                  | "pending"
                  | "approved"
                  | "rejected"
                  | "draft"
              }
            />
          </div>
        </div>

        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#2D3748]">{campaign.title}</h2>
            {campaign.organization ? (
              <p className="flex items-center gap-1.5 text-sm text-slate-500">
                <User className="size-4" />
                By {campaign.organization}
              </p>
            ) : null}
          </div>

          <p className="text-base leading-relaxed whitespace-pre-line text-slate-600">
            {campaign.description}
          </p>

          <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
            <DetailRow label="Organiser" value={organiserName} />
            <DetailRow label="Organiser Email" value={organiserEmail} />
            <DetailRow
              label="Campaign Type"
              value={isBusiness ? "Business" : "Community"}
            />
            <DetailRow label="Campaign ID" value={campaign.id} />
          </div>

          {isBusiness ? (
            <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
              <DetailRow
                label="Sponsorship Tier"
                value={tierLabel(campaign.sponsorshipTier)}
              />
              <DetailRow
                label="Preferred Duration"
                value={campaign.preferredDuration ?? "—"}
              />
            </div>
          ) : null}

          {!isBusiness ? (
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#2B6CB0]"
                  style={{ width: `${campaign.progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-slate-500">
                {campaign.progressPercent}% of goal
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            {campaign.goal ? (
              <DetailRow icon={<Target className="size-4" />} label="Goal">
                {campaign.goal}
              </DetailRow>
            ) : null}
            {campaign.targetAudience ? (
              <DetailRow icon={<Users className="size-4" />} label="Target Audience">
                {campaign.targetAudience}
              </DetailRow>
            ) : null}
            <DetailRow
              icon={<CalendarDays className="size-4" />}
              label="Start Date"
            >
              {formatDate(campaign.startDate)}
            </DetailRow>
            <DetailRow
              icon={<CalendarDays className="size-4" />}
              label="End Date"
            >
              {formatDate(campaign.endDate)}
            </DetailRow>
          </div>

          {campaign.supportingDocuments.length > 0 ? (
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <p className="text-sm font-semibold text-[#2D3748]">
                Supporting Documents
              </p>
              <ul className="space-y-2">
                {campaign.supportingDocuments.map((url, index) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#2B6CB0] hover:underline"
                    >
                      <FileText className="size-4" />
                      {documentName(url, index)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-t border-slate-100 pt-6">
            <Link
              href={`/admin/users/${campaign.createdBy}?from=campaigns`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2B6CB0] hover:underline"
            >
              <User className="size-4" />
              View organiser profile
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        {label}
      </p>
      <p className="text-sm text-slate-600">{children ?? value ?? "—"}</p>
    </div>
  );
}
