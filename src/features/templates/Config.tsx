import { useState } from "react";
import { Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Template } from "@/types/template";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BackButton from "@/components/button/BackButton";
import { DeliveryConfigForm } from "@/forms/DeliveryConfigForm";
import { TemplateAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import Mandatory from "@/components/form/Mandatory";
import ConfigSkeleton from "@/components/skeleton/ConfigSkeleton";

interface ConfigProps {
  template: Template | null;
  loadingTemplate: boolean;
}

const Config = ({ template, loadingTemplate }: ConfigProps) => {
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const autoReplyMutation = useMutation({
    mutationFn: () =>
      TemplateAPI.toggleAutoReplyStatus(template!.projectId, template!.id),
    onSuccess: (res) => {
      queryClient.setQueryData<Template>(
        ["template", template!.projectId, template!.id],
        (old) => (old ? { ...old, ...res.data?.data } : old),
      );
      toast.success(res.data?.message ?? "Auto Reply status updated", {
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error) || "Failed to update Auto Reply status.",
        { position: "top-right" },
      );
    },
  });

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
            onClick={() => setDeliveryDialogOpen(true)}
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
        </div>
      </section>

      {/* Delivery Config Dialog */}
      <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
        <DialogContent className="bg-[#1A2235] border-[#2A3550] text-zinc-300 max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              Edit Delivery Config
            </DialogTitle>
          </DialogHeader>
          <DeliveryConfigForm
            template={template}
            onSuccess={() => setDeliveryDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Section 2 — Settings */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-5">
        <h3 className="text-sm font-semibold text-zinc-300">Settings</h3>

        {/* Save Submission */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <Checkbox
              id="saveSubmission"
              checked={saveSubmission ?? true}
              onCheckedChange={() => {}}
              className="cursor-not-allowed"
            />
            <Label
              htmlFor="saveSubmission"
              className="text-zinc-300 text-sm font-normal"
            >
              Save Submission <Mandatory />
              <span className="text-[11px] text-zinc-600">
                By default, all form submissions are saved.
              </span>
            </Label>
          </div>
        </div>

        {/* Auto Reply */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="autoReply"
            checked={autoReplyConfig?.enabled ?? false}
            disabled={autoReplyMutation.isPending}
            onCheckedChange={() => autoReplyMutation.mutate()}
          />
          <Label
            htmlFor="autoReply"
            className="text-zinc-300 text-sm cursor-pointer font-normal flex items-center gap-2"
          >
            Auto Reply
            {autoReplyMutation.isPending && (
              <Spinner className="size-3.5 text-zinc-500" />
            )}
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
