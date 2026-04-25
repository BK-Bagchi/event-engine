import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { ServiceAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { Service } from "@/types/service";
import ProjectSection from "@/components/services/ProjectSection";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";
import StatusSection from "@/components/services/StatusSection";

// ── Skeleton placeholder ──────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[#2A3550]/60 ${className}`} />
);

const ServiceDetail = ({
  projectId,
  serviceId,
}: {
  projectId: string;
  serviceId: string;
}) => {
  const navigate = useNavigate();

  const {
    data: service,
    isLoading,
    isError,
    error,
  } = useQuery<Service>({
    queryKey: ["service", projectId, serviceId],
    queryFn: async () => {
      const res = await ServiceAPI.getService(projectId, serviceId);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) {
      const msg = getErrorMessage(error) || "Failed to load service.";
      toast.error(msg, { position: "top-right" });
    }
  }, [isError, error]);

  // ── Loading skeleton ───────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] py-6 flex flex-col gap-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard/services")}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Back to Services
        </button>

        {/* ── Section 1 — Assigned Project ─────────────────── */}
        <ProjectSection project={service.project} />

        {/* ── Section 2 — Service Info ──────────────────────── */}
        <ServiceInfoSection projectId={projectId} service={service} />

        {/* ── Section 3 — Status ───────────────────────────── */}
        <StatusSection
          projectId={projectId}
          serviceId={serviceId}
          initialStatus={service.status}
        />
      </div>
    </div>
  );
};

export default ServiceDetail;
