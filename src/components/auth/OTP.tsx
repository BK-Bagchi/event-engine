import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthAPI } from "@/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOTPType } from "@/validation/auth";
import FormError from "@/components/form/FormError";
import Timer from "@/components/others/Timer";

const TIMER_DURATION = 10 * 60; // 600 seconds

type Step = "email" | "otp" | "reset" | "success";
type Props = {
  email: string;
  userId: string;
  otpSentAt: number;
  setStep: (s: Step) => void;
  setOtpId: (id: string) => void;
};

export default function OTPStep({
  email,
  userId,
  otpSentAt,
  setStep,
  setOtpId,
}: Props) {
  const [otp, setOtp] = useState("");

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VerifyOTPType>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "", userId },
  });

  // ── Countdown timer ─────────────────────────────────────────
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - otpSentAt) / 1000);
    return Math.max(0, TIMER_DURATION - elapsed);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isExpired = secondsLeft <= 0;
  const timerMins = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const timerSecs = (secondsLeft % 60).toString().padStart(2, "0");

  // Keep form otp in sync with InputOTP changes
  const handleOtpChange = (val: string) => {
    setOtp(val);
    setValue("otp", val);
  };

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOTPType) => AuthAPI.verifyPasswordResetOTP(data),
    onSuccess: (res) => {
      toast.success(res.data?.message ?? "OTP verified successfully", {
        position: "top-right",
      });
      setOtpId(res.data?.data?.otpId ?? "");
      setStep("reset");
    },
    onError: (error) => {
      const msg =
        getErrorMessage(error) || "Failed to verify OTP. Please try again.";
      toast.error(msg, { position: "top-right" });
    },
    onSettled: () => reset(),
  });

  const onSubmit = (data: VerifyOTPType) => {
    // console.log("OTPStep form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    verifyOtpMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white mb-1">Verify Code</h2>
        <p className="text-sm text-zinc-400">
          Enter the 4-digit code sent to {email}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={handleOtpChange}
            containerClassName="gap-2"
          >
            <InputOTPGroup className="gap-1">
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="size-10 border-[#2A3550] bg-[#1A2235] text-white text-center font-semibold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <FormError message={errors.otp?.message} />
      </div>

      {/* Timer */}
      {/* prettier-ignore */}
      <Timer {...{isExpired, secondsLeft, timerMins, timerSecs, setStep}} />

      <Button
        type="submit"
        disabled={verifyOtpMutation.isPending || otp.length !== 4 || isExpired}
        className="w-full text-white font-semibold disabled:opacity-60 bg-brand-blue"
      >
        {verifyOtpMutation.isPending && (
          <>
            <Spinner className="size-4" /> Verifying...
          </>
        )}{" "}
        Verify Code
      </Button>

      <button
        type="button"
        onClick={() => setStep("email")}
        className="text-sm text-brand-blue hover:text-brand-hover-blue transition-colors text-center"
      >
        ← Back to Email
      </button>
    </form>
  );
}
