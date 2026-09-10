# AI Resume Analyzer — Frontend

React 18 + Vite + Tailwind CSS single-page app for the AI Resume Analyzer
& ATS Score Checker.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_BASE_URL if the backend isn't on http://localhost:5000
npm run dev
```

## Architecture

```
Pages -> Reusable Components -> Hooks/Context -> Service Layer -> apiClient -> Backend REST API
```

- `services/apiClient.js` — single fetch wrapper (auth header, JSON parsing, error normalization)
- `services/authService.js` / `services/resumeService.js` — the only places that know API shapes
- `services/mockResumeService.js` — optional drop-in mock with the same function signatures, for frontend-only development before the backend is ready
- `context/AuthContext.jsx` — current user + session
- `context/ToastContext.jsx` — global toast notifications
- `routes/ProtectedRoute.jsx` — guards `/dashboard`, `/upload`, `/analysis/:id`, `/history`, `/report/:id`

## Pages

`/`, `/login`, `/register`, `/dashboard`, `/upload`, `/analysis/:id`,
`/history`, `/report/:id`, and a catch-all 404 page.

## Notes

- Components never call the API directly — they call functions from `services/`.
- Never store `passwordHash` or any secret in frontend state or storage.
