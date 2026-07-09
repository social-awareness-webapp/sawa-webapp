"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  ShieldCheck,
  UserPlus,
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
import { cn } from "@/lib/utils";
import type { AdminBusinessAccountRow } from "@/types/admin";

const PAGE_SIZE = 10;

function tierLabel(tier: string | null) {
  if (tier === "premium") return "Premium";
  if (tier === "featured") return "Featured";
  return "Standard";
}

function tierClassName(tier: string | null) {
  if (tier === "premium") return "bg-[#1A365D] text-white";
  if (tier === "featured") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

export function AdminBusinessAccountsView({
  accounts,
}: {
  accounts: AdminBusinessAccountRow[];
}) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const stats = useMemo(
    () => ({
      total: accounts.length,
      pending: accounts.filter((account) => !account.isVerified).length,
      premium: accounts.filter((account) => account.sponsorshipTier === "premium")
        .length,
      featured: accounts.filter(
        (account) => account.sponsorshipTier === "featured"
      ).length,
    }),
    [accounts]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        term.length === 0 ||
        account.businessName.toLowerCase().includes(term) ||
        account.contactEmail.toLowerCase().includes(term);
      const matchesTier =
        tierFilter === "all" || account.sponsorshipTier === tierFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && account.isVerified) ||
        (statusFilter === "pending" && !account.isVerified);

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [accounts, search, tierFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1A365D]">Business Accounts</h1>
        <p className="text-sm text-slate-500">
          Manage verified and pending business partners.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminStatCard label="Total Businesses" value={stats.total} />
        <AdminStatCard
          label="Pending Verification"
          value={stats.pending}
          valueClassName="text-amber-600"
        />
        <AdminStatCard label="Premium Tier" value={stats.premium} />
        <AdminStatCard label="Featured Tier" value={stats.featured} />
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
              placeholder="Search businesses..."
              className="h-10 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={tierFilter} onValueChange={(value) => setTierFilter(value ?? "all")}>
              <SelectTrigger className="h-10 w-32">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
              <SelectTrigger className="h-10 w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="py-3 pr-4">Business</th>
                <th className="py-3 pr-4">Tier</th>
                <th className="py-3 pr-4">Campaigns</th>
                <th className="py-3 pr-4">Joined</th>
                <th className="py-3 pr-4">Verified</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((account) => (
                <tr key={account.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-[#1A365D]">
                        {account.businessName.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#2D3748]">
                          {account.businessName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {account.contactEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        tierClassName(account.sponsorshipTier)
                      )}
                    >
                      {tierLabel(account.sponsorshipTier)}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-sm text-slate-500">
                    {account.campaignCount}
                  </td>
                  <td className="py-4 pr-4 text-sm text-slate-500">
                    {account.joinedAt}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        account.isVerified
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {account.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" aria-label={`View ${account.businessName}`}>
                        <Eye className="size-4" />
                      </button>
                      {!account.isVerified ? (
                        <button
                          type="button"
                          aria-label={`Verify ${account.businessName}`}
                        >
                          <UserPlus className="size-4 text-emerald-500" />
                        </button>
                      ) : (
                        <button type="button" aria-label="Verified business">
                          <ShieldCheck className="size-4 text-emerald-500" />
                        </button>
                      )}
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
            {pageStart + paginated.length} of {filtered.length} businesses
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
