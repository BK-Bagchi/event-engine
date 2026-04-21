import { z } from "zod";

const firstName = z.string().min(1, "First name is required");
const lastName = z.string().min(1, "Last name is required");
const email = z.string().email("Invalid email address");

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

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  password,
});

export type LoginSchema = z.infer<typeof loginSchema>;
