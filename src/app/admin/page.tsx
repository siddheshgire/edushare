"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  History,
  Database,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockStore } from "@/lib/store/mock-store";
import { Resource, ResourceReport, ModerationLog, PlatformStats, UserProfile } from "@/types";
import { formatDate, formatBytes, getStatusBadgeClass } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pendingResources, setPendingResources] = useState<Resource[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [reports, setReports] = useState<ResourceReport[]>([]);
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([]);

  // Live Supabase Health State
  const [supabaseHealth, setSupabaseHealth] = useState<any | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  // Moderation state
  const [rejectingResource, setRejectingResource] = useState<Resource | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "reports" | "all" | "logs">("pending");

  const checkSupabaseHealth = async () => {
    try {
      setIsCheckingHealth(true);
      const res = await fetch("/api/health/supabase");
      const data = await res.json();
      setSupabaseHealth(data);
    } catch {
      setSupabaseHealth({
        status: "error",
        connected: false,
        message: "Failed to query /api/health/supabase",
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const loadData = () => {
    const user = mockStore.getCurrentUser();
    setCurrentUser(user);
    setStats(mockStore.getStats());

    // Pending resources
    const pending = mockStore.getResources({ moderationStatus: "pending" });
    setPendingResources(pending);

    // All resources
    const all = mockStore.getResources({ moderationStatus: undefined });
    setAllResources(all);

    // Reports
    const repList = mockStore.getReports().filter((r) => r.status === "pending");
    setReports(repList);

    // Logs
    const logs = mockStore.getModerationLogs();
    setModerationLogs(logs);
  };

  useEffect(() => {
    loadData();
    checkSupabaseHealth();
  }, []);

  const handleApprove = (resourceId: string) => {
    if (!currentUser) return;
    mockStore.updateModerationStatus(resourceId, "approved", "Approved by Moderator", currentUser);
    loadData();
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingResource || !currentUser) return;
    mockStore.updateModerationStatus(
      rejectingResource.id,
      "rejected",
      rejectionReason || "Does not meet academic guidelines",
      currentUser
    );
    setRejectingResource(null);
    setRejectionReason("");
    loadData();
  };

  const handleRemoveResource = (resourceId: string, reason = "Removed by Administrator") => {
    if (!currentUser) return;
    mockStore.updateModerationStatus(resourceId, "removed", reason, currentUser);
    loadData();
  };

  const handleResolveReport = (reportId: string, action: "resolve" | "dismiss") => {
    if (!currentUser) return;
    mockStore.resolveReport(reportId, action, currentUser);
    loadData();
  };

  const switchToAdmin = () => {
    const admin = mockStore.loginAs("admin");
    setCurrentUser(admin);
    loadData();
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Permission Banner if not logged in as Admin */}
        {!isAdmin && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                You are currently viewing in <strong>{currentUser ? "Student" : "Guest"}</strong> mode.
                Admin moderation privileges are restricted in production.
              </span>
            </div>
            <button
              onClick={switchToAdmin}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs transition whitespace-nowrap"
            >
              Switch to Admin Demo Mode
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Academic Moderation Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review student submissions, manage quality standards, investigate copyright reports, and maintain platform integrity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Live</span>
            </span>
          </div>
        </div>

        {/* Platform Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[11px] font-medium text-slate-500">Total Students</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.total_students}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[11px] font-medium text-slate-500">Approved Notes</p>
              <h3 className="text-xl font-bold text-blue-600 mt-0.5">{stats.total_resources}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[11px] font-medium text-slate-500">Pending Review</p>
              <h3 className="text-xl font-bold text-amber-600 mt-0.5">
                {stats.pending_submissions}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[11px] font-medium text-slate-500">Reports Queue</p>
              <h3 className="text-xl font-bold text-rose-600 mt-0.5">
                {stats.reported_resources}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[11px] font-medium text-slate-500">Open Requests</p>
              <h3 className="text-xl font-bold text-indigo-600 mt-0.5">{stats.open_requests}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[11px] font-medium text-slate-500">Total Downloads</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-0.5">
                {stats.total_downloads}
              </h3>
            </div>
          </div>
        )}

        {/* Live Cloud Database & Storage Diagnostic Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  supabaseHealth?.connected
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">
                    Database & Storage Architecture Status
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      supabaseHealth?.connected
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {supabaseHealth?.connected
                      ? `Live Supabase Cloud Connected (${supabaseHealth.latencyMs}ms)`
                      : "Local In-Memory Reactive Store (Offline Mode)"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {supabaseHealth?.message ||
                    "Running zero-config in-memory state. Enter Supabase credentials in .env.local to link live PostgreSQL."}
                </p>
              </div>
            </div>

            <button
              onClick={checkSupabaseHealth}
              disabled={isCheckingHealth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isCheckingHealth ? "animate-spin text-blue-600" : ""}`}
              />
              <span>{isCheckingHealth ? "Pinging Cloud..." : "Test Connection"}</span>
            </button>
          </div>

          {/* Setup details when in offline mode */}
          {!supabaseHealth?.connected && (
            <div className="mt-2 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 bg-slate-50/60 p-3 rounded-lg border">
              <p className="font-semibold text-slate-800 flex items-center gap-1">
                <span>Connecting Your Real Supabase Cloud Project:</span>
              </p>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-600">
                <li>Create a free PostgreSQL project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">supabase.com</a>.</li>
                <li>Copy <code className="bg-slate-200 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-slate-200 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> into your <code className="bg-slate-200 px-1 py-0.5 rounded">.env.local</code>.</li>
                <li>Execute migrations from <code className="bg-slate-200 px-1 py-0.5 rounded">supabase/migrations/</code> in the Supabase SQL editor.</li>
                <li>Create storage bucket <code className="bg-slate-200 px-1 py-0.5 rounded">edushare-resources</code>.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "pending"
                ? "border-indigo-600 text-indigo-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Submissions ({pendingResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "reports"
                ? "border-rose-600 text-rose-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Reported Resources ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "all"
                ? "border-slate-800 text-slate-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Repository Items ({allResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-blue-600 text-blue-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Moderation Audit Logs ({moderationLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: PENDING SUBMISSIONS QUEUE */}
        {activeTab === "pending" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Pending Resource Submissions Queue
              </h2>
              <span className="text-xs text-slate-500">
                Verify curriculum alignment, academic formatting, and fair-use attribution
              </span>
            </div>

            {pendingResources.length > 0 ? (
              <div className="space-y-4">
                {pendingResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {res.category}
                        </span>
                        <span className="text-xs font-medium text-slate-600">
                          {res.subject_name} • Sem {res.semester}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({formatBytes(res.file_size)})
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{res.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{res.description}</p>
                      <p className="text-[11px] text-slate-400">
                        Uploaded by {res.owner_name} on {formatDate(res.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <Link
                        href={`/resources/${res.id}`}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                      <button
                        onClick={() => handleApprove(res.id)}
                        disabled={!isAdmin}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setRejectingResource(res)}
                        disabled={!isAdmin}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Moderation Queue is Clear!</h4>
                <p className="text-xs text-slate-500">
                  All submitted resources have been reviewed and resolved.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REPORTED RESOURCES QUEUE */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                User Reports & Copyright Takedown Notices
              </h2>
              <span className="text-xs text-slate-500">
                Academic fair use and integrity investigations
              </span>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 bg-rose-50/50 rounded-xl border border-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          {rep.reason}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Reported by {rep.reporter_name} on {formatDate(rep.created_at)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Resource: {rep.resource_title}
                      </h3>
                      <p className="text-xs text-rose-900 bg-white/70 p-2.5 rounded-lg border border-rose-100">
                        &quot;{rep.description}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleResolveReport(rep.id, "dismiss")}
                        disabled={!isAdmin}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 transition disabled:opacity-50"
                      >
                        Dismiss Report
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveResource(rep.resource_id, `Removed: ${rep.reason}`);
                          handleResolveReport(rep.id, "resolve");
                        }}
                        disabled={!isAdmin}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition disabled:opacity-50"
                      >
                        Remove Resource
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Pending Reports</h4>
                <p className="text-xs text-slate-500">
                  There are currently no active user complaints or DMCA requests.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALL REPOSITORY ITEMS */}
        {activeTab === "all" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">All Platform Resources</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Subject</th>
                    <th className="pb-3 font-semibold">Uploader</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Downloads</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allResources.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70">
                      <td className="py-3 pr-4 font-semibold text-slate-900">
                        <Link href={`/resources/${res.id}`} className="hover:text-blue-600 transition">
                          {res.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{res.subject_name}</td>
                      <td className="py-3 pr-4 text-slate-600">{res.owner_name}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${getStatusBadgeClass(
                            res.moderation_status
                          )}`}
                        >
                          {res.moderation_status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{res.download_count}</td>
                      <td className="py-3 text-right">
                        {res.moderation_status === "approved" ? (
                          <button
                            onClick={() => handleRemoveResource(res.id)}
                            disabled={!isAdmin}
                            className="text-rose-600 hover:text-rose-700 font-medium text-xs disabled:opacity-50"
                          >
                            Remove
                          </button>
                        ) : res.moderation_status === "pending" ? (
                          <button
                            onClick={() => handleApprove(res.id)}
                            disabled={!isAdmin}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-xs disabled:opacity-50"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MODERATION AUDIT LOGS */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Moderator Audit Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-3 font-semibold">Administrator</th>
                    <th className="pb-3 font-semibold">Action</th>
                    <th className="pb-3 font-semibold">Target Resource / Record</th>
                    <th className="pb-3 font-semibold">Reason</th>
                    <th className="pb-3 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moderationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-3 pr-4 font-semibold text-slate-900">
                        {log.administrator_name}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
                            log.action === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-700 font-medium">{log.target_title}</td>
                      <td className="py-3 pr-4 text-slate-500">{log.reason || "Standard review"}</td>
                      <td className="py-3 text-right text-slate-400">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Reject Resource Dialog */}
      {rejectingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Reject Submission: {rejectingResource.title}
            </h3>
            <p className="text-xs text-slate-600">
              Please enter the specific reason so the student can update or re-upload accurate notes.
            </p>
            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Handwritten notes are blurry; missing page 4 to 8..."
                rows={3}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingResource(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
