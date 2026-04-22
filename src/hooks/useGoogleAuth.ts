import { useNavigate } from "react-router-dom";
import type { CredentialResponse } from "@react-oauth/google";
import googleLogin from "@/utils/googleLogin";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

const useGoogleAuth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await googleLogin(credentialResponse);
      console.log("Google login response:", res);
      const { user, token, message } = res.data ?? {};
      login(user, token);
      toast.success(message ?? "Logged in with Google", {
        position: "top-right",
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = getErrorMessage(err) || "Google login failed";
      toast.error(msg, { position: "top-right" });
    }
  };

  return { handleGoogleLogin };
};

export default useGoogleAuth;
