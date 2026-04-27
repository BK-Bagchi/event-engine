import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { AuthAPI } from "@/api";

export const useVerifyToken = () => {
  const query = useQuery({
    queryKey: ["verify-token"],
    queryFn: async () => {
      const res = await AuthAPI.verifyToken();
      return res.data;
    },
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error) || "Token verification failed.";
      toast.error(msg, { position: "top-right" });
    }
  }, [query.isError, query.error]);

  return {
    tokenData: query.data ?? null,
    loadingToken: query.isLoading,
  };
};
