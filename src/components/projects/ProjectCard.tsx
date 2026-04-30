import { Activity, BarChart2 } from "lucide-react";
//prettier-ignore
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

// ── Status badge ──────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  INACTIVE: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  SUSPENDED: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase() ?? "INACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[s] ?? statusStyles.INACTIVE}`}
    >
      <Activity size={10} />
      {s.toLowerCase()}
    </span>
  );
};

// ── Component ─────────────────────────────────────────────────
interface ProjectCardProps {
  project: Project;
  onPreview: () => void;
  onDetails: () => void;
}

const ProjectCard = ({ project, onPreview, onDetails }: ProjectCardProps) => {
  return (
    <Card className="bg-[#1A2235] border border-[#2A3550] ring-0 hover:border-brand-blue/40 transition-colors">
      <CardHeader className="border-b border-[#2A3550] pb-3">
        <CardTitle className="text-zinc-100 text-sm font-semibold truncate">
          {project.name}
        </CardTitle>
        <CardDescription>
          <StatusBadge status={project.status} />
        </CardDescription>
        <CardAction>
          <button
            onClick={onPreview}
            className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
          >
            Preview
          </button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-3">
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed min-h-10">
          {project.description || (
            <span className="italic text-zinc-600">
              No description provided.
            </span>
          )}
        </p>
      </CardContent>

      <CardFooter className="bg-transparent border-t border-[#2A3550] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <BarChart2 size={13} className="text-zinc-500" />
          <span>
            {project.usageStats?.totalRequests?.toLocaleString() ?? 0} requests
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs bg-transparent border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] hover:text-white"
          onClick={onDetails}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
