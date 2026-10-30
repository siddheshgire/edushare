import { z } from "zod";

export const RESOURCE_CATEGORIES = [
  "Lecture Notes",
  "Previous Year Question Papers",
  "Assignments and Practice Problems",
  "Reference Books and Materials",
  "Lab Manuals",
  "Revision Notes",
  "Other Educational Resources",
] as const;

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const ALLOWED_FILE_EXTENSIONS = [".pdf", ".docx", ".pptx", ".txt"];

export const resourceUploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  subjectId: z.string().min(1, "Please select a valid subject"),
  semester: z.coerce
    .number()
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
  category: z.enum(RESOURCE_CATEGORIES, {
    message: "Please select a valid category",
  }),
  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(10, "Maximum of 10 tags allowed")
    .default([]),
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z
    .number()
    .positive("File size must be greater than 0")
    .max(MAX_FILE_SIZE_BYTES, "File size must not exceed 25MB"),
  copyrightAcknowledged: z.boolean().refine((val) => val === true, {
    message: "You must confirm you have the right to share this material under academic fair use",
  }),
});

export const resourceModerationSchema = z.object({
  resourceId: z.string().uuid("Invalid resource ID").or(z.string().min(1)),
  action: z.enum(["approved", "rejected", "removed"]),
  reason: z.string().max(500).optional(),
});

export type ResourceUploadInput = z.infer<typeof resourceUploadSchema>;
export type ResourceModerationInput = z.infer<typeof resourceModerationSchema>;
