import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FormError from "@/components/form/FormError";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { Settings } from "@/types/project";

const settingsSchema = z.object({
  saveSubmissions: z.boolean(),
  enableAutoReply: z.boolean(),
  enableWebhook: z.boolean(),
  requireCaptcha: z.boolean(),
  rateLimitPerMinute: z.number().min(1).max(10000),
  maxAttachmentSizeMB: z.number().min(1).max(100),
});

type SettingsInput = z.infer<typeof settingsSchema>;

interface SettingsSectionProps {
  projectId: string;
  initialSettings: Settings;
}

const SettingsSection = ({
  projectId,
  initialSettings,
}: SettingsSectionProps) => {
  const [saving, setSaving] = useState(false);
  const [baseline, setBaseline] = useState<Settings>(initialSettings);

  // keep baseline in sync if parent provides new initialSettings
  useEffect(() => {
    setBaseline(initialSettings);
  }, [initialSettings]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      saveSubmissions: initialSettings.saveSubmissions,
      enableAutoReply: initialSettings.enableAutoReply,
      enableWebhook: initialSettings.enableWebhook,
      requireCaptcha: initialSettings.requireCaptcha,
      rateLimitPerMinute: initialSettings.rateLimitPerMinute,
      maxAttachmentSizeMB: initialSettings.maxAttachmentSizeMB,
    },
  });

  const onSubmit = async (data: SettingsInput) => {
    setSaving(true);
    try {
      await ProjectAPI.updateProjectSettings(projectId, data);
      toast.success("Settings saved", { position: "top-right" });
      // update baseline so form is considered unchanged after successful save
      setBaseline({
        saveSubmissions: data.saveSubmissions,
        enableAutoReply: data.enableAutoReply,
        enableWebhook: data.enableWebhook,
        requireCaptcha: data.requireCaptcha,
        rateLimitPerMinute: Number(data.rateLimitPerMinute),
        maxAttachmentSizeMB: Number(data.maxAttachmentSizeMB),
      });
    } catch (error) {
      const msg = getErrorMessage(error) || "Failed to save settings.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setSaving(false);
    }
  };

  // Watch form values and compare with initial settings to determine
  // whether the Save button should be shown.
  const watched = watch();
  const hasChanged =
    JSON.stringify({
      saveSubmissions: watched.saveSubmissions,
      enableAutoReply: watched.enableAutoReply,
      enableWebhook: watched.enableWebhook,
      requireCaptcha: watched.requireCaptcha,
      rateLimitPerMinute: Number(watched.rateLimitPerMinute),
      maxAttachmentSizeMB: Number(watched.maxAttachmentSizeMB),
    }) !==
    JSON.stringify({
      saveSubmissions: baseline.saveSubmissions,
      enableAutoReply: baseline.enableAutoReply,
      enableWebhook: baseline.enableWebhook,
      requireCaptcha: baseline.requireCaptcha,
      rateLimitPerMinute: baseline.rateLimitPerMinute,
      maxAttachmentSizeMB: baseline.maxAttachmentSizeMB,
    });

  return (
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Settings2 size={15} className="text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-200">
          Project Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Toggle Settings */}
        <div className="flex flex-col gap-2">
          {(
            [
              {
                name: "saveSubmissions",
                id: "s-save",
                label: "Save Submissions",
              },
              {
                name: "enableAutoReply",
                id: "s-auto",
                label: "Enable Auto Reply",
              },
              {
                name: "enableWebhook",
                id: "s-webhook",
                label: "Enable Webhook",
              },
              {
                name: "requireCaptcha",
                id: "s-captcha",
                label: "Require Captcha",
              },
            ] as const
          ).map(({ name, id, label }) => (
            <div
              key={id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#0B1120] border border-[#2A3550]"
            >
              <label
                htmlFor={id}
                className="text-sm text-zinc-300 cursor-pointer"
              >
                {label}
              </label>
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <Switch
                    id={id}
                    checked={!!field.value}
                    onCheckedChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>
          ))}
        </div>

        {/* Numeric Settings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-rate-limit" className="text-zinc-300 text-xs">
              Rate Limit (req/min)
            </Label>
            <Input
              id="s-rate-limit"
              type="number"
              min={1}
              max={10000}
              {...register("rateLimitPerMinute", { valueAsNumber: true })}
              className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
            />
            <FormError message={errors.rateLimitPerMinute?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-max-attach" className="text-zinc-300 text-xs">
              Max Attachment (MB)
            </Label>
            <Input
              id="s-max-attach"
              type="number"
              min={1}
              max={100}
              {...register("maxAttachmentSizeMB", { valueAsNumber: true })}
              className="bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
            />
            <FormError message={errors.maxAttachmentSizeMB?.message} />
          </div>
        </div>

        {hasChanged && (
          <Button
            type="submit"
            disabled={saving}
            className="self-end bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold px-6 gap-1.5"
          >
            {saving && <Spinner className="size-4" />}
            Save Settings
          </Button>
        )}
      </form>
    </section>
  );
};

export default SettingsSection;
