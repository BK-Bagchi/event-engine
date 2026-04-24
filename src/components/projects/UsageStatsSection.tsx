import { BarChart3 } from "lucide-react";
import type { UsageStats } from "@/types/project";

interface UsageStatsSectionProps {
  usageStats: UsageStats;
}

const stats: {
  key: keyof UsageStats;
  label: string;
  colorClass: string;
  dotClass: string;
}[] = [
  {
    key: "totalRequests",
    label: "Total Requests",
    colorClass: "text-blue-400",
    dotClass: "bg-blue-400",
  },
  {
    key: "totalSent",
    label: "Sent",
    colorClass: "text-green-400",
    dotClass: "bg-green-400",
  },
  {
    key: "totalFailed",
    label: "Failed",
    colorClass: "text-red-400",
    dotClass: "bg-red-400",
  },
  {
    key: "totalBlocked",
    label: "Blocked",
    colorClass: "text-yellow-400",
    dotClass: "bg-yellow-400",
  },
];

const UsageStatsSection = ({ usageStats }: UsageStatsSectionProps) => {
  return (
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 size={15} className="text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-200">
          Usage Statistics
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ key, label, colorClass, dotClass }) => (
          <div
            key={key}
            className="flex flex-col gap-1.5 p-4 rounded-lg bg-[#0B1120] border border-[#2A3550]"
          >
            <div className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full shrink-0 ${dotClass}`} />
              <span className="text-[11px] uppercase tracking-wider text-zinc-500">
                {label}
              </span>
            </div>
            <span className={`text-2xl font-semibold ${colorClass}`}>
              {(usageStats[key] ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsageStatsSection;
