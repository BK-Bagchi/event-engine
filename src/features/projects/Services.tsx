import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/button/BackButton";
import { CreateNewButton } from "@/components/button/CreateNewButton";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreateServiceForm } from "@/forms/CreateServiceForm";
import { useProjectServices } from "@/hooks/queries/service";
import ServiceCard from "@/components/services/ServiceCard";
import ServicesEmpty from "@/components/empty/ServicesEmpty";
import ServicesSkeleton from "@/components/skeleton/ServicesSkeleton";

const Services = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { services, loadingServices } = useProjectServices({ projectId });
  if (loadingServices)
    return (
      <>
        <Skeleton className="h-5 w-32 bg-[#2A3550] rounded my-6" />
        <ServicesSkeleton />
      </>
    );

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <BackButton to="/dashboard/projects" text="Back to Projects" />
        <CreateNewButton
          onClick={() => setDialogOpen(true)}
          title="Create New Service"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.length === 0 ? (
          <ServicesEmpty />
        ) : (
          services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDetails={() =>
                navigate(`/dashboard/services/${projectId}/${service.id}`)
              }
            />
          ))
        )}
      </div>

      {/* Create Service Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0D1220] border-[#2A3550] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Service</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Add a new email service to your project.
            </DialogDescription>
          </DialogHeader>
          <CreateServiceForm
            projectId={projectId}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
