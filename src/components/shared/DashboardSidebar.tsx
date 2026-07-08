"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Megaphone,
  PlusCircle,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Only the dashboard route exists today; the remaining destinations are
// placeholders (`#`) until their pages are built.
const navItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "My Campaigns", href: "#", icon: Megaphone },
  { label: "Post a Campaign", href: "#", icon: PlusCircle },
  { label: "Profile", href: "#", icon: User },
  { label: "Settings", href: "#", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-100 bg-white md:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href !== "#" &&
            (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-100 text-[#1A365D]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#1A365D]"
              )}
            >
              <Icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
