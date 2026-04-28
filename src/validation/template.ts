import { z } from "zod";

export const TEMPLATE_CATEGORIES = [
  "CONTACT",
  "AUTO_REPLY",
  "SUPPORT",
  "BOOKING",
  "CUSTOM",
] as const;

export const VARIABLE_TYPES = [
  "TEXT",
  "EMAIL",
  "TEXTAREA",
  "NUMBER",
  "SELECT",
  "FILE",
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

export const variableSchema = z.object({
  type: z.enum(VARIABLE_TYPES, { message: "Variable type is required" }),
  key: z
    .string()
    .min(1, "Key is required")
    .regex(
      /^[a-z_][a-z0-9_]*$/,
      "Key must start with a letter or underscore and contain only lowercase letters, numbers, and underscores",
    ),
  label: z.string().optional(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  validation: z
    .object({
      minLength: z
        .string()
        .optional()
        .refine(
          (v) => !v || (!isNaN(parseInt(v)) && parseInt(v) >= 0),
          "Must be a whole number ≥ 0",
        ),
      maxLength: z
        .string()
        .optional()
        .refine(
          (v) => !v || (!isNaN(parseInt(v)) && parseInt(v) >= 0),
          "Must be a whole number ≥ 0",
        ),
      regex: z.string().optional(),
      allowedValues: z
        .array(z.string().min(1, "Value cannot be empty"))
        .optional(),
    })
    .optional(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type VariableFormInput = z.infer<typeof variableSchema>;
