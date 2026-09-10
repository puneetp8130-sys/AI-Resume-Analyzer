# AI Resume Analyzer & ATS Score Checker --- TASK.md

## 1. Project Goal

Build a production-style, modular full-stack web application named **AI
Resume Analyzer & ATS Score Checker**.

The application must allow an authenticated student/job seeker to:

1.  Register and log in.
2.  Upload a readable PDF resume.
3.  Optionally provide a target job role.
4.  Analyze the resume through a backend AI service.
5.  Receive an ATS-oriented score.
6.  See detected skills, missing/recommended skills, relevant keywords,
    strengths, weaknesses, section feedback, and improvement
    suggestions.
7.  View previous analysis reports.
8.  Open a specific report.
9.  Delete their own analysis.

The architecture must keep the frontend independent from AI/database
implementation details so backend integration can be completed without
rewriting the UI.

> Source basis: the supplied SRS defines React.js + Tailwind CSS for
> presentation, Node.js + Express.js for application APIs, PDF parsing +
> Gemini API for processing, and MongoDB for persistence. It also
> defines the authentication, upload, analysis, history, report, and
> delete API requirements.

------------------------------------------------------------------------

# 2. Source Requirements to Preserve

The implementation must satisfy the supplied SRS:

-   PDF-only initial resume input.
-   Authentication with secure credentials.
-   Passwords hashed on the backend.
-   JWT-protected user features.
-   PDF type/size validation.
-   Text extraction from readable PDFs.
-   AI-assisted analysis.
-   ATS-oriented score.
-   Skills and missing/recommended skills.
-   Relevant keywords/content gaps.
-   Strengths and weaknesses.
-   Personalized suggestions.
-   Analysis history.
-   User-level privacy: a user must not access another user's report.
-   AI credentials must remain on the backend.
-   Modular frontend/backend/AI architecture.
-   Responsive and understandable UI.
-   Graceful invalid-file, AI, API, and database error handling.

------------------------------------------------------------------------

# 3. Development Rules

## Rule 1 --- Frontend must not contain business secrets

Never put:

-   Gemini API key
-   MongoDB URI
-   JWT signing secret
-   backend private credentials

inside React/Vite client code.

Frontend only communicates with the backend API.

## Rule 2 --- Use an API abstraction layer

Do NOT scatter `fetch()`/Axios calls across components.

Create:

``` text
src/services/
  apiClient.js
  authService.js
  resumeService.js
```

Components call service functions such as:

``` js
authService.login(data)
resumeService.upload(file, targetRole)
resumeService.analyze(analysisId)
resumeService.getHistory()
resumeService.getById(id)
resumeService.delete(id)
```

This makes future backend integration easy.

## Rule 3 --- Use typed/normalized API models

Even if JavaScript is used, keep one consistent frontend data shape.

The report model should support:

``` js
{
  id,
  fileName,
  targetRole,
  atsScore,
  summary,
  strengths,
  weaknesses,
  skills,
  missingSkills,
  keywords,
  sectionFeedback,
  suggestions,
  createdAt
}
```

If the backend changes field names, normalize them in the service layer
rather than changing every UI component.

## Rule 4 --- Never assume AI text is safe JSON

The backend must validate and normalize AI output before returning it to
the frontend.

Frontend should still have safe fallbacks for missing optional
arrays/fields.

## Rule 5 --- Loading/error/empty states are required

Every API-driven page must support:

-   loading
-   success
-   empty
-   error
-   retry

------------------------------------------------------------------------

# 4. Recommended Project Structure

``` text
ai-resume-analyzer/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── auth/
│   │   │   ├── resume/
│   │   │   └── report/
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UploadResumePage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useResumeAnalysis.js
│   │   │
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   ├── authService.js
│   │   │   └── resumeService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── storage.js
│   │   │
│   │   ├── constants/
│   │   │   ├── api.js
│   │   │   └── app.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── resumeController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── ResumeAnalysis.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── resumeRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── pdfService.js
│   │   │   ├── aiService.js
│   │   │   ├── analysisService.js
│   │   │   └── authService.js
│   │   │
│   │   ├── validators/
│   │   │   ├── authValidators.js
│   │   │   └── resumeValidators.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── apiResponse.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
│
├── TASK.md
├── project.content.md
└── README.md
```

------------------------------------------------------------------------

# 5. Frontend Tasks

## 5.1 Application Shell

Create:

-   responsive navbar/sidebar
-   authenticated dashboard layout
-   public landing layout
-   mobile navigation
-   page container
-   consistent cards/buttons/inputs
-   toast/alert system
-   loading skeletons
-   empty states
-   error states

Use reusable components instead of duplicating markup.

## 5.2 Landing Page

Sections:

-   hero
-   product value proposition
-   how it works
-   key analysis features
-   ATS score explanation
-   CTA to register/login
-   footer

Do not claim that the score guarantees selection.

## 5.3 Register Page

Fields:

-   name
-   email
-   password
-   confirm password

Requirements:

-   client-side validation
-   loading state
-   backend error display
-   successful registration flow

## 5.4 Login Page

Fields:

-   email
-   password

Requirements:

-   validation
-   loading state
-   authentication error
-   successful redirect to dashboard

## 5.5 Dashboard

Show:

-   welcome/header
-   upload/analyze CTA
-   recent analyses
-   total analysis count if available
-   latest ATS score if available
-   empty state for first-time users

Do not calculate fake analytics if backend does not provide the data.

## 5.6 Upload Resume Page

UI:

-   drag-and-drop PDF area
-   file picker
-   selected filename
-   file size
-   remove file
-   optional target job role
-   validation messages
-   Analyze button
-   upload/analysis progress state

Initial product requirement is PDF resumes.

Frontend validation should check:

-   extension/type
-   non-empty file
-   reasonable configured file-size limit

The exact authoritative file-size limit should come from the backend
configuration/API contract.

## 5.7 Analysis Progress

Create a clear processing screen.

Possible stages:

``` text
Uploading resume
      ↓
Extracting text
      ↓
Analyzing resume
      ↓
Generating recommendations
      ↓
Preparing report
```

These stages are UI states only unless the backend exposes real progress
events.

Do not fake real-time progress percentages.

## 5.8 Report Page

Main report layout:

### Header

-   filename
-   target role
-   analysis date
-   delete action

### ATS Score

Large score visualization:

``` text
ATS Score
  82 / 100
```

Use a reusable `ScoreCard` component.

### Summary

Readable AI-generated overview.

### Strengths

List of positive findings.

### Weaknesses

List of improvement areas.

### Skills

Detected skills as chips/tags.

### Missing / Recommended Skills

Clearly separated from detected skills.

### Keywords

Relevant keywords.

### Section Feedback

Use reusable cards for sections such as:

-   contact information
-   summary
-   skills
-   experience
-   projects
-   education

Only render sections actually returned by the backend.

### Suggestions

Prioritized improvement recommendations.

## 5.9 History Page

Show:

-   analysis date
-   filename
-   target role
-   ATS score
-   open report
-   delete

Include:

-   loading state
-   empty state
-   error state
-   retry

History must only contain the authenticated user's records.

## 5.10 404 / Error Page

Create a professional fallback page with navigation back to
dashboard/home.

------------------------------------------------------------------------

# 6. Frontend API Contract

Centralize these endpoints:

``` text
POST   /api/auth/register
POST   /api/auth/login

POST   /api/resume/upload
POST   /api/resume/analyze

GET    /api/resume/history
GET    /api/resume/:id
DELETE /api/resume/:id
```

Recommended frontend service API:

``` js
authService.register(payload)
authService.login(payload)

resumeService.upload(file, targetRole)
resumeService.analyze(id)

resumeService.getHistory()
resumeService.getById(id)
resumeService.delete(id)
```

Do not directly couple UI components to endpoint URLs.

------------------------------------------------------------------------

# 7. Backend Tasks

## 7.1 Server Setup

Create:

-   Express app
-   JSON parsing
-   CORS configuration
-   environment configuration
-   MongoDB connection
-   centralized error handling
-   route registration
-   health endpoint if useful for development

## 7.2 Authentication

Implement:

``` text
POST /api/auth/register
POST /api/auth/login
```

Register:

-   validate input
-   check duplicate email
-   hash password
-   create user

Login:

-   validate credentials
-   verify password
-   issue JWT

Protected endpoints must require valid JWT authentication.

## 7.3 Resume Upload

Implement:

``` text
POST /api/resume/upload
```

Responsibilities:

-   authenticate user
-   validate PDF
-   validate file size
-   safely process/store upload
-   return an analysis/upload identifier or metadata needed for the next
    step

Do not expose private filesystem details unnecessarily.

## 7.4 PDF Processing

Create `pdfService`.

Responsibilities:

-   read PDF
-   extract selectable text
-   reject empty/unreadable content
-   normalize whitespace
-   return cleaned text to analysis service

Scanned/image-only PDF OCR is outside the initial scope and may be a
future enhancement.

## 7.5 AI Service

Create `aiService`.

Responsibilities:

-   receive cleaned resume text and optional target role
-   build structured analysis prompt
-   call Gemini
-   request structured JSON
-   parse response
-   validate schema
-   normalize missing values
-   never expose API credentials to frontend

Suggested output:

``` json
{
  "atsScore": 82,
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "skills": ["string"],
  "missingSkills": ["string"],
  "keywords": ["string"],
  "sectionFeedback": [
    {
      "section": "string",
      "feedback": "string"
    }
  ],
  "suggestions": ["string"]
}
```

## 7.6 Analysis Service

Create `analysisService`.

Flow:

``` text
Authenticated request
      ↓
Find uploaded resume / receive file
      ↓
Extract PDF text
      ↓
Clean text
      ↓
AI service
      ↓
Validate AI JSON
      ↓
Create ResumeAnalysis
      ↓
Return normalized report
```

Keep this orchestration separate from the controller.

## 7.7 Analysis History

Implement:

``` text
GET /api/resume/history
GET /api/resume/:id
DELETE /api/resume/:id
```

Every query must be scoped to the authenticated user.

Conceptually:

``` js
ResumeAnalysis.findOne({
  _id: id,
  userId: req.user.id
})
```

Never fetch by `_id` alone for a protected user report.

------------------------------------------------------------------------

# 8. Database Tasks

## User

``` text
_id
name
email
passwordHash
createdAt
```

## ResumeAnalysis

``` text
_id
userId
fileName
targetRole
atsScore
summary
strengths
weaknesses
skills
missingSkills
keywords
sectionFeedback
suggestions
createdAt
```

The supplied SRS explicitly defines the core User and ResumeAnalysis
collections and their fields.

------------------------------------------------------------------------

# 9. API Response Convention --- Recommended

To simplify frontend integration, use a consistent shape.

Success:

``` json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error:

``` json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

For lists:

``` json
{
  "success": true,
  "data": {
    "items": [],
    "count": 0
  }
}
```

This is an implementation recommendation for consistency; the supplied
SRS lists endpoints but does not prescribe this exact envelope.

------------------------------------------------------------------------

# 10. Environment Variables

## Frontend

``` env
VITE_API_BASE_URL=http://localhost:5000
```

Only public client configuration belongs here.

## Backend

``` env
PORT=5000
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
```

Never commit real secrets.

Create `.env.example` files.

------------------------------------------------------------------------

# 11. Error Codes --- Recommended

Use stable codes so frontend behavior does not depend on error-message
text.

``` text
AUTH_INVALID_CREDENTIALS
AUTH_EMAIL_EXISTS
AUTH_UNAUTHORIZED

RESUME_INVALID_TYPE
RESUME_TOO_LARGE
RESUME_EMPTY
RESUME_NOT_FOUND

ANALYSIS_FAILED
AI_SERVICE_UNAVAILABLE
AI_INVALID_RESPONSE

VALIDATION_ERROR
INTERNAL_SERVER_ERROR
```

------------------------------------------------------------------------

# 12. Security Requirements

Must implement:

-   hashed passwords
-   JWT authentication
-   protected routes
-   user ownership checks
-   PDF validation
-   file-size validation
-   environment-based secrets
-   backend-only Gemini credentials
-   centralized error handling
-   no password in API responses
-   no cross-user report access

Do not log passwords, tokens, API keys, or sensitive resume contents
unnecessarily.

------------------------------------------------------------------------

# 13. UI/UX Requirements

The interface should be:

-   modern
-   clean
-   professional
-   responsive
-   accessible
-   understandable to students/job seekers

Use a consistent design system:

``` text
Primary action
Secondary action
Danger action
Success state
Warning state
Error state
Neutral state
```

Reusable components should include:

``` text
Button
Input
PasswordInput
Card
Modal
Toast
Spinner
Skeleton
Badge
ScoreCard
FileDropzone
ReportSection
EmptyState
ErrorState
ConfirmDialog
```

------------------------------------------------------------------------

# 14. State Management

Keep global state small.

Global:

-   authenticated user
-   auth/loading state

Page/local:

-   selected resume
-   upload progress state
-   report data
-   history data
-   loading/error states

Do not introduce a large state-management library unless complexity
actually requires it.

------------------------------------------------------------------------

# 15. Routing

Recommended:

``` text
/
 /login
 /register

 /dashboard
 /upload
 /analysis/:id
 /history
 /report/:id
```

Protected:

``` text
/dashboard
/upload
/analysis/:id
/history
/report/:id
```

Public:

``` text
/
/login
/register
```

------------------------------------------------------------------------

# 16. Testing Tasks

Implement/test at least the SRS scenarios:

``` text
T01 Register with valid details
T02 Register with existing email
T03 Login with valid credentials
T04 Login with invalid password
T05 Upload valid PDF
T06 Upload non-PDF
T07 Upload unreadable/empty PDF
T08 Analyze valid resume
T09 Open history
T10 Protected API without token
T11 AI service unavailable
T12 Delete own analysis
```

Also verify:

``` text
A user cannot access another user's report.
A user cannot delete another user's analysis.
Real API failures do not crash the UI.
Refreshing protected pages behaves correctly.
Empty history is handled gracefully.
AI responses with missing optional fields do not crash the report page.
```

------------------------------------------------------------------------

# 17. Definition of Done

The project is considered complete when:

-   frontend builds successfully
-   backend starts successfully
-   MongoDB connects
-   registration works
-   login works
-   JWT-protected routes work
-   PDF upload works
-   PDF extraction works
-   Gemini integration works through backend
-   structured AI response is validated
-   analysis is stored in MongoDB
-   report renders correctly
-   history renders correctly
-   delete works with ownership checks
-   invalid files are rejected
-   AI failure has a user-friendly error
-   responsive layout works on mobile and desktop
-   no secrets are committed
-   `.env.example` exists
-   README contains setup instructions

------------------------------------------------------------------------

# 18. Implementation Order

Follow this order:

### Phase 1

Project setup + frontend design system + routing.

### Phase 2

Login/register UI + backend authentication.

### Phase 3

Dashboard + upload UI + backend upload validation.

### Phase 4

PDF text extraction.

### Phase 5

MongoDB analysis model and history.

### Phase 6

Gemini service + structured AI output validation.

### Phase 7

Report UI + ATS score + skills + feedback + suggestions.

### Phase 8

History + report deletion.

### Phase 9

Error handling + security + responsive polish.

### Phase 10

Testing + README + final demo.

------------------------------------------------------------------------

# 19. Critical Instruction for Another AI Developer

Build the application **incrementally**.

Do not generate a fake frontend that assumes nonexistent APIs.

First establish:

``` text
UI
 ↓
service layer
 ↓
API contract
 ↓
backend controllers
 ↓
backend services
 ↓
database / AI
```

The frontend must remain functional with mock data during UI
development, but all mock data must be isolated behind the service/API
layer and easy to remove.

Do not put mock logic directly inside report components.

The final implementation must follow the supplied SRS and must keep the
architecture ready for future:

-   job-description matching
-   multiple resume versions
-   cover-letter generation
-   downloadable reports
-   additional document formats

These future features are mentioned in the SRS as extensions and should
not be hard-coded into the initial MVP.

------------------------------------------------------------------------

# 20. Final Quality Gate

Before declaring completion, verify:

``` text
[ ] No duplicated API logic
[ ] No secrets in frontend
[ ] No direct MongoDB access from frontend
[ ] No Gemini access from frontend
[ ] Protected APIs enforce ownership
[ ] AI output is schema-validated
[ ] All API states have loading/error/empty handling
[ ] PDF validation exists on backend
[ ] Passwords are hashed
[ ] JWT protection exists
[ ] Report data is normalized
[ ] Future API changes can be handled in services
[ ] Mobile UI is usable
[ ] README setup is complete
[ ] SRS requirements FR-01 to FR-12 are covered
[ ] SRS test cases T01 to T12 are covered
```
