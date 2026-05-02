import { useState, useMemo } from "react";
import EmailStep from "@/components/auth/Email";
import OTPStep from "@/components/auth/OTP";
import ResetStep from "@/components/auth/Reset";
import SuccessStep from "@/components/auth/Success";

type Step = "email" | "otp" | "reset" | "success";

const ForgotPassword = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const [step, setStep] = useState<Step>("email");
  const [userId, setUserId] = useState<string>("");
  const [otpId, setOtpId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);

  const otpSentAtValue = useMemo(() => otpSentAt ?? Date.now(), [otpSentAt]);

  return (
    <div className="w-full max-w-md p-6 shadow-lg">
      {step === "email" &&
        //prettier-ignore
        <EmailStep {...{ email, setEmail, setStep, setActiveTab, setUserId, setOtpSentAt }}
        />}
      {step === "otp" &&
        //prettier-ignore
        <OTPStep {...{ email, userId, setStep, setOtpId, otpSentAt: otpSentAtValue }}
        />}

      {step === "reset" && (
        <ResetStep {...{ userId, otpId, setStep, otpSentAt: otpSentAtValue }} />
      )}
      {step === "success" && <SuccessStep {...{ step, setActiveTab }} />}
      {/* Progress Indicator */}
      <div className="my-6 flex items-center justify-between gap-2">
        <div
          className={`h-1 flex-1 rounded-full transition-all ${step === "email" || step === "otp" || step === "reset" || step === "success" ? "bg-brand-blue" : "bg-bg-border"}`}
        />
        <div
          className={`h-1 flex-1 rounded-full transition-all ${step === "otp" || step === "reset" || step === "success" ? "bg-brand-blue" : "bg-bg-border"}`}
        />
        <div
          className={`h-1 flex-1 rounded-full transition-all ${step === "reset" || step === "success" ? "bg-brand-blue" : "bg-bg-border"}`}
        />
        <div
          className={`h-1 flex-1 rounded-full transition-all ${step === "success" ? "bg-brand-blue" : "bg-bg-border"}`}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
