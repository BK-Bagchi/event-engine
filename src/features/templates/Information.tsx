import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/button/BackButton";
//prettier-ignore
import type { Template, TemplateCategory, TemplateStatus } from "@/types/template";
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InformationProps {
  template: Template | null;
  loadingTemplate: boolean;
}

const CATEGORY_OPTIONS: { value: TemplateCategory; label: string }[] = [
  { value: "CONTACT", label: "Contact" },
  { value: "AUTO_REPLY", label: "Auto Reply" },
  { value: "SUPPORT", label: "Support" },
  { value: "BOOKING", label: "Booking" },
  { value: "CUSTOM", label: "Custom" },
];

const STATUS_OPTIONS: { value: TemplateStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

const InformationSkeleton = () => (
  <div className="max-w-6xl mx-auto flex flex-col gap-6">
    <Skeleton className="h-5 w-36 bg-[#2A3550]/60" />
    {/* Section 1 skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <Skeleton className="h-6 w-48 mb-3 bg-[#2A3550]/60" />
      <Skeleton className="h-4 w-full bg-[#2A3550]/60" />
      <Skeleton className="h-4 w-2/3 mt-2 bg-[#2A3550]/60" />
    </section>
    {/* Section 2 skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <Skeleton className="h-4 w-20 mb-3 bg-[#2A3550]/60" />
      <Skeleton className="h-8 w-44 bg-[#2A3550]/60" />
    </section>
    {/* Section 3 skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <Skeleton className="h-4 w-16 mb-3 bg-[#2A3550]/60" />
      <Skeleton className="h-8 w-44 bg-[#2A3550]/60" />
    </section>
  </div>
);

const Information = ({ template, loadingTemplate }: InformationProps) => {
  if (loadingTemplate) return <InformationSkeleton />;

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

      {/* Section 1 — Name & Description */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          {template.name}
        </h2>
        {template.description ? (
          <p className="text-sm text-zinc-400">{template.description}</p>
        ) : (
          <p className="text-sm text-zinc-600 italic">
            No description provided.
          </p>
        )}
      </section>

      {/* Section 2 — Category */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-3">Category</h3>
        <Select value={template.category} disabled>
          <SelectTrigger className="w-44 border-[#2A3550] bg-[#0B1120] text-zinc-300 disabled:opacity-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-300">
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Section 3 — Status */}
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-3">Status</h3>
        <Select value={template.status} disabled>
          <SelectTrigger className="w-44 border-[#2A3550] bg-[#0B1120] text-zinc-300 disabled:opacity-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A2235] border-[#2A3550] text-zinc-300">
            {STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </div>
  );
};

export default Information;
