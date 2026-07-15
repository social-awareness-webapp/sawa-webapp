import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, Target, User, Users } from "lucide-react";

import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCampaignByIdOrSlug } from "@/lib/campaigns/get-campaign";

type CampaignDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Approved",
  pending: "Pending Review",
  rejected: "Rejected",
  draft: "Draft",
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

export async function generateMetadata({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const campaign = await getCampaignByIdOrSlug(id);

  if (!campaign) {
    return {
      title: "Campaign Not Found | SAWA",
    };
  }

  return {
    title: `${campaign.title} | SAWA`,
    description: campaign.description,
  };
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const { id } = await params;
  const campaign = await getCampaignByIdOrSlug(id);

  if (!campaign || campaign.isArchived) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/dashboard/my-campaigns"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#2B6CB0] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to My Campaigns
        </Link>
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
              <Badge className="absolute top-4 left-4 border-0 bg-white/90 text-[#2D3748] shadow-sm">
                {campaign.category}
              </Badge>
            ) : null}
            <Badge className="absolute top-4 right-4 border-0 bg-[#1A365D]/90 text-white shadow-sm">
              {STATUS_LABELS[campaign.status] ?? campaign.status}
            </Badge>
          </div>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#2D3748]">
                {campaign.title}
              </h1>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        <span className="text-slate-400">{icon}</span>
        {label}
      </p>
      <p className="text-sm text-slate-600">{children}</p>
    </div>
  );
}
