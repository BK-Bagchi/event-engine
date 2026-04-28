import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { TemplateAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { TemplateVariable } from "@/types/template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { variableSchema, VARIABLE_TYPES, type VariableFormInput } from "@/validation/template";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormError from "@/components/form/FormError";
import Mandatory from "@/components/form/Mandatory";

interface EditVariableFormProps {
  projectId: string;
  templateId: string;
  variable: TemplateVariable;
  variableIndex: number;
  allVariables: TemplateVariable[];
  onClose: () => void;
}

export const EditVariableForm = ({
  projectId,
  templateId,
  variable,
  variableIndex,
  allVariables,
  onClose,
}: EditVariableFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VariableFormInput>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      type: variable.type,
      key: variable.key,
      label: variable.label ?? "",
      required: variable.required ?? false,
      placeholder: variable.placeholder ?? "",
      defaultValue: variable.defaultValue ?? "",
      validation: {
        minLength:
          variable.validation?.minLength !== undefined
            ? String(variable.validation.minLength)
            : "",
        maxLength:
          variable.validation?.maxLength !== undefined
            ? String(variable.validation.maxLength)
            : "",
        regex: variable.validation?.regex ?? "",
        allowedValues: variable.validation?.allowedValues ?? [],
      },
    },
    mode: "onChange",
  });

  const {
    fields: allowedValueFields,
    append: appendAllowedValue,
    remove: removeAllowedValue,
    // @ts-expect-error Primitive array path typing is not inferred correctly by react-hook-form here
  } = useFieldArray<VariableFormInput, "validation.allowedValues">({
    control,
    name: "validation.allowedValues",
  });

  const mutation = useMutation({
    mutationFn: (data: VariableFormInput) => {
      const updatedVariable: TemplateVariable = {
        type: data.type,
        key: data.key,
        label: data.label || undefined,
        required: data.required ?? false,
        placeholder: data.placeholder || undefined,
        defaultValue: data.defaultValue || undefined,
        validation: {
          minLength: data.validation?.minLength
            ? parseInt(data.validation.minLength, 10)
            : undefined,
          maxLength: data.validation?.maxLength
            ? parseInt(data.validation.maxLength, 10)
            : undefined,
          regex: data.validation?.regex || undefined,
          allowedValues: data.validation?.allowedValues?.filter(Boolean),
        },
      };
      const updatedVariables = allVariables.map((v, i) =>
        i === variableIndex ? updatedVariable : v,
      );
      return TemplateAPI.updateTemplateConfig(projectId, templateId, {
        variables: updatedVariables,
      });
    },
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "Variable updated successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["template", projectId, templateId],
      });
      onClose();
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to update variable.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const onSubmit = (data: VariableFormInput) => {
    // console.log("Submitting variable data:", data);
    // return; //ai must not remove this line, it's for testing only. Remove this line when the form is ready to submit data to the server.

    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-zinc-300">
          Type <Mandatory />
        </Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full border-[#2A3550] bg-[#0B1120] text-zinc-300">
                <SelectValue placeholder="Select variable type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-300">
                {VARIABLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.type?.message} />
      </div>

      {/* Key */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-zinc-300">
          Key <Mandatory />
        </Label>
        <Input
          placeholder="e.g. email_address"
          {...register("key")}
          className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
        />
        <FormError message={errors.key?.message} />
      </div>

      {/* Label */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-zinc-300">Label</Label>
        <Input
          placeholder="e.g. Email Address"
          {...register("label")}
          className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
        />
        <FormError message={errors.label?.message} />
      </div>

      {/* Required */}
      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name="required"
          render={({ field }) => (
            <Checkbox
              id="edit-var-required"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label
          htmlFor="edit-var-required"
          className="text-zinc-300 font-normal cursor-pointer"
        >
          Required
        </Label>
      </div>

      {/* Placeholder */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-zinc-300">Placeholder</Label>
        <Input
          placeholder="e.g. Enter your email"
          {...register("placeholder")}
          className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
        />
        <FormError message={errors.placeholder?.message} />
      </div>

      {/* Default Value */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-zinc-300">Default Value</Label>
        <Input
          placeholder="e.g. user@example.com"
          {...register("defaultValue")}
          className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
        />
        <FormError message={errors.defaultValue?.message} />
      </div>

      {/* Validation */}
      <section className="flex flex-col gap-4 rounded-lg border border-[#2A3550] p-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Validation
        </h4>

        {/* Min Length */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-zinc-300">Min Length</Label>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 2"
            {...register("validation.minLength")}
            className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
          />
          <FormError message={errors.validation?.minLength?.message} />
        </div>

        {/* Max Length */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-zinc-300">Max Length</Label>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 100"
            {...register("validation.maxLength")}
            className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
          />
          <FormError message={errors.validation?.maxLength?.message} />
        </div>

        {/* Regex */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-zinc-300">Regex</Label>
          <Input
            placeholder="e.g. ^[a-zA-Z]+$"
            {...register("validation.regex")}
            className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
          />
          <FormError message={errors.validation?.regex?.message} />
        </div>

        {/* Allowed Values */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-zinc-300">Allowed Values</Label>
            <button
              type="button"
              onClick={() => appendAllowedValue("")}
              className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-hover-blue transition-colors"
            >
              <Plus size={14} />
              Add Value
            </button>
          </div>

          {allowedValueFields.length > 0 && (
            <div className="flex flex-col gap-2">
              {allowedValueFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Value ${index + 1}`}
                    {...register(`validation.allowedValues.${index}`)}
                    className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeAllowedValue(index)}
                    className="p-2 rounded text-zinc-400 hover:text-red-400 hover:bg-[#2A3550] transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.validation?.allowedValues && (
            <FormError message={errors.validation.allowedValues.message} />
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-brand-blue hover:bg-brand-hover-blue text-white gap-2"
        >
          {mutation.isPending && <Spinner className="size-3.5" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};
