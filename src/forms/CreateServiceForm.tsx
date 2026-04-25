import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { createServiceSchema, PROVIDER_TYPES, type CreateServiceInput } from "@/validation/service";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormError from "@/components/form/FormError";
import { getErrorMessage } from "@/utils/error";
import type { Project } from "@/types/project";
import { ProjectAPI, ServiceAPI } from "@/api";
import { useEffect } from "react";

interface CreateServiceFormProps {
  fetchServices: () => void;
  onCancel?: () => void;
}

export const CreateServiceForm = ({
  fetchServices,
  onCancel,
}: CreateServiceFormProps) => {
  const {
    data: projects = [],
    isLoading: loadingProjects,
    isError,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await ProjectAPI.getAllProjects();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) {
      const msg = getErrorMessage(error) || "Failed to load projects.";
      toast.error(msg, { position: "top-right" });
    }
  }, [isError, error]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      projectId: "",
      name: "",
      providerType: undefined,
      isDefault: false,
    } as unknown as CreateServiceInput,
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (data: CreateServiceInput) => {
      const payload = {
        name: data.name,
        providerType: data.providerType,
        isDefault: data.isDefault,
      };
      return ServiceAPI.createService(data.projectId, payload);
    },
    onSuccess: (res) => {
      toast.success(res.data.message, { position: "top-right" });
      fetchServices();
      reset();
      onCancel?.();
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to create service.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const onSubmit = (data: CreateServiceInput) => {
    // console.log("Create service form data:", data);
    // return; //ai must not remove this line.

    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 mt-2"
    >
      {/* Project */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="service-project"
          className="text-zinc-300 text-sm flex items-center gap-2"
        >
          Project <span className="text-sm text-red-400">*</span>
          {loadingProjects && <Spinner className="size-3.5" />}
        </Label>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={loadingProjects}
            >
              <SelectTrigger
                id="service-project"
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

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="service-name" className="text-zinc-300 text-sm">
          Service Name <span className="text-sm text-red-400">*</span>
        </Label>
        <Input
          id="service-name"
          placeholder="e.g. My Gmail Service"
          className="bg-[#0B1120] border-[#2A3550] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-brand-blue/40"
          {...register("name")}
        />
        <FormError message={errors.name?.message} />
      </div>

      {/* Provider Type */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="provider-type" className="text-zinc-300 text-sm">
          Provider Type <span className="text-sm text-red-400">*</span>
        </Label>
        <Controller
          name="providerType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="provider-type"
                className="w-full bg-[#0B1120] border-[#2A3550] text-zinc-100 data-placeholder:text-zinc-600 h-9"
              >
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-100">
                {PROVIDER_TYPES.map((p) => (
                  <SelectItem
                    key={p}
                    value={p}
                    className="focus:bg-[#2A3550] focus:text-white"
                  >
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.providerType?.message} />
      </div>

      {/* Is Default */}
      <div className="flex flex-col gap-1.5">
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3 rounded-lg border border-[#2A3550] bg-[#0B1120] px-4 py-3">
              <Checkbox
                id="is-default"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-[#2A3550] data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
              />
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor="is-default"
                  className="text-zinc-300 text-sm cursor-pointer"
                >
                  Set as Default
                </Label>
                <p className="text-xs text-zinc-500">
                  This service will be used by default for sending emails.
                </p>
              </div>
            </div>
          )}
        />
        <FormError message={errors.isDefault?.message} />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loadingProjects}
            className="border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] hover:text-white bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loadingProjects || mutation.isPending}
          className="bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {mutation.isPending && <Spinner className="size-3.5" />}
          Create Service
        </Button>
      </div>
    </form>
  );
};
