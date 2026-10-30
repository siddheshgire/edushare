export type UserRole = 'student' | 'admin' | 'guest';

export type ResourceCategory =
  | 'Lecture Notes'
  | 'Previous Year Question Papers'
  | 'Assignments and Practice Problems'
  | 'Reference Books and Materials'
  | 'Lab Manuals'
  | 'Revision Notes'
  | 'Other Educational Resources';

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'removed';

export type RequestStatus = 'Open' | 'In Progress' | 'Fulfilled' | 'Closed';

export type ReportReason =
  | 'Incorrectly categorized'
  | 'Spam'
  | 'Inappropriate content'
  | 'Potential copyright violation'
  | 'Misleading description';

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  selected_semester?: number;
  avatar_url?: string;
  college_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  department?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  owner_id: string;
  owner_name?: string;
  title: string;
  description: string;
  subject_id: string;
  subject_name?: string;
  semester: number;
  category: ResourceCategory;
  storage_path: string;
  file_name: string;
  file_type: string;
  file_size: number; // in bytes
  tags: string[];
  moderation_status: ModerationStatus;
  rejection_reason?: string;
  download_count: number;
  view_count: number;
  is_bookmarked?: boolean;
  content_text?: string; // Extracted text for preview / AI processing
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
  resource?: Resource;
}

export interface ResourceRequest {
  id: string;
  requester_id: string;
  requester_name?: string;
  title: string;
  description: string;
  subject_id: string;
  subject_name?: string;
  semester: number;
  deadline?: string;
  status: RequestStatus;
  fulfillment_resource_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceReport {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  resource_id: string;
  resource_title?: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewed_by?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface ModerationLog {
  id: string;
  administrator_id: string;
  administrator_name?: string;
  action: 'approved' | 'rejected' | 'removed' | 'dismissed_report' | 'resolved_report';
  target_type: 'resource' | 'report' | 'request';
  target_id: string;
  target_title?: string;
  reason?: string;
  created_at: string;
}

export interface AISummary {
  id: string;
  resource_id: string;
  main_concepts: string[];
  definitions: { term: string; explanation: string }[];
  key_points: string[];
  revision_notes: string;
  practice_questions: { question: string; answer_hint: string }[];
  model_used: string;
  created_at: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: { section: string; page?: number }[];
  timestamp: string;
}

export interface PlatformStats {
  total_students: number;
  total_resources: number;
  total_downloads: number;
  pending_submissions: number;
  reported_resources: number;
  open_requests: number;
}
