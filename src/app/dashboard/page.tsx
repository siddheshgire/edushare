"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UploadCloud,
  Bookmark,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceUploadModal from "@/components/resources/ResourceUploadModal";
import CreateRequestModal from "@/components/requests/CreateRequestModal";
import { mockStore, INITIAL_SUBJECTS } from "@/lib/store/mock-store";
import { Resource, ResourceRequest, UserProfile } from "@/types";
import { formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [myUploads, setMyUploads] = useState<Resource[]>([]);
  const [myBookmarks, setMyBookmarks] = useState<Resource[]>([]);
  const [myRequests, setMyRequests] = useState<ResourceRequest[]>([]);
  const [recommended, setRecommended] = useState<Resource[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const loadData = () => {
    const user = mockStore.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      // My uploads (all statuses)
      const uploads = mockStore.getResources({ ownerId: user.id, moderationStatus: undefined });
      setMyUploads(uploads);

      // My bookmarks
      const bms = mockStore.getResources({ onlyBookmarkedBy: user.id });
      setMyBookmarks(bms);

      // My requests
      const reqs = mockStore.getRequests().filter((r) => r.requester_id === user.id);
      setMyRequests(reqs);

      // Recommendations based on student's semester or popular items
      const userSem = user.selected_semester || 3;
      const recs = mockStore
        .getResources({ moderationStatus: "approved" })
        .filter((r) => r.semester === userSem || r.download_count > 50)
        .slice(0, 3);
      setRecommended(recs);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {currentUser?.full_name || "Student"}!
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Semester {currentUser?.selected_semester || 3}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser?.college_name || "National Institute of Technology"} • Student Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Notes</span>
            </button>
            <button
              onClick={() => setIsRequestOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Request Notes</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Your Shared Materials</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myUploads.length}</h3>
              <p className="text-[11px] text-blue-600 mt-1">
                {myUploads.filter((u) => u.moderation_status === "approved").length} approved & live
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Bookmarked Resources</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myBookmarks.length}</h3>
              <p className="text-[11px] text-amber-600 mt-1">Saved for revision</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Your Study Requests</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myRequests.length}</h3>
              <p className="text-[11px] text-emerald-600 mt-1">
                {myRequests.filter((r) => r.status === "Open").length} open peer requests
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recommended for your Semester */}
        {recommended.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recommended for Semester {currentUser?.selected_semester || 3}
                </h2>
                <p className="text-xs text-slate-500">Curriculum matches and trending revision materials</p>
              </div>
              <Link
                href="/resources"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.map((res) => (
                <ResourceCard key={res.id} resource={res} onBookmarkToggle={loadData} />
              ))}
            </div>
          </div>
        )}

        {/* My Uploads Management Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Uploaded Materials</h2>
              <p className="text-xs text-slate-500">
                Track moderation review status for resources you have submitted
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              + Upload New
            </button>
          </div>

          {myUploads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Subject</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Downloads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myUploads.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70">
                      <td className="py-3 pr-4 font-semibold text-slate-900">
                        <Link href={`/resources/${res.id}`} className="hover:text-blue-600 transition">
                          {res.title}
                        </Link>
                        {res.rejection_reason && (
                          <p className="text-[11px] text-rose-600 mt-0.5">
                            Moderator Note: {res.rejection_reason}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{res.subject_name}</td>
                      <td className="py-3 pr-4 text-slate-600">{res.category}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${getStatusBadgeClass(
                            res.moderation_status
                          )}`}
                        >
                          {res.moderation_status === "approved" && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          )}
                          {res.moderation_status === "pending" && (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          {res.moderation_status === "rejected" && (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          {res.moderation_status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-500">{formatDate(res.created_at)}</td>
                      <td className="py-3 text-right font-medium text-slate-700">
                        {res.download_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              You haven&apos;t shared any resources yet. Contribute your notes to help peers!
            </div>
          )}
        </div>

        {/* My Requests Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Study Material Requests</h2>
              <p className="text-xs text-slate-500">Materials you requested from the community</p>
            </div>
            <button
              onClick={() => setIsRequestOpen(true)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              + Post New Request
            </button>
          </div>

          {myRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {req.subject_name}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{req.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>
                  <p className="text-[11px] text-slate-400">Posted on {formatDate(req.created_at)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-500 text-xs">
              No active study material requests.
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ResourceUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        subjects={INITIAL_SUBJECTS}
        onUploadSuccess={loadData}
      />

      <CreateRequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        subjects={INITIAL_SUBJECTS}
        onRequestCreated={loadData}
      />
    </div>
  );
}
