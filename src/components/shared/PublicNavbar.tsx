import Link from "next/link";
import { Megaphone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Megaphone className="size-5 text-[#1A365D]" />
          <span className="text-lg font-bold text-[#1A365D]">SAWA</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#featured-campaigns"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1A365D]"
          >
            Campaigns
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1A365D]"
          >
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-[#1A365D] hover:bg-[#1A365D]/5"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-[#1A365D] text-white hover:bg-[#2a4a7f]"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
