import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResourceCategory, ModerationStatus, RequestStatus, ReportStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getCategoryBadgeClass(category: ResourceCategory): string {
  switch (category) {
    case "Lecture Notes":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Previous Year Question Papers":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Assignments and Practice Problems":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Reference Books and Materials":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Lab Manuals":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "Revision Notes":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function getStatusBadgeClass(status: ModerationStatus | RequestStatus | ReportStatus): string {
  switch (status) {
    case "approved":
    case "Fulfilled":
    case "resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
    case "Open":
    case "In Progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "rejected":
    case "removed":
    case "Closed":
    case "dismissed":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
