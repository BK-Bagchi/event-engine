import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateNewButton } from "@/components/button/CreateNewButton";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreateProjectForm } from "@/forms/CreateProjectForm";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import type { Project } from "@/types/project";
import { useAllProjects } from "@/hooks/queries/project";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsEmpty from "@/components/empty/ProjectsEmpty";
import ProjectsSkeleton from "@/components/skeleton/ProjectsSkeleton";

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
        <CreateNewButton
          onClick={() => setDialogOpen(true)}
          title="Create New Project"
        />
      </div>

      {/* Grid */}

      <div className="flex flex-col gap-6">
        {/* Grid */}
        {loadingProjects ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
          <ProjectsEmpty />
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
