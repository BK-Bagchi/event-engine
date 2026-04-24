import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Calendar, Hash } from "lucide-react";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import type { Project as ProjectType } from "@/types/project";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditProjectForm } from "@/forms/EditProjectForm";
import StatusSection from "./StatusSection";
import KeysSection from "./KeysSection";
import OriginsSection from "./OriginsSection";
import SettingsSection from "./SettingsSection";
import UsageStatsSection from "./UsageStatsSection";

// ── Skeleton placeholder ──────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[#2A3550]/60 ${className}`} />
);

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ProjectAPI.getProject(id!);
      setProject(res.data.data);
    } catch (error) {
      const msg = getErrorMessage(error) || "Failed to load project.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // ── Loading skeleton ───────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] p-6 flex flex-col gap-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>

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
              className="shrink-0 border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] gap-1.5"
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
            setProject={setProject}
            setEditDialogOpen={setEditDialogOpen}
            setEditLoading={setEditLoading}
            loading={editLoading}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Project;
