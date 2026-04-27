import { z } from "zod";

export const TEMPLATE_CATEGORIES = [
  "CONTACT",
  "AUTO_REPLY",
  "SUPPORT",
  "BOOKING",
  "CUSTOM",
] as const;

export const createTemplateSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  serviceId: z.string().min(1, "Service is required"),
  name: z
    .string()
    .min(1, "Template name is required")
    .min(3, "Template name must be at least 3 characters")
    .max(100, "Template name must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  category: z.enum(TEMPLATE_CATEGORIES, {
    message: "Please select a valid category",
  }),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
