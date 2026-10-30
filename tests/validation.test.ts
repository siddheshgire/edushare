import { describe, it, expect } from "vitest";
import { resourceUploadSchema } from "@/lib/validation/resource";
import { resourceRequestSchema } from "@/lib/validation/request";
import { resourceReportSchema } from "@/lib/validation/report";
import { loginSchema, registerSchema } from "@/lib/validation/auth";

describe("Validation Schemas", () => {
  describe("resourceUploadSchema", () => {
    it("should accept valid upload metadata", () => {
      const valid = {
        title: "Dynamic Programming Lecture Notes",
        description: "Covers memoization and tabulation examples for 0/1 knapsack.",
        subjectId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        semester: 3,
        category: "Lecture Notes",
        tags: ["DP", "Algorithms"],
        fileName: "dp_notes.pdf",
        fileType: "application/pdf",
        fileSize: 1024 * 500, // 500 KB
        copyrightAcknowledged: true,
      };
      const result = resourceUploadSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject upload without copyright acknowledgement", () => {
      const invalid = {
        title: "Dynamic Programming Notes",
        description: "A comprehensive revision sheet for examinations.",
        subjectId: "sub-1",
        semester: 3,
        category: "Lecture Notes",
        tags: [],
        fileName: "dp.pdf",
        fileType: "application/pdf",
        fileSize: 1024,
        copyrightAcknowledged: false, // Disallowed
      };
      const result = resourceUploadSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject files exceeding 25MB limit", () => {
      const oversized = {
        title: "Massive Video / Dataset File",
        description: "Oversized file exceeding academic quota limitations.",
        subjectId: "sub-1",
        semester: 4,
        category: "Lecture Notes",
        tags: [],
        fileName: "massive.pdf",
        fileType: "application/pdf",
        fileSize: 30 * 1024 * 1024, // 30 MB > 25 MB
        copyrightAcknowledged: true,
      };
      const result = resourceUploadSchema.safeParse(oversized);
      expect(result.success).toBe(false);
    });
  });

  describe("resourceRequestSchema", () => {
    it("should validate study requests", () => {
      const validRequest = {
        title: "Need 2024 End Semester Question Paper",
        description: "Looking for solved answers for OS virtual memory unit.",
        subjectId: "sub-os-1",
        semester: 4,
      };
      const result = resourceRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should reject invalid semester outside 1-8", () => {
      const invalidRequest = {
        title: "High School Notes",
        description: "Need general science questions.",
        subjectId: "sub-1",
        semester: 12, // Invalid semester
      };
      const result = resourceRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe("resourceReportSchema", () => {
    it("should accept valid report reasons", () => {
      const validReport = {
        resourceId: "res-001",
        reason: "Potential copyright violation",
        description: "This document contains copyrighted publisher pages.",
      };
      const result = resourceReportSchema.safeParse(validReport);
      expect(result.success).toBe(true);
    });
  });

  describe("auth schemas", () => {
    it("should validate email format and minimum password length", () => {
      const validLogin = {
        email: "student@university.edu",
        password: "secretpassword123",
      };
      expect(loginSchema.safeParse(validLogin).success).toBe(true);

      const invalidLogin = {
        email: "not-an-email",
        password: "123", // too short
      };
      expect(loginSchema.safeParse(invalidLogin).success).toBe(false);
    });
  });
});
