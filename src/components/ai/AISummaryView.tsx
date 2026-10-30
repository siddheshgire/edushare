"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookMarked,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Resource, AISummary } from "@/types";

interface AISummaryViewProps {
  resource: Resource;
}

export default function AISummaryView({ resource }: AISummaryViewProps) {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedQuestions, setRevealedQuestions] = useState<number[]>([]);

  const handleGenerateSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          documentText: resource.content_text || resource.description,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to generate summary");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "Could not generate AI summary");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionReveal = (idx: number) => {
    if (revealedQuestions.includes(idx)) {
      setRevealedQuestions(revealedQuestions.filter((i) => i !== idx));
    } else {
      setRevealedQuestions([...revealedQuestions, idx]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Academic Summary</h3>
              <p className="text-xs text-slate-500">
                Concepts, key definitions, revision bullet points & practice questions
              </p>
            </div>
          </div>
        </div>

        {!summary && (
          <button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting & Summarizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Summary</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State before generation */}
      {!summary && !isLoading && (
        <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Lightbulb className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-800">Quick Exam Preparation</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Click &quot;Generate Summary&quot; to inspect this document&apos;s key concepts, definitions, and model practice questions for fast revision.
          </p>
          <button
            onClick={handleGenerateSummary}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs hover:bg-slate-50 transition"
          >
            Generate Now
          </button>
        </div>
      )}

      {/* Summary Content */}
      {summary && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Concepts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-blue-600" />
              <span>Core Concepts</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary.main_concepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Definitions */}
          {summary.definitions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Key Academic Definitions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summary.definitions.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1"
                  >
                    <span className="text-xs font-bold text-slate-900 block">{def.term}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{def.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Bullet Points */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Revision Notes & Properties
            </h4>
            <ul className="space-y-2">
              {summary.key_points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Questions */}
          {summary.practice_questions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Self-Assessment & Practice Questions</span>
              </h4>
              <div className="space-y-2.5">
                {summary.practice_questions.map((pq, idx) => {
                  const isRevealed = revealedQuestions.includes(idx);
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-lg overflow-hidden transition"
                    >
                      <button
                        onClick={() => toggleQuestionReveal(idx)}
                        className="w-full p-3 text-left bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs font-semibold text-slate-900"
                      >
                        <span>
                          Q{idx + 1}: {pq.question}
                        </span>
                        {isRevealed ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      {isRevealed && (
                        <div className="p-3 bg-indigo-50/50 border-t border-slate-200 text-xs text-indigo-900 leading-relaxed">
                          <strong className="text-indigo-800">Answer Guidance: </strong>
                          {pq.answer_hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assistant Footnote & Regenerate */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>
              Engine: <strong className="text-slate-700">{summary.model_used}</strong> • Always
              verify with primary curriculum notes before university examinations.
            </span>
            <button
              onClick={handleGenerateSummary}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Summary</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
