import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FormError from "@/components/form/FormError";
import { editProjectSchema, type EditProjectInput } from "@/validation/project";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { Project } from "@/types/project";
import Mandatory from "@/components/form/Mandatory";

interface EditProjectFormProps {
  project: Project;
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
}

export const EditProjectForm = ({
  project,
  setEditDialogOpen,
  onCancel,
}: EditProjectFormProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProjectInput>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EditProjectInput) =>
      ProjectAPI.updateProjectInfo(project.id, data),
    onSuccess: (res) => {
      queryClient.setQueryData<Project>(["project", project.id], (old) =>
        old ? { ...old, ...res.data?.data } : old,
      );
      toast.success(res.data?.message ?? "Project info updated", {
        position: "top-right",
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to update project.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const onSubmit = (data: EditProjectInput) => {
    // console.log("Submitting edit project form with data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-project-name" className="text-zinc-300">
          Project Name <Mandatory />
        </Label>
        <Input
          id="edit-project-name"
          type="text"
          {...register("name")}
          className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
        <FormError message={errors.name?.message} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-project-description" className="text-zinc-300">
          Description
        </Label>
        <Textarea
          id="edit-project-description"
          placeholder="Enter project description (optional)"
          {...register("description")}
          rows={3}
          className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40 resize-none"
        />
        <FormError message={errors.description?.message} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#2A3550]">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold"
        >
          {mutation.isPending && <Spinner className="size-4" />}
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
