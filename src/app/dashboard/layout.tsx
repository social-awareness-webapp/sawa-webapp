import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { DashboardHelpButton } from "@/components/shared/DashboardHelpButton";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { getCurrentUserProfile } from "@/lib/supabase/server";
import { getInitials } from "@/lib/user";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  const displayName = profile.fullName;
  const initials = getInitials(profile.fullName);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <DashboardHeader displayName={displayName} initials={initials} />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
      <DashboardHelpButton />
    </div>
  );
}
