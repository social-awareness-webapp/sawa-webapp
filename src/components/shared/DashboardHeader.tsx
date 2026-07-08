import Link from "next/link";
import { Megaphone } from "lucide-react";

import { DashboardMobileNav } from "@/components/shared/DashboardMobileNav";
import { DashboardUserMenu } from "@/components/shared/DashboardUserMenu";

type DashboardHeaderProps = {
  displayName: string;
  initials: string;
};

export function DashboardHeader({
  displayName,
  initials,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <DashboardMobileNav />
          <Link href="/dashboard" className="flex items-center gap-2">
            <Megaphone className="size-5 text-[#1A365D]" />
            <span className="text-lg font-bold text-[#1A365D]">SAWA</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span
            className="relative grid size-9 place-items-center rounded-full text-slate-400"
            aria-hidden
          ></span>
          <DashboardUserMenu displayName={displayName} initials={initials} />
        </div>
      </div>
    </header>
  );
}
