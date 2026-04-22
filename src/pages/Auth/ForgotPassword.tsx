import { useState } from "react";
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
  const [userId, setUserId] = useState<string>(""); // Store user ID for OTP verification and password reset
  const [otpId, setOtpId] = useState<string>(""); // Store OTP ID for password reset
  const [email, setEmail] = useState("");

  return (
    <div className="w-full max-w-md p-6 shadow-lg">
      {step === "email" && (
        <EmailStep {...{ email, setEmail, setStep, setActiveTab, setUserId }} />
      )}

      {step === "otp" && <OTPStep {...{ email, userId, setStep, setOtpId }} />}

      {step === "reset" && <ResetStep {...{ userId, otpId, setStep }} />}

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
