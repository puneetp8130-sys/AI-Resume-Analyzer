# AI Resume Analyzer & ATS Score Checker --- Project Content

## 1. Project Identity

**Project Name:** AI Resume Analyzer & ATS Score Checker\
**Project Type:** Full-stack web application\
**Domain:** Artificial Intelligence (AI) & Web Development\
**Academic Context:** Mini Project Lab (BCS554)\
**Frontend:** React.js + Tailwind CSS\
**Backend:** Node.js + Express.js\
**Database:** MongoDB\
**AI Processing:** Gemini API\
**Document Processing:** PDF text extraction

This document is the implementation context that should be given to
another AI coding agent before it starts building the project.

------------------------------------------------------------------------

# 2. Problem Statement

Manual resume checking is time-consuming and subjective. Students and
fresh job seekers may have relevant skills but fail to present them
clearly or use job-relevant keywords.

The application automates a first-level resume review and gives an
ATS-oriented evaluation, skill/keyword gaps, strengths, weaknesses, and
actionable improvement recommendations.

The ATS score is an evaluation aid and is not a guarantee of job
selection.

------------------------------------------------------------------------

# 3. Product Vision

Create a professional web application where a user can go from:

``` text
Landing Page
    ↓
Register / Login
    ↓
Dashboard
    ↓
Upload PDF Resume
    ↓
Optional Target Job Role
    ↓
Analyze
    ↓
AI Processing
    ↓
ATS Report
    ↓
History
```

The application should feel like a real product rather than a
college-project-only UI.

------------------------------------------------------------------------

# 4. Target Users

## Student / Job Seeker

Can:

-   create an account
-   log in
-   upload resume
-   optionally specify target role
-   analyze resume
-   view ATS score
-   inspect skills and gaps
-   read strengths/weaknesses
-   receive suggestions
-   view previous reports
-   delete own reports

## Authenticated User

Can access only their own analysis history and reports.

## Administrator

Administrator functionality is future scope and must not be treated as
an MVP requirement.

------------------------------------------------------------------------

# 5. MVP Functional Scope

The MVP contains:

### Authentication

-   registration
-   login
-   JWT authentication

### Resume

-   PDF upload
-   file validation
-   text extraction
-   optional target role

### AI Analysis

-   ATS-oriented score
-   summary
-   strengths
-   weaknesses
-   detected skills
-   missing/recommended skills
-   relevant keywords
-   section feedback
-   improvement suggestions

### History

-   list previous reports
-   open a report
-   delete own report

------------------------------------------------------------------------

# 6. Frontend Architecture

## Principle

Use a layered frontend:

``` text
Pages
  ↓
Reusable Components
  ↓
Hooks / Context
  ↓
Service Layer
  ↓
HTTP Client
  ↓
Backend REST API
```

This separation is important because backend integration may change
while the UI should remain stable.

------------------------------------------------------------------------

# 7. Frontend Folder Responsibilities

## `components/common`

Generic UI:

``` text
Button
Input
Card
Badge
Modal
Toast
Spinner
Skeleton
EmptyState
ErrorState
ConfirmDialog
```

No business logic.

## `components/layout`

Application shell:

``` text
Navbar
Sidebar
DashboardLayout
PublicLayout
MobileNav
Footer
```

## `components/auth`

Authentication-specific components:

``` text
LoginForm
RegisterForm
AuthHeader
```

## `components/resume`

Resume-specific components:

``` text
ResumeUpload
FileDropzone
ResumeFilePreview
TargetRoleInput
AnalysisProgress
```

## `components/report`

Report-specific components:

``` text
ScoreCard
SummaryCard
StrengthsCard
WeaknessesCard
SkillsList
MissingSkillsList
KeywordsList
SectionFeedback
SuggestionsList
ReportHeader
```

Each report component should receive data through props and should not
call the API directly.

------------------------------------------------------------------------

# 8. Frontend Pages

## LandingPage

Purpose:

Introduce product and direct users to authentication.

## LoginPage

Purpose:

Authenticate existing users.

## RegisterPage

Purpose:

Create a user account.

## DashboardPage

Purpose:

Provide overview and primary upload/analyze action.

## UploadResumePage

Purpose:

Select PDF + target role and start analysis.

## AnalysisPage

Purpose:

Show processing state while analysis is running.

## HistoryPage

Purpose:

Display previous reports.

## ReportPage

Purpose:

Display complete analysis result.

## NotFoundPage

Purpose:

Handle invalid routes.

------------------------------------------------------------------------

# 9. Frontend Data Models

Use a normalized report object:

``` js
const report = {
  id: "",
  fileName: "",
  targetRole: "",
  atsScore: 0,
  summary: "",
  strengths: [],
  weaknesses: [],
  skills: [],
  missingSkills: [],
  keywords: [],
  sectionFeedback: [],
  suggestions: [],
  createdAt: ""
};
```

Section feedback:

``` js
{
  section: "",
  feedback: ""
}
```

User:

``` js
{
  id: "",
  name: "",
  email: ""
}
```

Never store or expose `passwordHash` in frontend state.

------------------------------------------------------------------------

# 10. API Integration Design

Central API client:

``` js
apiClient
```

Responsibilities:

-   base URL
-   authorization header
-   JSON parsing
-   common error normalization
-   request helper

Services:

``` text
authService
resumeService
```

Example:

``` js
await authService.login({
  email,
  password
});
```

``` js
await resumeService.upload(file, targetRole);
```

``` js
await resumeService.getHistory();
```

Components must not know whether the implementation uses fetch, Axios,
or another HTTP client.

------------------------------------------------------------------------

# 11. Backend Architecture

Use:

``` text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

For AI:

``` text
Controller
  ↓
Analysis Service
  ↓
PDF Service
  ↓
AI Service
  ↓
Gemini
```

Controllers should stay thin.

Business logic belongs in services.

------------------------------------------------------------------------

# 12. Backend Folder Responsibilities

## `config`

Database and environment configuration.

## `routes`

Only endpoint routing.

## `controllers`

Translate HTTP requests into service calls and HTTP responses.

## `services`

Business logic:

``` text
authService
pdfService
aiService
analysisService
```

## `models`

MongoDB/Mongoose schemas.

## `middleware`

Authentication, upload validation, errors, request validation.

## `validators`

Input validation rules.

## `utils`

Shared helpers such as JWT and API response utilities.

------------------------------------------------------------------------

# 13. REST API

The supplied SRS defines:

  Method   Endpoint                Purpose
  -------- ----------------------- ----------------------------
  POST     `/api/auth/register`    Create user
  POST     `/api/auth/login`       Authenticate and issue JWT
  POST     `/api/resume/upload`    Upload and validate PDF
  POST     `/api/resume/analyze`   Run AI analysis
  GET      `/api/resume/history`   Get current user's history
  GET      `/api/resume/:id`       Get one analysis
  DELETE   `/api/resume/:id`       Delete user's analysis

All resume/report endpoints are authenticated.

------------------------------------------------------------------------

# 14. Recommended API Contract

The SRS defines the endpoints and purposes but does not prescribe exact
JSON envelopes. For implementation consistency, use:

## Success

``` json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

## Error

``` json
{
  "success": false,
  "message": "Something went wrong",
  "code": "ERROR_CODE"
}
```

The frontend service layer should normalize these responses.

------------------------------------------------------------------------

# 15. Authentication Flow

``` text
Register
   ↓
Backend validates input
   ↓
Check email
   ↓
Hash password
   ↓
Save user
   ↓
Return safe user response

Login
   ↓
Validate credentials
   ↓
Compare password hash
   ↓
Generate JWT
   ↓
Return token + safe user
```

Frontend stores only the minimum required authentication information.

The exact token storage mechanism should be selected with security in
mind and documented consistently.

------------------------------------------------------------------------

# 16. Protected Request Flow

``` text
Frontend
   |
   | Authorization: Bearer <JWT>
   ↓
Express
   ↓
Auth Middleware
   ↓
Decode / verify JWT
   ↓
req.user
   ↓
Controller
   ↓
Service
```

If JWT is missing/invalid:

``` text
401 Unauthorized
```

------------------------------------------------------------------------

# 17. Resume Analysis Flow

``` text
User
 ↓
Upload PDF
 ↓
Frontend validates basic file selection
 ↓
POST /api/resume/upload
 ↓
Backend validates PDF and size
 ↓
PDF stored/processed
 ↓
Text extracted
 ↓
Clean text
 ↓
AI analysis
 ↓
Validate AI JSON
 ↓
Store ResumeAnalysis
 ↓
Return report
 ↓
Frontend renders report
```

The SRS specifically describes this workflow on the system-design page.

------------------------------------------------------------------------

# 18. AI Output Contract

The AI should preferably return structured JSON.

Required conceptual fields:

``` json
{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "skills": [],
  "missingSkills": [],
  "keywords": [],
  "sectionFeedback": [],
  "suggestions": []
}
```

Backend must validate the response.

If the AI returns malformed JSON:

``` text
Do not save malformed analysis.
Return a controlled analysis error.
```

------------------------------------------------------------------------

# 19. ATS Score UI

The UI should display the score prominently.

Example:

``` text
+----------------------------+
|        ATS SCORE           |
|                            |
|          82 / 100          |
|                            |
|   Strong resume foundation |
+----------------------------+
```

The descriptive label must be based on an explicit UI rule if
implemented; do not invent unsupported claims.

The SRS requires an ATS-oriented score but does not define exact scoring
thresholds.

------------------------------------------------------------------------

# 20. Report UX

Recommended visual hierarchy:

``` text
Report Header
     ↓
ATS Score
     ↓
Summary
     ↓
Strengths + Weaknesses
     ↓
Skills + Missing Skills
     ↓
Keywords
     ↓
Section Feedback
     ↓
Suggestions
```

Use cards and tags for readability.

Long AI text should be displayed in readable blocks, not huge walls of
text.

------------------------------------------------------------------------

# 21. History UX

Each history item should show:

``` text
Resume filename
Target role
ATS score
Analysis date
Open
Delete
```

Deletion should require a confirmation dialog.

After deletion:

-   update the list
-   show success feedback
-   handle API failure without losing the existing UI state

------------------------------------------------------------------------

# 22. Loading States

Required loading experiences:

### Login

Button becomes loading/disabled.

### Register

Button becomes loading/disabled.

### Upload

Show upload processing.

### Analysis

Show a dedicated analysis screen.

### History

Show skeleton/list loading.

### Report

Show report skeleton.

Do not leave users staring at a blank page.

------------------------------------------------------------------------

# 23. Error UX

Examples:

### Invalid PDF

``` text
Please upload a valid PDF resume.
```

### Empty PDF

``` text
We could not extract readable text from this PDF.
Please upload a text-based resume.
```

### AI unavailable

``` text
Resume analysis is temporarily unavailable. Please try again.
```

### Unauthorized

Redirect to login where appropriate.

### Missing report

``` text
This report could not be found.
```

Do not expose stack traces to users.

------------------------------------------------------------------------

# 24. Responsive Design

The app must work on:

-   desktop
-   laptop
-   tablet
-   mobile

Upload UI should be especially usable on mobile.

Report cards should stack naturally on small screens.

Do not rely on horizontal scrolling for the primary report.

------------------------------------------------------------------------

# 25. Accessibility

Use:

-   semantic HTML
-   labels for form controls
-   keyboard-accessible buttons
-   visible focus states
-   useful alt text where images exist
-   sufficient contrast
-   error messages associated with inputs

------------------------------------------------------------------------

# 26. Backend Database Design

## User Collection

``` text
_id          ObjectId
name         String
email        String
passwordHash String
createdAt    Date
```

## ResumeAnalysis Collection

``` text
_id              ObjectId
userId           ObjectId
fileName         String
targetRole       String
atsScore         Number
skills           Array
missingSkills    Array
keywords         Array
suggestions      Array
createdAt        Date
```

For the richer frontend report contract, persist:

``` text
summary
weaknesses
sectionFeedback
```

as well when returned by the AI service.

The supplied SRS explicitly defines `userId`, `fileName`, `targetRole`,
`atsScore`, `skills`, `missingSkills`, `keywords`, `suggestions`, and
`createdAt`, and separately recommends `summary`, `strengths`,
`weaknesses`, and `sectionFeedback` in the AI output.

------------------------------------------------------------------------

# 27. Ownership / Privacy Rule

This is critical.

For:

``` text
GET /api/resume/:id
DELETE /api/resume/:id
```

the backend must verify both:

``` text
analysis ID
+
authenticated user ID
```

Never allow:

``` text
GET /api/resume/:id
```

to return a report solely because the ID exists.

------------------------------------------------------------------------

# 28. File Handling

Initial scope:

``` text
PDF only
```

The SRS states that readable/selectable PDF text is assumed.

Scanned/image-only PDFs may require OCR in a future version.

The implementation should isolate PDF parsing inside:

``` text
pdfService
```

so OCR can be added later without redesigning the whole application.

------------------------------------------------------------------------

# 29. AI Service Isolation

The frontend should never know:

-   Gemini model details
-   Gemini API key
-   prompt implementation
-   raw provider response format

Frontend receives the normalized report.

This allows future replacement of Gemini with another model/provider.

------------------------------------------------------------------------

# 30. Future Extension Compatibility

The architecture should leave clean extension points for:

### Job Description Matching

Possible future service:

``` text
jobMatchingService
```

### Multiple Resume Versions

Possible future entity:

``` text
ResumeVersion
```

### Cover Letter Generation

Possible future:

``` text
coverLetterService
```

### Downloadable Reports

Possible future:

``` text
reportExportService
```

### More Document Formats

Extend document processing without changing the report UI contract.

Do not build these as fake MVP features unless explicitly requested.

------------------------------------------------------------------------

# 31. Suggested Component Data Flow

Example:

``` text
ReportPage
   |
   └── fetch report through resumeService
            |
            ↓
        report object
            |
     ┌──────┼────────┐
     ↓      ↓        ↓
 ScoreCard Summary  SkillsList
                   |
             MissingSkillsList
```

The child components must remain presentational.

------------------------------------------------------------------------

# 32. Suggested Upload Data Flow

``` text
UploadResumePage
      |
      ↓
ResumeUpload
      |
      ↓
resumeService.upload()
      |
      ↓
Backend
      |
      ↓
Upload response
      |
      ↓
resumeService.analyze()
      |
      ↓
Analysis response
      |
      ↓
navigate('/report/:id')
```

If backend later combines upload + analyze into one endpoint, only the
service/orchestration layer should need significant changes.

------------------------------------------------------------------------

# 33. Coding Standards

Use:

-   meaningful variable names
-   small functions
-   reusable components
-   single responsibility
-   centralized constants
-   environment configuration
-   consistent error handling
-   comments only where logic is non-obvious

Avoid:

-   giant components
-   API calls inside every UI component
-   hard-coded backend URLs
-   duplicated validation
-   duplicated report rendering
-   secrets in source code
-   fake backend behavior presented as real functionality

------------------------------------------------------------------------

# 34. Another AI's Implementation Instructions

When this project is handed to another coding AI:

### Step 1

Read:

``` text
project.content.md
TASK.md
```

before modifying code.

### Step 2

Inspect the existing repository before creating files.

### Step 3

Do not replace an existing architecture blindly.

### Step 4

Create the frontend design system and routes first.

### Step 5

Implement API services with the exact endpoint contract.

### Step 6

Use mock responses only when backend endpoints are not ready.

### Step 7

Keep mock data inside a dedicated adapter/service.

### Step 8

When backend becomes available, switch the service implementation rather
than rewriting UI components.

### Step 9

Implement backend authentication and ownership checks.

### Step 10

Integrate PDF parsing.

### Step 11

Integrate Gemini behind `aiService`.

### Step 12

Validate AI output before database persistence.

### Step 13

Connect report/history pages to real APIs.

### Step 14

Run the defined test cases.

### Step 15

Do not declare the project finished until build, API integration,
security, and main user flow are verified.

------------------------------------------------------------------------

# 35. Main User Journey

The final product should support this complete path:

``` text
Visit website
   ↓
Register
   ↓
Login
   ↓
Dashboard
   ↓
Upload Resume
   ↓
Select PDF
   ↓
Optional target role
   ↓
Analyze
   ↓
Processing UI
   ↓
ATS Score
   ↓
Skills
   ↓
Missing Skills
   ↓
Keywords
   ↓
Strengths
   ↓
Weaknesses
   ↓
Section Feedback
   ↓
Suggestions
   ↓
Save Report
   ↓
History
   ↓
Open / Delete Report
```

------------------------------------------------------------------------

# 36. Academic SRS Alignment

The supplied SRS lists these functional requirements:

``` text
FR-01 Register
FR-02 Secure authentication
FR-03 PDF upload
FR-04 File validation
FR-05 PDF text extraction
FR-06 AI service processing
FR-07 ATS score
FR-08 Skills + missing skills
FR-09 Keywords + content gaps
FR-10 Strengths + weaknesses + suggestions
FR-11 Save analysis
FR-12 View previous reports
```

The implementation should map each requirement to code, API behavior,
and UI behavior.

------------------------------------------------------------------------

# 37. SRS Architecture Alignment

The supplied architecture is:

``` text
Presentation
React.js + Tailwind CSS

Application
Node.js + Express.js

Processing
PDF Parser + Gemini API

Data
MongoDB
```

Maintain this separation in the actual project.

------------------------------------------------------------------------

# 38. SRS Testing Alignment

The supplied test scenarios include:

``` text
T01 valid registration
T02 duplicate registration
T03 valid login
T04 invalid password
T05 valid PDF
T06 non-PDF
T07 unreadable/empty PDF
T08 valid analysis
T09 history
T10 unauthorized protected API
T11 AI unavailable
T12 delete own analysis
```

Also verify user ownership/security.

------------------------------------------------------------------------

# 39. Final Acceptance Criteria

A coding AI should report completion only when:

``` text
[ ] Full frontend created
[ ] Full backend structure created
[ ] React routing works
[ ] Responsive UI works
[ ] Auth pages work
[ ] Dashboard works
[ ] Upload page works
[ ] Analysis state works
[ ] Report UI works
[ ] History works
[ ] Delete works
[ ] API service layer exists
[ ] Backend routes exist
[ ] Controllers exist
[ ] Services exist
[ ] MongoDB models exist
[ ] JWT middleware exists
[ ] PDF service exists
[ ] AI service exists
[ ] AI output validation exists
[ ] User ownership checks exist
[ ] Environment examples exist
[ ] No secrets committed
[ ] Error states exist
[ ] Loading states exist
[ ] SRS requirements are covered
[ ] Test cases are covered
```

------------------------------------------------------------------------

# 40. Important Source Note

This implementation context is derived from the supplied **AI Resume
Analyzer & ATS Score Checker** SRS. The SRS specifies the initial
product scope, technology architecture, functional requirements,
database design, API endpoints, AI output fields, testing strategy, team
responsibilities, and future extensions.

Where this document contains implementation-level recommendations such
as folder names, service abstractions, response envelopes, component
organization, or error-code conventions, those are proposed engineering
decisions intended to make the SRS easier to implement and maintain;
they are not claimed to be verbatim requirements of the SRS.
