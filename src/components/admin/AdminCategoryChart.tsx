"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { AdminCategorySlice } from "@/types/admin";

type AdminCategoryChartProps = {
  data: AdminCategorySlice[];
};

export function AdminCategoryChart({ data }: AdminCategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
        No campaigns available to chart yet.
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={2}
            stroke="#ffffff"
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.category} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              borderColor: "#e2e8f0",
              fontSize: "0.875rem",
            }}
            formatter={(value, name) => {
              const count = Number(value);
              const percent = ((count / total) * 100).toFixed(1);
              return [`${count} (${percent}%)`, name];
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
