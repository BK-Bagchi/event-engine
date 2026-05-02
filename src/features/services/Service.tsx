import ProjectSection from "@/components/services/ProjectSection";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";
import StatusSection from "@/components/services/StatusSection";
import BackButton from "@/components/button/BackButton";
import { useService } from "@/hooks/queries/service";
import ServiceSkeleton from "@/components/skeleton/ServiceSkeleton";

const ServiceDetail = ({
  projectId,
  serviceId,
}: {
  projectId: string;
  serviceId: string;
}) => {
  const { service, loadingService } = useService({ projectId, serviceId });

  // ── Loading skeleton ───────────────────────────────────────
  if (loadingService) return <ServiceSkeleton />;

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
        <BackButton to="/dashboard/services" text="Back to Services" />

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
