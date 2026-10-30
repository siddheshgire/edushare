import { z } from "zod";

export const REPORT_REASONS = [
  "Incorrectly categorized",
  "Spam",
  "Inappropriate content",
  "Potential copyright violation",
  "Misleading description",
] as const;

export const resourceReportSchema = z.object({
  resourceId: z.string().min(1, "Resource ID is required"),
  reason: z.enum(REPORT_REASONS, {
    message: "Please select a valid report reason",
  }),
  description: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters detailing the issue")
    .max(1000, "Description cannot exceed 1000 characters"),
});

export type ResourceReportInput = z.infer<typeof resourceReportSchema>;
