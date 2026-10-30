"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Bookmark,
  Flag,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Resource } from "@/types";
import { formatBytes, getCategoryBadgeClass, getStatusBadgeClass } from "@/lib/utils";
import { mockStore } from "@/lib/store/mock-store";

interface ResourceCardProps {
  resource: Resource;
  onBookmarkToggle?: (resourceId: string, newState: boolean) => void;
  onReportClick?: (resource: Resource) => void;
  showModerationStatus?: boolean;
}

export default function ResourceCard({
  resource,
  onBookmarkToggle,
  onReportClick,
  showModerationStatus = false,
}: ResourceCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(Boolean(resource.is_bookmarked));
  const [downloadCount, setDownloadCount] = useState(resource.download_count);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentUser = mockStore.getCurrentUser();
    if (!currentUser) {
      alert("Please log in to bookmark study materials.");
      return;
    }
    const newState = mockStore.toggleBookmark(currentUser.id, resource.id);
    setIsBookmarked(newState);
    if (onBookmarkToggle) onBookmarkToggle(resource.id, newState);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsDownloading(true);
      const res = await fetch(`/api/resources/${resource.id}/download`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setDownloadCount(data.data.downloadCount);
        // Trigger browser download via GET
        const downloadWindow = window.open(`/api/resources/${resource.id}/download`, "_blank");
        if (!downloadWindow) {
          window.location.href = `/api/resources/${resource.id}/download`;
        }
      }
    } catch {
      // Fallback direct download
      mockStore.incrementDownload(resource.id);
      setDownloadCount((prev) => prev + 1);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReportClick) {
      onReportClick(resource);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-5">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(
                resource.category
              )}`}
            >
              {resource.category}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Sem {resource.semester}
            </span>
            {showModerationStatus && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md border capitalize flex items-center gap-1 ${getStatusBadgeClass(
                  resource.moderation_status
                )}`}
              >
                {resource.moderation_status === "approved" && <CheckCircle className="w-3 h-3" />}
                {resource.moderation_status === "pending" && <Clock className="w-3 h-3" />}
                {resource.moderation_status === "rejected" && <XCircle className="w-3 h-3" />}
                {resource.moderation_status}
              </span>
            )}
          </div>

          {/* Quick Actions (Bookmark & Report) */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              title={isBookmarked ? "Remove Bookmark" : "Save to Bookmarks"}
              className={`p-1.5 rounded-lg border transition ${
                isBookmarked
                  ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                  : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleReport}
              title="Report inappropriate content or copyright issue"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={`/resources/${resource.id}`} className="block group-hover:text-blue-600 transition">
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2">
            {resource.title}
          </h3>
        </Link>

        {/* Subject & Description */}
        <p className="text-xs font-medium text-blue-700 mt-1 mb-2">
          {resource.subject_name || "General Engineering"}
        </p>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Download */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            {downloadCount}
          </span>
          <span>{formatBytes(resource.file_size)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/resources/${resource.id}`}
            className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-md transition"
          >
            Study & AI View
          </Link>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
