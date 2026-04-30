import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ServerCog } from "lucide-react";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import type { Project } from "@/types/project";
import { CreateServiceForm } from "@/forms/CreateServiceForm";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { useAllServices } from "@/hooks/queries/service";
import ServiceCard from "@/components/services/ServiceCard";

// ── Main component ────────────────────────────────────────────
const Services = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { services, loadingServices } = useAllServices();

  const openProjectPreview = (project: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Services</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage email provider services across your projects.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold flex items-center gap-2"
        >
          <Plus size={16} />
          Create New Service
        </Button>
      </div>

      {/* Grid */}
      {loadingServices ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <Empty className="border border-dashed border-[#2A3550] bg-[#1A2235]/50 min-h-85">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="size-12 bg-[#2A3550] rounded-xl"
            >
              <ServerCog size={22} className="text-zinc-400" />
            </EmptyMedia>
            <EmptyTitle className="text-zinc-200 text-base">
              No services yet
            </EmptyTitle>
            <EmptyDescription className="text-zinc-500">
              You haven't configured any email services. Create one to start
              sending emails.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDetails={() =>
                navigate(
                  `/dashboard/services/${service.project._id}/${service.id}`,
                )
              }
              onProjectPreview={openProjectPreview}
            />
          ))}
        </div>
      )}

      {/* Project Preview Drawer */}
      <ProjectPreviewDrawer
        project={selectedProject}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedProject(null);
        }}
      />

      {/* Create Service Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A2235] border border-[#2A3550] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-lg">
              Create New Service
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Configure a new email provider service for your project.
            </DialogDescription>
          </DialogHeader>
          <CreateServiceForm onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
