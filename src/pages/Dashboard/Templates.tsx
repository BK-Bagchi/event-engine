import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { CreateNewButton } from "@/components/button/CreateNewButton";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import ServicePreviewDrawer from "@/components/drawer/ServicePreview";
import { CreateTemplateForm } from "@/forms/CreateTemplateForm";
import type { Project } from "@/types/project";
import type { Service } from "@/types/service";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { useAllTemplates } from "@/hooks/queries/template";
import TemplateCard from "@/components/templates/TemplateCard";

// ── Main component ────────────────────────────────────────────
const Templates = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceDrawerOpen, setServiceDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { templates, loadingTemplates: isLoading } = useAllTemplates();

  const openProjectPreview = (project: Project) => {
    setSelectedProject(project);
    setProjectDrawerOpen(true);
  };

  const openServicePreview = (service: Service) => {
    setSelectedService(service);
    setServiceDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Templates</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage and monitor your email templates.
          </p>
        </div>
        <CreateNewButton
          onClick={() => setDialogOpen(true)}
          title="Create New Template"
        />
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : templates.length === 0 ? (
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
                You haven't created any templates yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onDetails={() =>
                  navigate(
                    `/dashboard/templates/${template.project._id}/${template.id}`,
                  )
                }
                onProjectPreview={openProjectPreview}
                onServicePreview={openServicePreview}
              />
            ))}
          </div>
        )}

        {/* Project Preview Drawer */}
        <ProjectPreviewDrawer
          project={selectedProject}
          open={projectDrawerOpen}
          onClose={() => {
            setProjectDrawerOpen(false);
            setSelectedProject(null);
          }}
        />

        {/* Service Preview Drawer */}
        <ServicePreviewDrawer
          service={selectedService}
          open={serviceDrawerOpen}
          onClose={() => {
            setServiceDrawerOpen(false);
            setSelectedService(null);
          }}
        />
      </div>

      {/* Create Template Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A2235] border border-[#2A3550] text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-lg">
              Create New Template
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Configure a new email template for your project and service.
            </DialogDescription>
          </DialogHeader>
          <CreateTemplateForm onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
