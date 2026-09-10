# AI Resume Analyzer — Backend

Node.js + Express + MongoDB API that powers PDF resume upload, AI-driven
ATS analysis (via Gemini), authentication, and report history.

## Architecture

```
Route -> Middleware -> Controller -> Service -> Model -> MongoDB
```

AI pipeline:

```
Controller -> analysisService -> pdfService / aiService -> Gemini
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

The API listens on `PORT` (default `5000`).

## Environment variables

See `.env.example`. Required for full functionality:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign auth tokens
- `GEMINI_API_KEY` — Gemini API key (server-side only, never sent to the frontend)

## Folder structure

```
src/
  config/       environment + database setup
  routes/       endpoint routing only
  controllers/  thin HTTP <-> service glue
  services/     business logic (auth, pdf, ai, analysis)
  models/       Mongoose schemas
  middleware/   auth, upload, error handling
  validators/   request input validation
  utils/        JWT helpers, response envelope, error class
```

## API summary

See `../docs/API.md` for the full contract.

## Security notes

- Passwords are hashed with bcrypt; `passwordHash` is never returned to clients.
- All `/api/resume/*` routes require a valid `Authorization: Bearer <JWT>` header.
- `GET/DELETE /api/resume/:id` verify both the analysis ID **and** the
  authenticated user's ID before returning or deleting data.
- Gemini is only ever called from `services/aiService.js`.
