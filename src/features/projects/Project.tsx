import { useState } from "react";
import { Pencil, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditProjectForm } from "@/forms/EditProjectForm";
import StatusSection from "@/components/projects/StatusSection";
import KeysSection from "@/components/projects/KeysSection";
import OriginsSection from "@/components/projects/OriginsSection";
import SettingsSection from "@/components/projects/SettingsSection";
import UsageStatsSection from "@/components/projects/UsageStatsSection";
import BackButton from "@/components/button/BackButton";
import { useProject } from "@/hooks/queries/project";
import ProjectSkeleton from "@/components/skeleton/ProjectSkeleton";

const Project = ({ projectId: id }: { projectId: string }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { project, loadingProject } = useProject({ projectId: id });

  // ── Loading skeleton ───────────────────────────────────────
  if (loadingProject) return <ProjectSkeleton />;

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Back button */}
        <BackButton to="/dashboard/projects" text="Back to Projects" />

        {/* ── Section 1 — Info ─────────────────────────────── */}
        <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">
                {project.name}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Hash size={11} />
                <span className="font-mono">{project.slug}</span>
              </div>
              {project.description && (
                <p className="mt-1 text-sm text-zinc-400">
                  {project.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-600">
                <Calendar size={10} />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditDialogOpen(true)}
              className="shrink-0 border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] gap-1.5 hover:text-white"
            >
              <Pencil size={13} />
              Edit
            </Button>
          </div>
        </section>

        {/* ── Section 2 — Status ──────────────────────────── */}
        <StatusSection projectId={project.id} initialStatus={project.status} />

        {/* ── Section 3 — API Keys ────────────────────────── */}
        <KeysSection
          projectId={project.id}
          initialPublicKey={project.publicKey}
          initialSecretKey={project.secretKey}
        />

        {/* ── Section 4 — Allowed Origins ─────────────────── */}
        <OriginsSection
          projectId={project.id}
          initialOrigins={project.allowedOrigins}
        />

        {/* ── Section 5 — Settings ────────────────────────── */}
        <SettingsSection
          projectId={project.id}
          initialSettings={project.settings}
        />

        {/* ── Section 6 — Usage Stats ─────────────────────── */}
        <UsageStatsSection usageStats={project.usageStats} />
      </div>

      {/* ── Edit Project Dialog ─────────────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#1A2235] border-[#2A3550] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Project</DialogTitle>
          </DialogHeader>
          <EditProjectForm
            project={project}
            setEditDialogOpen={setEditDialogOpen}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Project;
