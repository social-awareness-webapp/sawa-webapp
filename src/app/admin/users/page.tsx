import { AdminUsersView } from "@/components/admin/AdminUsersView";
import { getAdminUsers } from "@/lib/admin/get-admin-users";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return <AdminUsersView users={users} />;
}
