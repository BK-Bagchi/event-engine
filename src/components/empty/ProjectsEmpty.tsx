import { FolderOpen } from "lucide-react";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

const ProjectsEmpty = () => {
  return (
    <Empty className="border border-dashed border-[#2A3550] bg-[#1A2235]/50 min-h-85">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-12 bg-[#2A3550] rounded-xl">
          <FolderOpen size={22} className="text-zinc-400" />
        </EmptyMedia>
        <EmptyTitle className="text-zinc-200 text-base">
          No projects yet
        </EmptyTitle>
        <EmptyDescription className="text-zinc-500">
          You haven't created any projects. Get started by creating your first
          project.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default ProjectsEmpty;
