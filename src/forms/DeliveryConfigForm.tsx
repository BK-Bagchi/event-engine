import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import FormError from "@/components/form/FormError";
import Mandatory from "@/components/form/Mandatory";
import { TemplateAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import {
  deliveryConfigSchema,
  type DeliveryConfigInput,
} from "@/validation/template";
import type { Template } from "@/types/template";

interface DeliveryConfigFormProps {
  template: Template;
  onSuccess: () => void;
}

export const DeliveryConfigForm = ({
  template,
  onSuccess,
}: DeliveryConfigFormProps) => {
  const queryClient = useQueryClient();

  const toDefault = template.deliveryConfig?.to?.length
    ? template.deliveryConfig.to.map((v) => ({ value: v }))
    : [{ value: "" }];
  const ccDefault = template.deliveryConfig?.cc?.length
    ? template.deliveryConfig.cc.map((v) => ({ value: v }))
    : [{ value: "" }];
  const bccDefault = template.deliveryConfig?.bcc?.length
    ? template.deliveryConfig.bcc.map((v) => ({ value: v }))
    : [{ value: "" }];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryConfigInput>({
    resolver: zodResolver(deliveryConfigSchema),
    defaultValues: { to: toDefault, cc: ccDefault, bcc: bccDefault },
  });

  const toFields = useFieldArray({ control, name: "to" });
  const ccFields = useFieldArray({ control, name: "cc" });
  const bccFields = useFieldArray({ control, name: "bcc" });

  const mutation = useMutation({
    mutationFn: (data: DeliveryConfigInput) =>
      TemplateAPI.updateDeliveryConfig(template.projectId, template.id, {
        to: data.to.map((e) => e.value),
        cc: data.cc.map((e) => e.value).filter(Boolean),
        bcc: data.bcc.map((e) => e.value).filter(Boolean),
      }),
    onSuccess: (res) => {
      queryClient.setQueryData<Template>(
        ["template", template.projectId, template.id],
        (old) => (old ? { ...old, ...res.data?.data } : old),
      );
      toast.success(res.data?.message ?? "Delivery config updated", {
        position: "top-right",
      });
      onSuccess();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error) || "Failed to update delivery config.",
        { position: "top-right" },
      );
    },
  });

  const onSubmit = (data: DeliveryConfigInput) => {
    // console.log("Submitting data:", data);
    // return; //api must not remove this line, it's for testing form validation

    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* To */}
      <div className="flex flex-col gap-2">
        <Label className="text-zinc-300">
          To <Mandatory />
        </Label>
        {toFields.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              type="email"
              placeholder="recipient@example.com"
              {...register(`to.${index}.value`)}
              className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
            />
            {toFields.fields.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-zinc-500 hover:text-red-400 shrink-0"
                onClick={() => toFields.remove(index)}
              >
                <Trash2 size={15} />
              </Button>
            )}
          </div>
        ))}
        <FormError
          message={
            Array.isArray(errors.to)
              ? (errors.to as { value?: { message?: string } }[]).find(
                  (e) => e?.value?.message,
                )?.value?.message
              : (
                  errors.to as
                    | { root?: { message?: string }; message?: string }
                    | undefined
                )?.root?.message ||
                (errors.to as { message?: string } | undefined)?.message
          }
        />
        <button
          type="button"
          className="w-fit flex items-center gap-1 text-xs text-brand-blue hover:text-brand-hover-blue transition-colors"
          onClick={() => toFields.append({ value: "" })}
        >
          <Plus size={13} />
          Add More
        </button>
      </div>

      {/* CC */}
      <div className="flex flex-col gap-2">
        <Label className="text-zinc-300">
          CC <Mandatory />
        </Label>
        {ccFields.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              type="email"
              placeholder="cc@example.com"
              {...register(`cc.${index}.value`)}
              className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
            />
            {ccFields.fields.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-zinc-500 hover:text-red-400 shrink-0"
                onClick={() => ccFields.remove(index)}
              >
                <Trash2 size={15} />
              </Button>
            )}
          </div>
        ))}
        <FormError
          message={
            Array.isArray(errors.cc)
              ? (errors.cc as { value?: { message?: string } }[]).find(
                  (e) => e?.value?.message,
                )?.value?.message
              : (
                  errors.cc as
                    | { root?: { message?: string }; message?: string }
                    | undefined
                )?.root?.message ||
                (errors.cc as { message?: string } | undefined)?.message
          }
        />
        <button
          type="button"
          className="w-fit flex items-center gap-1 text-xs text-brand-blue hover:text-brand-hover-blue transition-colors"
          onClick={() => ccFields.append({ value: "" })}
        >
          <Plus size={13} />
          Add More
        </button>
      </div>

      {/* BCC */}
      <div className="flex flex-col gap-2">
        <Label className="text-zinc-300">BCC</Label>
        {bccFields.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              type="email"
              placeholder="bcc@example.com"
              {...register(`bcc.${index}.value`)}
              className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
            />
            {bccFields.fields.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-zinc-500 hover:text-red-400 shrink-0"
                onClick={() => bccFields.remove(index)}
              >
                <Trash2 size={15} />
              </Button>
            )}
          </div>
        ))}
        <FormError
          message={
            Array.isArray(errors.bcc)
              ? (errors.bcc as { value?: { message?: string } }[]).find(
                  (e) => e?.value?.message,
                )?.value?.message
              : (
                  errors.bcc as
                    | { root?: { message?: string }; message?: string }
                    | undefined
                )?.root?.message ||
                (errors.bcc as { message?: string } | undefined)?.message
          }
        />
        <button
          type="button"
          className="w-fit flex items-center gap-1 text-xs text-brand-blue hover:text-brand-hover-blue transition-colors"
          onClick={() => bccFields.append({ value: "" })}
        >
          <Plus size={13} />
          Add More
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2"
        >
          {mutation.isPending && <Spinner className="size-4" />}
          Save
        </Button>
      </div>
    </form>
  );
};
