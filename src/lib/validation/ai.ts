import { z } from "zod";

export const aiSummaryRequestSchema = z.object({
  resourceId: z.string().min(1, "Resource ID is required"),
  documentText: z
    .string()
    .min(50, "Document content must contain at least 50 characters to generate an academic summary")
    .max(50000, "Document exceeds maximum allowed processing length (50,000 characters)"),
});

export const aiChatQuerySchema = z.object({
  resourceId: z.string().min(1, "Resource ID is required"),
  query: z
    .string()
    .trim()
    .min(3, "Question must be at least 3 characters")
    .max(400, "Question cannot exceed 400 characters"),
  contextText: z
    .string()
    .min(50, "Document context is required to ground answers")
    .max(50000, "Context exceeds processing limit"),
});

export type AISummaryRequestInput = z.infer<typeof aiSummaryRequestSchema>;
export type AIChatQueryInput = z.infer<typeof aiChatQuerySchema>;
