import { useState } from "react";
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

interface LoginDataType {
  email: string;
  passwordHash: string;
}

const Login = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginSchema) => {
    console.log("Login form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    setLoading(true);
    try {
      const payload: LoginDataType = {
        email: data.email,
        passwordHash: data.password,
      };
      const res = await AuthAPI.login(payload);
      console.log("Login response:", res);
      toast.success(res.data?.message ?? "Logged in successfully", {
        position: "top-right",
      });
      // handle post-login actions (redirect, store token, etc.) elsewhere
    } catch (error) {
      console.error("Login error:", error);
      const msg = getErrorMessage(error) || "Login failed. Please try again.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setLoading(false);
    }
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
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
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
        disabled={loading}
        className="w-full text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 bg-brand-blue"
      >
        {loading && <Spinner className="size-4" />} Login
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2A3550]" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="flex-1 h-px bg-[#2A3550]" />
      </div>

      {/* Google Auth */}
      <Button
        type="button"
        variant="outline"
        className="w-full bg-[#1A2235] border-[#2A3550] text-zinc-200 hover:bg-[#111827] hover:text-white flex items-center gap-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
};

export default Login;
