"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Bookmark,
  Flag,
  Calendar,
  User,
  ArrowLeft,
  Sparkles,
  Bot,
  FileText,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AISummaryView from "@/components/ai/AISummaryView";
import AIStudyChat from "@/components/ai/AIStudyChat";
import ReportModal from "@/components/resources/ReportModal";
import ResourceCard from "@/components/resources/ResourceCard";
import { mockStore } from "@/lib/store/mock-store";
import { Resource } from "@/types";
import { formatBytes, formatDate, getCategoryBadgeClass } from "@/lib/utils";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params?.id as string;

  const [resource, setResource] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "chat" | "preview">("summary");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);

  useEffect(() => {
    if (resourceId) {
      const res = mockStore.getResourceById(resourceId);
      if (res) {
        setResource(res);
        setIsBookmarked(Boolean(res.is_bookmarked));
        setDownloadCount(res.download_count);

        // Fetch related resources in the same subject
        const related = mockStore
          .getResources({ subjectId: res.subject_id, moderationStatus: "approved" })
          .filter((item) => item.id !== res.id)
          .slice(0, 3);
        setRelatedResources(related);
      }
    }
  }, [resourceId]);

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Resource Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested educational resource might have been removed or is pending moderation.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Library</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookmarkToggle = () => {
    const user = mockStore.getCurrentUser();
    if (!user) {
      alert("Please log in to bookmark resources.");
      return;
    }
    const newState = mockStore.toggleBookmark(user.id, resource.id);
    setIsBookmarked(newState);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(`/api/resources/${resource.id}/download`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setDownloadCount(data.data.downloadCount);
        // Direct browser file download
        window.location.href = `/api/resources/${resource.id}/download`;
      }
    } catch {
      mockStore.incrementDownload(resource.id);
      setDownloadCount((prev) => prev + 1);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Back Link */}
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Resources</span>
          </button>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(
                    resource.category
                  )}`}
                >
                  {resource.category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {resource.subject_name || "General Engineering"}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Semester {resource.semester}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {resource.title}
              </h1>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {resource.description}
              </p>

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resource.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Shared by {resource.owner_name || "Academic Contributor"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(resource.created_at)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatBytes(resource.file_size)}</span>
                </span>
                <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadCount} Downloads</span>
                </span>
              </div>
            </div>

            {/* Action Buttons Box */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? "Preparing File..." : "Download Material"}</span>
              </button>

              <button
                onClick={handleBookmarkToggle}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  isBookmarked
                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current text-amber-600" : ""}`} />
                <span>{isBookmarked ? "Saved in Bookmarks" : "Save to Bookmarks"}</span>
              </button>

              <button
                onClick={() => setReportingResource(resource)}
                className="w-full px-4 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Content</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Study Assistant & Content Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
                activeTab === "summary"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI Exam Summary</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
                activeTab === "chat"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Grounded Q&A Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
                activeTab === "preview"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Extracted Text Reader</span>
            </button>
          </div>

          {/* Tab Views */}
          {activeTab === "summary" && <AISummaryView resource={resource} />}

          {activeTab === "chat" && <AIStudyChat resource={resource} />}

          {activeTab === "preview" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs">Document Text Preview</h3>
                <span className="text-[11px] text-slate-400">
                  {resource.file_name} ({formatBytes(resource.file_size)})
                </span>
              </div>
              <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
                {resource.content_text || "No preview text available for this document."}
              </pre>
            </div>
          )}
        </div>

        {/* Related Subject Resources */}
        {relatedResources.length > 0 && (
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                More Materials in {resource.subject_name}
              </h3>
              <Link
                href={`/resources?subjectId=${resource.subject_id}`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all in subject &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedResources.map((rel) => (
                <ResourceCard key={rel.id} resource={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <ReportModal
        resource={reportingResource}
        onClose={() => setReportingResource(null)}
      />
    </div>
  );
}
