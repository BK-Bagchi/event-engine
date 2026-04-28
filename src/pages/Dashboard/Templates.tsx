import { useState } from "react";
import { useNavigate } from "react-router-dom";
//prettier-ignore
import { FileText, Activity, Tag, FolderOpen, Layers, Plus } from "lucide-react";
//prettier-ignore
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import ProjectPreviewDrawer from "@/components/drawer/ProjectPreview";
import ServicePreviewDrawer from "@/components/drawer/ServicePreview";
import { CreateTemplateForm } from "@/forms/CreateTemplateForm";
import type { Project } from "@/types/project";
import type { Service } from "@/types/service";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { useAllTemplates } from "@/hooks/queries/template";

// ── Status badge ──────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  DRAFT: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  ARCHIVED: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase() ?? "DRAFT";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[s] ?? statusStyles.DRAFT}`}
    >
      <Activity size={10} />
      {s.toLowerCase()}
    </span>
  );
};

// ── Category badge ────────────────────────────────────────────
const categoryStyles: Record<string, string> = {
  CONTACT: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
  AUTO_REPLY: "bg-purple-500/10 text-purple-400 border border-purple-500/25",
  SUPPORT: "bg-orange-500/10 text-orange-400 border border-orange-500/25",
  BOOKING: "bg-teal-500/10 text-teal-400 border border-teal-500/25",
  CUSTOM: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/25",
};

const CategoryBadge = ({ category }: { category: string }) => {
  const c = category?.toUpperCase() ?? "CUSTOM";
  const label = c.replace("_", " ");
  return (
    <span
      className={`w-fit inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${categoryStyles[c] ?? categoryStyles.CUSTOM}`}
    >
      <Tag size={10} />
      {label.toLowerCase()}
    </span>
  );
};

// ── Main component ────────────────────────────────────────────
const Templates = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceDrawerOpen, setServiceDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { templates, loadingTemplates: isLoading } = useAllTemplates();

  const openProjectPreview = (project: Project) => {
    setSelectedProject(project);
    setProjectDrawerOpen(true);
  };

  const openServicePreview = (service: Service) => {
    setSelectedService(service);
    setServiceDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Templates</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage and monitor your email templates.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold flex items-center gap-2"
        >
          <Plus size={16} />
          Create New Template
        </Button>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <Empty className="border border-dashed border-[#2A3550] bg-[#1A2235]/50 min-h-85">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-12 bg-[#2A3550] rounded-xl"
              >
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="bg-[#1A2235] border border-[#2A3550] ring-0 hover:border-brand-blue/40 transition-colors"
              >
                <CardHeader className="border-b border-[#2A3550] pb-3">
                  <CardTitle className="text-zinc-100 text-sm font-semibold truncate">
                    {template.name}
                  </CardTitle>
                  <CardDescription>
                    <StatusBadge status={template.status} />
                  </CardDescription>
                  <CardAction className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        template.project && openProjectPreview(template.project)
                      }
                      className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
                    >
                      Project
                    </button>
                    <button
                      onClick={() =>
                        template.service && openServicePreview(template.service)
                      }
                      className="text-[11px] font-medium text-brand-blue hover:text-brand-hover-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/10 rounded px-2 py-0.5 transition-colors"
                    >
                      Service
                    </button>
                  </CardAction>
                </CardHeader>

                <CardContent className="pt-3 flex flex-col gap-2">
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed min-h-8">
                    {template.description || (
                      <span className="italic text-zinc-600">
                        No description provided.
                      </span>
                    )}
                  </p>
                  <CategoryBadge category={template.category} />
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <FolderOpen size={11} />
                      <span className="truncate max-w-34">
                        {template.project?.name ?? "—"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers size={11} />
                      <span className="truncate max-w-34">
                        {template.service?.name ?? "—"}
                      </span>
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="bg-transparent border-t border-[#2A3550] flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-transparent border-[#2A3550] text-zinc-300 hover:bg-[#2A3550] hover:text-white"
                    onClick={() =>
                      navigate(
                        `/dashboard/templates/${template.project._id}/${template.id}`,
                      )
                    }
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Project Preview Drawer */}
        <ProjectPreviewDrawer
          project={selectedProject}
          open={projectDrawerOpen}
          onClose={() => {
            setProjectDrawerOpen(false);
            setSelectedProject(null);
          }}
        />

        {/* Service Preview Drawer */}
        <ServicePreviewDrawer
          service={selectedService}
          open={serviceDrawerOpen}
          onClose={() => {
            setServiceDrawerOpen(false);
            setSelectedService(null);
          }}
        />
      </div>

      {/* Create Template Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A2235] border border-[#2A3550] text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-lg">
              Create New Template
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Configure a new email template for your project and service.
            </DialogDescription>
          </DialogHeader>
          <CreateTemplateForm onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
