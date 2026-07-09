import { notFound } from "next/navigation";

import { AdminUserDetailView } from "@/components/admin/AdminUserDetailView";
import { getAdminUserDetail } from "@/lib/admin/get-admin-user-detail";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

function resolveBackNavigation(from?: string) {
  if (from === "business-accounts") {
    return {
      backHref: "/admin/business-accounts",
      backLabel: "Back to Business Accounts",
    };
  }

  if (from === "campaigns" || from === "pending-campaigns") {
    return {
      backHref:
        from === "pending-campaigns"
          ? "/admin/pending-campaigns"
          : "/admin/campaigns",
      backLabel:
        from === "pending-campaigns"
          ? "Back to Pending Campaigns"
          : "Back to All Campaigns",
    };
  }

  return {
    backHref: "/admin/users",
    backLabel: "Back to User Management",
  };
}

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: AdminUserDetailPageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const user = await getAdminUserDetail(id);

  if (!user) {
    notFound();
  }

  const navigation = resolveBackNavigation(from);

  return (
    <AdminUserDetailView
      user={user}
      backHref={navigation.backHref}
      backLabel={navigation.backLabel}
    />
  );
}
