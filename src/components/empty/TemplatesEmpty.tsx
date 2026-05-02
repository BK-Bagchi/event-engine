import { FileText } from "lucide-react";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

const TemplatesEmpty = () => {
  return (
    <Empty className="border border-dashed border-[#2A3550] bg-[#1A2235]/50 min-h-85">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-12 bg-[#2A3550] rounded-xl">
          <FileText size={22} className="text-zinc-400" />
        </EmptyMedia>
        <EmptyTitle className="text-zinc-200 text-base">
          No templates yet
        </EmptyTitle>
        <EmptyDescription className="text-zinc-500">
          You haven't created any templates yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default TemplatesEmpty;
