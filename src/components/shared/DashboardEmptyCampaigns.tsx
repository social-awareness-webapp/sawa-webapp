import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardEmptyCampaigns() {
  return (
    <Card className="border border-slate-100 bg-white p-10 shadow-sm ring-0">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-slate-100 text-[#1A365D]">
          <Megaphone className="size-6" />
        </span>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[#1A365D]">
            No campaigns yet
          </h2>
          <p className="max-w-sm text-sm text-slate-500">
            You haven&apos;t posted any campaigns yet. Create your first campaign
            to start rallying support in your community.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-1 gap-2 bg-[#1A365D] px-4 text-white hover:bg-[#2a4a7f]"
          )}
        >
          <Plus className="size-4" />
          New Campaign
        </Link>
      </div>
    </Card>
  );
}
