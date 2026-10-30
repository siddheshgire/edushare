# EduShare Database Schema and Data Architecture

## 1. Relational Database Overview
EduShare uses PostgreSQL hosted on **Supabase** with Row Level Security (RLS) enabled across every table. The database schema enforces data integrity, unique constraints, referential cascades, and full-text search indexing.

Migrations are version-controlled in `supabase/migrations/`:
- `20261030_001_initial_schema.sql`: Core tables, indexes, and full-text search.
- `20261030_002_rls_policies.sql`: Role-based security policies for student, admin, and guest access.
- `20261030_003_seed_data.sql`: Seed curriculum subjects and taxonomy.

---

## 2. Table Specifications

### 2.1 `public.profiles`
Stores student and administrator profile data linked directly to `auth.users(id)`.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | User unique identifier |
| `full_name` | TEXT | NOT NULL | Student / Administrator full name |
| `email` | TEXT | NOT NULL, UNIQUE | University or personal email |
| `role` | TEXT | NOT NULL, DEFAULT 'student', CHECK (role IN ('student', 'admin')) | Authorization role |
| `selected_semester` | INTEGER | CHECK (selected_semester BETWEEN 1 AND 8) | Academic semester preference |
| `college_name` | TEXT | NULLABLE | University or institute affiliation |
| `avatar_url` | TEXT | NULLABLE | Profile avatar image link |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

### 2.2 `public.subjects`
Academic subjects categorized by engineering curriculum.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Subject identifier |
| `name` | TEXT | NOT NULL, UNIQUE | Subject title (e.g., Operating Systems) |
| `code` | TEXT | NOT NULL, UNIQUE | University course code (e.g., CS402) |
| `description` | TEXT | NULLABLE | Brief curriculum description |
| `department` | TEXT | DEFAULT 'Computer Science & Engineering' | Engineering department |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Timestamp |

### 2.3 `public.resources`
The core repository table storing verified and pending educational materials.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Resource identifier |
| `owner_id` | UUID | REFERENCES profiles(id) ON DELETE CASCADE | Uploader profile ID |
| `title` | TEXT | NOT NULL | Resource title (e.g., 0/1 Knapsack Notes) |
| `description` | TEXT | NOT NULL | Detailed chapter and topic description |
| `subject_id` | UUID | REFERENCES subjects(id) ON DELETE RESTRICT | Subject foreign key |
| `semester` | INTEGER | CHECK (semester BETWEEN 1 AND 8) | Semester target |
| `category` | TEXT | NOT NULL, CHECK (category IN (7 types)) | Lecture Notes, PYQs, Lab Manuals, etc. |
| `storage_path` | TEXT | NOT NULL | Supabase Storage bucket path |
| `file_name` | TEXT | NOT NULL | Original document filename |
| `file_type` | TEXT | NOT NULL | MIME type (e.g. application/pdf) |
| `file_size` | BIGINT | NOT NULL, CHECK (file_size > 0) | Size in bytes (max 25MB enforced) |
| `tags` | TEXT[] | DEFAULT '{}' | Topic keyword array |
| `moderation_status` | TEXT | NOT NULL, DEFAULT 'pending', CHECK IN (...) | pending, approved, rejected, removed |
| `rejection_reason` | TEXT | NULLABLE | Explanation provided on rejection |
| `download_count` | INTEGER | NOT NULL, DEFAULT 0 | Real usage download tracker |
| `view_count` | INTEGER | NOT NULL, DEFAULT 0 | Resource impression counter |
| `content_text` | TEXT | NULLABLE | Extracted text for preview and AI grounding |
| `fts` | tsvector | GENERATED ALWAYS AS (...) STORED | PostgreSQL Full-Text Search column |

### 2.4 `public.bookmarks`
Enforces saved resources for students.
- `CONSTRAINT unique_user_bookmark UNIQUE (user_id, resource_id)` prevents redundant entries.

### 2.5 `public.resource_requests`
Peer study requests for materials not yet in the repository.
- Statuses: `Open`, `In Progress`, `Fulfilled`, `Closed`.

### 2.6 `public.resource_reports`
User reporting mechanism for copyright violations, inappropriate content, or misleading tags.
- Statuses: `pending`, `resolved`, `dismissed`.

### 2.7 `public.moderation_logs`
Audit trail recording all admin approvals, rejections, removals, and report resolutions.

---

## 3. Row Level Security (RLS) Summary
1. **Public/Guests**: Can read `subjects` and `resources` where `moderation_status = 'approved'`.
2. **Students**: Can upload resources (defaulting to `pending`), view their own pending/rejected items, update own resources, manage bookmarks, file reports, and post study requests.
3. **Admins**: Can view all submissions across all statuses, update moderation statuses, resolve reports, and write audit logs.
