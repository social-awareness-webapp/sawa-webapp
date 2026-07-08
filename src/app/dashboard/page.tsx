import type { Metadata } from "next";

import { DashboardContainer } from "@/containers/DashboardContainer";
import { getCurrentUserProfile } from "@/lib/supabase/server";
import { getFirstName, getGreeting } from "@/lib/user";

export const metadata: Metadata = {
  title: "Dashboard | SAWA",
  description: "Manage your awareness campaigns on SAWA.",
};

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();
  const firstName = getFirstName(profile?.fullName);
  const greeting = getGreeting();

  return <DashboardContainer greeting={greeting} firstName={firstName} />;
}
