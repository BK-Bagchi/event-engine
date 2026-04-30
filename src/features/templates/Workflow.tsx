import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GitBranch, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTemplateWorkflows } from "@/hooks/queries/workflow";
import { WorkflowAPI } from "@/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
//prettier-ignore
import WorkflowEditor, { type WorkflowData} from "@/components/workflows/WorkflowEditor";
import { getErrorMessage } from "@/utils/error";
import type { Template } from "@/types/template";

// ── Loading skeleton ──────────────────────────────────────────
const WorkflowSkeleton = () => (
  <div className="rounded-lg border border-[#2A3550] bg-[#1A2235] p-5 flex flex-col gap-5">
    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-14 bg-[#2A3550] rounded" />
      <Skeleton className="h-8 w-36 bg-[#2A3550] rounded-lg" />
    </div>
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-16 bg-[#2A3550] rounded" />
      <Skeleton className="h-10 w-full bg-[#2A3550] rounded-md" />
      <Skeleton className="h-10 w-full bg-[#2A3550] rounded-md" />
      <Skeleton className="h-7 w-24 bg-[#2A3550] rounded-md" />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────
interface WorkflowProps {
  template: Template | null;
  loadingTemplate: boolean;
}

const Workflow = ({ template, loadingTemplate }: WorkflowProps) => {
  const projectId = template?.projectId ?? "";
  const templateId = template?.id ?? "";

  const { workflows, loadingWorkflows } = useTemplateWorkflows({
    projectId,
    templateId,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => WorkflowAPI.createWorkflow(projectId, templateId),
    onSuccess: (res) => {
      const created = res.data.data as WorkflowData;
      queryClient.setQueryData<WorkflowData[]>(
        ["workflows", projectId, templateId],
        (old) => [...(old ?? []), created],
      );
      queryClient.invalidateQueries({
        queryKey: ["workflows", projectId, templateId],
      });
      toast.success("Workflow created.", { position: "top-right" });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || "Failed to create workflow.", {
        position: "top-right",
      });
    },
  });

  if (loadingTemplate || loadingWorkflows) return <WorkflowSkeleton />;

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <Button
            className="bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold flex items-center gap-2 text-sm"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Spinner className="size-3.5" />
            ) : (
              <Plus size={16} />
            )}
            Create Workflow
          </Button>
        </div>
        <Empty className="border border-dashed border-[#2A3550] bg-[#1A2235]/50 min-h-85">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="size-12 bg-[#2A3550] rounded-xl"
            >
              <GitBranch size={22} className="text-zinc-400" />
            </EmptyMedia>
            <EmptyTitle className="text-zinc-200 text-base">
              No workflow yet
            </EmptyTitle>
            <EmptyDescription className="text-zinc-500">
              Create a workflow to define automated actions for this template.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {(workflows as WorkflowData[]).map((workflow) => (
        <WorkflowEditor
          key={workflow.id}
          workflow={workflow}
          projectId={projectId}
          templateId={templateId}
        />
      ))}
    </div>
  );
};

export default Workflow;
