"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, BookOpen, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResourceCard from "@/components/resources/ResourceCard";
import ReportModal from "@/components/resources/ReportModal";
import { mockStore } from "@/lib/store/mock-store";
import { Resource } from "@/types";

export default function BookmarksPage() {
  const [bookmarkedResources, setBookmarkedResources] = useState<Resource[]>([]);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);

  const loadBookmarks = () => {
    const user = mockStore.getCurrentUser();
    if (user) {
      const bms = mockStore.getResources({ onlyBookmarkedBy: user.id });
      setBookmarkedResources(bms);
    } else {
      setBookmarkedResources([]);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Saved Bookmarks & Personal Library
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {bookmarkedResources.length} Saved
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Quick access to lecture notes and revision guides you saved for exam preparation.
            </p>
          </div>

          <Link
            href="/resources"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Search className="w-4 h-4" />
            <span>Discover More Notes</span>
          </Link>
        </div>

        {/* Bookmarks Grid */}
        {bookmarkedResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onBookmarkToggle={loadBookmarks}
                onReportClick={(r) => setReportingResource(r)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Your Personal Library is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t bookmarked any materials yet. Browse the resource library and tap the bookmark icon on any card to save it for quick revision.
            </p>
            <div className="pt-2">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Resource Library</span>
              </Link>
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
