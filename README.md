# AI Resume Analyzer & ATS Score Checker

A full-stack web app that gives job seekers an instant, AI-generated
ATS-oriented review of their resume: a 0–100 score, detected vs. missing
skills, relevant keywords, strengths/weaknesses, section-by-section
feedback, and concrete suggestions.

> The ATS score is an evaluation aid and is **not** a guarantee of job selection.

## Features

- Email/password registration and login with JWT authentication
- Drag-and-drop PDF resume upload with client- and server-side validation
- Optional target job role input to focus the AI analysis
- AI-powered analysis (Google Gemini) covering:
  - ATS score, summary, strengths, weaknesses
  - detected skills, missing/recommended skills, keywords
  - section-by-section feedback and improvement suggestions
- Report history with open/delete, protected by per-user ownership checks
- Responsive UI with loading, empty, error, and retry states throughout

## Architecture

```
Presentation   React.js + Tailwind CSS
Application    Node.js + Express.js
Processing     PDF Parser (pdf-parse) + Gemini API
Data           MongoDB (Mongoose)
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full breakdown
and [`docs/API.md`](docs/API.md) for the REST API contract.

## Folder structure

```
ai-resume-analyzer/
├── frontend/          React + Vite + Tailwind SPA
│   └── src/
│       ├── components/{common,layout,auth,resume,report}/
│       ├── pages/, routes/, context/, hooks/, services/, utils/, constants/
├── backend/           Node.js + Express API
│   └── src/
│       ├── config/, controllers/, middleware/, models/, routes/, services/, validators/, utils/
├── docs/              API.md, ARCHITECTURE.md
├── TASK.md            Original implementation task brief
├── project.content.md Original project specification (SRS-derived)
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Google Gemini API key](https://ai.google.dev/)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=<your Gemini API key>
GEMINI_MODEL=gemini-1.5-flash
CLIENT_URL=http://localhost:5173
MAX_UPLOAD_SIZE_MB=5
```

Run it:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

The API starts on `http://localhost:5000`. `GET /api/health` returns `{ "status": "ok" }`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Run it:

```bash
npm run dev
```

The app starts on `http://localhost:5173`.

### 3. MongoDB setup

- Local: install MongoDB Community Server and use `mongodb://localhost:27017/ai-resume-analyzer`.
- Cloud: create a free cluster on MongoDB Atlas, add a database user, allow
  your IP, and copy the connection string into `MONGODB_URI`.

### 4. Gemini setup

- Create an API key at [ai.google.dev](https://ai.google.dev/).
- Set it as `GEMINI_API_KEY` in `backend/.env`. It is **only** read on the
  backend (`services/aiService.js`) and is never sent to the frontend.

## API overview

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Log in, get JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| POST | `/api/resume/upload` | ✓ | Upload + validate PDF, extract text |
| POST | `/api/resume/analyze` | ✓ | Run AI analysis, persist report |
| GET | `/api/resume/history` | ✓ | List current user's reports |
| GET | `/api/resume/:id` | ✓ | Get one report (owner only) |
| DELETE | `/api/resume/:id` | ✓ | Delete one report (owner only) |

Full details, request/response shapes, and error codes: [`docs/API.md`](docs/API.md).

## Testing

The following scenarios are covered by the implementation's validation and
ownership logic (see `docs/API.md` for the exact error codes each maps to):

```
T01  Register with valid details
T02  Register with existing email            -> EMAIL_IN_USE
T03  Login with valid credentials
T04  Login with invalid password             -> INVALID_CREDENTIALS
T05  Upload valid PDF
T06  Upload non-PDF                          -> INVALID_FILE_TYPE
T07  Upload unreadable/empty PDF             -> PDF_NOT_READABLE / EMPTY_FILE
T08  Analyze valid resume
T09  Open history
T10  Access protected API without token      -> UNAUTHORIZED
T11  AI service unavailable                  -> AI_UNAVAILABLE / AI_NOT_CONFIGURED
T12  Delete own analysis
```

Also verified by design:

- User A cannot access or delete User B's report (`REPORT_NOT_FOUND` either way).
- Malformed/incomplete AI JSON is never persisted (`AI_MALFORMED_RESPONSE`).
- Missing optional AI fields default to empty arrays/strings and never crash the UI.
- Refreshing a protected route re-validates the session via `GET /api/auth/me`.
- An empty history renders a friendly empty state, not an error.

No automated test runner is wired up yet (`backend/package.json`'s `test`
script is a placeholder) — see **Future scope**.

## Environment configuration

Never commit `.env` files. `frontend/.env.example` and `backend/.env.example`
document every variable required to run the app; copy them to `.env` and
fill in real values locally or in your deployment platform's secret store.

## Future scope

- OCR support for scanned/image-only PDF resumes
- Job description matching (`jobMatchingService`)
- Cover letter generation (`coverLetterService`)
- Downloadable/exportable reports (`reportExportService`)
- Multiple resume versions per user
- Administrator functionality
- Automated test suite (unit + integration)
