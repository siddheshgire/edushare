import React from "react";
import Link from "next/link";
import { BookOpen, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xl text-white tracking-tight">EduShare</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Open Educational Platform
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Tagline: <strong className="text-slate-200">Learn Together. Share Knowledge. Grow Together.</strong>
              <br />
              A centralized digital learning hub designed to eliminate fragmented study resources.
              Discover, organize, and download lecture notes, previous question papers, and lab manuals for free.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Academic Fair-Use & Zero Commercial Paywalls</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources" className="hover:text-white transition">
                  Resource Library
                </Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-white transition">
                  Request Study Materials
                </Link>
              </li>
              <li>
                <Link href="/resources?category=Previous+Year+Question+Papers" className="hover:text-white transition">
                  Previous Year Papers (PYQs)
                </Link>
              </li>
              <li>
                <Link href="/resources?category=Revision+Notes" className="hover:text-white transition">
                  Exam Revision Guides
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white text-indigo-400 transition">
                  Moderator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Integrity & Copyright Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Academic Policy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              EduShare adheres to academic fair-use guidelines. Students must only upload handwritten notes, open study guides, or materials they have explicit permission to distribute.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="block font-medium text-slate-300">Notice & Takedown:</span>
              To report unauthorized or copyrighted materials, use the in-app &quot;Report&quot; action on any resource card or contact{" "}
              <a href="mailto:integrity@edushare.edu" className="text-blue-400 underline">
                integrity@edushare.edu
              </a>.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduShare. Digital Learning & Educational Resource Accessibility.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">SEVA Innovation Showcase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
