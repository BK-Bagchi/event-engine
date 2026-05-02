import { Controller, useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormError from "@/components/form/FormError";
import { getErrorMessage } from "@/utils/error";
//prettier-ignore
import { createTemplateSchema, TEMPLATE_CATEGORIES, type CreateTemplateInput } from "@/validation/template";
import { TemplateAPI } from "@/api";
import { useAllProjects } from "@/hooks/queries/project";
import { useProjectServices } from "@/hooks/queries/service";
import Mandatory from "@/components/form/Mandatory";

const CATEGORY_LABELS: Record<string, string> = {
  CONTACT: "Contact",
  AUTO_REPLY: "Auto Reply",
  SUPPORT: "Support",
  BOOKING: "Booking",
  CUSTOM: "Custom",
};

interface CreateTemplateFormProps {
  onCancel?: () => void;
  projectId?: string;
  serviceId?: string;
}

export const CreateTemplateForm = ({
  onCancel,
  projectId,
  serviceId,
}: CreateTemplateFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      projectId: projectId || "",
      serviceId: serviceId || "",
      name: "",
      description: "",
      category: undefined,
    } as unknown as CreateTemplateInput,
    mode: "onChange",
  });

  const selectedProjectId = useWatch({ control, name: "projectId" });

  const { projects, loadingProjects } = useAllProjects();
  const { services, loadingServices } = useProjectServices({
    projectId: selectedProjectId,
  });

  // ── Create mutation ───────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (data: CreateTemplateInput) =>
      TemplateAPI.createTemplate(data.projectId, data.serviceId, {
        name: data.name,
        description: data.description,
        category: data.category as
          | "CONTACT"
          | "AUTO_REPLY"
          | "SUPPORT"
          | "BOOKING"
          | "CUSTOM",
      }),
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Template created successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      reset();
      onCancel?.();
    },
    onError: (err) => {
      const msg = getErrorMessage(err) || "Failed to create template.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const onSubmit = (data: CreateTemplateInput) => {
    // console.log("Create template form data:", data);
    // return; //ai must not remove this line.

    mutation.mutate(data);
  };

  const isLoadingData = loadingProjects || loadingServices;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 mt-2"
    >
      {/* Project */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="template-project"
          className="text-zinc-300 text-sm flex items-center gap-2"
        >
          Project <Mandatory />
          {loadingProjects && <Spinner className="size-3.5" />}
        </Label>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={loadingProjects || !!projectId}
            >
              <SelectTrigger
                id="template-project"
                className="w-full bg-[#0B1120] border-[#2A3550] text-zinc-100 data-placeholder:text-zinc-600 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-100">
                {projects.map((p) => (
                  <SelectItem
                    key={p.id}
                    value={p.id}
                    className="focus:bg-[#2A3550] focus:text-white"
                  >
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.projectId?.message} />
      </div>

      {/* Service */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="template-service"
          className="text-zinc-300 text-sm flex items-center gap-2"
        >
          Service <Mandatory />
          {loadingServices && <Spinner className="size-3.5" />}
        </Label>
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={loadingServices || !!serviceId}
            >
              <SelectTrigger
                id="template-service"
                className="w-full bg-[#0B1120] border-[#2A3550] text-zinc-100 data-placeholder:text-zinc-600 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SelectValue
                  placeholder={
                    selectedProjectId
                      ? services.length === 0
                        ? "No services for this project"
                        : "Select a service"
                      : "Select a service"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-100">
                {services.map((s) => (
                  <SelectItem
                    key={s.id}
                    value={s.id}
                    className="focus:bg-[#2A3550] focus:text-white"
                  >
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.serviceId?.message} />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="template-name" className="text-zinc-300 text-sm">
          Template Name <Mandatory />
        </Label>
        <Input
          id="template-name"
          placeholder="e.g. Welcome Email"
          className="bg-[#0B1120] border-[#2A3550] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-brand-blue/40"
          {...register("name")}
        />
        <FormError message={errors.name?.message} />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="template-category" className="text-zinc-300 text-sm">
          Category <Mandatory />
        </Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="template-category"
                className="w-full bg-[#0B1120] border-[#2A3550] text-zinc-100 data-placeholder:text-zinc-600 h-9"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-100">
                {TEMPLATE_CATEGORIES.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="focus:bg-[#2A3550] focus:text-white"
                  >
                    {CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.category?.message} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="template-description" className="text-zinc-300 text-sm">
          Description
        </Label>
        <Textarea
          id="template-description"
          placeholder="Brief description of what this template is for..."
          className="bg-[#0B1120] border-[#2A3550] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-brand-blue/40 min-h-20 resize-none"
          {...register("description")}
        />
        <FormError message={errors.description?.message} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#2A3550]">
        <Button
          type="submit"
          disabled={isLoadingData || mutation.isPending}
          className="flex-1 bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {mutation.isPending && <Spinner className="size-3.5" />}
          Create Template
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoadingData || mutation.isPending}
            className="flex-1 border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
