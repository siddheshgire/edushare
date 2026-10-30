"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Bookmark,
  HelpCircle,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X,
  UploadCloud,
} from "lucide-react";
import { mockStore } from "@/lib/store/mock-store";
import { UserProfile } from "@/types";

export default function Navbar({ onOpenUpload }: { onOpenUpload?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentUser(mockStore.getCurrentUser());
  }, []);

  const handleRoleSwitch = (role: "student" | "admin" | "guest") => {
    const user = mockStore.loginAs(role);
    setCurrentUser(user);
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "student") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: "Resource Library", href: "/resources", icon: BookOpen },
    { label: "Study Requests", href: "/requests", icon: HelpCircle },
    { label: "My Bookmarks", href: "/bookmarks", icon: Bookmark, authOnly: true },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, authOnly: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900">EduShare</span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Open Academics
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Learn Together. Share Knowledge.</p>
            </div>
          </Link>

          {/* Quick Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, PYQs, subjects, topics..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authOnly && !currentUser) return null;
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Dashboard Link */}
            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === "/admin"
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin Moderation</span>
              </Link>
            )}
          </nav>

          {/* Actions & Role Selector */}
          <div className="flex items-center gap-2.5">
            {/* Upload Button */}
            {currentUser && onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload</span>
              </button>
            )}

            {/* Interactive Demo Role Switcher */}
            <div className="hidden sm:flex items-center text-xs bg-slate-100 rounded-lg p-1 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-1.5">Role:</span>
              <button
                onClick={() => handleRoleSwitch("student")}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentUser?.role === "student"
                    ? "bg-white text-blue-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSwitch("admin")}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentUser?.role === "admin"
                    ? "bg-indigo-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleSwitch("guest")}
                className={`px-2 py-1 rounded font-medium transition ${
                  !currentUser
                    ? "bg-slate-700 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Guest
              </button>
            </div>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-medium text-slate-900 truncate max-w-[110px]">
                    {currentUser.full_name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">{currentUser.role}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, PYQs, subjects..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200"
            />
          </form>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              if (link.authOnly && !currentUser) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-indigo-700 font-semibold bg-indigo-50"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin Moderation Dashboard</span>
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Switch Demo Role:</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleRoleSwitch("student")}
                className={`px-2 py-1 text-xs rounded ${
                  currentUser?.role === "student" ? "bg-blue-600 text-white" : "bg-slate-100"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSwitch("admin")}
                className={`px-2 py-1 text-xs rounded ${
                  currentUser?.role === "admin" ? "bg-indigo-600 text-white" : "bg-slate-100"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleSwitch("guest")}
                className={`px-2 py-1 text-xs rounded ${
                  !currentUser ? "bg-slate-700 text-white" : "bg-slate-100"
                }`}
              >
                Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
