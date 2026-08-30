# SynapseEDU — Learning Hub (StudentSOS 2.0, Round 2) — PRD

## Original problem statement
Build the Round 2 working prototype of SynapseEDU / StudentSOS 2.0 — an AI-Powered Personalized Learning System, scoped to ONE module: the **Learning Hub**. Core loop: Upload material → understand → learn → assess → analyze → identify weakness → recommend revision → improve mastery. Demo subject: **Computer Networks**. Differentiator: the system tells students exactly what to study next based on measured weakness. Other hubs (Projects/Career/Opportunities/Community) are future scope ("Coming Soon").

## Key user decision (hybrid delivery)
The Emergent environment can only host FastAPI+MongoDB+React. The user required the literal Node/Express/MySQL stack. Resolution (user chose HYBRID):
1. **Previewable frontend** — static HTML5 + CSS3 + JavaScript + Bootstrap 5 + GSAP, served on port 3000, running fully client-side in DEMO MODE (localStorage). Live and testable in Emergent.
2. **Downloadable backend** — complete, runnable **Node.js + Express + MySQL + JWT + Gemini** project at `/app/backend-node/` (self-host / Render). NOT run in the preview. No FastAPI/MongoDB anywhere.

## Architecture
- Frontend (`/app/frontend/public/`): multi-page (login, dashboard, upload, topics, topic, tutor, quiz, results, revision, progress). Modular JS: `config` (API_BASE_URL toggles demo/live), `demo-data`, `state` (localStorage), `mastery` (deterministic), `ui`, `api` (demo/backend abstraction with fallbacks), `layout` (shell+JWT guard), one script per page. Served via `serve` (package.json start script; `serve.json` config).
- Backend (`/app/backend-node/`): Express REST API (`/api/auth|materials|topics|tutor|quizzes|performance|revision`), MySQL schema (10 tables), JWT+bcrypt, Gemini service, PDF extraction, pluggable RAG (keyword→upgradable to embeddings), deterministic logic (mastery/weakTopic/adaptiveQuiz/revision), demo/in-memory fallback when DB/Gemini unavailable. AI generates content only; all scoring/mastery is deterministic.

## What's implemented (2026-06)
- ✅ Login (premium split-screen, one-click demo login, JWT-ready)
- ✅ Learning Dashboard (overall mastery, topics, completed, weakest area, AI recommended next with "why", learning-profile bars, recent activity)
- ✅ Upload + simulated AI processing sequence + analysis summary
- ✅ Topic Explorer (8 CN topics, mastery bars, weakest flagged)
- ✅ Topic Learning (summary, key concepts, definitions, examples, related, radial progress)
- ✅ AI Tutor (grounded-in-material responses + source badges, suggested questions, typing indicator)
- ✅ Quiz (5 MCQs, easy/medium/hard chips, progress, adaptive difficulty logic)
- ✅ Quiz Results (score radial, concept + difficulty performance, weak concept, recommended next)
- ✅ Weak Topic Analysis + Progress Dashboard (mastery-over-time SVG chart, profile bars, quiz history)
- ✅ Personalized Revision Plan (ranked, timed, focus subtopics, "Why am I seeing this?")
- ✅ Deterministic mastery scoring + measurable improvement (AIMD 36%→~54-60% after quiz) — verified by testing agent (100%) and Node harness + curl on the backend.
- ✅ Demo/fallback reliability (works with no backend/Gemini); GSAP made non-gating.
- ✅ Node/Express/MySQL backend runs (demo mode verified via curl: auth, dashboard, topics, quiz generate/submit, tutor, revision, register).
- ✅ Email/Password auth (register + login + validation + errors): client-side SHA-256 salted store in preview; Node backend uses bcrypt+JWT. Verified 9/9.
- ✅ LIVE Gemini in preview via Emergent backend proxy (`/api/ai/tutor|quiz|extract|status`, Emergent Universal key, model `gemini-3-flash-preview`, selectable 3.1-pro/3.5-flash). Grounded AI Tutor (with source + Gemini badges), AI quiz generation, and topic extraction on upload — all with demo fallback + 35s timeout guard. Verified 6/6 frontend, 4/4 backend. Node backend keeps its own `@google/generative-ai` integration for self-host.

## Fixes (2026-06-30)
- ✅ Resolved oxlint blocker: `.oxlintrc.json` has `env.browser` — now 0 errors (19 non-blocking warnings).
- ✅ Fixed root-URL directory listing: `serve` was showing an "Index of public" file listing at `/` instead of loading the app. Root cause: serve-handler only resolves `index.html` for a directory when `cleanUrls` is true or a rewrite exists (rewrites break due to pinned `path-to-regexp@0.1.13`). Set `cleanUrls: true` + `directoryListing: false` in `/app/frontend/public/serve.json`. Root now serves `index.html`; `.html` URLs 301 to clean paths and serve correctly. Verified all pages 200 + demo login → dashboard.

## User personas
- College student revising a subject from their own material; wants to know precisely what to study next and see measurable progress.

## Core requirements (static)
Learning Hub only · Computer Networks demo · visible learning loop · deterministic math + AI content · grounded tutor · premium SynapseEDU identity · demo reliability · portable to Node/MySQL.

## Backlog / future scope (P1/P2)
- P1: Wire preview frontend to the live Node backend (set `CONFIG.API_BASE_URL`); live Gemini topic extraction on real PDFs; embeddings-based RAG (FAISS/pgvector).
- P2: Multiple subjects/courses; prerequisite knowledge graph; spaced repetition; flashcards; the other hubs (Projects/Career/Opportunities/Community).

## Credentials
Frontend: click "Quick demo login" (or demo@synapse.edu / demo1234). Backend demo: same. See `/app/memory/test_credentials.md`.
