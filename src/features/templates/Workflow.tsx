import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GitBranch, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTemplateWorkflows } from "@/hooks/queries/workflow";
import { WorkflowAPI } from "@/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import WorkflowEditor, { type WorkflowData} from "@/components/workflows/WorkflowEditor";
import { getErrorMessage } from "@/utils/error";
import type { Template } from "@/types/template";
import WorkflowSkeleton from "@/components/skeleton/WorkflowSkeleton";
import IndexEmpty from "@/components/empty/IndexEmpty";

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
        <IndexEmpty
          Icon={GitBranch}
          emptyTitle="No workflow yet"
          emptyDescription="Create a workflow to define automated actions for this template."
        />
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
