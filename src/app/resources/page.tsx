"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UploadCloud, Search, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceFilterBar from "@/components/resources/ResourceFilterBar";
import ResourceUploadModal from "@/components/resources/ResourceUploadModal";
import ReportModal from "@/components/resources/ReportModal";
import { mockStore, INITIAL_SUBJECTS } from "@/lib/store/mock-store";
import { Resource } from "@/types";

function ResourceLibraryContent() {
  const searchParams = useSearchParams();

  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subjectId") || "");
  const [selectedSemester, setSelectedSemester] = useState<number>(
    searchParams.get("semester") ? Number(searchParams.get("semester")) : 0
  );
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState<"newest" | "downloads">("newest");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);

  const fetchResources = React.useCallback(() => {
    let list = mockStore.getResources({
      search,
      subjectId: selectedSubject || undefined,
      semester: selectedSemester > 0 ? selectedSemester : undefined,
      category: selectedCategory || undefined,
      moderationStatus: "approved",
    });

    if (sortBy === "downloads") {
      list = list.sort((a, b) => b.download_count - a.download_count);
    } else {
      list = list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    setResources(list);
  }, [search, selectedSubject, selectedSemester, selectedCategory, sortBy]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedSubject("");
    setSelectedSemester(0);
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Educational Resource Library
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {resources.length} Available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse approved lecture notes, solved previous year papers, and lab manuals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Toggle */}
            <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-lg p-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setSortBy("newest")}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  sortBy === "newest" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("downloads")}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  sortBy === "downloads"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Most Downloaded
              </button>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <ResourceFilterBar
          subjects={INITIAL_SUBJECTS}
          search={search}
          onSearchChange={setSearch}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          totalResults={resources.length}
          onReset={handleResetFilters}
        />

        {/* Resources Grid */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {resources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onReportClick={(r) => setReportingResource(r)}
                onBookmarkToggle={() => fetchResources()}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No resources found matching filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords, selecting a different semester, or clearing the category filter.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Upload First Material For This Topic
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <ResourceUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        subjects={INITIAL_SUBJECTS}
        onUploadSuccess={fetchResources}
      />

      <ReportModal
        resource={reportingResource}
        onClose={() => setReportingResource(null)}
      />
    </div>
  );
}

export default function ResourceLibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
          Loading Resource Library...
        </div>
      }
    >
      <ResourceLibraryContent />
    </Suspense>
  );
}
