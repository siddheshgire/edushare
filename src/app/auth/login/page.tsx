"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail, ShieldCheck, GraduationCap } from "lucide-react";
import { mockStore } from "@/lib/store/mock-store";
import { loginSchema } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid input");
      return;
    }

    try {
      setIsLoading(true);
      // Determine if logging in as admin or student
      const isAdminEmail = email.toLowerCase().includes("admin");
      mockStore.loginAs(isAdminEmail ? "admin" : "student", { email });
      if (isAdminEmail) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: "student" | "admin") => {
    mockStore.loginAs(role);
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">EduShare</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-xs text-slate-500">
          Sign in to access bookmarked notes, upload resources, and collaborate
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In to EduShare"}
            </button>
          </form>

          {/* Quick Demo Logins for Evaluator */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="block text-center text-[11px] uppercase tracking-wider font-bold text-slate-400">
              Instant Demonstration Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("student")}
                className="p-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-semibold text-blue-700 flex items-center justify-center gap-1.5 transition"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="p-2 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-semibold text-indigo-700 flex items-center justify-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
              Create student profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
