import { useNavigate } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import BackButton from "@/components/button/BackButton";
import { useProjectTemplates } from "@/hooks/queries/template";
import TemplateCard from "@/components/templates/TemplateCard";

// ── Skeleton for back button ──────────────────────────────────
const BackButtonSkeleton = () => (
  <Skeleton className="h-5 w-32 bg-[#2A3550] rounded" />
);

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

  const { templates, loadingTemplates } = useProjectTemplates({ projectId });

  return (
    <div className="flex flex-col gap-6 py-6">
      {loadingTemplates ? (
        <BackButtonSkeleton />
      ) : (
        <BackButton to="/dashboard/projects" text="Back to Projects" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingTemplates ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : templates.length === 0 ? (
          <EmptyState />
        ) : (
          templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDetails={() =>
                navigate(`/dashboard/templates/${projectId}/${template.id}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Templates;
