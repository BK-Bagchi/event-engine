import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/button/BackButton";
import { CreateNewButton } from "@/components/button/CreateNewButton";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreateTemplateForm } from "@/forms/CreateTemplateForm";
import { useProjectTemplates } from "@/hooks/queries/template";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplatesEmpty from "@/components/empty/TemplatesEmpty";
import TemplatesSkeleton from "@/components/skeleton/TemplatesSkeleton";

const Templates = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

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
      <div className="flex items-center justify-between">
        <BackButton to="/dashboard/projects" text="Back to Projects" />
        <CreateNewButton
          onClick={() => setDialogOpen(true)}
          title="Create New Template"
        />
      </div>
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

      {/* Create Template Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0D1220] border-[#2A3550] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              Create New Template
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Add a new email template to your project.
            </DialogDescription>
          </DialogHeader>
          <CreateTemplateForm
            projectId={projectId}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
