import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type Props = {
  step: "email" | "otp" | "reset" | "success";
  setActiveTab: (tab: string) => void;
};

export default function SuccessStep({ step, setActiveTab }: Props) {
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
    <div className="flex flex-col gap-5 text-center">
      <div className="flex justify-center">
        <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg
            className="size-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Password Reset Successful
        </h2>
        <p className="text-sm text-zinc-400">
          Your password has been reset. You can now log in with your new
          password.
        </p>
      </div>

      <div className="flex flex-col gap-3 items-center">
        <p className="text-sm text-zinc-300">
          Redirecting to login within{" "}
          <span className="font-semibold text-white">{countdown}s</span>
        </p>

        <div className="w-full">
          <Progress
            value={Math.max(0, Math.round(((3 - countdown) / 3) * 100))}
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}
