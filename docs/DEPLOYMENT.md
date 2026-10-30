# EduShare Production Deployment Guide

## 1. Overview
EduShare is architected to deploy smoothly on **Vercel** with a managed **Supabase** backend (PostgreSQL database, authentication, and document storage).

---

## 2. Prerequisites
1. **Node.js**: v18.18+ or v20+ (tested on Node v24).
2. **Supabase Account**: Free tier is sufficient for deployment.
3. **Vercel Account**: For automated Next.js deployments.
4. **AI Provider API Key (Optional)**: Google Gemini API key or OpenAI key. (If unset, the app gracefully operates using native academic extractive parsing).

---

## 3. Step-by-Step Supabase Setup

### Step 3.1: Create a Supabase Project
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**, select an organization, enter Project Name `edushare-prod`, and choose a region close to your target users.
3. Note your database password.

### Step 3.2: Run Database Migrations
In the Supabase Dashboard, navigate to the **SQL Editor** and execute the migrations in sequence:
1. `supabase/migrations/20261030_001_initial_schema.sql`: Creates `profiles`, `subjects`, `resources`, `bookmarks`, `resource_requests`, `resource_reports`, `download_events`, `moderation_logs`, and full-text search indexes.
2. `supabase/migrations/20261030_002_rls_policies.sql`: Enables Row Level Security on all tables and creates authorization policies.
3. `supabase/migrations/20261030_003_seed_data.sql`: Seeds curriculum subjects (DSA, OS, DBMS, Computer Networks, AI, Cloud, etc.).

### Step 3.3: Configure Storage Bucket
1. Go to **Storage** -> **Create a new bucket**.
2. Name the bucket `edushare-resources`.
3. Set public access according to your security posture (Private bucket with authenticated URL generation is recommended).

### Step 3.4: Retrieve API Keys
Go to **Project Settings -> API** and copy:
- `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
- `anon public key` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role secret key` -> `SUPABASE_SERVICE_ROLE_KEY` (Keep secure on server only!)

---

## 4. Vercel Deployment

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete edushare educational platform"
   git branch -M main
   git remote add origin https://github.com/your-username/edushare.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New -> Project**, and import your `edushare` repository.
4. In the **Environment Variables** section, configure:
   | Variable Name | Example / Production Value |
   |---|---|
   | `NEXT_PUBLIC_APP_URL` | `https://edushare.vercel.app` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` (Server only) |
   | `AI_PROVIDER_API_KEY` | Your Google Gemini API Key |
   | `AI_MODEL_NAME` | `gemini-1.5-flash` |
5. Click **Deploy**. Vercel will run `npm run build` and provision your globally distributed application.

---

## 5. Post-Deployment Verification Checklist
- [ ] Landing page loads with verified resource count and search bar.
- [ ] Student can register, login, and browse resources.
- [ ] Search query "Dijkstra" returns relevant Data Structures notes.
- [ ] Filter by Semester 4 correctly isolates OS and DBMS resources.
- [ ] Upload modal successfully validates file format and enforces 25MB limit.
- [ ] New upload enters `pending` state in moderation queue.
- [ ] Admin portal approves resource, moving it into public library.
- [ ] File download counter increments atomically.
- [ ] AI Study Assistant generates structured exam summary and answers grounded questions.
