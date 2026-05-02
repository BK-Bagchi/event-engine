interface TimerProps {
  isExpired: boolean;
  secondsLeft: number;
  timerMins: string;
  timerSecs: string;
  setStep: (s: "email" | "otp" | "reset" | "success") => void;
}

const Timer = ({
  isExpired,
  secondsLeft,
  timerMins,
  timerSecs,
  setStep,
}: TimerProps) => {
  return (
    <div className="text-center">
      {isExpired ? (
        <p className="text-sm text-red-400">
          OTP has expired. Please{" "}
          <button
            type="button"
            onClick={() => setStep("email")}
            className="underline hover:text-red-300 transition-colors"
          >
            request a new code
          </button>
          .
        </p>
      ) : (
        <p className="text-sm text-zinc-400">
          Code expires in{" "}
          <span
            className={`font-semibold ${secondsLeft <= 60 ? "text-red-400" : "text-brand-blue"}`}
          >
            {timerMins}:{timerSecs}
          </span>
        </p>
      )}
    </div>
  );
};

export default Timer;
