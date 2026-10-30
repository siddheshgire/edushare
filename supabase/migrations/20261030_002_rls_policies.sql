-- EduShare Row Level Security (RLS) Policies Migration 002

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the active user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
-- Any authenticated user can read public profile data
CREATE POLICY "Profiles readable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Insert profile upon registration
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- 2. Subjects Policies
-- Subjects are readable by everyone (including guests)
CREATE POLICY "Subjects are viewable by everyone"
ON public.subjects FOR SELECT
TO public
USING (true);

-- Only admins can manage subjects
CREATE POLICY "Admins can manage subjects"
ON public.subjects FOR ALL
TO authenticated
USING (public.is_admin());

-- 3. Resources Policies
-- Approved resources are viewable by everyone (students and guests)
CREATE POLICY "Approved resources viewable by everyone"
ON public.resources FOR SELECT
TO public
USING (moderation_status = 'approved');

-- Owners can view their own pending or rejected resources
CREATE POLICY "Owners can view own unapproved resources"
ON public.resources FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

-- Admins can view all resources (including pending/rejected/removed)
CREATE POLICY "Admins can view all resources"
ON public.resources FOR SELECT
TO authenticated
USING (public.is_admin());

-- Authenticated students can upload resources (forced to 'pending' moderation status)
CREATE POLICY "Students can upload resources"
ON public.resources FOR INSERT
TO authenticated
WITH CHECK (
    owner_id = auth.uid() 
    AND moderation_status = 'pending'
);

-- Owners can update their own resources metadata
CREATE POLICY "Owners can update own resources"
ON public.resources FOR UPDATE
TO authenticated
USING (owner_id = auth.uid() AND moderation_status IN ('pending', 'approved'))
WITH CHECK (owner_id = auth.uid());

-- Owners can delete their own resources
CREATE POLICY "Owners can delete own resources"
ON public.resources FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Admins can update any resource (e.g. approving, rejecting, or removing)
CREATE POLICY "Admins can manage all resources"
ON public.resources FOR ALL
TO authenticated
USING (public.is_admin());

-- 4. Bookmarks Policies
-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
ON public.bookmarks FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can add bookmarks for approved resources
CREATE POLICY "Users can add bookmarks"
ON public.bookmarks FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON public.bookmarks FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 5. Resource Requests Policies
-- Everyone can view open resource requests
CREATE POLICY "Resource requests viewable by authenticated users"
ON public.resource_requests FOR SELECT
TO authenticated
USING (true);

-- Students can create requests
CREATE POLICY "Students can create resource requests"
ON public.resource_requests FOR INSERT
TO authenticated
WITH CHECK (requester_id = auth.uid());

-- Requester can update or close their own requests
CREATE POLICY "Requesters can update own requests"
ON public.resource_requests FOR UPDATE
TO authenticated
USING (requester_id = auth.uid())
WITH CHECK (requester_id = auth.uid());

-- Admins can moderate requests
CREATE POLICY "Admins can moderate requests"
ON public.resource_requests FOR ALL
TO authenticated
USING (public.is_admin());

-- 6. Resource Reports Policies
-- Students can submit reports
CREATE POLICY "Students can submit reports"
ON public.resource_reports FOR INSERT
TO authenticated
WITH CHECK (reporter_id = auth.uid());

-- Students can view their own filed reports
CREATE POLICY "Students can view own reports"
ON public.resource_reports FOR SELECT
TO authenticated
USING (reporter_id = auth.uid());

-- Only admins can view, resolve, and dismiss reports
CREATE POLICY "Admins can manage all reports"
ON public.resource_reports FOR ALL
TO authenticated
USING (public.is_admin());

-- 7. Moderation Logs Policies
-- Only admins can view or insert moderation logs
CREATE POLICY "Admins can manage moderation logs"
ON public.moderation_logs FOR ALL
TO authenticated
USING (public.is_admin());

-- 8. Download Events Policies
-- Anyone can record a download event
CREATE POLICY "Anyone can log download events"
ON public.download_events FOR INSERT
TO public
WITH CHECK (true);

-- Admins and owners can view download events
CREATE POLICY "Admins can view download events"
ON public.download_events FOR SELECT
TO authenticated
USING (public.is_admin());

-- 9. AI Summaries Policies
-- AI summaries of approved resources are viewable by authenticated users
CREATE POLICY "AI summaries viewable for approved resources"
ON public.ai_summaries FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.resources 
        WHERE resources.id = ai_summaries.resource_id 
        AND resources.moderation_status = 'approved'
    )
);

-- Authenticated users or server functions can insert AI summaries
CREATE POLICY "Authenticated users can create AI summaries"
ON public.ai_summaries FOR INSERT
TO authenticated
WITH CHECK (true);
