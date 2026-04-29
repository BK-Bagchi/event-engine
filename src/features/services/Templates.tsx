import { useNavigate } from "react-router-dom";
import { FileText, Activity, Tag } from "lucide-react";
//prettier-ignore
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { useServiceTemplates } from "@/hooks/queries/template";
import BackButton from "@/components/button/BackButton";
import { Skeleton } from "@/components/ui/skeleton";

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

// ── Main component ────────────────────────────────────────────
const Templates = ({
  projectId,
  serviceId,
}: {
  projectId: string;
  serviceId: string;
}) => {
  const navigate = useNavigate();
  const { templates, loadingTemplates } = useServiceTemplates({
    projectId,
    serviceId,
  });

  if (loadingTemplates) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-6 py-6">
        <Skeleton className="h-8 w-32 bg-[#1A2235]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <Empty className="border border-dashed border-[#2A3550] bg-[#1A2235]/50 min-h-85">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="size-12 bg-[#2A3550] rounded-xl"
          >
            <FileText size={22} className="text-zinc-400" />
          </EmptyMedia>
          <EmptyTitle className="text-zinc-200 text-base">
            No templates yet
          </EmptyTitle>
          <EmptyDescription className="text-zinc-500">
            No templates have been created for this service.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 py-6">
      {/* Back button */}
      <BackButton to="/dashboard/services" text="Back to Services" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="bg-[#1A2235] border border-[#2A3550] ring-0 hover:border-brand-blue/40 transition-colors"
          >
            <CardHeader className="border-b border-[#2A3550] pb-3">
              <CardTitle className="text-zinc-100 text-sm font-semibold truncate">
                {template.name}
              </CardTitle>
              <CardDescription>
                <StatusBadge status={template.status} />
              </CardDescription>
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
            </CardContent>

            <CardFooter className="bg-transparent border-t border-[#2A3550] flex items-center justify-end">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs bg-transparent border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] hover:text-white"
                onClick={() =>
                  navigate(`/dashboard/templates/${projectId}/${template.id}`)
                }
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;
