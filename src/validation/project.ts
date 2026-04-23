import { z } from "zod";
const name = z
  .string()
  .min(1, "Project name is required")
  .min(3, "Project name must be at least 3 characters")
  .max(50, "Project name must not exceed 50 characters");
const description = z
  .string()
  .max(500, "Description must not exceed 500 characters")
  .default("");

export const createProjectSchema = z
  .object({
    name: name,
    description: description,
    allowedOrigins: z
      .array(
        z.string().refine(
          (val) => {
            try {
              const u = new URL(val);
              // must be http/https, no path other than '/', no query, no fragment
              return (
                (u.protocol === "http:" || u.protocol === "https:") &&
                (u.pathname === "/" || u.pathname === "") &&
                u.search === "" &&
                u.hash === ""
              );
            } catch {
              return false;
            }
          },
          {
            message:
              "No path, query, or fragment is expected in allowed origin.",
          },
        ),
      )
      .min(1, "At least one allowed origin is required"),
    settings: z
      .object({
        saveSubmissions: z.boolean().default(true),
        enableAutoReply: z.boolean().default(false),
        enableWebhook: z.boolean().default(false),
        requireCaptcha: z.boolean().default(false),
        rateLimitPerMinute: z
          .number()
          .int("Rate limit must be a whole number")
          .min(1, "Rate limit must be at least 1")
          .max(10000, "Rate limit cannot exceed 10000")
          .default(30),
        maxAttachmentSizeMB: z
          .number()
          .int("Attachment size must be a whole number")
          .min(1, "Attachment size must be at least 1 MB")
          .max(100, "Attachment size cannot exceed 100 MB")
          .default(5),
      })
      .default({
        saveSubmissions: true,
        enableAutoReply: false,
        enableWebhook: false,
        requireCaptcha: false,
        rateLimitPerMinute: 30,
        maxAttachmentSizeMB: 5,
      }),
  })
  .strict();

export const editProjectSchema = z.object({
  name: name,
  description: description,
});

export type CreateProjectInput = z.input<typeof createProjectSchema>;
export type CreateProjectSchema = z.output<typeof createProjectSchema>;
export type EditProjectInput = z.input<typeof editProjectSchema>;
