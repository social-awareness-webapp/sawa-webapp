import { SidebarNav } from "@/components/shared/SidebarNav";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-100 bg-white md:block">
      <SidebarNav />
    </aside>
  );
}
