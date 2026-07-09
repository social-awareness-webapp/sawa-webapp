import { AdminCampaignsView } from "@/components/admin/AdminCampaignsView";
import { getAdminCampaigns } from "@/lib/admin/get-admin-campaigns";

export default async function AdminPendingCampaignsPage() {
  const campaigns = await getAdminCampaigns({ status: "pending" });

  return <AdminCampaignsView campaigns={campaigns} mode="pending" />;
}
