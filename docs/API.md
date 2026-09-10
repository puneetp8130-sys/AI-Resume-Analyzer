# API Reference

Base URL: `http://localhost:5000` (configurable via `CLIENT_URL` / `VITE_API_BASE_URL`)

All responses use a consistent envelope.

**Success**
```json
{ "success": true, "data": {}, "message": "Success" }
```

**Error**
```json
{ "success": false, "message": "Human-readable message", "code": "ERROR_CODE" }
```

All `/api/resume/*` routes require:
```
Authorization: Bearer <JWT>
```

---

## Auth

### `POST /api/auth/register`
Create a new user account.

Request body:
```json
{ "name": "Jordan Lee", "email": "jordan@example.com", "password": "at least 8 chars" }
```

Response `201`:
```json
{
  "success": true,
  "data": {
    "user": { "id": "…", "name": "Jordan Lee", "email": "jordan@example.com", "createdAt": "…" },
    "token": "<jwt>"
  },
  "message": "Account created successfully."
}
```

Errors: `VALIDATION_ERROR` (400), `EMAIL_IN_USE` (409)

### `POST /api/auth/login`
Request body:
```json
{ "email": "jordan@example.com", "password": "…" }
```
Response: same shape as register. Errors: `VALIDATION_ERROR` (400), `INVALID_CREDENTIALS` (401)

### `GET /api/auth/me`
Requires auth. Returns the current user (no `passwordHash`).

---

## Resume & Reports

### `POST /api/resume/upload`
`multipart/form-data`, field name `resume` (PDF only, max 5MB by default).

Response `200`:
```json
{
  "success": true,
  "data": { "fileName": "resume.pdf", "extractedText": "…cleaned resume text…" },
  "message": "Resume uploaded and processed successfully."
}
```

Errors: `INVALID_FILE_TYPE`, `EMPTY_FILE`, `FILE_TOO_LARGE`, `PDF_NOT_READABLE`, `PDF_EXTRACTION_FAILED`, `NO_FILE_PROVIDED` (all 400/422)

### `POST /api/resume/analyze`
Request body:
```json
{ "fileName": "resume.pdf", "targetRole": "Frontend Engineer", "extractedText": "…" }
```

Runs the resume text through the AI service, validates/normalizes the
output, and persists it. Response `201`:
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "…",
      "fileName": "resume.pdf",
      "targetRole": "Frontend Engineer",
      "atsScore": 82,
      "summary": "…",
      "strengths": ["…"],
      "weaknesses": ["…"],
      "skills": ["…"],
      "missingSkills": ["…"],
      "keywords": ["…"],
      "sectionFeedback": [{ "section": "Experience", "feedback": "…" }],
      "suggestions": ["…"],
      "createdAt": "…"
    }
  },
  "message": "Resume analyzed successfully."
}
```

Errors: `VALIDATION_ERROR` (400), `PDF_NOT_READABLE` (400), `AI_NOT_CONFIGURED` / `AI_UNAVAILABLE` (503), `AI_MALFORMED_RESPONSE` (502) — malformed AI output is never persisted.

### `GET /api/resume/history`
Returns all of the authenticated user's reports, newest first.
```json
{ "success": true, "data": { "reports": [ /* report objects */ ] } }
```

### `GET /api/resume/:id`
Returns one report **only if it belongs to the authenticated user**.
Errors: `REPORT_NOT_FOUND` (404) — returned both when the ID doesn't exist
and when it belongs to another user, so ownership can't be probed.

### `DELETE /api/resume/:id`
Deletes one report, with the same ownership check as `GET`.
```json
{ "success": true, "data": {}, "message": "Report deleted successfully." }
```

---

## Error codes reference

| Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | Request body failed validation |
| `EMAIL_IN_USE` | Email already registered |
| `INVALID_CREDENTIALS` | Wrong email/password |
| `UNAUTHORIZED` | Missing bearer token |
| `INVALID_TOKEN` | Expired/invalid JWT |
| `INVALID_FILE_TYPE` | Non-PDF upload |
| `EMPTY_FILE` | Zero-byte upload |
| `FILE_TOO_LARGE` | Exceeds max upload size |
| `PDF_NOT_READABLE` | No extractable text in PDF |
| `PDF_EXTRACTION_FAILED` | PDF parsing threw an error |
| `AI_NOT_CONFIGURED` | `GEMINI_API_KEY` missing |
| `AI_UNAVAILABLE` | Gemini request failed/timed out |
| `AI_MALFORMED_RESPONSE` | Gemini returned invalid/incomplete JSON |
| `REPORT_NOT_FOUND` | Report missing or not owned by the user |
| `INTERNAL_ERROR` | Unexpected server error |
