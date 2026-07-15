"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AdminDailySubmission } from "@/types/admin";

type AdminSubmissionsChartProps = {
  data: AdminDailySubmission[];
};

export function AdminSubmissionsChart({ data }: AdminSubmissionsChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
        No campaign submissions in the last 30 days.
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ fill: "rgba(26, 54, 93, 0.06)" }}
            contentStyle={{
              borderRadius: "0.5rem",
              borderColor: "#e2e8f0",
              fontSize: "0.875rem",
            }}
            formatter={(value) => [value, "Submissions"]}
            labelFormatter={(_, payload) => {
              const item = payload?.[0]?.payload as AdminDailySubmission | undefined;
              return item?.date ?? "";
            }}
          />
          <Bar dataKey="count" fill="#1A365D" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
