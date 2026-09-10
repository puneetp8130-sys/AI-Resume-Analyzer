# Architecture

## Stack

```
Presentation   React.js + Tailwind CSS
Application    Node.js + Express.js
Processing     PDF Parser (pdf-parse) + Gemini API
Data           MongoDB (Mongoose)
```

## High-level flow

```
Browser (React)
   |  Authorization: Bearer <JWT>
   v
Express App
   |
   v
Auth Middleware -> Controller -> Service -> Model -> MongoDB
```

AI-specific pipeline:

```
Controller -> analysisService -> pdfService (extract/clean text)
                               -> aiService (prompt Gemini, validate/normalize JSON)
                               -> ResumeAnalysis model (persist)
```

## Frontend layers

```
Pages -> Reusable Components -> Hooks/Context -> Service Layer -> apiClient -> Backend REST API
```

- **Pages** (`src/pages`) own data fetching/orchestration for a route.
- **Components** (`src/components/*`) are presentational; report/resume
  components receive data through props only.
- **Context** (`AuthContext`, `ToastContext`) holds cross-cutting app state.
- **Services** (`src/services`) are the only modules that know API shapes.
  `apiClient.js` centralizes the base URL, auth header, and error
  normalization so services stay thin.

## Backend layers

```
routes/       -> only endpoint wiring
middleware/   -> auth (JWT), upload validation (multer), centralized error handling
controllers/  -> translate HTTP <-> service calls, stay thin
services/     -> business logic: authService, pdfService, aiService, analysisService
models/       -> Mongoose schemas (User, ResumeAnalysis)
validators/   -> input validation, kept out of controllers
utils/        -> AppError, apiResponse envelope, JWT helpers, text cleanup
```

## Security boundaries

- **Password storage**: bcrypt hash only; `passwordHash` has `select: false`
  and is never included in any API response.
- **JWT**: issued on register/login, verified by `authMiddleware.requireAuth`
  on every `/api/resume/*` route.
- **Ownership enforcement**: `GET/DELETE /api/resume/:id` query MongoDB with
  `{ _id: id, userId: req.user.userId }` — a report can never be fetched or
  deleted based on ID alone.
- **AI isolation**: `GEMINI_API_KEY` and all provider-specific logic live
  only in `services/aiService.js` on the backend. The frontend never talks
  to Gemini and never sees the key.
- **AI output validation**: `aiService.normalizeAiOutput` enforces the exact
  report shape and rejects/discards malformed responses before anything is
  saved to MongoDB.

## Resume analysis flow

```
User selects PDF (+ optional target role)
  -> POST /api/resume/upload   (validate PDF, extract + clean text)
  -> POST /api/resume/analyze  (send text to Gemini, validate/normalize JSON, save)
  -> GET  /api/resume/:id      (fetch the persisted, normalized report)
```

Upload and analyze are separate endpoints so a future change (e.g.
combining them, or adding OCR before extraction) only touches the service
layer and the frontend's `resumeService`/`AnalysisPage`, not the report UI.

## Extension points

The codebase intentionally isolates:

- **PDF parsing** in `pdfService` — OCR for scanned PDFs can be added here later.
- **AI provider** in `aiService` — swapping Gemini for another model only
  changes this file's internals; the return shape stays the same.
- **Future services** noted in `project.content.md` (`jobMatchingService`,
  `coverLetterService`, `reportExportService`) can be added alongside
  `analysisService` without touching existing routes or the frontend
  report contract.
