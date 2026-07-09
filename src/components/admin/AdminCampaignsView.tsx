"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import {
  AdminCampaignStatusBadge,
  AdminCategoryBadge,
  AdminOrganiserRoleBadge,
  formatRelativeTime,
} from "@/components/admin/admin-badges";
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
import { reviewCampaign } from "@/services/admin.service";
import { cn } from "@/lib/utils";
import type { AdminCampaignRow, AdminCampaignStatus } from "@/types/admin";

type AdminCampaignsViewProps = {
  campaigns: AdminCampaignRow[];
  mode: "pending" | "all";
};

const PAGE_SIZE = 10;

const ALL_STATUSES: AdminCampaignStatus[] = [
  "pending",
  "approved",
  "rejected",
];

export function AdminCampaignsView({ campaigns, mode }: AdminCampaignsViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    mode === "pending" ? "pending" : "all"
  );
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return {
      pending: campaigns.filter((c) => c.status === "pending").length,
      approvedToday: campaigns.filter(
        (c) => c.status === "approved" && c.createdAt.slice(0, 10) === today
      ).length,
      rejectedToday: campaigns.filter(
        (c) => c.status === "rejected" && c.createdAt.slice(0, 10) === today
      ).length,
    };
  }, [campaigns]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesSearch =
        term.length === 0 ||
        campaign.title.toLowerCase().includes(term) ||
        campaign.organiserName.toLowerCase().includes(term) ||
        campaign.organiserEmail.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || campaign.category === categoryFilter;
      const matchesType =
        typeFilter === "all" || campaign.campaignType === typeFilter;

      const matchesMode =
        mode === "all"
          ? ALL_STATUSES.includes(campaign.status as AdminCampaignStatus)
          : campaign.status === "pending";

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesType &&
        matchesMode
      );
    });
  }, [campaigns, search, statusFilter, categoryFilter, typeFilter, mode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleReview = async (
    campaignId: string,
    decision: "approved" | "rejected"
  ) => {
    setReviewingId(campaignId);
    setError(null);

    try {
      await reviewCampaign(campaignId, decision);
      router.refresh();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Failed to update campaign status."
      );
    } finally {
      setReviewingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter(mode === "pending" ? "pending" : "all");
    setCategoryFilter("all");
    setTypeFilter("all");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#1A365D]">
            {mode === "pending" ? "Pending Campaigns" : "All Campaigns"}
          </h1>
          <p className="text-sm text-slate-500">
            {mode === "pending"
              ? "Review and approve submitted campaigns."
              : "Complete campaign registry across all statuses."}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      {mode === "pending" ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AdminStatCard label="Pending" value={stats.pending} />
          <AdminStatCard
            label="Approved Today"
            value={stats.approvedToday}
            valueClassName="text-emerald-600"
          />
          <AdminStatCard
            label="Rejected Today"
            value={stats.rejectedToday}
            valueClassName="text-red-600"
          />
          <AdminStatCard label="Avg Review Time" value="1.8d" />
        </div>
      ) : null}

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
              placeholder={
                mode === "pending"
                  ? "Search by title, organiser..."
                  : "Search campaigns..."
              }
              className="h-10 pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mode === "all" ? (
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value ?? "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-36">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            ) : null}
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value ?? "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value ?? "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="social">Community</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="py-3 pr-4">Campaign Title</th>
                <th className="py-3 pr-4">Organiser</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Submitted</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((campaign) => {
                const isReviewing = reviewingId === campaign.id;

                return (
                  <tr
                    key={campaign.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="max-w-[220px] py-4 pr-4 text-sm font-medium text-[#2D3748]">
                      <span className="line-clamp-1">{campaign.title}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-[#1A365D]">
                          {campaign.organiserName.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#2D3748]">
                            {campaign.organiserName}
                          </p>
                          <AdminOrganiserRoleBadge
                            role={campaign.organiserRole}
                            campaignType={campaign.campaignType}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <AdminCategoryBadge category={campaign.category} />
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-500">
                      {formatRelativeTime(campaign.createdAt)}
                    </td>
                    <td className="py-4 pr-4">
                      <AdminCampaignStatusBadge status={campaign.status} />
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="transition-colors hover:text-[#2B6CB0]"
                          aria-label={`View ${campaign.title}`}
                        >
                          <Eye className="size-4" />
                        </Link>
                        {campaign.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              disabled={isReviewing}
                              onClick={() =>
                                handleReview(campaign.id, "approved")
                              }
                              className="text-emerald-500 transition-colors hover:text-emerald-700 disabled:opacity-50"
                              aria-label={`Approve ${campaign.title}`}
                            >
                              {isReviewing ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Check className="size-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={isReviewing}
                              onClick={() =>
                                handleReview(campaign.id, "rejected")
                              }
                              className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                              aria-label={`Reject ${campaign.title}`}
                            >
                              <X className="size-4" />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginated.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              No campaigns match your filters.
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Showing {paginated.length === 0 ? 0 : pageStart + 1}–
            {pageStart + paginated.length} of {filtered.length} campaigns
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
