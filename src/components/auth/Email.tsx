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
import { useMutation } from "@tanstack/react-query";

type Step = "email" | "otp" | "reset" | "success";
type Props = {
  email: string;
  setEmail: (v: string) => void;
  setStep: (s: Step) => void;
  setActiveTab: (tab: string) => void;
  setUserId: (id: string) => void;
  setOtpSentAt: (t: number) => void;
};

export default function EmailStep({
  email,
  setEmail,
  setStep,
  setActiveTab,
  setUserId,
  setOtpSentAt,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SendOTPType>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (data: SendOTPType) => AuthAPI.sendPasswordResetOTP(data),
    onSuccess: (res, data) => {
      setEmail(data.email);
      toast.success(res.data?.message ?? "OTP sent successfully", {
        position: "top-right",
      });
      setUserId(res.data.data.userId ?? "");
      setOtpSentAt(Date.now());
      setStep("otp");
    },
    onError: (error) => {
      const msg =
        getErrorMessage(error) || "Failed to send OTP. Please try again.";
      toast.error(msg, { position: "top-right" });
    },
    onSettled: () => reset(),
  });

  const onSubmit = (data: SendOTPType) => {
    // console.log("EmailStep form data:", data);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    sendOtpMutation.mutate(data);
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
        disabled={sendOtpMutation.isPending}
        className="w-full text-white font-semibold disabled:opacity-60 bg-brand-blue"
      >
        {sendOtpMutation.isPending ? (
          <>
            <Spinner className="size-4" /> Sending Reset Code...{" "}
          </>
        ) : (
          "Send Reset Code"
        )}
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
