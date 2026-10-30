"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  UploadCloud,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceUploadModal from "@/components/resources/ResourceUploadModal";
import ReportModal from "@/components/resources/ReportModal";
import { mockStore, INITIAL_SUBJECTS } from "@/lib/store/mock-store";
import { Resource } from "@/types";

export default function LandingPage() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);

  useEffect(() => {
    // Load approved resources
    setResources(mockStore.getResources({ moderationStatus: "approved" }));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const stats = mockStore.getStats();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>EduShare Open Academic Repository</span>
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                <span className="text-slate-500 font-normal">100% Free for Students</span>
              </div>

              {/* Tagline & Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Learn Together. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Share Knowledge.
                </span>{" "}
                Grow Together.
              </h1>

              {/* Problem Statement & Solution Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                No more hunting through fragmented WhatsApp groups or dead Google Drive links. EduShare is a centralized, peer-verified platform to upload, discover, and download quality lecture notes, previous exam papers, and AI-assisted revision guides.
              </p>

              {/* Central Search Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-2xl mx-auto relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition"
              >
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by subject, chapter, or question (e.g. 'DSA Graphs', 'OS PYQ')..."
                  className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none px-2"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Popular Discovery Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Trending Topics:</span>
                {[
                  "Dynamic Programming",
                  "DBMS Normalization",
                  "Operating Systems 2025 PYQ",
                  "TCP/IP Sockets",
                  "Deep Learning Transformers",
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => router.push(`/resources?search=${encodeURIComponent(chip)}`)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-full transition text-[11px]"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  href="/resources"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Resource Library</span>
                </Link>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold shadow-xs transition flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span>Share Your Notes</span>
                </button>
              </div>
            </div>

            {/* Impact Metric Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  {stats.total_resources}+
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Verified Materials</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
                  {stats.total_downloads}+
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Free Downloads</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  8 Semesters
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Engineering Taxonomy</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">
                  AI-Powered
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Revision & Q&A</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW EDUSHARE WORKS SECTION */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Simple & Transparent
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                How EduShare Powers Digital Learning
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                A community-governed academic pipeline designed for students and verified by moderators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-base">Contribute Materials</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students upload lecture notes, solved question papers, and lab manuals. Every upload passes peer moderation for academic accuracy and fair-use compliance.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-base">Discover by Semester & Subject</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Search through organized curriculum categories from Semester 1 to 8. Download directly with zero paywalls, intrusive ads, or forced accounts.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-base">Study with Grounded AI</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate structured summaries, extract key definitions, and ask questions strictly grounded in the uploaded document without prompt injection vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED & RECENT RESOURCES */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Peer-Verified Materials
                </h2>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Featured Resources</h3>
              </div>
              <Link
                href="/resources"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>View Full Library ({resources.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.slice(0, 6).map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  onReportClick={(r) => setReportingResource(r)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SUBJECT & SEMESTER DISCOVERY */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curriculum</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Browse Materials by Subject
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Curated departments covering core computer science and engineering modules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INITIAL_SUBJECTS.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/resources?subjectId=${sub.id}`}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {sub.code}
                    </span>
                    <span className="text-[11px] text-slate-400 group-hover:text-blue-600 transition">
                      View Notes &rarr;
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition">
                    {sub.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* REQUESTS & COMMUNITY CTA */}
        <section className="py-16 bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium backdrop-blur-xs">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Can&apos;t find notes for a specific topic?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Request Study Materials From Your Peers
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Post an academic request for unsolved past papers, lab manuals, or tricky lecture topics. Your fellow students can upload matching documents to help you ace your exams.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/requests"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg transition"
              >
                Browse Study Requests
              </Link>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs transition"
              >
                Upload & Share Resources
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Upload Modal */}
      <ResourceUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        subjects={INITIAL_SUBJECTS}
        onUploadSuccess={() => {
          setResources(mockStore.getResources({ moderationStatus: "approved" }));
        }}
      />

      {/* Report Modal */}
      <ReportModal
        resource={reportingResource}
        onClose={() => setReportingResource(null)}
      />
    </div>
  );
}
