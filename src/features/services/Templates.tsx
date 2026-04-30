import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { useServiceTemplates } from "@/hooks/queries/template";
import BackButton from "@/components/button/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import TemplateCard from "@/components/templates/TemplateCard";

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
          <TemplateCard
            key={template.id}
            template={template}
            onDetails={() =>
              navigate(`/dashboard/templates/${projectId}/${template.id}`)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Templates;
