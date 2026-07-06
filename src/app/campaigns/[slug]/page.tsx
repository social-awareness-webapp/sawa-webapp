import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";

import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCampaignBySlug } from "@/lib/campaigns";

type CampaignDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: CampaignDetailPageProps) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);

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
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/#featured-campaigns"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#2B6CB0] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to campaigns
        </Link>
        <Card className="overflow-hidden border border-slate-100 py-0 shadow-sm ring-0">
          <div className="relative h-56 bg-slate-100">
            <Badge className="absolute top-4 left-4 border-0 bg-white/90 text-[#2D3748] shadow-sm">
              {campaign.category}
            </Badge>
          </div>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#2D3748]">
                {campaign.title}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-slate-500">
                <User className="size-4" />
                By {campaign.organization}
              </p>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
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
                {campaign.progressPercent}% of goal · {campaign.daysLeft} days
                left
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
