import { useState } from "react";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import type { Project } from "@/types/project";

interface ProjectSectionProps {
  project: Project;
}

const ProjectSection = ({ project }: ProjectSectionProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
        <div className="flex items-center gap-2 mb-5">
          <Layers size={15} className="text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Assigned Project
          </h2>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-base font-semibold text-zinc-100 truncate">
              {project.name}
            </p>
            {project.slug && (
              <p className="text-xs font-mono text-zinc-500">/{project.slug}</p>
            )}
            {project.description && (
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDrawerOpen(true)}
            className="shrink-0 border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] hover:text-white"
          >
            Preview
          </Button>
        </div>
      </section>

      <ProjectPreviewDrawer
        project={project}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default ProjectSection;
