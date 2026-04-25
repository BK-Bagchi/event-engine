import { z } from "zod";

export const PROVIDER_TYPES = [
  "GMAIL",
  "OUTLOOK",
  "SMTP",
  "RESEND",
  "SENDGRID",
] as const;

const name = z
  .string()
  .min(1, "Service name is required")
  .min(3, "Service name must be at least 3 characters")
  .max(100, "Service name must not exceed 100 characters");
const providerType = z.enum(PROVIDER_TYPES, {
  message: "Please select a valid provider type",
});

export const createServiceSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  name: name,
  providerType: providerType,
  isDefault: z.boolean(),
});

export const editServiceSchema = z.object({
  name: name,
  providerType: providerType,
  isDefault: z.boolean(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type EditServiceInput = z.infer<typeof editServiceSchema>;
