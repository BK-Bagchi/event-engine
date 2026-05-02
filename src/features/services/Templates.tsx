import { useNavigate } from "react-router-dom";
import { useServiceTemplates } from "@/hooks/queries/template";
import BackButton from "@/components/button/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplatesEmpty from "@/components/empty/TemplatesEmpty";
import TemplatesSkeleton from "@/components/skeleton/TemplatesSkeleton";

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

  if (loadingTemplates)
    return (
      <>
        <Skeleton className="h-5 w-32 bg-[#2A3550] rounded my-6" />
        <TemplatesSkeleton />
      </>
    );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 py-6">
      {/* Back button */}
      <BackButton to="/dashboard/services" text="Back to Services" />
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
