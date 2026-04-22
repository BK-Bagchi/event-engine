import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AuthAPI } from "@/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendOtpSchema, type SendOTPType } from "@/validation/auth";
import { getErrorMessage } from "@/utils/error";
import FormError from "@/components/form/FormError";

type Step = "email" | "otp" | "reset" | "success";
type Props = {
  email: string;
  setEmail: (v: string) => void;
  setStep: (s: Step) => void;
  setActiveTab: (tab: string) => void;
  setUserId: (id: string) => void;
};

export default function EmailStep({
  email,
  setEmail,
  setStep,
  setActiveTab,
  setUserId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SendOTPType>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email },
  });

  const onSubmit = async (data: SendOTPType) => {
    console.log("EmailStep form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    setLoading(true);
    try {
      const res = await AuthAPI.sendPasswordResetOTP(data);
      console.log("sendPasswordResetOTP response:", res);
      setEmail(data.email);
      toast.success(res.data?.message ?? "OTP sent successfully", {
        position: "top-right",
      });
      setUserId(res.data.data.userId ?? ""); // Store user ID for later steps
    } catch (error) {
      console.error("Send OTP error:", error);
      const msg =
        getErrorMessage(error) || "Failed to send OTP. Please try again.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setLoading(false);
      setStep("otp");
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white mb-1">
          Forgot Password?
        </h2>
        <p className="text-sm text-zinc-400">
          Enter your email to receive a password reset code.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-zinc-300">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
        <FormError message={errors.email?.message} />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full text-white font-semibold disabled:opacity-60 bg-brand-blue"
      >
        {loading ? <Spinner className="size-4" /> : "Send Reset Code"}
      </Button>

      <button
        type="button"
        onClick={() => setActiveTab("login")}
        className="text-sm text-brand-blue hover:text-brand-hover-blue transition-colors text-center"
      >
        Back to Login
      </button>
    </form>
  );
}
