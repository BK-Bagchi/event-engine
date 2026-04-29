import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LayoutTemplate } from "lucide-react";
import { TemplateAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { Template } from "@/types/template";
//prettier-ignore
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import BackButton from "@/components/button/BackButton";

// ── Skeleton for back button ──────────────────────────────────
const BackButtonSkeleton = () => (
  <Skeleton className="h-5 w-32 bg-[#2A3550] rounded" />
);

// ── Status badge ──────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  DRAFT: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  ARCHIVED: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase() ?? "DRAFT";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyle[s] ?? statusStyle["DRAFT"]}`}
    >
      {s.toLowerCase()}
    </span>
  );
};

// ── Category badge ────────────────────────────────────────────
const categoryStyle: Record<string, string> = {
  CONTACT: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  AUTO_REPLY: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  SUPPORT: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  BOOKING: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
  CUSTOM: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
};

const CategoryBadge = ({ category }: { category: string }) => {
  const c = category?.toUpperCase() ?? "CUSTOM";
  const label = c.replace("_", " ").toLowerCase();
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${categoryStyle[c] ?? categoryStyle["CUSTOM"]}`}
    >
      {label}
    </span>
  );
};

// ── Empty state ───────────────────────────────────────────────
const EmptyState = () => (
  <Empty className="col-span-3 border-[#2A3550] bg-[#1A2235]/50">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <LayoutTemplate className="text-zinc-600" />
      </EmptyMedia>
      <EmptyTitle className="text-zinc-400">No templates configured</EmptyTitle>
      <EmptyDescription className="text-zinc-600">
        This project has no email templates set up yet. Create a template to
        customize your emails.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);

// ── Main component ────────────────────────────────────────────
const Templates = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();

  const {
    data: templates = [],
    isLoading,
    isError,
    error,
  } = useQuery<Template[]>({
    queryKey: ["project-templates", projectId],
    queryFn: async () => {
      const res = await TemplateAPI.getProjectTemplates(projectId);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) {
      const msg = getErrorMessage(error) || "Failed to load templates.";
      toast.error(msg, { position: "top-right" });
    }
  }, [isError, error]);

  return (
    <div className="flex flex-col gap-6 py-6">
      {isLoading ? (
        <BackButtonSkeleton />
      ) : (
        <BackButton to="/dashboard/projects" text="Back to Projects" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : templates.length === 0 ? (
          <EmptyState />
        ) : (
          templates.map((template) => (
            <Card
              key={template.id}
              className="bg-[#1A2235] border-[#2A3550] flex flex-col justify-between"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white leading-snug">
                  {template.name}
                </CardTitle>
                {template.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {template.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pb-2">
                <CategoryBadge category={template.category} />
                <StatusBadge status={template.status} />
              </CardContent>
              <CardFooter className="pt-2 border-t border-[#2A3550]">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/dashboard/projects/${projectId}/templates/${template.id}`,
                    )
                  }
                  className="border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] hover:text-white text-xs"
                >
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Templates;
