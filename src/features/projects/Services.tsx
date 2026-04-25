import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ServerCog, ArrowLeft } from "lucide-react";
import { ServiceAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { Service } from "@/types/service";
//prettier-ignore
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import CardSkeleton from "@/components/skeleton/CardSkeleton";

// ── Status badge ──────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  INACTIVE: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  SUSPENDED: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase() ?? "INACTIVE";
  return (
    <span
      className={`w-fit inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyle[s] ?? statusStyle["INACTIVE"]}`}
    >
      {s.toLowerCase()}
    </span>
  );
};

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

  const {
    data: services = [],
    isLoading,
    isError,
    error,
  } = useQuery<Service[]>({
    queryKey: ["project-services", projectId],
    queryFn: async () => {
      const res = await ServiceAPI.getProjectServices(projectId);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) {
      const msg = getErrorMessage(error) || "Failed to load services.";
      toast.error(msg, { position: "top-right" });
    }
  }, [isError, error]);

  return (
    <div className="flex flex-col gap-6 py-6">
      {isLoading ? (
        <BackButtonSkeleton />
      ) : (
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : services.length === 0 ? (
          <EmptyState />
        ) : (
          services.map((service) => (
            <Card
              key={service.id}
              className="bg-[#1A2235] border-[#2A3550] flex flex-col justify-between"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white leading-snug">
                  {service.name}
                </CardTitle>
                <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                  {service.providerType}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pb-2">
                <StatusBadge status={service.status} />
                {service.isDefault && (
                  <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 w-fit">
                    Default
                  </span>
                )}
              </CardContent>
              <CardFooter className="pt-2 border-t border-[#2A3550] bg-[#1A2235]">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/dashboard/projects/${projectId}/services/${service.id}`,
                    )
                  }
                  className="border-[#2A3550] bg-[#2a344b] hover:bg-[#2A3550] text-white text-xs"
                >
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Services;
