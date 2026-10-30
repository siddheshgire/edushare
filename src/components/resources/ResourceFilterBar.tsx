"use client";

import { Search, RotateCcw } from "lucide-react";
import { Subject } from "@/types";
import { RESOURCE_CATEGORIES } from "@/lib/validation/resource";

interface FilterBarProps {
  subjects: Subject[];
  search: string;
  onSearchChange: (val: string) => void;
  selectedSubject: string;
  onSubjectChange: (val: string) => void;
  selectedSemester: number | 0;
  onSemesterChange: (val: number) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  totalResults: number;
  onReset: () => void;
}

export default function ResourceFilterBar({
  subjects,
  search,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedSemester,
  onSemesterChange,
  selectedCategory,
  onCategoryChange,
  totalResults,
  onReset,
}: FilterBarProps) {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const hasActiveFilters = Boolean(
    search.trim() || selectedSubject || selectedSemester > 0 || selectedCategory
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* Search Bar & Reset */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by keywords, title, algorithms, question topics..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900">{totalResults}</strong> resource
            {totalResults === 1 ? "" : "s"}
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Dropdowns Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Subject Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Type</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          >
            <option value="">All Categories</option>
            {RESOURCE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => onSemesterChange(0)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedSemester === 0
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {semesters.map((s) => (
              <button
                key={s}
                onClick={() => onSemesterChange(s)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition flex-1 text-center ${
                  selectedSemester === s
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
