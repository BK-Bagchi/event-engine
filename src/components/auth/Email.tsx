import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type Step = "email" | "otp" | "reset" | "success";
type Props = {
  email: string;
  setEmail: (v: string) => void;
  setStep: (s: Step) => void;
  setActiveTab: (tab: string) => void;
};

export default function EmailStep({
  email,
  setEmail,
  setStep,
  setActiveTab,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: call sendPasswordResetOTP API
      console.log("Send OTP to:", email);
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#1A2235] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
        />
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
