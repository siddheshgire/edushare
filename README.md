# EduShare — Open Academic Resource Platform

> **Tagline**: Learn Together. Share Knowledge. Grow Together.  
> **Sector**: Education and Employability  
> **Sub-theme**: Digital Learning and Educational Resource Accessibility  
> **Target Track**: SEVA Innovation Showcase  

EduShare is a centralized, digital learning and educational resource-sharing platform designed to solve the fragmentation of study materials across disconnected messaging apps and personal cloud drives. Students can discover, upload, organize, and request peer-verified lecture notes, previous year question papers (PYQs), and laboratory manuals for free, augmented with a grounded AI Study Assistant.

---

## 🌟 Key Features

### 1. Student Experience
- **Curriculum Resource Library**: Search and filter notes, previous year question papers, lab manuals, and assignments across all 8 engineering semesters and subjects.
- **Resource Upload Workflow**: Upload academic documents (PDF, DOCX, PPTX, TXT up to 25MB) with metadata validation, tags, and mandatory fair-use copyright consent.
- **Personal Dashboard**: Track submitted resources (`pending`, `approved`, `rejected`), access bookmarked materials, and manage active study requests.
- **Peer Study Requests**: Request missing exam papers or lecture notes; community members can fulfill requests by contributing matching materials.
- **Academic Reporting**: Flag inaccurate descriptions, spam, or copyright violations directly to the moderation team.

### 2. AI Study Assistant (Server-Side)
- **Structured Academic Summarization**: Generates Core Concepts, Key Academic Definitions, Exam Revision Bullet Points, and Self-Assessment Practice Questions with answer hints.
- **Grounded Q&A**: Answers questions strictly grounded in the uploaded document text with section citations.
- **Prompt Injection Defense**: Isolates document text as untrusted data and declines out-of-scope inquiries to prevent hallucinations.
- **Zero-Dependency Fallback**: Gracefully operates with native text extraction if an external LLM API key is not configured.

### 3. Administrator & Moderation Portal
- **Platform Analytics**: Live queries for registered students, approved notes, pending submissions, reported resources, and total downloads.
- **Moderation Queue**: Review incoming student uploads with one-click Approve or structured Reject with custom feedback.
- **Report Resolution**: Investigate flagged materials and execute immediate takedowns for copyright infringements.
- **Audit Logs**: Immutable log recording moderator actions and rationale.

---

## 🏗️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS, Lucide Icons.
- **Backend**: Next.js Route Handlers, Server-Side Authorization, Zod Validation.
- **Database & Storage**: PostgreSQL via Supabase, Row Level Security (RLS), Supabase Storage.
- **AI Engine**: Google Gemini API (Server-side) / Modular LLM integration with prompt isolation.
- **Testing**: Vitest automated unit and integration test suite.
- **Deployment**: Vercel & Supabase.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
cd edushare
npm install
```

### 2. Run Automated Tests
```bash
npm test
```
*Expected: 17/17 tests passing across validation, permissions, filtering, and AI services.*

### 3. Configure Environment Variables
Duplicate `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The platform runs seamlessly out-of-the-box with built-in realistic mock data even before external Supabase credentials are configured).*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Verification
```bash
npm run build
npm run start
```

---

## 🗄️ Database & Security Migrations
Database schemas and Row Level Security policies are checked into `supabase/migrations/`:
- `supabase/migrations/20261030_001_initial_schema.sql`
- `supabase/migrations/20261030_002_rls_policies.sql`
- `supabase/migrations/20261030_003_seed_data.sql`

For instructions on applying migrations to a live Supabase project, refer to [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## 📚 Documentation Index
- [Architecture & System Design](docs/ARCHITECTURE.md)
- [Database Schema & Data Models](docs/DATABASE.md)
- [Security & Threat Model](docs/SECURITY.md)
- [Deployment Guide (Vercel & Supabase)](docs/DEPLOYMENT.md)
- [SEVA Innovation Demonstration Script](docs/DEMONSTRATION_SCRIPT.md)

---

## ⚖️ Academic Fair-Use & License
EduShare is distributed for non-commercial educational purposes. All uploaded documents are governed by academic fair-use guidelines and community peer-moderation.
