import { Mail, Server, Zap, Send, Layers, Activity, Star } from "lucide-react";
//prettier-ignore
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import type { Service } from "@/types/service";
import type { Project } from "@/types/project";

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
      className={`w-fit inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide border ${cfg.bg} ${cfg.color} ${cfg.border}`}
    >
      {cfg.icon}
      {providerType.charAt(0).toUpperCase() +
        providerType.slice(1).toLowerCase().replace("_", " ")}
    </span>
  );
};

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

const DefaultBadge = () => (
  <span className="w-fit inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
    <Star size={10} className="fill-amber-400" />
    Default
  </span>
);

// ── Component ─────────────────────────────────────────────────
interface ServiceCardProps {
  service: Service;
  onDetails: () => void;
  onProjectPreview?: (project: Project) => void;
}

const ServiceCard = ({
  service,
  onDetails,
  onProjectPreview,
}: ServiceCardProps) => {
  return (
    <Card className="bg-[#1A2235] border border-[#2A3550] ring-0 hover:border-brand-blue/40 transition-colors flex flex-col">
      <CardHeader
        className={`${onProjectPreview && service.project && "border-b border-[#2A3550]"} pd-3`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <CardTitle className="text-zinc-100 text-sm font-semibold truncate">
                {service.name}
              </CardTitle>
              {service.isDefault && <DefaultBadge />}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={service.status} />
            <ProviderBadge providerType={service.providerType} />
          </div>
        </div>
        {onProjectPreview && service.project && (
          <CardAction className="flex items-center gap-1.5">
            <button
              onClick={() => onProjectPreview(service.project)}
              className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
            >
              Preview
            </button>
          </CardAction>
        )}
      </CardHeader>

      {service.project?.name && (
        <CardContent className="flex items-center gap-1.5 flex-1 py-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Layers size={12} className="shrink-0" />
            <span className="truncate text-zinc-400">
              {service.project.name}
            </span>
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-2 border-t border-[#2A3550] bg-[#1A2235]">
        <div className="mt-auto flex justify-end w-full">
          <button
            onClick={onDetails}
            className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
          >
            Details
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
