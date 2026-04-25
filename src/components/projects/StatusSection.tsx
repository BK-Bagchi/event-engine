import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";

type ProjectStatus = "ACTIVE" | "ARCHIVED";

interface StatusSectionProps {
  projectId: string;
  initialStatus: string;
}

const statusMeta: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  ACTIVE: {
    label: "Active",
    dot: "bg-green-400",
    badge: "text-green-400 border-green-500/30 bg-green-500/10",
  },
  ARCHIVED: {
    label: "Archived",
    dot: "bg-zinc-400",
    badge: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10",
  },
};

const StatusSection = ({ projectId, initialStatus }: StatusSectionProps) => {
  const [status, setStatus] = useState<string>(
    initialStatus?.toUpperCase() ?? "ACTIVE",
  );

  const meta = statusMeta[status] ?? statusMeta["ACTIVE"];

  const mutation = useMutation({
    mutationFn: (value: string) =>
      ProjectAPI.updateProjectStatus(projectId, {
        status: value as ProjectStatus,
      }),
    onSuccess: (res, value) => {
      const updated = res.data?.data?.status ?? value;
      setStatus(updated);
      toast.success(
        `Status updated to ${statusMeta[updated]?.label ?? updated}`,
        { position: "top-right" },
      );
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to update status.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const handleStatusChange = (value: string) => {
    // console.log("Status changed to:", value);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    mutation.mutate(value);
  };

  return (
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Activity size={15} className="text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-200">Project Status</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Current badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${meta.badge}`}
        >
          <span className={`size-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>

        {/* Select */}
        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={mutation.isPending}
        >
          <SelectTrigger className="w-40 bg-[#0B1120] border-[#2A3550] text-zinc-300 focus:ring-brand-blue/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-200">
            <SelectItem value="ACTIVE" className="focus:bg-[#2A3550]">
              Active
            </SelectItem>
            <SelectItem value="ARCHIVED" className="focus:bg-[#2A3550]">
              Archived
            </SelectItem>
          </SelectContent>
        </Select>

        {mutation.isPending && <Spinner className="size-4 text-zinc-400" />}
      </div>
    </section>
  );
};

export default StatusSection;
