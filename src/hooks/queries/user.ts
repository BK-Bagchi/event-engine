import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { UserAPI } from "@/api";

export const useProfile = () => {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await UserAPI.getProfile();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Failed to load profile.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    profile: query.data ?? null,
    loadingProfile: query.isLoading,
  };
};
