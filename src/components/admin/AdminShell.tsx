import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminNavCounts } from "@/lib/admin/get-admin-campaigns";
import { getCurrentUserProfile } from "@/lib/supabase/server";

export async function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "super_admin") {
    redirect("/unauthorized");
  }

  const counts = await getAdminNavCounts();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <AdminHeader displayName={profile.fullName} />
      <div className="flex flex-1">
        <AdminSidebar counts={counts} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
