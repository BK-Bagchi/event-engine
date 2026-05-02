import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/validation/auth";
import { AuthAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";
import FormError from "@/components/form/FormError";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import { useMutation } from "@tanstack/react-query";

interface LoginDataType {
  email: string;
  passwordHash: string;
}

const Login = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const [showPassword, setShowPassword] = useState(false);

  const { handleGoogleLogin } = useGoogleAuth();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginDataType) => AuthAPI.login(payload),
    onSuccess: (res) => {
      const { token, data: userData } = res.data || {};
      login(userData, token);
      toast.success(res.data?.message ?? "Logged in successfully", {
        position: "top-right",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Login failed. Please try again.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const onSubmit = (data: LoginSchema) => {
    // console.log("Login form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    loginMutation.mutate({ email: data.email, passwordHash: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
        <FormError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-zinc-300">
            Password
          </Label>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="w-full pr-10 bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-300 hover:text-white"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        <FormError message={errors.password?.message} />
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end -mt-2">
        <a
          href="#"
          className="text-xs text-brand-blue hover:text-brand-hover-blue transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("forgot-password");
          }}
        >
          Forgot Password?
        </a>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 bg-brand-blue"
      >
        {loginMutation.isPending && <Spinner className="size-4" />} Login
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2A3550]" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="flex-1 h-px bg-[#2A3550]" />
      </div>

      {/* Google Auth */}
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() =>
          toast.error("Google login failed", { position: "top-right" })
        }
      />
    </form>
  );
};

export default Login;
