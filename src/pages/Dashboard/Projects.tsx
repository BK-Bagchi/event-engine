import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { CreateProjectForm } from "@/forms/CreateProjectForm";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import type { Project } from "@/types/project";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { useAllProjects } from "@/hooks/queries/project";
import ProjectCard from "@/components/projects/ProjectCard";

// ── Main component ────────────────────────────────────────────
const Projects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { projects, loadingProjects } = useAllProjects();

  const openPreview = (project: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header with Create button */}
      <div className="flex items-center justify-between">
        {/* Page header */}
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Projects</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage and monitor your event engine projects.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold flex items-center gap-2"
        >
          <Plus size={16} />
          Create New Project
        </Button>
      </div>

      {/* Grid */}

      <div className="flex flex-col gap-6">
        {/* Grid */}
        {loadingProjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Empty className="border border-dashed border-[#2A3550] bg-[#1A2235]/50 min-h-85">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-12 bg-[#2A3550] rounded-xl"
              >
                <FolderOpen size={22} className="text-zinc-400" />
              </EmptyMedia>
              <EmptyTitle className="text-zinc-200 text-base">
                No projects yet
              </EmptyTitle>
              <EmptyDescription className="text-zinc-500">
                You haven't created any projects. Get started by creating your
                first project.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPreview={() => openPreview(project)}
                onDetails={() => navigate(`/dashboard/projects/${project.id}`)}
              />
            ))}
          </div>
        )}

        {/* Drawer */}
        <ProjectPreviewDrawer
          project={selectedProject}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedProject(null);
          }}
        />
      </div>

      {/* Create Project Dialog - Outside grid */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A2235] border border-[#2A3550] text-white w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-lg">
              Create New Project
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Configure your new event engine project with name, allowed
              origins, and settings.
            </DialogDescription>
          </DialogHeader>

          <CreateProjectForm onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
