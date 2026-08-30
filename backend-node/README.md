# SynapseEDU — Learning Hub Backend (Round 2)

Node.js + Express + MySQL + JWT + Gemini API backend for the **SynapseEDU / StudentSOS 2.0** Learning Hub.

> Architecture: **Frontend → Node/Express REST API → MySQL → Gemini API**, with a demo/fallback mode so the full learning loop works even when MySQL or Gemini is unavailable.

## The learning loop this API powers
`Upload material → extract topics → learn → quiz → deterministic scoring → weak-topic detection → personalized revision → mastery improves`

AI (Gemini) is used only for **content** (topic extraction, grounded tutor answers, question generation, revision explanations). All **math** (scores, percentages, mastery, weak-topic detection) is **deterministic backend logic** — never AI.

## Quick start (demo mode — no MySQL / Gemini needed)
```bash
cp .env.example .env        # AI_MODE=demo by default
npm install
npm start                   # → http://localhost:5000  (in-memory seeded data)
```

## Live mode (MySQL + Gemini)
1. Create a MySQL database (local, PlanetScale, or AWS RDS).
2. In `.env` set `AI_MODE=live`, fill `DB_*`, `JWT_SECRET`, and `GEMINI_API_KEY` (https://aistudio.google.com/app/apikey).
3. `npm run seed` (creates schema + seeds the Computer Networks template), then `npm start`.

The schema is in `src/db/schema.sql` (users, subjects, study_materials, topics, subtopics, questions, quiz_attempts, answers, topic_performance, revision_plans).

## API
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register (bcrypt) → JWT |
| POST | `/api/auth/login` | Login → JWT |
| GET  | `/api/auth/me` | Current user (protected) |
| POST | `/api/materials/upload` | Upload PDF → extract text → topics |
| GET  | `/api/materials` | List materials |
| GET  | `/api/topics` | Topics with per-user mastery |
| GET  | `/api/topics/:id` | Single topic |
| POST | `/api/tutor/ask` | RAG-grounded tutor answer |
| POST | `/api/quizzes/generate` | Generate quiz (adaptive difficulty) |
| POST | `/api/quizzes/submit` | Deterministic scoring + mastery update |
| GET  | `/api/performance` | Overview + quiz history |
| GET  | `/api/performance/dashboard` | Dashboard aggregation |
| GET  | `/api/performance/topics` | Topic mastery list |
| GET  | `/api/revision` | Personalized revision plan |
| GET  | `/api/health` | Health check |

All endpoints except `auth` and `health` require `Authorization: Bearer <token>`.

Demo credentials: **demo@synapse.edu / demo1234**

## Project structure
```
backend-node/
├── server.js
├── .env.example
└── src/
    ├── config/      env.js, db.js (MySQL pool + auto-fallback)
    ├── db/          schema.sql, seed.js
    ├── data/        store.js (MySQL or in-memory), demoData.js
    ├── middleware/  auth.js (JWT), error.js
    ├── routes/      auth, materials, topics, tutor, quizzes, performance, revision
    ├── controllers/ one per resource
    ├── services/    gemini.service.js, pdf.service.js, rag.service.js (pluggable RAG)
    └── logic/       mastery.js, weakTopic.js, adaptiveQuiz.js, revision.js  (deterministic)
```

## Deployment
- **Backend → Render:** set env vars (`AI_MODE=live`, `DB_*`, `JWT_SECRET`, `GEMINI_API_KEY`, `CORS_ORIGIN=<your Netlify URL>`), build `npm install`, start `npm start`.
- **DB → PlanetScale / AWS RDS** (MySQL-compatible).
- **Frontend → Netlify:** set `CONFIG.API_BASE_URL` (in `frontend/js/config.js`) to your Render URL.

## Security
bcrypt password hashing · JWT auth · protected routes · input validation · file type/size validation · CORS config · rate limiting · secrets via env vars · Gemini key never exposed to the browser (all AI calls go through this backend).

## RAG
`src/services/rag.service.js` chunks material and retrieves top-k relevant chunks (keyword/BM25-lite) to ground the tutor. The interface is designed so retrieval can be upgraded to embeddings + a vector DB (FAISS / pgvector) without changing callers.
