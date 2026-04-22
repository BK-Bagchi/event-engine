import type { CredentialResponse } from "@react-oauth/google";
import { AuthAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";

const googleLogin = async (credentialResponse: CredentialResponse) => {
  try {
    if (!credentialResponse || !credentialResponse.credential)
      throw new Error("Google login failed: No credential returned");

    const token = credentialResponse.credential;
    const res = await AuthAPI.oauthLogin({ token });

    return res;
  } catch (error) {
    const msg =
      getErrorMessage(error) || "Google login failed. Please try again.";
    throw new Error(msg);
  }
};

export default googleLogin;
