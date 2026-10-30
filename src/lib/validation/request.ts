import { z } from "zod";

export const resourceRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Please describe the material you need in at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  subjectId: z.string().min(1, "Please select a valid subject"),
  semester: z.coerce
    .number()
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
  deadline: z.string().optional(),
});

export type ResourceRequestInput = z.infer<typeof resourceRequestSchema>;
