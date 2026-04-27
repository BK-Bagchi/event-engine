import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { ProjectAPI } from "@/api";
import type { Project } from "@/types/project";

export const useProject = ({ projectId }: { projectId: string }) => {
  const query = useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await ProjectAPI.getProject(projectId);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load project.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    project: query.data ?? null,
    loadingProject: query.isLoading,
  };
};
//api is getAllProjects, so the hook is useAllProjects. name like this everywhere, so it's consistent and easy to understand. if it's getProject, then the hook is useProject, which is also consistent and easy to understand. if we name it useProjects, it might be confusing because it sounds like it returns multiple projects, but it actually returns one project. same for services and templates. consistent naming is important for code readability and maintainability.
export const useAllProjects = () => {
  const query = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await ProjectAPI.getAllProjects();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load projects.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    projects: query.data ?? [],
    loadingProjects: query.isLoading,
  };
};
