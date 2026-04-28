import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TemplateAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { TemplateVariable } from "@/types/template";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface DeleteVariableAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  templateId: string;
  variable: TemplateVariable;
  variableIndex: number;
  allVariables: TemplateVariable[];
}

const DeleteVariableAlert = ({
  open,
  onOpenChange,
  projectId,
  templateId,
  variable,
  variableIndex,
  allVariables,
}: DeleteVariableAlertProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const updatedVariables = allVariables.filter(
        (_, i) => i !== variableIndex,
      );
      return TemplateAPI.updateTemplateConfig(projectId, templateId, {
        variables: updatedVariables,
      });
    },
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Variable deleted successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["template", projectId, templateId],
      });
      onOpenChange(false);
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to delete variable.";
      toast.error(msg, { position: "top-right" });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1A2235] border-[#2A3550] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Delete Variable
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Are you sure you want to delete the variable{" "}
            <span className="font-mono text-zinc-200">
              &#123;&#123;{variable.key}&#125;&#125;
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-[#2A3550] bg-transparent text-zinc-800 hover:bg-[#2A3550] hover:text-zinc-800"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="gap-2"
          >
            {mutation.isPending && <Spinner className="size-3.5" />}
            <Trash2 size={14} />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVariableAlert;
