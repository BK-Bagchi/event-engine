import { z } from "zod";

const firstName = z.string().min(1, "First name is required");
const lastName = z.string().min(1, "Last name is required");
const email = z.string().email("Invalid email address");
const otp = z.string().regex(/^\d{4}$/, "OTP must be exactly 4 digits");

// password must be at least 6 chars, include uppercase, lowercase and a special character
const passwordRule = /(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}/;
const password = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(
    passwordRule,
    "Password must include uppercase, lowercase and a special character",
  );
const confirmPassword = z.string().min(1, "Confirm password is required");

export const registerSchema = z
  .object({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    avatar: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password,
});

export const sendOtpSchema = z.object({
  email,
});

export const verifyOtpSchema = z.object({
  otp,
  userId: z.string().min(1, "Missing userId"),
});

export const resetPasswordSchema = z
  .object({
    userId: z.string().min(1, "Missing userId"),
    otpId: z.string().min(1, "Missing otpId"),
    newPassword: password,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type SendOTPType = z.infer<typeof sendOtpSchema>;
export type VerifyOTPType = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
