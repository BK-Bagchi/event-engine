import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/button/BackButton";
import { useProjectServices } from "@/hooks/queries/service";
import ServiceCard from "@/components/services/ServiceCard";
import ServicesEmpty from "@/components/empty/ServicesEmpty";
import ServicesSkeleton from "@/components/skeleton/ServicesSkeleton";

const Services = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();

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
      <BackButton to="/dashboard/projects" text="Back to Projects" />
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
    </div>
  );
};

export default Services;
