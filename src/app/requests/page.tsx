"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Calendar,
  User,
  UploadCloud,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CreateRequestModal from "@/components/requests/CreateRequestModal";
import ResourceUploadModal from "@/components/resources/ResourceUploadModal";
import { mockStore, INITIAL_SUBJECTS } from "@/lib/store/mock-store";
import { ResourceRequest } from "@/types";
import { formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function StudyRequestsPage() {
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFulfillUploadOpen, setIsFulfillUploadOpen] = useState(false);
  const [fulfillingRequest, setFulfillingRequest] = useState<ResourceRequest | null>(null);

  const loadRequests = React.useCallback(() => {
    let list = mockStore.getRequests();
    if (selectedSemester > 0) {
      list = list.filter((r) => r.semester === selectedSemester);
    }
    if (selectedSubject) {
      list = list.filter((r) => r.subject_id === selectedSubject);
    }
    setRequests(list);
  }, [selectedSemester, selectedSubject]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleFulfillClick = (req: ResourceRequest) => {
    setFulfillingRequest(req);
    setIsFulfillUploadOpen(true);
  };

  const handleMarkFulfilled = (reqId: string) => {
    mockStore.updateRequestStatus(reqId, "Fulfilled");
    loadRequests();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar onOpenUpload={() => setIsFulfillUploadOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Study Material Requests
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {requests.length} Requests
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Need notes or exam papers that aren&apos;t in the library yet? Request from peers or contribute solutions!
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Post Study Request</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {INITIAL_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedSemester(0)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedSemester === 0
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedSemester === sem
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  S{sem}
                </button>
              ))}
            </div>
          </div>

          {(selectedSubject || selectedSemester > 0) && (
            <button
              onClick={() => {
                setSelectedSubject("");
                setSelectedSemester(0);
              }}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {req.subject_name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        Sem {req.semester}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{req.title}</h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {req.description}
                  </p>
                </div>

                {/* Footer details */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Requested by {req.requester_name || "Student"}</span>
                    </span>
                    {req.deadline && (
                      <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>Needed by: {formatDate(req.deadline)}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {req.status !== "Fulfilled" && (
                      <button
                        onClick={() => handleFulfillClick(req)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Contribute Resource</span>
                      </button>
                    )}
                    {req.status === "In Progress" && (
                      <button
                        onClick={() => handleMarkFulfilled(req.id)}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
                      >
                        Mark Fulfilled
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No requests found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no open study requests matching this subject or semester.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              Post the First Request
            </button>
          </div>
        )}
      </main>

      <Footer />

      <CreateRequestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        subjects={INITIAL_SUBJECTS}
        onRequestCreated={loadRequests}
      />

      <ResourceUploadModal
        isOpen={isFulfillUploadOpen}
        onClose={() => {
          setIsFulfillUploadOpen(false);
          setFulfillingRequest(null);
        }}
        subjects={INITIAL_SUBJECTS}
        onUploadSuccess={() => {
          if (fulfillingRequest) {
            mockStore.updateRequestStatus(fulfillingRequest.id, "Fulfilled");
          }
          loadRequests();
        }}
      />
    </div>
  );
}
