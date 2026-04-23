import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//prettier-ignore
import { createProjectSchema, type CreateProjectInput } from "@/validation/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import FormError from "@/components/form/FormError";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";

interface CreateProjectFormProps {
  loading?: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProjects: () => Promise<void>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
}

export const CreateProjectForm = ({
  loading = false,
  setDialogOpen,
  setSubmitting,
  fetchProjects,
  onCancel,
}: CreateProjectFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      allowedOrigins: ["https://"],
      settings: {
        saveSubmissions: true,
        enableAutoReply: false,
        enableWebhook: false,
        requireCaptcha: false,
        rateLimitPerMinute: 30,
        maxAttachmentSizeMB: 5,
      },
    },
    mode: "onChange",
  });

  const {
    fields: originFields,
    append: appendOrigin,
    remove: removeOrigin,
    // @ts-expect-error Primitive array path typing is not inferred correctly by react-hook-form here
  } = useFieldArray<CreateProjectInput, "allowedOrigins">({
    control,
    name: "allowedOrigins",
  });

  const onSubmit = async (data: CreateProjectInput) => {
    // console.log("Form submitted with data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    setSubmitting(true);
    try {
      const res = await ProjectAPI.createProject(data);
      toast.success(res.data?.message ?? "Project created successfully", {
        position: "top-right",
      });
      setDialogOpen(false);
      fetchProjects();
    } catch (error) {
      const msg = getErrorMessage(error) || "Failed to create project.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* ── Part 1: Name & Description ── */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-zinc-200">
          Basic Information
        </h3>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="project-name" className="text-zinc-300">
            Project Name <span className="text-sm text-red-400">*</span>
          </Label>
          <Input
            id="project-name"
            type="text"
            placeholder="My Awesome Project"
            {...register("name")}
            className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <FormError message={errors.name?.message} />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="project-description" className="text-zinc-300">
            Description
          </Label>
          <Textarea
            id="project-description"
            placeholder="Enter project description (optional)"
            {...register("description")}
            className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40 resize-none"
            rows={3}
          />
          <FormError message={errors.description?.message} />
        </div>
      </section>

      {/* ── Part 2: Allowed Origins ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">
            Allowed Origins <span className="text-sm text-red-400">*</span>
          </h3>
          <button
            type="button"
            onClick={() => appendOrigin("https://")}
            className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-hover-blue transition-colors"
          >
            <Plus size={14} />
            Add Origin
          </button>
        </div>

        {originFields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1 flex flex-col gap-1.5">
              <Input
                type="text"
                placeholder={
                  index === 0 ? "http://localhost:3000" : "https://example.com"
                }
                {...register(`allowedOrigins.${index}`)}
                className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
              />
              {errors.allowedOrigins?.[index] && (
                <FormError message={errors.allowedOrigins[index]?.message} />
              )}
            </div>

            {originFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeOrigin(index)}
                className="p-2 rounded text-zinc-400 hover:text-red-400 hover:bg-[#2A3550] transition-colors shrink-0 mb-0"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        {errors.allowedOrigins && (
          <FormError message={errors.allowedOrigins?.message} />
        )}
      </section>

      {/* ── Part 3: Settings ── */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-zinc-200">
          Settings <span className="text-sm text-red-400">*</span>
        </h3>

        {/* Boolean Settings */}
        <div className="space-y-3">
          {/* Save Submissions */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1A2235] border border-[#2A3550]">
            <label
              htmlFor="save-submissions"
              className="text-sm text-zinc-300 cursor-pointer"
            >
              Save Submissions
            </label>
            <Controller
              control={control}
              name="settings.saveSubmissions"
              render={({ field }) => (
                <Switch
                  id="save-submissions"
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(v)}
                />
              )}
            />
          </div>

          {/* Enable Auto Reply */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1A2235] border border-[#2A3550]">
            <label
              htmlFor="enable-auto-reply"
              className="text-sm text-zinc-300 cursor-pointer"
            >
              Enable Auto Reply
            </label>
            <Controller
              control={control}
              name="settings.enableAutoReply"
              render={({ field }) => (
                <Switch
                  id="enable-auto-reply"
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(v)}
                />
              )}
            />
          </div>

          {/* Enable Webhook */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1A2235] border border-[#2A3550]">
            <label
              htmlFor="enable-webhook"
              className="text-sm text-zinc-300 cursor-pointer"
            >
              Enable Webhook
            </label>
            <Controller
              control={control}
              name="settings.enableWebhook"
              render={({ field }) => (
                <Switch
                  id="enable-webhook"
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(v)}
                />
              )}
            />
          </div>

          {/* Require Captcha */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1A2235] border border-[#2A3550]">
            <label
              htmlFor="require-captcha"
              className="text-sm text-zinc-300 cursor-pointer"
            >
              Require Captcha
            </label>
            <Controller
              control={control}
              name="settings.requireCaptcha"
              render={({ field }) => (
                <Switch
                  id="require-captcha"
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(v)}
                />
              )}
            />
          </div>
        </div>

        {/* Numeric Settings */}
        <div className="grid grid-cols-2 gap-3">
          {/* Rate Limit */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rate-limit" className="text-zinc-300 text-xs">
              Rate Limit (req/min){" "}
              <span className="text-sm text-red-400">*</span>
            </Label>
            <Input
              id="rate-limit"
              type="number"
              min={1}
              max={10000}
              {...register("settings.rateLimitPerMinute", {
                valueAsNumber: true,
              })}
              className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
            />
            <FormError message={errors.settings?.rateLimitPerMinute?.message} />
          </div>

          {/* Max Attachment Size */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="max-attachment" className="text-zinc-300 text-xs">
              Max Attachment (MB){" "}
              <span className="text-sm text-red-400">*</span>
            </Label>
            <Input
              id="max-attachment"
              type="number"
              min={1}
              max={100}
              {...register("settings.maxAttachmentSizeMB", {
                valueAsNumber: true,
              })}
              className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
            />
            <FormError
              message={errors.settings?.maxAttachmentSizeMB?.message}
            />
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#2A3550]">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold"
        >
          {loading && <Spinner className="size-4" />}
          Create Project
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-[#2A3550] text-zinc-900 hover:bg-[#2A3550]"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
