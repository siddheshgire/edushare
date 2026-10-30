import { describe, it, expect } from "vitest";
import { generateDocumentSummary, answerDocumentQuestion, isAIAssistantConfigured } from "@/lib/ai/service";

describe("AI Study Assistant Service", () => {
  const sampleDoc = `
DATABASE MANAGEMENT SYSTEMS: NORMALIZATION & TRANSACTIONS
Unit 3: Relational Database Design
- Functional Dependency (X -> Y): If t1[X] = t2[X], then t1[Y] = t2[Y].
- Boyce-Codd Normal Form (BCNF): For every non-trivial functional dependency X -> Y, X must be a superkey.
- ACID Properties: Atomicity, Consistency, Isolation, Durability.
Two-Phase Locking (2PL) guarantees serializability through growing and shrinking phases.
`;

  it("should generate a structured summary with concepts, definitions, and practice questions", async () => {
    const result = await generateDocumentSummary(
      "test-res-dbms",
      "Database Normalization Guide",
      sampleDoc
    );

    expect(result.success).toBe(true);
    expect(result.summary).toBeDefined();

    const summary = result.summary!;
    expect(summary.main_concepts.length).toBeGreaterThan(0);
    expect(summary.definitions.length).toBeGreaterThan(0);
    expect(summary.key_points.length).toBeGreaterThan(0);
    expect(summary.practice_questions.length).toBeGreaterThan(0);
    expect(summary.practice_questions[0]).toHaveProperty("question");
    expect(summary.practice_questions[0]).toHaveProperty("answer_hint");
  });

  it("should answer questions grounded in the provided document content", async () => {
    const res = await answerDocumentQuestion(
      "Database Normalization Guide",
      sampleDoc,
      "What is the condition for BCNF?"
    );

    expect(res.success).toBe(true);
    expect(res.answer).toBeDefined();
    expect(res.answer?.toLowerCase()).toContain("superkey");
  });

  it("should indicate lack of information when query is out of scope", async () => {
    const res = await answerDocumentQuestion(
      "Database Normalization Guide",
      sampleDoc,
      "What is the chemical composition of photosynthesis?"
    );

    expect(res.success).toBe(true);
    expect(res.answer).toBeDefined();
    expect(res.answer?.toLowerCase()).toContain("not contain");
  });
});
