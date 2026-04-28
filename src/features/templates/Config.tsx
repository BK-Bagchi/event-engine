import { Pencil } from "lucide-react";
import type { Template } from "@/types/template";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/button/BackButton";

interface ConfigProps {
  template: Template | null;
  loadingTemplate: boolean;
}

const ConfigSkeleton = () => (
  <div className="max-w-6xl mx-auto flex flex-col gap-6">
    <Skeleton className="h-5 w-36 bg-[#2A3550]/60" />
    {/* Delivery Config skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32 bg-[#2A3550]/60" />
        <Skeleton className="h-8 w-16 bg-[#2A3550]/60" />
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Skeleton className="h-4 w-24 bg-[#2A3550]/60 shrink-0" />
            <Skeleton
              className={`h-4 bg-[#2A3550]/60 ${i === 0 ? "w-2/3" : i === 1 ? "w-1/2" : i === 2 ? "w-40" : "w-32"}`}
            />
          </div>
        ))}
      </div>
    </section>

    {/* Settings skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-5">
      <Skeleton className="h-5 w-20 bg-[#2A3550]/60" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded bg-[#2A3550]/60" />
            <Skeleton className="h-4 w-40 bg-[#2A3550]/60" />
          </div>
          {i === 0 && <Skeleton className="h-3 w-72 ml-7 bg-[#2A3550]/60" />}
        </div>
      ))}
    </section>
  </div>
);

const Config = ({ template, loadingTemplate }: ConfigProps) => {
  if (loadingTemplate) return <ConfigSkeleton />;

  if (!template)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500 text-sm">Template not found.</p>
      </div>
    );

  const { deliveryConfig, saveSubmission, autoReplyConfig, webhookConfig } =
    template;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Back button */}
      <BackButton to="/dashboard/templates" text="Back to Templates" />

      {/* Section 1 — Delivery Config */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-300">
            Delivery Config
          </h3>
          <Button
            size="sm"
            variant="outline"
            className="border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] hover:text-white gap-1.5"
          >
            <Pencil size={13} />
            Edit
          </Button>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex gap-2">
            <span className="text-zinc-500 w-24 shrink-0">To</span>
            <span className="text-zinc-300">
              {deliveryConfig?.to?.length ? (
                deliveryConfig.to.join(", ")
              ) : (
                <span className="text-zinc-600 italic">Not set</span>
              )}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-500 w-24 shrink-0">CC</span>
            <span className="text-zinc-300">
              {deliveryConfig?.cc?.length ? (
                deliveryConfig.cc.join(", ")
              ) : (
                <span className="text-zinc-600 italic">Not set</span>
              )}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-500 w-24 shrink-0">BCC</span>
            <span className="text-zinc-300">
              {deliveryConfig?.bcc?.length ? (
                deliveryConfig.bcc.join(", ")
              ) : (
                <span className="text-zinc-600 italic">Not set</span>
              )}
            </span>
          </div>
          {/* <div className="flex gap-2">
            <span className="text-zinc-500 w-24 shrink-0">Reply To</span>
            <span className="text-zinc-300">
              {deliveryConfig?.replyToField ? (
                deliveryConfig.replyToField
              ) : (
                <span className="text-zinc-600 italic">Not set</span>
              )}
            </span>
          </div> */}
        </div>
      </section>

      {/* Section 2 — Settings */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-5">
        <h3 className="text-sm font-semibold text-zinc-300">Settings</h3>

        {/* Save Submission */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <Checkbox
              id="saveSubmission"
              defaultChecked={saveSubmission ?? true}
            />
            <Label
              htmlFor="saveSubmission"
              className="text-zinc-300 text-sm cursor-pointer font-normal"
            >
              Save Submission
            </Label>
          </div>
          <p className="text-[11px] text-zinc-600 ml-7">
            By default, all form submissions are saved. Uncheck to disable
            submission storage for this template.
          </p>
        </div>

        {/* Auto Reply */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="autoReply"
            defaultChecked={autoReplyConfig?.enabled ?? false}
          />
          <Label
            htmlFor="autoReply"
            className="text-zinc-300 text-sm cursor-pointer font-normal"
          >
            Auto Reply
          </Label>
        </div>

        {/* Webhook */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="webhook"
            defaultChecked={webhookConfig?.enabled ?? false}
          />
          <Label
            htmlFor="webhook"
            className="text-zinc-300 text-sm cursor-pointer font-normal"
          >
            Enable Webhook
          </Label>
        </div>
      </section>
    </div>
  );
};

export default Config;
