"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutGrid,
  Megaphone,
  Shield,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminNavCounts } from "@/types/admin";

type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  badge?: number;
};

type AdminSidebarProps = {
  counts: AdminNavCounts;
};

export function AdminSidebar({ counts }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems: AdminNavItem[] = [
    { label: "Overview", href: "/admin", icon: LayoutGrid },
    {
      label: "Pending Campaigns",
      href: "/admin/pending-campaigns",
      icon: Megaphone,
      badge: counts.pendingCampaigns,
    },
    { label: "All Campaigns", href: "/admin/campaigns", icon: Megaphone },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Business Accounts", href: "/admin/business-accounts", icon: Briefcase },
  ];

  const activeHref = navItems
    .map((item) => item.href)
    .filter(
      (href) => pathname === href || pathname.startsWith(`${href}/`)
    )
    .sort((a, b) => b.length - a.length)[0];

  return (
    <aside className="hidden w-64 shrink-0 bg-[#0B1F3A] text-slate-200 md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <Shield className="size-5 text-amber-400" />
        <span className="text-lg font-bold text-white">SAWA Admin</span>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4.5" />
                {item.label}
              </span>
              {item.badge && item.badge > 0 ? (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
