import { useState, useEffect } from "react";
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
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(3);

  // Start countdown and auto-redirect when we enter the success step
  useEffect(() => {
    let intervalId: number | undefined;
    let initTimeoutId: number | undefined;

    if (step === "success") {
      // initialize countdown asynchronously to avoid synchronous setState in effect
      initTimeoutId = window.setTimeout(() => setCountdown(3), 0);

      intervalId = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (intervalId) window.clearInterval(intervalId);
            setActiveTab("login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (initTimeoutId) window.clearTimeout(initTimeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [step, setActiveTab]);

  return (
    <div className="w-full max-w-md p-6 shadow-lg">
      {step === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          setStep={setStep}
          setActiveTab={setActiveTab}
        />
      )}

      {step === "otp" && (
        <OTPStep email={email} otp={otp} setOtp={setOtp} setStep={setStep} />
      )}

      {step === "reset" && <ResetStep setStep={setStep} />}

      {step === "success" && <SuccessStep countdown={countdown} />}

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
