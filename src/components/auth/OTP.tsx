import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
//prettier-ignore
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "email" | "otp" | "reset" | "success";
type Props = {
  email: string;
  otp: string;
  setOtp: (v: string) => void;
  setStep: (s: Step) => void;
};

export default function OTPStep({ email, otp, setOtp, setStep }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert("Please enter a valid 4-digit OTP");
      return;
    }
    setLoading(true);
    try {
      // TODO: call verifyPasswordResetOTP API
      console.log("Verify OTP:", { email, otp });
      setStep("reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            onChange={setOtp}
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
