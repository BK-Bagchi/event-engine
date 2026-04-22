import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AuthAPI } from "@/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordType } from "@/validation/auth";
import FormError from "@/components/form/FormError";

type Step = "email" | "otp" | "reset" | "success";
type Props = {
  userId: string;
  otpId: string;
  setStep: (s: Step) => void;
};

export default function ResetStep({ userId, otpId, setStep }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      userId,
      otpId,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordType) => {
    console.log("ResetStep form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    setLoading(true);
    try {
      const payload = {
        userId: data.userId,
        otpId: data.otpId,
        newPassword: data.newPassword,
      };
      const res = await AuthAPI.resetPassword(payload);
      console.log("resetPassword response:", res);
      toast.success(res.data?.message ?? "Password reset successfully", {
        position: "top-right",
      });
      setStep("success");
    } catch (error) {
      console.error("Reset password error:", error);
      const msg =
        getErrorMessage(error) || "Failed to reset password. Please try again.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password" className="text-zinc-300">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            {...register("newPassword")}
            className="w-full pr-10 bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <button
            type="button"
            aria-label={showNew ? "Hide password" : "Show password"}
            onClick={() => setShowNew((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-300 hover:text-white"
          >
            {showNew ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        <FormError message={errors.newPassword?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-password" className="text-zinc-300">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full pr-10 bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <button
            type="button"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-300 hover:text-white"
          >
            {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        <FormError message={errors.confirmPassword?.message} />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold disabled:opacity-60 bg-brand-blue"
      >
        {loading ? <Spinner className="size-4" /> : "Reset Password"}
      </Button>

      <button
        type="button"
        onClick={() => setStep("otp")}
        className="text-sm text-brand-blue hover:text-brand-hover-blue transition-colors text-center"
      >
        ← Back to Verification
      </button>
    </form>
  );
}
