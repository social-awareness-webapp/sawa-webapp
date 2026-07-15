import { AdminBusinessAccountsView } from "@/components/admin/AdminBusinessAccountsView";
import { getAdminBusinessAccounts } from "@/lib/admin/get-admin-business-accounts";

export default async function AdminBusinessAccountsPage() {
  const accounts = await getAdminBusinessAccounts();

  return <AdminBusinessAccountsView accounts={accounts} />;
}
