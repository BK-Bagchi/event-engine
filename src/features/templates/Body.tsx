import { Pencil } from "lucide-react";
import type { Template } from "@/types/template";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/button/BackButton";

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
  if (loadingTemplate) return <BodySkeleton />;

  if (!template)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500 text-sm">Template not found.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Back button */}
      <BackButton to="/dashboard/templates" text="Back to Templates" />

      {/* Variables */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-300">Variables</h3>
          {template.variables?.length > 0 && (
            <p className="text-[11px] text-zinc-600">
              Use{" "}
              <span className="font-mono text-zinc-500">
                &#123;&#123;key&#125;&#125;
              </span>{" "}
              in templates to insert variable values.
            </p>
          )}
        </div>
        {template.variables?.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {template.variables.map((variable, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-lg border border-[#2A3550] bg-[#0B1120] px-4 py-2.5"
              >
                <span className="font-mono text-sm text-zinc-300">
                  {variable.key}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] hover:text-white gap-1.5"
                >
                  <Pencil size={12} />
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-600 italic">No variables defined.</p>
        )}
      </section>

      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-6">
        {/* Subject Template */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-zinc-300 text-sm">Subject Template</Label>
          <p className="text-[11px] text-zinc-600">
            The subject line of the email.
          </p>
          <Input
            readOnly
            value={template.subjectTemplate ?? ""}
            placeholder="e.g. New submission from {{name}}"
            className="border-[#2A3550] bg-[#0B1120] text-zinc-300 placeholder:text-zinc-600"
          />
        </div>

        {/* HTML Template */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-zinc-300 text-sm">HTML Template</Label>
          <p className="text-[11px] text-zinc-600">
            The HTML-formatted body of the email.
          </p>
          <Textarea
            readOnly
            value={template.htmlTemplate ?? ""}
            placeholder="<p>Hello {{name}},</p>"
            className="border-[#2A3550] bg-[#0B1120] text-zinc-300 placeholder:text-zinc-600 min-h-32"
            style={{ resize: "both" }}
          />
        </div>

        {/* Text Template */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-zinc-300 text-sm">Text Template</Label>
          <p className="text-[11px] text-zinc-600">
            The plain-text fallback body of the email.
          </p>
          <Textarea
            readOnly
            value={template.textTemplate ?? ""}
            placeholder="Hello {{name}}, ..."
            className="border-[#2A3550] bg-[#0B1120] text-zinc-300 placeholder:text-zinc-600 min-h-32"
            style={{ resize: "both" }}
          />
        </div>
      </section>
    </div>
  );
};

export default Body;
