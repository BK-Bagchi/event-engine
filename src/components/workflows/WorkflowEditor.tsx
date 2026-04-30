import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { WorkflowAPI } from "@/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import FormError from "@/components/form/FormError";
import { getErrorMessage } from "@/utils/error";

// ── Types ─────────────────────────────────────────────────────
export type ActionType =
  | "SEND_EMAIL"
  | "AUTO_REPLY"
  | "SAVE_SUBMISSION"
  | "TRIGGER_WEBHOOK"
  | "LABEL_SUBMISSION";

export type WorkflowStatus = "ACTIVE" | "DISABLED";

export interface WorkflowAction {
  type: ActionType;
  enabled: boolean;
}

export interface WorkflowData {
  id: string;
  projectId: string;
  templateId: string;
  actions: WorkflowAction[];
  status: WorkflowStatus;
}

const ACTION_TYPES: ActionType[] = [
  "SEND_EMAIL",
  "AUTO_REPLY",
  "SAVE_SUBMISSION",
  "TRIGGER_WEBHOOK",
  "LABEL_SUBMISSION",
];

const ACTION_LABELS: Record<ActionType, string> = {
  SEND_EMAIL: "Send Email",
  AUTO_REPLY: "Auto Reply",
  SAVE_SUBMISSION: "Save Submission",
  TRIGGER_WEBHOOK: "Trigger Webhook",
  LABEL_SUBMISSION: "Label Submission",
};

// ── Helpers ───────────────────────────────────────────────────
const getInitialActions = (actions: WorkflowAction[]): WorkflowAction[] =>
  actions.length > 0 ? actions : [{ type: "SAVE_SUBMISSION", enabled: true }];

const actionsEqual = (a: WorkflowAction[], b: WorkflowAction[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every(
    (act, i) => act.type === b[i].type && act.enabled === b[i].enabled,
  );
};

// ── Component ─────────────────────────────────────────────────
interface WorkflowEditorProps {
  workflow: WorkflowData;
  projectId: string;
  templateId: string;
}

const WorkflowEditor = ({
  workflow,
  projectId,
  templateId,
}: WorkflowEditorProps) => {
  const queryClient = useQueryClient();

  const originalActions = getInitialActions(workflow.actions);
  const [actions, setActions] = useState<WorkflowAction[]>(originalActions);
  const [status, setStatus] = useState<WorkflowStatus>(workflow.status);
  const [duplicateError, setDuplicateError] = useState<string | undefined>();

  const isDirty = !actionsEqual(actions, originalActions);

  const updateActions = (next: WorkflowAction[]) => {
    setActions(next);
    setDuplicateError(undefined);
  };

  // ── Status mutation ─────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      WorkflowAPI.updateWorkflowStatus(projectId, templateId, workflow.id, {
        status: newStatus,
      }),
    onSuccess: (_, newStatus) => {
      setStatus(newStatus as WorkflowStatus);
      queryClient.invalidateQueries({
        queryKey: ["workflows", projectId, templateId],
      });
      toast.success("Workflow status updated.", { position: "top-right" });
    },
    onError: (err) => {
      // Revert status on error
      setStatus(workflow.status);
      toast.error(getErrorMessage(err) || "Failed to update status.", {
        position: "top-right",
      });
    },
  });

  // ── Actions mutation ────────────────────────────────────────
  const actionsMutation = useMutation({
    mutationFn: (data: { actions: WorkflowAction[] }) =>
      WorkflowAPI.updateWorkflowActions(
        projectId,
        templateId,
        workflow.id,
        data,
      ),
    onSuccess: (res) => {
      const updated = res.data.data as WorkflowData;
      queryClient.setQueryData<WorkflowData[]>(
        ["workflows", projectId, templateId],
        (old) =>
          old?.map((w) => (w.id === workflow.id ? { ...w, ...updated } : w)) ??
          old,
      );
      queryClient.invalidateQueries({
        queryKey: ["workflows", projectId, templateId],
      });
      toast.success("Workflow actions saved.", { position: "top-right" });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || "Failed to save actions.", {
        position: "top-right",
      });
    },
  });

  // ── Handlers ────────────────────────────────────────────────
  const handleTypeChange = (index: number, type: ActionType) => {
    updateActions(actions.map((a, i) => (i === index ? { ...a, type } : a)));
  };

  const handleEnabledChange = (index: number, enabled: boolean) => {
    updateActions(actions.map((a, i) => (i === index ? { ...a, enabled } : a)));
  };

  const handleAddAction = () => {
    updateActions([...actions, { type: "SAVE_SUBMISSION", enabled: true }]);
  };

  const handleRemoveAction = (index: number) => {
    updateActions(actions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const types = actions.map((a) => a.type);
    const hasDuplicates = types.length !== new Set(types).size;
    if (hasDuplicates) {
      setDuplicateError(
        "Each action type must be unique. Remove duplicate actions before saving.",
      );
      return;
    }
    setDuplicateError(undefined);
    actionsMutation.mutate({ actions });
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      <div className="rounded-lg border border-[#2A3550] bg-[#1A2235] p-5 flex flex-col gap-5">
        {/* Status + Save row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-300">Status</span>
            <Select
              value={status}
              onValueChange={(val) => {
                setStatus(val as WorkflowStatus);
                statusMutation.mutate(val);
              }}
              disabled={statusMutation.isPending}
            >
              <SelectTrigger className="w-36 h-8 text-xs bg-[#0F1623] border-[#2A3550] text-zinc-200 **:data-[slot=select-value]:text-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-200">
                <SelectItem
                  value="ACTIVE"
                  className="text-xs text-zinc-200 focus:bg-[#2A3550] focus:text-zinc-300"
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="DISABLED"
                  className="text-xs text-zinc-200 focus:bg-[#2A3550] focus:text-zinc-300"
                >
                  Disabled
                </SelectItem>
              </SelectContent>
            </Select>
            {statusMutation.isPending && <Spinner className="size-3.5" />}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-[#2A3550] bg-[#1A2235] p-5 flex flex-col gap-5">
        {/* Actions list */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-zinc-300">
            Workflow Actions
          </span>

          {(() => {
            const saveSubmissionCount = actions.filter(
              (a) => a.type === "SAVE_SUBMISSION",
            ).length;
            return actions.map((action, i) => {
              const isLastSaveSubmission =
                action.type === "SAVE_SUBMISSION" && saveSubmissionCount === 1;
              const canDelete = actions.length > 1 && !isLastSaveSubmission;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md border border-[#2A3550] bg-[#0F1623] px-3 py-2.5"
                >
                  <Select
                    value={action.type}
                    onValueChange={(val) =>
                      handleTypeChange(i, val as ActionType)
                    }
                  >
                    <SelectTrigger className="w-48 h-7 text-xs bg-[#1A2235] border-[#2A3550] text-zinc-200 **:data-[slot=select-value]:text-zinc-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-200">
                      {ACTION_TYPES.map((t) => (
                        <SelectItem
                          key={t}
                          value={t}
                          className="text-xs text-zinc-200 focus:bg-[#2A3550] focus:text-zinc-100"
                        >
                          {ACTION_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1.5">
                    <Checkbox
                      id={`enabled-${workflow.id}-${i}`}
                      checked={action.enabled}
                      onCheckedChange={(checked) =>
                        handleEnabledChange(i, !!checked)
                      }
                      className="border-zinc-600 data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
                    />
                    <Label
                      htmlFor={`enabled-${workflow.id}-${i}`}
                      className="text-xs text-zinc-400 cursor-pointer"
                    >
                      Enabled
                    </Label>
                  </div>

                  {canDelete ? (
                    <button
                      onClick={() => handleRemoveAction(i)}
                      className="ml-auto text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : (
                    actions.length > 1 &&
                    isLastSaveSubmission && (
                      <span className="ml-auto text-[10px] text-zinc-600 select-none">
                        required
                      </span>
                    )
                  )}
                </div>
              );
            });
          })()}

          {duplicateError && <FormError message={duplicateError} />}

          <Button
            size="sm"
            variant="outline"
            className="w-fit h-7 text-xs text-brand-blue hover:text-brand-hover-blue transition-colors bg-transparent hover:bg-transparent border-none"
            onClick={handleAddAction}
          >
            <Plus size={13} />
            Add More
          </Button>
        </div>

        {isDirty && (
          <Button
            size="sm"
            className="w-fit h-8 px-6 text-xs bg-brand-blue hover:bg-brand-hover-blue text-white flex items-center gap-2"
            onClick={handleSave}
            disabled={actionsMutation.isPending}
          >
            {actionsMutation.isPending && <Spinner className="size-3.5" />}Save
            Changes
          </Button>
        )}
      </div>
    </>
  );
};

export default WorkflowEditor;
