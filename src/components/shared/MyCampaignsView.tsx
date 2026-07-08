"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LayoutGrid,
  List,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardCampaignStatus, OwnerCampaign } from "@/types/dashboard";

type StatusFilter = "all" | DashboardCampaignStatus;
type SortKey = "newest" | "oldest" | "title";
type ViewMode = "list" | "grid";

type MyCampaignsViewProps = {
  campaigns: OwnerCampaign[];
  isLoading: boolean;
  isError: boolean;
  deletingId: string | null;
  onDelete: (campaign: OwnerCampaign) => void;
};

const PAGE_SIZE = 8;

const FILTER_ORDER: StatusFilter[] = [
  "all",
  "approved",
  "pending",
  "rejected",
  "draft",
];

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  draft: "Draft",
};

const statusStyles: Record<
  DashboardCampaignStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  pending: {
    label: "Pending Review",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

const categoryStyles: Record<string, string> = {
  Environment: "bg-emerald-50 text-emerald-700",
  Education: "bg-violet-50 text-violet-700",
  Community: "bg-amber-50 text-amber-700",
  Health: "bg-sky-50 text-sky-700",
};

function StatusBadge({ status }: { status: DashboardCampaignStatus }) {
  const { label, className } = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        className
      )}
    >
      {label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryStyles[category] ?? "bg-slate-100 text-slate-600"
      )}
    >
      {category}
    </span>
  );
}

function CampaignActions({
  campaign,
  deletingId,
  onDelete,
}: {
  campaign: OwnerCampaign;
  deletingId: string | null;
  onDelete: (campaign: OwnerCampaign) => void;
}) {
  const isDeleting = deletingId === campaign.id;

  return (
    <div className="flex items-center gap-3 text-slate-400">
      <Link
        href={`/campaigns/${campaign.id}`}
        aria-label={`View ${campaign.title}`}
        className="transition-colors hover:text-[#2B6CB0]"
      >
        <Eye className="size-4" />
      </Link>
      <Link
        href={`/campaigns/${campaign.id}/edit`}
        aria-label={`Edit ${campaign.title}`}
        className="transition-colors hover:text-[#2B6CB0]"
      >
        <Pencil className="size-4" />
      </Link>
      <button
        type="button"
        aria-label={`Delete ${campaign.title}`}
        onClick={() => onDelete(campaign)}
        disabled={isDeleting}
        className="text-red-400 transition-colors hover:text-red-600 disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
      </button>
    </div>
  );
}

export function MyCampaignsView({
  campaigns,
  isLoading,
  isError,
  deletingId,
  onDelete,
}: MyCampaignsViewProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);

  const changeStatusFilter = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeSort = (value: SortKey) => {
    setSort(value);
    setPage(1);
  };

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      all: campaigns.length,
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
    };

    for (const campaign of campaigns) {
      base[campaign.status] += 1;
    }

    return base;
  }, [campaigns]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = campaigns.filter((campaign) => {
      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;
      const matchesSearch =
        term.length === 0 ||
        campaign.title.toLowerCase().includes(term) ||
        (campaign.category?.toLowerCase().includes(term) ?? false);

      return matchesStatus && matchesSearch;
    });

    result.sort((a, b) => {
      if (sort === "title") {
        return (a.title ?? "").localeCompare(b.title ?? "");
      }

      const compare = (a.submittedDate ?? "").localeCompare(
        b.submittedDate ?? ""
      );
      return sort === "newest" ? -compare : compare;
    });

    return result;
  }, [campaigns, statusFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#1A365D] sm:text-2xl">
            My Campaigns
          </h1>
          <p className="text-sm text-slate-500">
            Manage and track all your submitted campaigns.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className={cn(
            buttonVariants({ variant: "default" }),
            "gap-2 self-start bg-[#1A365D] text-white hover:bg-[#2a4a7f]"
          )}
        >
          <Plus className="size-4" />
          New Campaign
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_ORDER.map((filter) => {
          const isActive = statusFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => changeStatusFilter(filter)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#1A365D] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {FILTER_LABELS[filter]} ({counts[filter]})
            </button>
          );
        })}
      </div>

      <Card className="border border-slate-100 bg-white p-4 shadow-sm ring-0 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search campaigns by title or category..."
              className="h-10 rounded-lg border-slate-200 pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={sort}
              onValueChange={(value) => changeSort(value as SortKey)}
            >
              <SelectTrigger className="h-10 w-36 rounded-lg border-slate-200 px-3 text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "list"
                    ? "bg-[#1A365D] text-white"
                    : "text-slate-400 hover:text-[#1A365D]"
                )}
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "grid"
                    ? "bg-[#1A365D] text-white"
                    : "text-slate-400 hover:text-[#1A365D]"
                )}
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <MessageState message="We couldn't load your campaigns right now. Please try again in a moment." />
          ) : filtered.length === 0 ? (
            <MessageState
              message={
                search.trim() || statusFilter !== "all"
                  ? "No campaigns match your filters."
                  : "You haven't created any campaigns yet."
              }
            />
          ) : view === "list" ? (
            <CampaignsTable
              campaigns={paginated}
              deletingId={deletingId}
              onDelete={onDelete}
            />
          ) : (
            <CampaignsGrid
              campaigns={paginated}
              deletingId={deletingId}
              onDelete={onDelete}
            />
          )}
        </div>

        {!isLoading && !isError && filtered.length > 0 ? (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400">
              Showing {paginated.length} of {filtered.length} campaigns
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="min-w-8 rounded-md bg-[#1A365D] px-2 py-1 text-center text-xs font-medium text-white">
                {currentPage}
              </span>
              <button
                type="button"
                aria-label="Next page"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage >= totalPages}
                className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function CampaignsTable({
  campaigns,
  deletingId,
  onDelete,
}: {
  campaigns: OwnerCampaign[];
  deletingId: string | null;
  onDelete: (campaign: OwnerCampaign) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            <th className="py-3 pr-4 font-semibold">Campaign Title</th>
            <th className="py-3 pr-4 font-semibold">Category</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Submitted</th>
            <th className="py-3 pr-4 font-semibold">End Date</th>
            <th className="py-3 pr-4 font-semibold">Supporters</th>
            <th className="py-3 pr-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr
              key={campaign.id}
              className="border-b border-slate-50 last:border-0"
            >
              <td className="py-4 pr-4 text-sm font-medium text-[#2D3748]">
                {campaign.title}
              </td>
              <td className="py-4 pr-4">
                <CategoryBadge category={campaign.category} />
              </td>
              <td className="py-4 pr-4">
                <StatusBadge status={campaign.status} />
              </td>
              <td className="py-4 pr-4 text-sm text-slate-500">
                {campaign.submittedDate || "—"}
              </td>
              <td className="py-4 pr-4 text-sm text-slate-500">
                {campaign.endDate ?? "—"}
              </td>
              <td className="py-4 pr-4 text-sm text-slate-500">
                {campaign.supporters ?? "—"}
              </td>
              <td className="py-4 pr-4">
                <CampaignActions
                  campaign={campaign}
                  deletingId={deletingId}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CampaignsGrid({
  campaigns,
  deletingId,
  onDelete,
}: {
  campaigns: OwnerCampaign[];
  deletingId: string | null;
  onDelete: (campaign: OwnerCampaign) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.id}
          className="flex flex-col gap-3 border border-slate-100 p-4 shadow-sm ring-0"
        >
          <div className="flex items-start justify-between gap-2">
            <CategoryBadge category={campaign.category} />
            <StatusBadge status={campaign.status} />
          </div>
          <h3 className="text-sm font-semibold text-[#2D3748]">
            {campaign.title}
          </h3>
          <div className="space-y-1 text-xs text-slate-500">
            <p>Submitted: {campaign.submittedDate || "—"}</p>
            <p>End: {campaign.endDate ?? "—"}</p>
            <p>Supporters: {campaign.supporters ?? "—"}</p>
          </div>
          <div className="mt-auto border-t border-slate-50 pt-3">
            <CampaignActions
              campaign={campaign}
              deletingId={deletingId}
              onDelete={onDelete}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-lg bg-slate-50"
        />
      ))}
    </div>
  );
}

function MessageState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-sm text-slate-500">{message}</div>
  );
}
