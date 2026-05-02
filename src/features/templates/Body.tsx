import { useState, useEffect, useRef } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Template, TemplateVariable } from "@/types/template";
import * as TemplateAPI from "@/api/template";
import { htmlToText, textToHtml } from "@/utils/templateConversion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getErrorMessage } from "@/utils/error";
import BackButton from "@/components/button/BackButton";
import { TemplateBodyEditor } from "@/components/templates/TemplateBodyEditor";
import { AddVariableForm } from "@/forms/AddVariableForm";
import { EditVariableForm } from "@/forms/EditVariableForm";
import DeleteVariableAlert from "@/alerts/DeleteVariableAlert";
import { CreateNewButton } from "@/components/button/CreateNewButton";

interface BodyProps {
  template: Template | null;
  loadingTemplate: boolean;
}

const BodySkeleton = () => (
  <div className="max-w-6xl mx-auto flex flex-col gap-6">
    <Skeleton className="h-5 w-36 bg-[#2A3550]/60" />
    {/* Variables skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-20 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-44 bg-[#2A3550]/60" />
      </div>
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton
              className={`h-4 bg-[#2A3550]/60 ${i === 0 ? "w-24" : i === 1 ? "w-32" : "w-20"}`}
            />
            <Skeleton className="h-7 w-14 bg-[#2A3550]/60" />
          </div>
        ))}
      </div>
    </section>
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-6">
      {/* Subject skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-36 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-52 bg-[#2A3550]/60" />
        <Skeleton className="h-8 w-full bg-[#2A3550]/60" />
      </div>
      {/* HTML Template skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-32 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-60 bg-[#2A3550]/60" />
        <Skeleton className="h-32 w-full bg-[#2A3550]/60" />
      </div>
      {/* Text Template skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-56 bg-[#2A3550]/60" />
        <Skeleton className="h-32 w-full bg-[#2A3550]/60" />
      </div>
    </section>
  </div>
);

const Body = ({ template, loadingTemplate }: BodyProps) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    variable: TemplateVariable;
    index: number;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    variable: TemplateVariable;
    index: number;
  } | null>(null);

  // ── Body field state ──────────────────────────────────────────────────────
  const [subjectValue, setSubjectValue] = useState("");
  const [htmlValue, setHtmlValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [activeMode, setActiveMode] = useState<"html" | "text">("html");

  const queryClient = useQueryClient();
  const templateIdRef = useRef<string | undefined>(undefined);

  // Sync local state only when the template ID changes (not on every re-render)
  useEffect(() => {
    if (!template || template.id === templateIdRef.current) return;
    templateIdRef.current = template.id;
    setSubjectValue(template.subjectTemplate ?? "");
    setHtmlValue(template.htmlTemplate ?? "");
    setTextValue(template.textTemplate ?? "");
  }, [template]);

  // Derived: has the user changed anything?
  const isDirty = template
    ? subjectValue !== (template.subjectTemplate ?? "") ||
      htmlValue !== (template.htmlTemplate ?? "") ||
      textValue !== (template.textTemplate ?? "")
    : false;

  const saveMutation = useMutation({
    mutationFn: () =>
      TemplateAPI.updateTemplateConfig(template!.projectId, template!.id, {
        subjectTemplate: subjectValue,
        htmlTemplate: htmlValue,
        textTemplate: textValue,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["template", template!.projectId, template!.id],
      });
      toast.success(res.data?.message ?? "Template body saved.", {
        position: "top-right",
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to save template body.";
      toast.error(msg, { position: "top-right" });
    },
  });

  // Conversion handlers
  function handleHtmlChange(val: string) {
    setHtmlValue(val);
    setTextValue(htmlToText(val));
  }

  function handleTextChange(val: string) {
    setTextValue(val);
    setHtmlValue(textToHtml(val));
  }

  const onSubmit = () => {
    //prettier-ignore
    // console.log("Submitting with values:", { subjectValue, htmlValue, textValue });
    // return; //ai must not remove this log and return statement, it's for debugging purposes. Remove it once verified.

    saveMutation.mutate();
  };

  if (loadingTemplate) return <BodySkeleton />;

  if (!template)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500 text-sm">Template not found.</p>
      </div>
    );

  return (
    <>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Back button */}
        <BackButton to="/dashboard/templates" text="Back to Templates" />

        {/* Variables */}
        <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">Variables</h3>
            <div className="flex items-center gap-3">
              {template.variables?.length > 0 && (
                <p className="text-[11px] text-zinc-600">
                  Use{" "}
                  <span className="font-mono text-zinc-500">
                    &#123;&#123;key&#125;&#125;
                  </span>{" "}
                  in templates to insert variable values.
                </p>
              )}
              <CreateNewButton
                onClick={() => setAddDialogOpen(true)}
                title="Add Variable"
              />
            </div>
          </div>
          {template.variables?.length > 0 ? (
            <ul className="flex gap-2">
              {template.variables.map((variable, idx) => (
                <li
                  key={idx}
                  className="w-fit flex items-center justify-between rounded-lg border border-[#2A3550] bg-[#0B1120] px-4 py-2.5"
                >
                  <span className="font-mono text-sm text-zinc-300">
                    &#123;&#123;{variable.key}&#125;&#125;
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditTarget({ variable, index: idx })}
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-200 hover:bg-[#2A3550]"
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget({ variable, index: idx })}
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-[#2A3550]"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-600 italic">
              No variables defined.
            </p>
          )}
        </section>

        {/* Body section */}
        <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-6">
          {/* Section header + Save button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-300">
                Template Body
              </h3>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                Edit HTML or plain text — the other field is auto-derived.
              </p>
            </div>
            {isDirty && (
              <Button
                size="sm"
                onClick={onSubmit}
                disabled={saveMutation.isPending}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saveMutation.isPending ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <Save size={13} />
                )}
                Save
              </Button>
            )}
          </div>

          {/* Subject Template */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-sm">Subject Template</Label>
            <p className="text-[11px] text-zinc-600">
              The subject line of the email.
            </p>
            <Input
              value={subjectValue}
              onChange={(e) => setSubjectValue(e.target.value)}
              placeholder="e.g. New submission from {{name}}"
              className="border-[#2A3550] bg-[#0B1120] text-zinc-300 placeholder:text-zinc-600"
            />
          </div>

          {/* Template Body Editor Component */}
          <TemplateBodyEditor
            htmlValue={htmlValue}
            textValue={textValue}
            activeMode={activeMode}
            onHtmlChange={handleHtmlChange}
            onTextChange={handleTextChange}
            onModeChange={setActiveMode}
          />
        </section>
      </div>

      {/* ── Add Variable Dialog ─────────────────────────────── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-[#1A2235] border-[#2A3550] text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Add Variable</DialogTitle>
          </DialogHeader>
          <AddVariableForm
            projectId={template.projectId}
            templateId={template.id}
            existingVariables={template.variables ?? []}
            onClose={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Edit Variable Dialog ────────────────────────────── */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent className="bg-[#1A2235] border-[#2A3550] text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Variable</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <EditVariableForm
              projectId={template.projectId}
              templateId={template.id}
              variable={editTarget.variable}
              variableIndex={editTarget.index}
              allVariables={template.variables ?? []}
              onClose={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Variable Alert ───────────────────────────── */}
      {deleteTarget && (
        <DeleteVariableAlert
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          projectId={template.projectId}
          templateId={template.id}
          variable={deleteTarget.variable}
          variableIndex={deleteTarget.index}
          allVariables={template.variables ?? []}
        />
      )}
    </>
  );
};

export default Body;
