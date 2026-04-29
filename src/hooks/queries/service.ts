import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { ServiceAPI } from "@/api";
import type { Service } from "@/types/service";

export const useAllServices = () => {
  const query = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await ServiceAPI.getAllServices();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load services.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    services: query.data ?? [],
    loadingServices: query.isLoading,
    refetchServices: query.refetch,
  };
};

export const useProjectServices = ({ projectId }: { projectId: string }) => {
  const query = useQuery<Service[]>({
    queryKey: ["services", projectId],
    queryFn: async () => {
      const res = await ServiceAPI.getProjectServices(projectId);
      return res.data.data;
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load services.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    services: query.data ?? [],
    loadingServices: query.isLoading,
  };
};

export const useService = ({
  projectId,
  serviceId,
}: {
  projectId: string;
  serviceId: string;
}) => {
  const query = useQuery<Service>({
    queryKey: ["service", projectId, serviceId],
    queryFn: async () => {
      const res = await ServiceAPI.getService(projectId, serviceId);
      return res.data.data;
    },
    enabled: !!projectId && !!serviceId,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load service.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    service: query.data ?? null,
    loadingService: query.isLoading,
  };
};
