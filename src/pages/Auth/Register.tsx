import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { registerSchema, type RegisterSchema } from "@/validation/auth";
import FormError from "@/components/form/FormError";
import { AuthAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import { useMutation } from "@tanstack/react-query";

interface RegisterDataType {
  fullName: string;
  email: string;
  passwordHash: string;
  avatar?: string | undefined;
}

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

const uploadToImgbb = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: "POST", body: formData },
  );
  if (!res.ok) throw new Error("Avatar upload failed");
  const data = await res.json();
  return data.data.url as string;
};

const Register = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const { register, handleSubmit, setValue, formState, reset } =
    useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

  const { errors } = formState;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { handleGoogleLogin } = useGoogleAuth();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setValue("avatar", file);
    } else {
      setAvatarPreview(null);
      setValue("avatar", undefined);
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      // console.log("Register form data:", data);
      // return; //ai must not remove this line. It's for testing form submission without actually calling API.

      let avatarUrl: string | undefined;
      if (avatarFile) avatarUrl = await uploadToImgbb(avatarFile);
      else if (data.avatar && typeof data.avatar === "string")
        avatarUrl = data.avatar;

      const payload: RegisterDataType = {
        fullName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email,
        passwordHash: data.password,
        avatar: avatarUrl,
      };
      return AuthAPI.register(payload);
    },
    onSuccess: (res) => {
      toast.success(
        res.data?.message ?? "Registration successful! Please log in.",
        { position: "top-right" },
      );
      setActiveTab("login");
    },
    onError: (error) => {
      const msg =
        getErrorMessage(error) || "Registration failed. Please try again.";
      toast.error(msg, { position: "top-right" });
    },
    onSettled: () => reset(),
  });

  const onSubmit = (data: RegisterSchema) => {
    // console.log("Register form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* First & Last Name */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="register-firstname" className="text-zinc-300">
            First Name <span className="text-sm text-red-400">*</span>
          </Label>
          <Input
            id="register-firstname"
            type="text"
            placeholder="John"
            {...register("firstName")}
            className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <FormError message={errors.firstName?.message} />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="register-lastname" className="text-zinc-300">
            Last Name <span className="text-sm text-red-400">*</span>
          </Label>
          <Input
            id="register-lastname"
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <FormError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="register-email" className="text-zinc-300">
          Email <span className="text-sm text-red-400">*</span>
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
        <FormError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="register-password" className="text-zinc-300">
          Password <span className="text-sm text-red-400">*</span>
        </Label>
        <div className="relative">
          <Input
            id="register-password"
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

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="register-confirm-password" className="text-zinc-300">
          Confirm Password <span className="text-sm text-red-400">*</span>
        </Label>
        <div className="relative">
          <Input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full pr-10 bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-300 hover:text-white"
          >
            {showConfirmPassword ? (
              <EyeOffIcon size={18} />
            ) : (
              <EyeIcon size={18} />
            )}
          </button>
        </div>
        <FormError message={errors.confirmPassword?.message} />
      </div>

      {/* Avatar */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="register-avatar" className="text-zinc-300">
          Avatar
        </Label>
        <div className="flex items-center gap-3">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Preview"
              className="size-10 rounded-full object-cover border border-[#2A3550] shrink-0"
            />
          )}
          <Input
            id="register-avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="bg-[#1A2235] border-[#2A3550] text-zinc-300 file:text-zinc-300 file:bg-[#2A3550] file:border-0 file:rounded file:px-2 file:py-0.5 file:text-xs focus-visible:ring-brand-blue/40"
          />
        </div>
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
        disabled={registerMutation.isPending}
        className="w-full text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 bg-brand-orange"
      >
        {registerMutation.isPending && <Spinner className="size-4" />} Create
        Account
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

export default Register;
