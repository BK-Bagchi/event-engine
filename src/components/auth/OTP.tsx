import { useState } from "react";
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

type Step = "email" | "otp" | "reset" | "success";
type Props = {
  email: string;
  userId: string;
  setStep: (s: Step) => void;
  setOtpId: (id: string) => void;
};

export default function OTPStep({ email, userId, setStep, setOtpId }: Props) {
  const [loading, setLoading] = useState(false);
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

  // Keep form otp in sync with InputOTP changes
  const handleOtpChange = (val: string) => {
    setOtp(val);
    setValue("otp", val);
  };

  const onSubmit = async (data: VerifyOTPType) => {
    console.log("OTPStep form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    setLoading(true);
    try {
      const res = await AuthAPI.verifyPasswordResetOTP(data);
      console.log("verifyPasswordResetOTP response:", res);
      toast.success(res.data?.message ?? "OTP verified successfully", {
        position: "top-right",
      });
      setOtpId(res.data?.data?.otpId ?? ""); // Store OTP ID for later steps
      setStep("reset");
    } catch (error) {
      console.error("Verify OTP error:", error);
      const msg =
        getErrorMessage(error) || "Failed to verify OTP. Please try again.";
      toast.error(msg, { position: "top-right" });
    } finally {
      setLoading(false);
      reset();
    }
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

      <Button
        type="submit"
        disabled={loading || otp.length !== 4}
        className="w-full text-white font-semibold disabled:opacity-60 bg-brand-blue"
      >
        {loading ? <Spinner className="size-4" /> : "Verify Code"}
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
