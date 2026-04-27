import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { WorkflowAPI } from "@/api";

export const useProjectWorkflows = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: ["workflows", projectId],
    queryFn: async () => {
      const res = await WorkflowAPI.getProjectWorkflows(projectId);
      return res.data.data;
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load workflows.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    workflows: query.data ?? [],
    loadingWorkflows: query.isLoading,
  };
};

export const useTemplateWorkflows = ({
  projectId,
  templateId,
}: {
  projectId: string;
  templateId: string;
}) => {
  const query = useQuery({
    queryKey: ["workflows", projectId, templateId],
    queryFn: async () => {
      const res = await WorkflowAPI.getTemplateWorkflows(projectId, templateId);
      return res.data.data;
    },
    enabled: !!projectId && !!templateId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load workflows.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    workflows: query.data ?? [],
    loadingWorkflows: query.isLoading,
  };
};

export const useWorkflow = ({
  projectId,
  templateId,
  workflowId,
}: {
  projectId: string;
  templateId: string;
  workflowId: string;
}) => {
  const query = useQuery({
    queryKey: ["workflow", projectId, templateId, workflowId],
    queryFn: async () => {
      const res = await WorkflowAPI.getWorkflow(
        projectId,
        templateId,
        workflowId,
      );
      return res.data.data;
    },
    enabled: !!projectId && !!templateId && !!workflowId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load workflow.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    workflow: query.data ?? null,
    loadingWorkflow: query.isLoading,
  };
};
