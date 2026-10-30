# EduShare — Official Project Submission

> **Status**: Prototype Deployed & Live User Testing in Progress  
> **Sector**: Education and Employability  
> **Sub-theme**: Digital Learning and Educational Resource Accessibility  
> **Author / Lead**: Siddhesh Gire (`siddhesh.gire2501132072@student.sspu.ac.in`)  
> **Tagline**: *Learn Together. Share Knowledge. Grow Together.*

---

## 1. Executive Summary & Problem Statement

### The Problem
Higher education students face severe friction in accessing verified, curriculum-aligned academic resources:
- Study materials are scattered across fragmented channels (WhatsApp groups, Telegram channels, Google Drive links) with zero quality control or searchability.
- Students lack reliable, course-specific AI study assistance that quotes verified sources without hallucinating.
- Peer contributions lack an organized incentive structure, and inappropriate or copyright-infringing content goes unmonitored without administrative controls.

### The Solution: EduShare
**EduShare** is an AI-assisted open educational resource-sharing platform engineered to democratize access to high-quality academic materials. Built with Next.js 15, TypeScript, Tailwind CSS, Supabase (PostgreSQL + RLS + Object Storage), and Google Gemini 2.5 Flash, EduShare delivers:
1. **Centralized Resource Repository**: Multi-tiered filtering by university, course, department, semester, subject, and file type with fast-text search.
2. **Ground-Truth AI Study Assistant**: Powered by Gemini 2.5 Flash with prompt injection defenses, generating structured takeaways, quizzes, and verified source citations.
3. **Peer-to-Peer Study Requests**: A collaborative marketplace where students can request missing notes and peers fulfill them.
4. **Institutional Trust & Governance**: Multi-role authentication (Student, Admin, Guest), moderation review queues, copyright reporting, and audit trails.

---

## 2. System Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 15 (App Router)** | High-performance React server components, static generation & API routes |
| **Language & Styling** | **TypeScript & Tailwind CSS** | Strict type safety, responsive design, accessible UI with Lucide icons |
| **Database & Auth** | **Supabase (PostgreSQL 15)** | Relational schemas, Row-Level Security (RLS), full audit trails |
| **Object Storage** | **Supabase Storage** | Secure cloud storage bucket (`edushare-resources`) for PDFs, EPUBs, PPTXs |
| **AI Engine** | **Google Gemini 2.5 Flash** | Real-time academic summaries, quiz generation, and grounded Q&A |
| **Testing** | **Vitest** | Automated unit and integration test suite (100% pass rate) |
| **Deployment** | **Vercel** | Global edge network with continuous integration |

---

## 3. Core Modules & Completed Features

- [x] **Module 1: Discovery Landing Page**: Search hero, impact counters, curriculum taxonomy explorer.
- [x] **Module 2: Authentication & Profile**: Role switcher (Student, Admin, Guest), department metadata.
- [x] **Module 3: Student Dashboard**: Real-time contribution metrics, upload history, bookmarks quick-access.
- [x] **Module 4: Multi-Dimensional Resource Library**: Instant filtering by department, semester, file format, and sort order.
- [x] **Module 5: Resource Upload Pipeline**: File size validation (25MB limit), fair-use licensing confirmation.
- [x] **Module 6: Resource Detail & Engagement**: Live PDF/DOC preview, atomic download counter, rating system, bookmarker.
- [x] **Module 7: Peer Study Material Requests**: Request creation, status tracking (Open, In Progress, Fulfilled).
- [x] **Module 8: Bookmarks & Personal Library**: One-click saving and local offline synchronization.
- [x] **Module 9: Admin Moderation Portal**: Batch approval/rejection workflows, copyright flag resolution, database diagnostic monitor.
- [x] **Module 10: Grounded AI Study Assistant**: Gemini 2.5 Flash with anti-jailbreak sanitization and citation enforcement.
- [x] **Module 11: Real-Time Search**: Debounced query processing across titles, descriptions, and tags.
- [x] **Module 12: Content Reporting**: Community abuse reporting system with reason logging and admin escalation.

---

## 4. Prototype Verification & Automated Test Results

The platform has been rigorously tested with automated unit and integration tests:

```text
✓ tests/validation.test.ts (4 tests)
✓ tests/permissions.test.ts (5 tests)
✓ tests/resource-filter.test.ts (3 tests)
✓ tests/ai-assistant.test.ts (4 tests)
✓ tests/supabase-integration.test.ts (4 tests)

Test Files  5 passed (5)
     Tests  20 passed (20)
  Duration  1.65s
```

Production build verification:
```text
✓ Compiled successfully in 8.4s
✓ 17/17 routes generated and statically optimized
✓ Exit code: 0
```

---

## 5. Live Prototype & Submission Links

- **GitHub Repository**: [https://github.com/siddheshgire/edushare](https://github.com/siddheshgire/edushare)
- **Live Deployment Platform**: Vercel (`https://edushare-<project-hash>.vercel.app`)
- **Database Engine**: Supabase Cloud (`https://fnymkseufbxzjdclsyww.supabase.co`)
- **AI Core**: Google Gemini 2.5 Flash Model
- **Status Note**: *Prototype is currently deployed and undergoing live user acceptance testing and load verification.*
