"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  RotateCcw,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/user";
import { exportAdminUsersCsv } from "@/lib/csv/admin-exports";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { AdminUserRow } from "@/types/admin";

const PAGE_SIZE = 10;

export function AdminUsersView({ users }: { users: AdminUserRow[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const stats = useMemo(
    () => ({
      total: users.length,
      business: users.filter((user) => user.role === "business_owner").length,
      suspended: users.filter((user) => user.isArchived).length,
      newThisWeek: users.filter((user) => {
        const joined = new Date(user.joinedAt).getTime();
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return joined >= weekAgo;
      }).length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        term.length === 0 ||
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.isArchived) ||
        (statusFilter === "suspended" && user.isArchived);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No users match your current filters to export.");
      return;
    }

    try {
      const { count, filename } = exportAdminUsersCsv(filtered);
      toast.success(`Exported ${count} user${count === 1 ? "" : "s"} to ${filename}.`);
    } catch {
      toast.error("Failed to export users. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#1A365D]">User Management</h1>
          <p className="text-sm text-slate-500">
            View and manage all registered SAWA users.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Download className="size-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminStatCard label="Total Users" value={stats.total.toLocaleString()} />
        <AdminStatCard
          label="Business Accounts"
          value={stats.business}
          valueClassName="text-amber-600"
        />
        <AdminStatCard
          label="Suspended"
          value={stats.suspended}
          valueClassName="text-red-600"
        />
        <AdminStatCard
          label="New This Week"
          value={stats.newThisWeek}
          valueClassName="text-emerald-600"
        />
      </div>

      <Card className="border border-slate-100 bg-white p-4 shadow-sm ring-0 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="h-10 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value ?? "all")}>
              <SelectTrigger className="h-10 w-36">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Community</SelectItem>
                <SelectItem value="business_owner">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
              <SelectTrigger className="h-10 w-36">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setStatusFilter("all");
                setPage(1);
              }}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Campaigns</th>
                <th className="py-3 pr-4">Joined</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-[#1A365D] text-xs font-semibold text-white">
                        {getInitials(user.fullName)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#2D3748]">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        user.role === "business_owner"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {user.role === "business_owner" ? "Business" : "Community"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-sm text-slate-500">
                    {user.campaignCount}
                  </td>
                  <td className="py-4 pr-4 text-sm text-slate-500">
                    {user.joinedAt}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        user.isArchived
                          ? "bg-red-50 text-red-700"
                          : "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {user.isArchived ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" aria-label={`View ${user.fullName}`}>
                        <Eye className="size-4" />
                      </button>
                      <button type="button" aria-label={`Suspend ${user.fullName}`}>
                        {user.isArchived ? (
                          <UserCheck className="size-4" />
                        ) : (
                          <UserX className="size-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Showing {paginated.length === 0 ? 0 : pageStart + 1}–
            {pageStart + paginated.length} of {filtered.length} users
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-md border border-slate-200 p-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-8 rounded-md bg-[#1A365D] px-2 py-1 text-center text-xs font-medium text-white">
              {currentPage}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-md border border-slate-200 p-1.5 disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
