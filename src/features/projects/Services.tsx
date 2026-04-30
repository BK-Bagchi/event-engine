import { useNavigate } from "react-router-dom";
import { ServerCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import BackButton from "@/components/button/BackButton";
import { useProjectServices } from "@/hooks/queries/service";
import ServiceCard from "@/components/services/ServiceCard";

// ── Skeleton for back button ──────────────────────────────────
const BackButtonSkeleton = () => (
  <Skeleton className="h-5 w-32 bg-[#2A3550] rounded" />
);

// ── Empty state ───────────────────────────────────────────────
const EmptyState = () => (
  <Empty className="col-span-3 border-[#2A3550] bg-[#1A2235]/50">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <ServerCog className="text-zinc-600" />
      </EmptyMedia>
      <EmptyTitle className="text-zinc-400">No services configured</EmptyTitle>
      <EmptyDescription className="text-zinc-600">
        This project has no email services set up yet. Add a service to start
        sending emails.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);

// ── Main component ────────────────────────────────────────────
const Services = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();

  const { services, loadingServices } = useProjectServices({ projectId });

  return (
    <div className="flex flex-col gap-6 py-6">
      {loadingServices ? (
        <BackButtonSkeleton />
      ) : (
        <BackButton to="/dashboard/projects" text="Back to Projects" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingServices ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : services.length === 0 ? (
          <EmptyState />
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
