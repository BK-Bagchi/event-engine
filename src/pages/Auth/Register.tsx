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
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data: RegisterSchema) => {
    // console.log("Register form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    try {
      setLoading(true);

      // upload avatar first (if selected) and get URL
      let avatarUrl: string | undefined;
      if (avatarFile) avatarUrl = await uploadToImgbb(avatarFile);
      // if avatar already a URL in form data
      else if (data.avatar && typeof data.avatar === "string")
        avatarUrl = data.avatar;

      const payload: RegisterDataType = {
        fullName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email,
        passwordHash: data.password,
        avatar: avatarUrl,
      };
      const res = await AuthAPI.register(payload);
      console.log("Register response:", res);
      toast.success(
        res.data?.message ?? "Registration successful! Please log in.",
        {
          position: "top-right",
        },
      );
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
      const msg =
        getErrorMessage(error) || "Registration failed. Please try again.";
      toast.error(msg, { position: "top-right" });
    } finally {
      reset();
      setLoading(false);
    }
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
        disabled={loading}
        className="w-full text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 bg-brand-orange"
      >
        {loading && <Spinner className="size-4" />} Create Account
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

export default Register;
