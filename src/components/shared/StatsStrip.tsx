import type { StatItem } from "@/types/campaign";

type StatsStripProps = {
  stats: StatItem[];
};

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <section className="bg-[#2B6CB0] py-4">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center text-white">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
