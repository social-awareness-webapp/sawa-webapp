import { AdminCampaignsView } from "@/components/admin/AdminCampaignsView";
import {
  getAdminCampaigns,
  getAdminReviewStats,
} from "@/lib/admin/get-admin-campaigns";

export default async function AdminPendingCampaignsPage() {
  const [campaigns, reviewStats] = await Promise.all([
    getAdminCampaigns({ status: "pending" }),
    getAdminReviewStats(),
  ]);

  return (
    <AdminCampaignsView
      campaigns={campaigns}
      mode="pending"
      reviewStats={reviewStats}
    />
  );
}
