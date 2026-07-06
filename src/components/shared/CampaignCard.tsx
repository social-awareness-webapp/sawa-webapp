import Link from "next/link";
import { User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Campaign } from "@/types/campaign";

type CampaignCardProps = {
  campaign: Campaign;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card className="overflow-hidden border border-slate-100 py-0 shadow-sm ring-0">
      <div className="relative h-40 bg-slate-100">
        <Badge className="absolute top-3 left-3 border-0 bg-white/90 text-[#2D3748] shadow-sm">
          {campaign.category}
        </Badge>
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#2D3748]">
            {campaign.title}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <User className="size-3.5" />
            By {campaign.organization}
          </p>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {campaign.description}
          </p>
        </div>
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2B6CB0] transition-all"
              style={{ width: `${campaign.progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {campaign.progressPercent}% of goal · {campaign.daysLeft} days left
          </p>
        </div>
        <Link
          href={`/campaigns/${campaign.slug}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f]"
          )}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}
