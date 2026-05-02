import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/button/BackButton";
import { useProjectTemplates } from "@/hooks/queries/template";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplatesEmpty from "@/components/empty/TemplatesEmpty";
import TemplatesSkeleton from "@/components/skeleton/TemplatesSkeleton";

const Templates = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();

  const { templates, loadingTemplates } = useProjectTemplates({ projectId });
  if (loadingTemplates)
    return (
      <>
        <Skeleton className="h-5 w-32 bg-[#2A3550] rounded my-6" />
        <TemplatesSkeleton />
      </>
    );

  return (
    <div className="flex flex-col gap-6 py-6">
      <BackButton to="/dashboard/projects" text="Back to Projects" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <TemplatesEmpty />
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
