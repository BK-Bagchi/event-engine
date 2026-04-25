import { useState } from "react";
//prettier-ignore
import { ServerCog, Pencil, Mail, Server, Zap, Send, Layers, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EditServiceForm } from "@/forms/EditServiceForm";
import type { Service } from "@/types/service";

interface ServiceInfoSectionProps {
  projectId: string;
  service: Service;
}
// ── Provider badge ────────────────────────────────────────────
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

const ServiceInfoSection = ({
  projectId,
  service,
}: ServiceInfoSectionProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <div className="flex items-center gap-2 mb-5">
          <ServerCog size={15} className="text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Service Information
          </h2>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3 min-w-0">
            {/* Name */}
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-widest text-zinc-500">
                Name
              </p>
              <p className="text-base font-semibold text-zinc-100 truncate">
                {service.name}
              </p>
            </div>

            {/* Provider */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] uppercase tracking-widest text-zinc-500">
                Provider
              </p>
              <ProviderBadge providerType={service.providerType} />
            </div>

            {/* Default */}
            {service.isDefault && (
              <span className="w-fit inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Star size={10} className="fill-amber-400" />
                Default Service
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
            className="shrink-0 border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] gap-1.5 hover:text-white"
          >
            <Pencil size={13} />
            Edit
          </Button>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#1A2235] border-[#2A3550] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Service</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Update the service name, provider type, and default setting.
            </DialogDescription>
          </DialogHeader>
          <EditServiceForm
            projectId={projectId}
            service={service}
            setEditDialogOpen={setEditDialogOpen}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceInfoSection;
