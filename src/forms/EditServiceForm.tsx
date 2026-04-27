import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { editServiceSchema, PROVIDER_TYPES, type EditServiceInput } from "@/validation/service";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormError from "@/components/form/FormError";
import { getErrorMessage } from "@/utils/error";
import { ServiceAPI } from "@/api";
import type { Service } from "@/types/service";
import Mandatory from "@/components/form/Mandatory";

interface EditServiceFormProps {
  projectId: string;
  service: Service;
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
}

export const EditServiceForm = ({
  projectId,
  service,
  setEditDialogOpen,
  onCancel,
}: EditServiceFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditServiceInput>({
    resolver: zodResolver(editServiceSchema),
    defaultValues: {
      name: service.name,
      providerType: service.providerType as EditServiceInput["providerType"],
      isDefault: service.isDefault,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EditServiceInput) =>
      ServiceAPI.updateServiceInfo(projectId, service.id, data),
    onSuccess: (res) => {
      queryClient.setQueryData<Service>(
        ["service", projectId, service.id],
        (old) => (old ? { ...old, ...res.data?.data } : old),
      );
      toast.success(res.data?.message ?? "Service updated", {
        position: "top-right",
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to update service.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const onSubmit = (data: EditServiceInput) => {
    // console.log("Submitting edit service form with data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 mt-1"
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-service-name" className="text-zinc-300 text-sm">
          Service Name <Mandatory />
        </Label>
        <Input
          id="edit-service-name"
          type="text"
          placeholder="e.g. My Gmail Service"
          {...register("name")}
          className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
        <FormError message={errors.name?.message} />
      </div>

      {/* Provider Type */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-provider-type" className="text-zinc-300 text-sm">
          Provider Type <Mandatory />
        </Label>
        <Controller
          name="providerType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="edit-provider-type"
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
                id="edit-is-default"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-[#2A3550] data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
              />
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor="edit-is-default"
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
      <div className="flex items-center gap-3 pt-1 border-t border-[#2A3550]">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold flex items-center gap-2"
        >
          {mutation.isPending && <Spinner className="size-4" />}
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-[#2A3550] text-zinc-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
