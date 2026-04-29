import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { TemplateAPI } from "@/api";
import type { Template } from "@/types/template";

export const useAllTemplates = () => {
  const query = useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await TemplateAPI.getAllTemplates();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load templates.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    templates: query.data ?? [],
    loadingTemplates: query.isLoading,
  };
};

export const useProjectTemplates = ({ projectId }: { projectId: string }) => {
  const query = useQuery<Template[]>({
    queryKey: ["templates", projectId],
    queryFn: async () => {
      const res = await TemplateAPI.getProjectTemplates(projectId);
      return res.data.data;
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load templates.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    templates: query.data ?? [],
    loadingTemplates: query.isLoading,
  };
};

export const useServiceTemplates = ({
  projectId,
  serviceId,
}: {
  projectId: string;
  serviceId: string;
}) => {
  const query = useQuery<Template[]>({
    queryKey: ["templates", projectId, serviceId],
    queryFn: async () => {
      const res = await TemplateAPI.getServiceTemplates(projectId, serviceId);
      return res.data.data;
    },
    enabled: !!projectId && !!serviceId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load templates.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    templates: query.data ?? [],
    loadingTemplates: query.isLoading,
  };
};

export const useTemplate = ({
  projectId,
  templateId,
}: {
  projectId: string;
  templateId: string;
}) => {
  const query = useQuery<Template>({
    queryKey: ["template", projectId, templateId],
    queryFn: async () => {
      const res = await TemplateAPI.getTemplate(projectId, templateId);
      return res.data.data;
    },
    enabled: !!projectId && !!templateId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load template.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    template: query.data ?? null,
    loadingTemplate: query.isLoading,
  };
};
