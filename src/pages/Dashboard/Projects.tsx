import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
//prettier-ignore
import { FolderOpen, Activity, BarChart2, Plus } from "lucide-react";
//prettier-ignore
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { CreateProjectForm } from "@/forms/CreateProjectForm";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";

export interface Settings {
  saveSubmissions: boolean;
  enableAutoReply: boolean;
  enableWebhook: boolean;
  requireCaptcha: boolean;
  rateLimitPerMinute: number;
  maxAttachmentSizeMB: number;
}

export interface UsageStats {
  totalRequests: number;
  totalSent: number;
  totalFailed: number;
  totalBlocked: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  publicKey: string;
  secretKey: string;
  allowedOrigins: string[];
  settings: Settings;
  usageStats: UsageStats;
  createdAt: string;
  updatedAt: string;
}

// ── Status badge ──────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  active: "bg-green-500/15 text-green-400 border border-green-500/30",
  inactive: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  suspended: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[status] ?? statusStyles.inactive}`}
  >
    <Activity size={10} />
    {status}
  </span>
);

// ── Card Skeleton ─────────────────────────────────────────────
const ProjectCardSkeleton = () => (
  <Card className="bg-[#1A2235] border-[#2A3550] ring-0 border">
    <CardHeader className="border-b border-[#2A3550] pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-2/3 bg-[#2A3550]" />
          <Skeleton className="h-3 w-1/3 bg-[#2A3550]" />
        </div>
        <Skeleton className="h-6 w-16 rounded-md bg-[#2A3550]" />
      </div>
    </CardHeader>
    <CardContent className="pt-3 flex flex-col gap-2">
      <Skeleton className="h-3 w-full bg-[#2A3550]" />
      <Skeleton className="h-3 w-4/5 bg-[#2A3550]" />
    </CardContent>
    <CardFooter className="bg-transparent border-t border-[#2A3550] flex items-center justify-between">
      <Skeleton className="h-3 w-24 bg-[#2A3550]" />
      <Skeleton className="h-7 w-20 rounded-md bg-[#2A3550]" />
    </CardFooter>
  </Card>
);

// ── Main component ────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ProjectAPI.getAllProjects();
      setProjects(res.data.data);
    } catch (error) {
      const msg = getErrorMessage(error) || "Failed to load projects.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
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
              <Card
                key={project.id}
                className="bg-[#1A2235] border border-[#2A3550] ring-0 hover:border-brand-blue/40 transition-colors"
              >
                <CardHeader className="border-b border-[#2A3550] pb-3">
                  <CardTitle className="text-zinc-100 text-sm font-semibold truncate">
                    {project.name}
                  </CardTitle>
                  <CardDescription>
                    <StatusBadge status={project.status} />
                  </CardDescription>
                  <CardAction>
                    <button
                      onClick={() => openPreview(project)}
                      className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
                    >
                      Preview
                    </button>
                  </CardAction>
                </CardHeader>

                <CardContent className="pt-3">
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed min-h-10">
                    {project.description || (
                      <span className="italic text-zinc-600">
                        No description provided.
                      </span>
                    )}
                  </p>
                </CardContent>

                <CardFooter className="bg-transparent border-t border-[#2A3550] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <BarChart2 size={13} className="text-zinc-500" />
                    <span>
                      {project.usageStats?.totalRequests?.toLocaleString() ?? 0}{" "}
                      requests
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-transparent border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] hover:text-white"
                    onClick={() => openPreview(project)}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
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

          <CreateProjectForm
            loading={submitting}
            setSubmitting={setSubmitting}
            fetchProjects={fetchProjects}
            setDialogOpen={setDialogOpen}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
