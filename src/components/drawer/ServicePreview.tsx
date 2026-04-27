import { Activity, Mail, Server, Send, Star, X, Zap } from "lucide-react";
//prettier-ignore
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import type { Service } from "@/types/service";

// ── Provider icon map ────────────────────────────────────────
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

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  INACTIVE: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  SUSPENDED: "bg-red-500/15 text-red-400 border border-red-500/30",
};

// ── Info row ─────────────────────────────────────────────────
const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-[11px] uppercase tracking-widest text-zinc-500">
      {label}
    </p>
    {children}
  </div>
);

const ServicePreview = ({
  service,
  open,
  onClose,
}: {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!service) return null;

  const s = service.status?.toUpperCase() ?? "INACTIVE";
  const cfg = providerConfig[service.providerType] ?? {
    icon: <Server size={13} />,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/25",
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      direction="right"
    >
      <DrawerContent className="bg-[#1A2235] border-l border-[#2A3550] text-white flex flex-col gap-0 p-0">
        {/* Header */}
        <DrawerHeader className="flex-row items-center justify-between border-b border-[#2A3550] px-6 py-4">
          <div>
            <DrawerTitle className="text-zinc-100 text-base font-semibold">
              {service.name}
            </DrawerTitle>
            <DrawerDescription className="text-zinc-500 text-xs mt-0.5">
              Email Service
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#2A3550] transition-colors">
              <X size={16} />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {/* Provider Type */}
          <InfoRow label="Provider">
            <span
              className={`w-fit inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide border ${cfg.bg} ${cfg.color} ${cfg.border}`}
            >
              {cfg.icon}
              {service.providerType}
            </span>
          </InfoRow>

          {/* Status */}
          <InfoRow label="Status">
            <span
              className={`w-fit inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[s] ?? statusStyles.INACTIVE}`}
            >
              <Activity size={10} />
              {s.toLowerCase()}
            </span>
          </InfoRow>

          {/* Default */}
          <InfoRow label="Default Service">
            {service.isDefault ? (
              <span className="w-fit inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Star size={10} className="fill-amber-400" />
                Yes, this is the default service
              </span>
            ) : (
              <span className="text-sm text-zinc-500 italic">
                Not the default service
              </span>
            )}
          </InfoRow>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ServicePreview;
