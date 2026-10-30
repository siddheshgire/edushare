"use client";

import React, { useState } from "react";
import { Send, Bot, User, AlertCircle, Quote } from "lucide-react";
import { Resource, AIChatMessage } from "@/types";

interface AIStudyChatProps {
  resource: Resource;
}

export default function AIStudyChat({ resource }: AIStudyChatProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello! I'm your EduShare Study Assistant for "${resource.title}". Ask me any concept clarification, formula inquiry, or exam question grounded in this document.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedQuestions = [
    `What are the core definitions in ${resource.title.slice(0, 30)}...?`,
    "Can you explain the main algorithms or steps outlined?",
    "What are common pitfalls or exam questions related to this topic?",
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || query;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          query: userMsg.content,
          contextText: resource.content_text || resource.description,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to answer question");
      }

      const botMsg: AIChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.answer || "No response generated.",
        citations: data.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setError(err.message || "Failed to contact study assistant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Grounded Document Q&A Assistant</h4>
            <p className="text-[10px] text-slate-500">
              Answers are verified strictly against this uploaded material
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
          Grounded Mode Active
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-5 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-medium flex-shrink-0">Suggestions:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-full text-slate-600 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed space-y-1.5 ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100/80 text-slate-800 border border-slate-200"
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>

              {m.citations && m.citations.length > 0 && (
                <div className="pt-1.5 border-t border-slate-200/60 flex items-center gap-1 text-[10px] text-blue-700 font-medium">
                  <Quote className="w-3 h-3" />
                  <span>Verified Source: {m.citations.map((c) => c.section).join(", ")}</span>
                </div>
              )}

              <span
                className={`block text-[10px] text-right ${
                  m.role === "user" ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
            <Bot className="w-4 h-4 text-blue-600 animate-bounce" />
            <span>Consulting document contents and formulating grounded response...</span>
          </div>
        )}

        {error && (
          <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a specific conceptual question about this document..."
          disabled={isLoading}
          className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
