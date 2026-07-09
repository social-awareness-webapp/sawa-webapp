import { AdminCampaignsView } from "@/components/admin/AdminCampaignsView";
import { getAdminCampaigns } from "@/lib/admin/get-admin-campaigns";

export default async function AdminAllCampaignsPage() {
  const campaigns = await getAdminCampaigns({
    status: ["pending", "approved", "rejected"],
  });

  return <AdminCampaignsView campaigns={campaigns} mode="all" />;
}
