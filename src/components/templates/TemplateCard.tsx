import { Activity, Tag, FolderOpen, Layers } from "lucide-react";
//prettier-ignore
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Template } from "@/types/template";
import type { Project } from "@/types/project";
import type { Service } from "@/types/service";

// ── Status badge ──────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  DRAFT: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  ARCHIVED: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase() ?? "DRAFT";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[s] ?? statusStyles.DRAFT}`}
    >
      <Activity size={10} />
      {s.toLowerCase()}
    </span>
  );
};

// ── Category badge ────────────────────────────────────────────
const categoryStyles: Record<string, string> = {
  CONTACT: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
  AUTO_REPLY: "bg-purple-500/10 text-purple-400 border border-purple-500/25",
  SUPPORT: "bg-orange-500/10 text-orange-400 border border-orange-500/25",
  BOOKING: "bg-teal-500/10 text-teal-400 border border-teal-500/25",
  CUSTOM: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/25",
};

const CategoryBadge = ({ category }: { category: string }) => {
  const c = category?.toUpperCase() ?? "CUSTOM";
  const label = c.replace("_", " ");
  return (
    <span
      className={`w-fit inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${categoryStyles[c] ?? categoryStyles.CUSTOM}`}
    >
      <Tag size={10} />
      {label.toLowerCase()}
    </span>
  );
};

// ── Component ─────────────────────────────────────────────────
interface TemplateCardProps {
  template: Template;
  onDetails: () => void;
  onProjectPreview?: (project: Project) => void;
  onServicePreview?: (service: Service) => void;
}

const TemplateCard = ({
  template,
  onDetails,
  onProjectPreview,
  onServicePreview,
}: TemplateCardProps) => {
  const hasProject = !!template.project;
  const hasService = !!template.service;
  const hasProjectName = !!template.project?.name;
  const hasServiceName = !!template.service?.name;

  return (
    <Card className="bg-[#1A2235] border border-[#2A3550] ring-0 hover:border-brand-blue/40 transition-colors">
      <CardHeader className="border-b border-[#2A3550] pb-3">
        <CardTitle className="text-zinc-100 text-sm font-semibold truncate">
          {template.name}
        </CardTitle>
        <CardDescription>
          <StatusBadge status={template.status} />
        </CardDescription>
        {(hasProject || hasService) && (
          <CardAction className="flex items-center gap-1.5">
            {hasProject && onProjectPreview && (
              <button
                onClick={() => onProjectPreview(template.project)}
                className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
              >
                Project
              </button>
            )}
            {hasService && onServicePreview && (
              <button
                onClick={() => onServicePreview(template.service!)}
                className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
              >
                Service
              </button>
            )}
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="pt-3 flex flex-col gap-2">
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed min-h-8">
          {template.description || (
            <span className="italic text-zinc-600">
              No description provided.
            </span>
          )}
        </p>
        <CategoryBadge category={template.category} />
        {(hasProjectName || hasServiceName) && (
          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
            {hasProjectName && (
              <span className="flex items-center gap-1">
                <FolderOpen size={11} />
                <span className="truncate max-w-34">
                  {template.project!.name}
                </span>
              </span>
            )}
            {hasServiceName && (
              <span className="flex items-center gap-1">
                <Layers size={11} />
                <span className="truncate max-w-34">
                  {template.service!.name}
                </span>
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-transparent border-t border-[#2A3550] flex items-center justify-end">
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

export default TemplateCard;
