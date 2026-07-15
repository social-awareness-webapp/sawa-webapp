"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Megaphone,
  PlusCircle,
  User,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNavItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "My Campaigns", href: "/dashboard/my-campaigns", icon: Megaphone },
  { label: "Post a Campaign", href: "/campaigns/new", icon: PlusCircle },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  // Highlight only the most specific matching item.
  const activeHref = dashboardNavItems
    .map((item) => item.href)
    .filter(
      (href) =>
        href !== "#" && (pathname === href || pathname.startsWith(`${href}/`)),
    )
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav className="flex flex-col gap-1 p-4">
      {dashboardNavItems.map((item) => {
        const isActive = item.href !== "#" && item.href === activeHref;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-100 text-[#1A365D]"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#1A365D]",
            )}
          >
            <Icon className="size-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
