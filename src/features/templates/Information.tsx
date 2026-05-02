import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/button/BackButton";
//prettier-ignore
import type { Template, TemplateCategory, TemplateStatus } from "@/types/template";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import InformationSkeleton from "@/components/skeleton/InformationSkeleton";

interface InformationProps {
  template: Template | null;
  loadingTemplate: boolean;
}

const CATEGORY_OPTIONS: { value: TemplateCategory; label: string }[] = [
  { value: "CONTACT", label: "Contact" },
  { value: "AUTO_REPLY", label: "Auto Reply" },
  { value: "SUPPORT", label: "Support" },
  { value: "BOOKING", label: "Booking" },
  { value: "CUSTOM", label: "Custom" },
];

const STATUS_OPTIONS: { value: TemplateStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

const Information = ({ template, loadingTemplate }: InformationProps) => {
  const queryClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: (category: TemplateCategory) =>
      TemplateAPI.updateTemplateCategory(template!.projectId, template!.id, {
        category,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData<Template>(
        ["template", template!.projectId, template!.id],
        (old) => (old ? { ...old, ...res.data?.data } : old),
      );
      toast.success(res.data?.message ?? "Category updated", {
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to update category.", {
        position: "top-right",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: TemplateStatus) =>
      TemplateAPI.updateTemplateStatus(template!.projectId, template!.id, {
        status,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData<Template>(
        ["template", template!.projectId, template!.id],
        (old) => (old ? { ...old, ...res.data?.data } : old),
      );
      toast.success(res.data?.message ?? "Status updated", {
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to update status.", {
        position: "top-right",
      });
    },
  });

  if (loadingTemplate) return <InformationSkeleton />;

  if (!template)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500 text-sm">Template not found.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Back button */}
      <BackButton to="/dashboard/templates" text="Back to Templates" />

      {/* Section 1 — Name & Description */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          {template.name}
        </h2>
        {template.description ? (
          <p className="text-sm text-zinc-400">{template.description}</p>
        ) : (
          <p className="text-sm text-zinc-600 italic">
            No description provided.
          </p>
        )}
      </section>

      {/* Section 2 — Category */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-zinc-400">Category</h3>
          {categoryMutation.isPending && (
            <Spinner className="size-3.5 text-zinc-500" />
          )}
        </div>
        <Select
          value={template.category}
          disabled={categoryMutation.isPending}
          onValueChange={(val) =>
            categoryMutation.mutate(val as TemplateCategory)
          }
        >
          <SelectTrigger className="w-44 border-[#2A3550] bg-[#0B1120] text-zinc-300 disabled:opacity-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-300">
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Section 3 — Status */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-zinc-400">Status</h3>
          {statusMutation.isPending && (
            <Spinner className="size-3.5 text-zinc-500" />
          )}
        </div>
        <Select
          value={template.status}
          disabled={statusMutation.isPending}
          onValueChange={(val) => statusMutation.mutate(val as TemplateStatus)}
        >
          <SelectTrigger className="w-44 border-[#2A3550] bg-[#0B1120] text-zinc-300 disabled:opacity-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-300">
            {STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </div>
  );
};

export default Information;
