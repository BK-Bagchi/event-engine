import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateNewButton } from "@/components/button/CreateNewButton";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import type { Project } from "@/types/project";
import { CreateServiceForm } from "@/forms/CreateServiceForm";
import { useAllServices } from "@/hooks/queries/service";
import ServiceCard from "@/components/services/ServiceCard";
import ServicesEmpty from "@/components/empty/ServicesEmpty";
import ServicesSkeleton from "@/components/skeleton/ServicesSkeleton";

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
        <CreateNewButton
          onClick={() => setDialogOpen(true)}
          title="Create New Service"
        />
      </div>

      {/* Grid */}
      {loadingServices ? (
        <ServicesSkeleton />
      ) : services.length === 0 ? (
        <ServicesEmpty />
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
