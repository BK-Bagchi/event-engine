import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
//prettier-ignore
import { Plus, Mail, Server, Zap, Send, Layers, Activity, Star, ServerCog } from "lucide-react";
//prettier-ignore
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { ServiceAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { ServiceWithProject } from "@/types/service";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import type { Project } from "@/types/project";
import { CreateServiceForm } from "@/forms/CreateServiceForm";
import CardSkeleton from "@/components/skeleton/CardSkeleton";

// ── Provider config ───────────────────────────────────────────
const providerConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  GMAIL: {
    icon: <Mail size={13} />,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
  },
  OUTLOOK: {
    icon: <Mail size={13} />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
  },
  SMTP: {
    icon: <Server size={13} />,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/25",
  },
  RESEND: {
    icon: <Zap size={13} />,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/25",
  },
  SENDGRID: {
    icon: <Send size={13} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
  },
};

const ProviderBadge = ({ providerType }: { providerType: string }) => {
  const cfg = providerConfig[providerType] ?? {
    icon: <Layers size={13} />,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/25",
  };
  return (
    <span
      className={`w-fit inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide border ${cfg.bg} ${cfg.color} ${cfg.border}`}
    >
      {cfg.icon}
      {providerType}
    </span>
  );
};

// ── Status badge ──────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  INACTIVE: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  SUSPENDED: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase() ?? "INACTIVE";
  return (
    <span
      className={`w-fit inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[s] ?? statusStyles.INACTIVE}`}
    >
      <Activity size={10} />
      {s.toLowerCase()}
    </span>
  );
};

// ── Default badge ─────────────────────────────────────────────
const DefaultBadge = () => (
  <span className="w-fit inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
    <Star size={10} className="fill-amber-400" />
    Default
  </span>
);

// ── Card Skeleton ─────────────────────────────────────────────

// ── Main component ────────────────────────────────────────────
const Services = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: services = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ServiceWithProject[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await ServiceAPI.getAllServices();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) {
      const msg = getErrorMessage(error) || "Failed to load services.";
      toast.error(msg, { position: "top-right" });
    }
  }, [isError, error]);

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
      {isLoading ? (
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
            <Card
              key={service.id}
              className="bg-[#1A2235] border border-[#2A3550] ring-0 hover:border-brand-blue/40 transition-colors flex flex-col"
            >
              <CardHeader className="border-b border-[#2A3550] pb-3">
                <div className="flex flex-col gap-3">
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    {/* Left side */}
                    <div className="flex items-center gap-2 min-w-0">
                      <CardTitle className="text-zinc-100 text-sm font-semibold truncate">
                        {service.name}
                      </CardTitle>

                      {service.isDefault && <DefaultBadge />}
                    </div>

                    {/* Right side */}
                    <button
                      onClick={() =>
                        service.project && openProjectPreview(service.project)
                      }
                      className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors shrink-0"
                    >
                      Preview
                    </button>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={service.status} />
                    <ProviderBadge providerType={service.providerType} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between gap-2 flex-1 py-3">
                {/* Project row */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Layers size={12} className="shrink-0" />
                  <span className="truncate text-zinc-400">
                    {service.project?.name ?? "—"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-[#2A3550] bg-[#1A2235]">
                <div className="mt-auto flex justify-end">
                  <button className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors">
                    Details
                  </button>
                </div>
              </CardFooter>
            </Card>
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
          <CreateServiceForm
            fetchServices={() => {
              refetch();
            }}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
