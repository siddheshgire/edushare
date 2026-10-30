-- =========================================================================
-- EDUSHARE COMPLETE POSTGRESQL DATABASE & RLS SCHEMA
-- Copy and paste this entire script into your Supabase SQL Editor and click RUN
-- =========================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    selected_semester INTEGER CHECK (selected_semester BETWEEN 1 AND 8),
    college_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    department TEXT DEFAULT 'Computer Science & Engineering',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    category TEXT NOT NULL CHECK (category IN (
        'Lecture Notes',
        'Previous Year Question Papers',
        'Assignments and Practice Problems',
        'Reference Books and Materials',
        'Lab Manuals',
        'Revision Notes',
        'Other Educational Resources'
    )),
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    tags TEXT[] DEFAULT '{}',
    moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'removed')),
    rejection_reason TEXT,
    download_count INTEGER NOT NULL DEFAULT 0,
    view_count INTEGER NOT NULL DEFAULT 0,
    content_text TEXT,
    fts tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_bookmark UNIQUE (user_id, resource_id)
);

-- 5. Resource Requests Table
CREATE TABLE IF NOT EXISTS public.resource_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    deadline DATE,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Fulfilled', 'Closed')),
    fulfillment_resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Resource Reports Table
CREATE TABLE IF NOT EXISTS public.resource_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN (
        'Incorrectly categorized',
        'Spam',
        'Inappropriate content',
        'Potential copyright violation',
        'Misleading description'
    )),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_report UNIQUE (reporter_id, resource_id)
);

-- 7. Download Events Table
CREATE TABLE IF NOT EXISTS public.download_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Moderation Logs Table
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    administrator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'removed', 'dismissed_report', 'resolved_report')),
    target_type TEXT NOT NULL CHECK (target_type IN ('resource', 'report', 'request')),
    target_id UUID NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. AI Summaries Table
CREATE TABLE IF NOT EXISTS public.ai_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE UNIQUE,
    main_concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
    definitions JSONB NOT NULL DEFAULT '[]'::jsonb,
    key_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    revision_notes TEXT NOT NULL,
    practice_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    model_used TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(moderation_status);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_semester ON public.resources(semester);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_fts ON public.resources USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_requests_status ON public.resource_requests(status);
CREATE INDEX IF NOT EXISTS idx_resource_reports_status ON public.resource_reports(status);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Profiles readable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Subjects Policies
CREATE POLICY "Subjects are viewable by everyone"
ON public.subjects FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage subjects"
ON public.subjects FOR ALL TO authenticated USING (public.is_admin());

-- Resources Policies
CREATE POLICY "Approved resources viewable by everyone"
ON public.resources FOR SELECT TO public USING (moderation_status = 'approved');

CREATE POLICY "Owners can view own unapproved resources"
ON public.resources FOR SELECT TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all resources"
ON public.resources FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Students can upload resources"
ON public.resources FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid() AND moderation_status = 'pending');

CREATE POLICY "Owners can update own resources"
ON public.resources FOR UPDATE TO authenticated
USING (owner_id = auth.uid() AND moderation_status IN ('pending', 'approved'))
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete own resources"
ON public.resources FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all resources"
ON public.resources FOR ALL TO authenticated USING (public.is_admin());

-- Bookmarks Policies
CREATE POLICY "Users can view own bookmarks"
ON public.bookmarks FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can add bookmarks"
ON public.bookmarks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bookmarks"
ON public.bookmarks FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Resource Requests Policies
CREATE POLICY "Resource requests viewable by authenticated users"
ON public.resource_requests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students can create resource requests"
ON public.resource_requests FOR INSERT TO authenticated WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Requesters can update own requests"
ON public.resource_requests FOR UPDATE TO authenticated
USING (requester_id = auth.uid()) WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Admins can moderate requests"
ON public.resource_requests FOR ALL TO authenticated USING (public.is_admin());

-- Resource Reports Policies
CREATE POLICY "Students can submit reports"
ON public.resource_reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Students can view own reports"
ON public.resource_reports FOR SELECT TO authenticated USING (reporter_id = auth.uid());

CREATE POLICY "Admins can manage all reports"
ON public.resource_reports FOR ALL TO authenticated USING (public.is_admin());

-- Moderation Logs Policies
CREATE POLICY "Admins can manage moderation logs"
ON public.moderation_logs FOR ALL TO authenticated USING (public.is_admin());

-- Download Events Policies
CREATE POLICY "Anyone can log download events"
ON public.download_events FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view download events"
ON public.download_events FOR SELECT TO authenticated USING (public.is_admin());

-- AI Summaries Policies
CREATE POLICY "AI summaries viewable for approved resources"
ON public.ai_summaries FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.resources 
        WHERE resources.id = ai_summaries.resource_id 
        AND resources.moderation_status = 'approved'
    )
);

CREATE POLICY "Authenticated users can create AI summaries"
ON public.ai_summaries FOR INSERT TO authenticated WITH CHECK (true);

-- =========================================================================
-- SEED INITIAL SUBJECT TAXONOMY
-- =========================================================================
INSERT INTO public.subjects (id, name, code, description, department)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Data Structures & Algorithms', 'CS301', 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming and Complexity Analysis', 'Computer Science & Engineering'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Database Management Systems', 'CS403', 'Relational Algebra, SQL, Normalization, ACID Transactions, and Concurrency Control', 'Computer Science & Engineering'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Operating Systems', 'CS402', 'Processes, Threads, CPU Scheduling, Memory Virtualization, Deadlocks, and File Systems', 'Computer Science & Engineering'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Computer Networks', 'CS501', 'OSI/TCP-IP Models, Routing Algorithms, Transport Layer Protocols, and Network Security', 'Computer Science & Engineering'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Machine Learning & AI', 'CS701', 'Supervised & Unsupervised Learning, Neural Networks, Loss Functions, and Transformers', 'Artificial Intelligence'),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Software Engineering & Agile', 'CS502', 'System Modeling, Design Patterns, CI/CD, Agile/Scrum Principles, and Testing QA', 'Information Technology'),
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Digital Logic & Computer Org', 'CS201', 'Boolean Algebra, Logic Gates, Multiplexers, CPU Datapath, and Assembly Architecture', 'Computer Science & Engineering'),
    ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Cloud Computing & DevOps', 'CS601', 'Virtualization, Containers, Microservices, Kubernetes, and Serverless Architecture', 'Cloud & Systems')
ON CONFLICT (code) DO NOTHING;
