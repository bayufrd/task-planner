# AGENTS.md — Smart Task Planner

This file is the working guide for AI agents and future contributors operating inside the `Proyek Perangkat Lunak` folder.

> Scope: this guidance applies to the whole Smart Task Planner application under this directory.

---

## 1. Product Direction

Smart Task Planner is an AI-powered universal task management web application for students, freelancers, and professionals. The app focuses on intelligent task organization, automatic priority scheduling, and a fast command-driven user experience.

Primary product goals:

- Help users capture, prioritize, filter, and complete tasks quickly.
- Automatically rank tasks using the existing 4-factor priority algorithm:
  - Urgency: 40%
  - Priority/importance: 35%
  - Reminders: 15%
  - Estimated duration: 10%
- Keep the UI professional, responsive, accessible, and usable in both dark and light modes.
- Evolve from the current local/persistent MVP into a fullstack app with authentication, database-backed tasks, reminders, and Google Calendar synchronization.

---

## 2. Current App Summary

Based on the project README, this application is a Next.js fullstack task planner with:

### Completed MVP capabilities

- Task creation, editing, completion, and deletion.
- Automatic priority calculation using the 4-factor scoring algorithm.
- Task filtering by date, tags, and priority-related fields.
- Calendar/timeline visualization for task distribution.
- Command palette / chat-style task command interface.
- NLP-style parsing for task commands.
- Dark/light mode with persistent preference.
- LocalStorage persistence for current task data.
- Responsive layout for desktop, tablet, and mobile.

### Phase 1 direction

Future work should move the app toward:

- MySQL + Prisma persistence.
- NextAuth.js authentication with Google OAuth.
- Google Calendar sync.
- CRUD API endpoints.
- Task reminders and notifications.

### Longer-term direction

Future enhancements may include:

- Collaborative task sharing.
- Team workspaces.
- Analytics dashboard.
- Native mobile app.
- Recurring tasks.
- Time tracking.

---

## 3. Technology Stack Expectations

Use and preserve the documented stack unless explicitly instructed otherwise:

- Next.js 14 with App Router.
- React 18.
- TypeScript 5.x.
- TailwindCSS 3.x.
- Zustand for client state management and persistence.
- Next.js API Routes / Route Handlers are legacy API entry points during migration.
- Express.js backend inside `backend/` is the new target for backend/API functionality.
- Prisma 5.x for database access.
- MySQL 5.7+ as the relational database.
- NextAuth.js 4.x for authentication.
- Google OAuth 2.0 and Google Calendar API for integrations.

When adding new functionality, prefer solutions that fit this stack rather than introducing new frameworks or state libraries.

---

## 4. Development Principles

### TypeScript

- Keep the code type-safe.
- Avoid `any` unless there is a clear reason.
- Prefer explicit interfaces/types for domain objects such as tasks, tags, reminders, users, and calendar records.
- Keep shared domain types reusable across UI, state, and API layers.

### React / Next.js

- Use App Router conventions.
- Keep server-only code out of client components.
- Add `"use client"` only when the component uses browser APIs, hooks, Zustand, or interactive state.
- Prefer small, composable components over large monolithic components.
- Do not break SSR/client boundaries when adding database, auth, or browser-storage logic.

### Styling

- Use TailwindCSS utility classes and existing design patterns.
- Maintain dark mode compatibility.
- Preserve responsive behavior.
- Keep accessibility in mind: semantic elements, keyboard support, focus states, and readable contrast.
- When generating AI UI concepts, keep Google Stitch prompts aligned with the product context in `README.md` and document the reusable prompt in `docs/STITCH_UI_PROMPT.md`.

### State management

- Continue using Zustand for client-side task state while the MVP remains local-first.
- Keep persistence behavior stable so refreshes do not lose data.
- When database-backed tasks are introduced, design migration carefully so local task data can be synced or migrated instead of unexpectedly discarded.

### Data and persistence

- LocalStorage is part of the MVP.
- Prisma/MySQL is the intended Phase 1 persistent backend.
- Keep task data models aligned between:
  - frontend types,
  - Zustand store,
  - API request/response contracts,
  - Prisma schema,
  - documentation.

---

## 5. Domain Model Guidance

Core entities described in the README:

- `users` — user accounts and authentication data.
- `tasks` — task records with deadline, priority, duration, status, tags, and metadata.
- `task_tags` — categorization/filtering data.
- `reminders` — reminder configuration and notification timing.
- `calendars` — Google Calendar sync metadata.

Task-related behavior should preserve:

- Priority scoring consistency.
- Deadline/urgency calculations.
- Filtering by dates and tags.
- Completion state.
- Calendar/timeline display compatibility.
- Command palette compatibility.

Task status direction:

- New tasks must use `PENDING` as the default status.
- When the user clicks the finish/complete action, change the task status to `DONE`.
- Completed tasks must not be deleted automatically; keep the data for history and productivity counters.
- Default active task fetching should hide `DONE` tasks unless the UI/API explicitly requests completed/history data.
- If a task is ignored, missed, or overdue beyond the configured tolerance window, change the task status to `SKIPPED`.
- Automatic skipped tolerance uses the task form/command `estimatedDuration` value as the overdue tolerance window.
- If `estimatedDuration` is not set, default the automatic skipped tolerance to 60 minutes.
- If `estimatedDuration` is set below 60 minutes, keep the automatic skipped tolerance at the minimum 60 minutes.
- If `estimatedDuration` is set above 60 minutes, use that value as the automatic skipped tolerance window.
- Prefer the canonical enum values: `PENDING`, `DONE`, `SKIPPED`.
- Dashboard counters should eventually show total counts for `DONE`, `PENDING`, and `SKIPPED` tasks.
- Do not hard-delete task records when changing status unless the user explicitly chooses delete.

If modifying task scoring or status behavior, update related UI labels, tests, API contracts, Prisma schema, and documentation.

---

## 6. Priority Algorithm Direction

The project's defining feature is automatic task ranking. Treat this as core business logic.

Expected scoring factors:

1. Urgency / deadline proximity — 40%
2. Priority / importance — 35%
3. Reminder signal — 15%
4. Estimated duration — 10%

Implementation guidance:

- Keep the algorithm deterministic.
- Centralize scoring logic in one reusable module when possible.
- Avoid duplicating formula logic across components.
- Write or update tests when changing scoring behavior.
- Preserve existing user-facing priority semantics unless the change is requested.
- Document any weight or formula changes.

---

## 7. Command Palette / NLP Guidance

The command palette is a key UX feature.

When modifying it:

- Preserve `Ctrl+K` / keyboard-driven access.
- Keep command input conversational and forgiving.
- Ensure quick actions still support task creation and management.
- Avoid breaking existing command parsing behavior.
- Consider adding parser tests for new command formats.
- Provide clear user feedback for invalid or ambiguous commands.

---

## 8. Authentication and API Direction

For backend/API work:

- Migrate API implementation from Next.js API Routes / Route Handlers into a dedicated Express.js backend under `backend/`.
- Treat existing Next.js API endpoint direction as legacy during migration unless the user explicitly asks to keep a route in Next.js.
- New backend endpoints should be implemented in Express first.
- Use Prisma + MySQL from the Express backend for persistence.
- Use Google OAuth if required, but decide whether OAuth remains handled by NextAuth.js or is migrated into Express.
- Regular email/password register-login is not confirmed as complete; if implemented, prefer Express auth endpoints.
- Keep sensitive values in environment variables.
- Never hardcode credentials, OAuth secrets, database URLs, JWT secrets, password salts, or API keys.
- Protect user-specific API routes.
- Ensure users can only access their own tasks, reminders, tags, and calendar sync data.
- Validate all API input before database writes.
- Return consistent Express API responses using the documented success/error response shape.
- Do not remove legacy Next.js API routes until the Express replacement endpoint is complete, tested, documented, and the frontend has been migrated to call the Express endpoint.

---

## 9. Database / Prisma Direction

When working with Prisma/MySQL:

- Keep Prisma schema aligned with the documented 5 core tables.
- Use migrations for schema changes.
- Add indexes for common query patterns:
  - user-owned tasks,
  - due dates,
  - completion status,
  - tags,
  - reminder dates,
  - calendar sync IDs.
- Avoid raw SQL unless necessary.
- Do not commit generated secrets or local database dumps.
- Make schema changes backward-aware and document migration implications.

---

## 10. Google Calendar Integration Direction

When implementing or modifying calendar sync:

- Use OAuth tokens securely.
- Store only required calendar metadata.
- Handle token refresh and revoked access.
- Avoid duplicate calendar events.
- Keep app task state and Google Calendar state reconcilable.
- Log sync failures safely without exposing secrets.
- Make sync behavior explicit to the user.

---

## 11. Security Requirements

Preserve the security posture described by the README:

- Validate user input.
- Use Prisma to prevent SQL injection.
- Rely on React/Next.js escaping for XSS protection and avoid unsafe HTML.
- Enforce authentication for private data.
- Use HTTPS in production.
- Do not expose server-only secrets to client bundles.
- Use `NEXT_PUBLIC_` only for values that are safe to expose publicly.

---

## 12. Performance Requirements

Maintain a responsive production app:

- Avoid unnecessary client-side re-renders.
- Keep heavy calculations memoized or centralized.
- Lazy-load large optional UI sections when appropriate.
- Preserve Next.js build optimizations.
- Keep database queries indexed and scoped by user.
- Avoid adding large dependencies without justification.

Target README metrics:

- First load around 1.2s.
- Time to interactive around 1.5s.
- Lighthouse performance score 90+.

---

## 13. Documentation Expectations

When behavior changes, update the relevant documentation:

- `README.md` for high-level product or setup changes.
- `docs/DEPLOYMENT.md` for production deployment changes.
- `docs/phase0/DEVELOPMENT.md` for local development changes.
- `docs/phase0/DATABASE_SETUP.md` for schema/database changes.
- `docs/STITCH_UI_PROMPT.md` for Google Stitch UI generation prompts and visual direction.
- Any API or integration docs if endpoints or OAuth behavior change.

Keep documentation consistent with the deployed domain:

- `https://taskplanner.dastrevas.com`

---

## 14. Testing and Validation

Before finalizing changes, prefer running relevant checks:

```bash
npm install
npm run lint
npm run build
npm run smoke:nextjs
```

Next.js app smoke checklist:

- [ ] Start Next.js with `npm run dev` or production server with `npm start`.
- [ ] Verify `GET /` returns HTTP 200.
- [ ] Verify `GET /auth/signin` returns HTTP 200.
- [ ] Verify `GET /api/auth/session` returns HTTP 200.
- [ ] Verify `GET /api/auth/providers` returns HTTP 200.
- [ ] Run `npm run smoke:nextjs` from `Proyek Perangkat Lunak/`.
- [ ] Ensure no unexpected 404 appears for active Next.js app routes.
- [ ] Confirm frontend API calls use `NEXT_PUBLIC_API_URL=http://localhost:5000` for Express backend endpoints.

If database changes are involved, also run the appropriate Prisma commands documented by the project, such as:

```bash
npm run prisma:migrate
```

If tests are added in the future, run the project test command before completion.

If a command cannot be run in the current environment, mention that clearly in the final response.

---

## 15. Express Backend Migration Direction

The Smart Task Planner backend/API is being migrated from Next.js API Routes / Route Handlers into a dedicated Express.js backend under the `backend/` folder.

### Why Express Backend

- Separate backend concerns from frontend Next.js.
- Easier to scale backend independently.
- Clearer separation of API logic, middleware, and routing.
- Easier to add non-Next.js clients in the future (mobile app, CLI, etc.).
- Easier to manage backend-specific dependencies and tooling.

### Migration Strategy

1. Create `backend/` folder structure.
2. Initialize Express backend with TypeScript.
3. Integrate Prisma client from the Express backend.
4. Migrate API endpoints one by one from Next.js to Express.
5. Update frontend API calls to point to Express backend.
6. Keep legacy Next.js API routes until Express replacement is complete and tested.
7. Remove legacy Next.js API routes after successful migration.
8. Document each migrated endpoint in `backend/README.md`.

### Backend Folder Location

`Proyek Perangkat Lunak/backend/`

### Backend Documentation

`Proyek Perangkat Lunak/backend/README.md`

### Express Backend Checklist

Refer to Phase 2 roadmap and `backend/README.md` for detailed endpoint migration checklist.

---

## 16. Git / Repository Hygiene

**Important: GitHub workflow location**

- Git operations (add, commit, push) are executed from the **root directory** (`/Users/testdev/Desktop/project-repo/task-planner`), not from `Proyek Perangkat Lunak/`.
- This repository contains 3 apps:
  1. `Pemrograman Basis Data/` - Java backend task planner
  2. `Pemrograman Fullstack/` - Pestakami fullstack app
  3. `Proyek Perangkat Lunak/` - Smart Task Planner (current focus)
- When committing changes to `Proyek Perangkat Lunak/`, ensure git commands run from repository root.

**Repository hygiene rules:**

- `AGENTS.md` is intentionally a local guidance file and should be ignored by git.
- Do not commit local environment files, build output, dependency directories, logs, or generated secrets.
- Do not overwrite unrelated user changes.
- Keep commits focused by feature/fix.
- Review diffs before finalizing edits.
- After completing a feature, method, documentation update, bug fix, or removal, immediately commit and push the completed change unless the user explicitly says not to push.
- Use clear conventional commit-style messages that describe the action and scope.
- Preferred commit message examples:
  - `add: adding login function`
  - `add: adding task priority calculation`
  - `update: improving dashboard responsive layout`
  - `fix: resolving task filtering bug`
  - `remove: removing unused design documentation`
  - `docs: adding SKPL progress documentation`
  - `refactor: simplifying command parser logic`
- Before pushing, check staged changes with `git status --short`.
- If there are unexpected unrelated changes, stop and ask the user before committing.
- If the change is intentionally requested for all project files, use `git add .`, commit, and push.
- Prefer this workflow after finishing a requested unit of work:
  1. Inspect changed files.
  2. Run relevant validation when practical.
  3. Run `git status --short`.
  4. Stage the intended changes.
  5. Commit with a clear message.
  6. Push to the current branch.

---

## 17. Project Roadmap / Progress Checklist

Use this roadmap to understand what is already available in the current Smart Task Planner application and what still needs to be completed. Keep this checklist updated whenever a feature is finished, changed, removed, or moved to another phase.

### Phase 0 — Documentation and Project Foundation

Completed:

- [x] Main `README.md` describing product direction, stack, deployment, features, and roadmap.

- [x] Deployment documentation reference for `https://taskplanner.dastrevas.com`.
- [x] SKPL progress documentation in `docs/Progress_Dokumentasi_SKPL.md`.
- [x] Project Based Learning report in `docs/Laporan_MK_Project_Based_Learning_Smart_Task_Planner.md`.
- [x] Google Stitch UI prompt documentation in `docs/STITCH_UI_PROMPT.md`.
- [x] Git ignore rules for local agent guidance files.

Not yet / keep empty until planned:

- [ ]
- [ ]
- [ ]

### Phase 1 — Local-First MVP Task Planner

Completed:

- [x] Task creation.
- [x] Task editing.
- [x] Task deletion.
- [x] Task completion status.
- [x] Automatic task priority calculation using 4 factors.
- [x] Priority scoring factors documented:
  - Urgency / deadline proximity: 40%.
  - Priority / importance: 35%.
  - Reminder signal: 15%.
  - Estimated duration: 10%.
- [x] Task sorting/ranking by priority score.
- [x] Task filtering by date.
- [x] Task filtering by tags.
- [x] Task filtering by priority-related fields.
- [x] Calendar/timeline visualization.
- [x] Command palette / chat-style command interface.
- [x] NLP-style parsing for task commands.
- [x] Dark/light mode.
- [x] Persistent theme preference.
- [x] LocalStorage persistence for task data.
- [x] Responsive layout for desktop, tablet, and mobile.

Not yet / verify before marking complete:

- [ ] Add automated tests for priority algorithm.
- [ ] Add parser tests for command palette/NLP command formats.
- [ ] Add complete accessibility audit checklist.
- [ ] Add keyboard navigation validation for all interactive UI.
- [ ] Add user-facing error states for every task operation.
- [ ] Add empty-state UI validation for dashboard, filters, and timeline.
- [ ] Add loading-state UI validation for future API-driven data.
- [ ] Verify new task default status is `PENDING`.
- [ ] Verify complete action changes task status to `DONE` instead of deleting it.
- [ ] Verify default active task query/view hides `DONE` tasks unless history/completed mode is requested.
- [ ] Implement or verify overdue/ignored task transition to `SKIPPED` after the configured tolerance window.
- [ ] Add dashboard/task summary counters for `DONE`, `PENDING`, and `SKIPPED`.
- [ ] Add UI filters for `PENDING`, `DONE`, and `SKIPPED` history/status views.
- [ ] Add tests or manual validation checklist for task status transitions.
- [ ]
- [ ]
- [ ]

### Phase 2 — Fullstack Persistence and API

Completed:

- [x] Technology direction selected: Prisma + MySQL.
- [x] Backend migration direction decided: migrate API from Next.js Route Handlers to Express.js backend under `backend/`.
- [x] Core database entities documented: users, tasks, task_tags, reminders, calendars.
- [x] Recommended CRUD endpoint structure documented.
- [x] Backend folder created: `backend/`.
- [x] Backend migration documentation created: `backend/README.md`.

Not yet / required to complete fullstack MVP:

- [ ] Finalize `prisma/schema.prisma` for users, tasks, task_tags, reminders, and calendars.
- [ ] Run and verify Prisma migrations.
- [ ] Generate Prisma client.
- [ ] Implement authenticated `GET /api/tasks`.
- [ ] Implement authenticated `POST /api/tasks`.
- [ ] Implement authenticated `GET /api/tasks/[id]`.
- [ ] Implement authenticated `PATCH` or `PUT /api/tasks/[id]`.
- [ ] Implement authenticated `DELETE /api/tasks/[id]`.
- [ ] Implement priority recalculation endpoint if still needed.
- [ ] Add server-side input validation for task API requests.
- [ ] Add consistent API error response format.
- [ ] Scope all task queries by authenticated user.
- [ ] Add database indexes for user-owned tasks, due dates, completion status, tags, reminders, and calendar sync IDs.
- [ ] Design migration/sync strategy from LocalStorage tasks to database tasks.
- [ ] Add API documentation.
- [ ] Add integration tests for API routes when test tooling exists.
- [ ] Implement `POST /api/tasks/:id/skip` (overdue/ignored `PENDING` to `SKIPPED`).
- [ ] Implement `POST /api/calendar/:id/refresh` (manual sync action).
- [ ]
- [ ]
- [ ]

#### API Endpoint and Response Roadmap

Use this checklist to track endpoint implementation and response contract completeness. Mark an endpoint as complete only when the handler exists, validates input, checks auth when required, scopes data by user, and returns documented success/error responses.

Migration note:

All API endpoints are being migrated from Next.js API Routes to Express backend under `backend/`. Previously documented Next.js endpoint direction is now treated as legacy. New implementation should target Express.

Endpoint implementation checklist (Express backend):

- [x] Initialize Express backend: `backend/package.json`, `backend/tsconfig.json`, `backend/src/server.ts`.
- [x] Add Express middleware: JSON parser, CORS, error handler.
- [x] Add Prisma client integration in Express backend.
- [x] Add standard response helper.
- [x] Add health check route: `GET /health`.
- [x] Migrate/implement `GET /api/tasks` in Express.
- [x] Migrate/implement `POST /api/tasks` in Express.
- [x] Migrate/implement `GET /api/tasks/:id` in Express.
- [x] Migrate/implement `PATCH /api/tasks/:id` in Express.
- [x] Migrate/implement `DELETE /api/tasks/:id` in Express for explicit hard delete only.
- [x] Migrate/implement status update endpoint in Express: `PATCH /api/tasks/:id/status` for `PENDING` to `DONE`.
- [x] Migrate/implement status update endpoint in Express: `POST /api/tasks/:id/skip` for overdue/ignored `PENDING` to `SKIPPED` (can use PATCH /api/tasks/:id/status).
- [x] Migrate/implement `GET /api/tasks?status=PENDING` in Express.
- [x] Migrate/implement `GET /api/tasks?status=DONE` in Express for completed/history view.
- [x] Migrate/implement `GET /api/tasks?status=SKIPPED` in Express for skipped/history view.
- [x] Migrate/implement task counter endpoint in Express: `GET /api/tasks/stats` returning `pending`, `done`, and `skipped` counts.
- [x] Migrate/implement `POST /api/tasks/:id/priority` in Express if priority scoring is exposed through API.
- [x] Migrate/implement `POST /api/sync/calendar` in Express.
- [x] Migrate/implement `POST /api/auth/register` in Express if regular register is approved.
- [x] Migrate/implement `POST /api/auth/login` in Express if email/password login is approved.
- [x] Migrate/implement `GET /api/auth/me` in Express.
- [ ] Decide Google OAuth strategy: keep NextAuth.js in Next.js or migrate OAuth flow to Express backend.

API response contract checklist:

- [x] Define standard success response shape: `{ success: true, data, message? }`.
- [x] Define standard error response shape: `{ success: false, error: { code, message, details? } }`.
- [x] Document `GET /api/tasks` response for active/default tasks. Default excludes `DONE` tasks unless explicitly requested.
- [x] Document `POST /api/tasks` response, including default `status: PENDING`.
- [x] Document task completion response, including `status: DONE`.
- [x] Document skipped/overdue response, including `status: SKIPPED`.
- [x] Document task stats response, including `pending`, `done`, and `skipped` counters.
- [x] Document validation error response: HTTP 400.
- [x] Document unauthorized response: HTTP 401.
- [x] Document forbidden/not-owner response: HTTP 403.
- [x] Document not found response: HTTP 404.
- [x] Document internal error response: HTTP 500.
- [x] Ensure API responses never expose secrets, OAuth tokens, password hashes, or private data from other users.

### Phase 3 — Authentication and User Data Protection

Completed:

- [x] Authentication direction selected: NextAuth.js 4.x with Google OAuth 2.0.
- [x] Security requirements documented.
- [x] Private user data isolation requirement documented.

Not yet / required to complete auth MVP:

- [ ] Confirm final auth strategy: Google OAuth only, regular email/password auth, or both.
- [ ] Regular register/login is not currently confirmed as implemented; treat it as pending until verified in code.
- [ ] Implement regular user registration if approved, for example `POST /api/auth/register`.
- [ ] Implement regular email/password login if approved, preferably using NextAuth Credentials Provider or a clearly documented custom endpoint.
- [ ] Hash passwords securely with bcrypt or argon2 if regular auth is implemented.
- [ ] Add register page UI if regular registration is implemented.
- [ ] Add login page UI supporting Google OAuth and/or regular credentials according to the final auth decision.
- [ ] Add validation for name, email, and password fields.
- [ ] Add duplicate email handling.
- [ ] Add password policy documentation.
- [ ] Add response format documentation for register/login success and error cases.
- [ ] Finalize NextAuth.js Google provider configuration.
- [ ] Store OAuth secrets only in environment variables.
- [ ] Verify `NEXTAUTH_URL` for local and production environments.
- [ ] Verify `NEXTAUTH_SECRET` exists in production.
- [ ] Implement or verify protected dashboard route behavior.
- [ ] Implement or verify protected API route behavior.
- [ ] Ensure user can only access their own tasks, tags, reminders, and calendar metadata.
- [ ] Add sign-in UI state.
- [ ] Add sign-out UI action.
- [ ] Add unauthorized/unauthenticated fallback pages or messages.
- [ ] Add auth documentation for local and production setup.
- [ ]
- [ ]
- [ ]

### Phase 4 — Reminders and Notifications

Completed:

- [x] Reminder factor included in priority algorithm direction.
- [x] Reminder entity documented.
- [x] Reminder feature listed in Phase 1 direction.

Not yet:

- [ ] Implement reminder data model in Prisma.
- [ ] Implement create/update/delete reminder behavior.
- [ ] Add reminder UI controls in task form/modal.
- [ ] Add reminder list or visual indicator on task cards.
- [ ] Implement reminder notification mechanism.
- [ ] Decide notification channels: in-app, email, browser notification, or calendar-only.
- [ ] Add reminder scheduling logic.
- [ ] Add reminder tests when test tooling exists.
- [ ]
- [ ]
- [ ]

### Phase 5 — Google Calendar Synchronization

Completed:

- [x] Google Calendar integration direction documented.
- [x] Calendar entity documented.
- [x] Sync safety rules documented:
  - secure OAuth tokens,
  - token refresh handling,
  - duplicate event prevention,
  - safe failure logs,
  - explicit user-facing sync behavior.

Not yet:

- [ ] Configure required Google Calendar OAuth scopes.
- [ ] Securely store required Google Calendar token metadata.
- [ ] Implement token refresh handling.
- [ ] Implement calendar sync service.
- [ ] Implement create Google Calendar event from task.
- [ ] Implement update Google Calendar event when task changes.
- [ ] Implement delete or detach Google Calendar event when task is deleted.
- [ ] Prevent duplicate calendar events.
- [ ] Persist `googleCalendarId` and `googleEventId` metadata.
- [ ] Add manual sync action in UI.
- [ ] Add sync status feedback in UI.
- [ ] Add sync failure handling without exposing tokens/secrets.
- [ ] Add tests or validation checklist for sync behavior.
- [ ]
- [ ]
- [ ]

### Phase 6 — Production Hardening and Quality

Completed:

- [x] Deployment target documented: `https://taskplanner.dastrevas.com`.
- [x] Deployment stack documented: Linux, PM2, Nginx, Let's Encrypt, MySQL.
- [x] Performance targets documented.
- [x] Security requirements documented.

Not yet:

- [ ] Run `npm run lint` and record result.
- [ ] Run `npm run build` and record result.
- [ ] Add or verify `npm run type-check` if available.
- [ ] Add automated test command when tests exist.
- [ ] Add Lighthouse audit result.
- [ ] Verify production HTTPS.
- [ ] Verify PM2 process config.
- [ ] Verify Nginx reverse proxy config documentation.
- [ ] Verify environment variable documentation.
- [ ] Verify no secrets are committed.
- [ ] Add production monitoring checklist.
- [ ] Add rollback/deployment recovery notes.
- [ ]
- [ ]
- [ ]

### Phase 7 — Future Enhancements

Completed:

- [x] Future enhancement direction documented in README and SKPL.

Not yet:

- [ ] Collaborative task sharing.
- [ ] Team workspaces.
- [ ] Analytics dashboard.
- [ ] Native mobile app.
- [ ] Recurring tasks.
- [ ] Time tracking.
- [ ] Drag-and-drop task rescheduling.
- [ ] Advanced productivity insights.
- [ ]
- [ ]
- [ ]

---

## 18. Agent Workflow for Future Tasks

When working in this folder:

1. Inspect the relevant files before editing.
2. Identify whether the change affects UI, state, API, database, auth, or documentation.
3. Preserve existing user-facing behavior unless explicitly asked to change it.
4. Keep TypeScript and Tailwind conventions consistent.
5. Update documentation when the product direction or setup changes.
6. Run available validation commands when practical.
7. Summarize what changed and any follow-up actions.

---

## 19. Do Not Do Without Explicit Approval

- Do not replace the documented stack.
- Do not remove the command palette, priority scoring, theme support, or persistence.
- Do not hardcode production credentials or personal tokens.
- Do not delete documentation or deployment files.
- Do not introduce a new database provider without approval.
- Do not make destructive database migrations without a clear migration plan.
- Do not expose private user task data across accounts.

---

## 20. Development Environment Configuration

### Test Credentials

For manual testing during development:

- **Email:** testdev@gmail.com
- **Password:** Testdev123!

For register testing, use random email format: `test${timestamp}@example.com` with password minimum 6 characters.

---

## 21. Frontend-Backend Integration Testing

### Prerequisites

Both servers must be running:

```bash
# Terminal 1: Frontend
cd "Proyek Perangkat Lunak" && npm run dev

# Terminal 2: Backend
cd "Proyek Perangkat Lunak/backend" && npm run dev
```

### Auth Endpoints

| # | Test Case | Method | Endpoint | Body/Params | Expected |
|---|-----------|--------|----------|-------------|----------|
| 1 | Health check | GET | `http://localhost:5000/health` | - | `{ status: "ok" }` HTTP 200 |
| 2 | Register success | POST | `http://localhost:5000/api/auth/register` | `{ name: "Test User", email: "test${timestamp}@example.com", password: "Testpass123!" }` | `{ success: true, data: { id, name, email } }` HTTP 201 |
| 3 | Register duplicate email | POST | `http://localhost:5000/api/auth/register` | `{ name: "Test", email: "testdev@gmail.com", password: "Testpass123!" }` | `{ success: false }` HTTP 400/409 |
| 4 | Register missing fields | POST | `http://localhost:5000/api/auth/register` | `{ email: "test@example.com" }` | Validation error HTTP 400 |
| 5 | Login success | POST | `http://localhost:5000/api/auth/login` | `{ email: "testdev@gmail.com", password: "Testdev123!" }` | `{ success: true, data: { token } }` HTTP 200 |
| 6 | Login wrong password | POST | `http://localhost:5000/api/auth/login` | `{ email: "testdev@gmail.com", password: "wrongpassword" }` | `{ success: false }` HTTP 401 |
| 7 | Login non-existent email | POST | `http://localhost:5000/api/auth/login` | `{ email: "nonexistent@example.com", password: "Testdev123!" }` | `{ success: false }` HTTP 401 |
| 8 | Get current user | GET | `http://localhost:5000/api/auth/me` | Header: `Authorization: Bearer <token>` | `{ success: true, data: { id, name, email } }` HTTP 200 |
| 9 | Get current user no token | GET | `http://localhost:5000/api/auth/me` | - | HTTP 401 unauthorized |

### Task Endpoints

| # | Test Case | Method | Endpoint | Body/Params | Expected |
|---|-----------|--------|----------|-------------|----------|
| 10 | Get all tasks (empty) | GET | `http://localhost:5000/api/tasks` | Header: `Authorization: Bearer <token>` | `{ success: true, data: [] }` HTTP 200 |
| 11 | Create task | POST | `http://localhost:5000/api/tasks` | `{ title: "Test Task", deadline: "2026-05-20T10:00:00Z", priority: 3, duration: 60 }` | `{ success: true, data: { id, title, status: "PENDING" } }` HTTP 201 |
| 12 | Get task by id | GET | `http://localhost:5000/api/tasks/:id` | Header: `Authorization: Bearer <token>` | `{ success: true, data: { id, title } }` HTTP 200 |
| 13 | Update task | PATCH | `http://localhost:5000/api/tasks/:id` | `{ title: "Updated Task" }` | `{ success: true, data: { id, title: "Updated Task" } }` HTTP 200 |
| 14 | Mark task done | PATCH | `http://localhost:5000/api/tasks/:id/status` | `{ status: "DONE" }` | `{ success: true, data: { id, status: "DONE" } }` HTTP 200 |
| 15 | Skip task | PATCH | `http://localhost:5000/api/tasks/:id/status` | `{ status: "SKIPPED" }` | `{ success: true, data: { id, status: "SKIPPED" } }` HTTP 200 |
| 16 | Get tasks by status | GET | `http://localhost:5000/api/tasks?status=DONE` | Header: `Authorization: Bearer <token>` | `{ success: true, data: [...] }` HTTP 200 |
| 17 | Get task stats | GET | `http://localhost:5000/api/tasks/stats` | Header: `Authorization: Bearer <token>` | `{ success: true, data: { pending, done, skipped } }` HTTP 200 |
| 18 | Delete task | DELETE | `http://localhost:5000/api/tasks/:id` | Header: `Authorization: Bearer <token>` | HTTP 204 or `{ success: true }` |
| 19 | Create task without auth | POST | `http://localhost:5000/api/tasks` | `{ title: "Test" }` | HTTP 401 |
| 20 | Get another user's task | GET | `http://localhost:5000/api/tasks/:otherId` | Header: `Authorization: Bearer <token>` | HTTP 403/404 |

### Task Form Parsing (via Command Palette / API)

| # | Test Case | Input | Expected Parsed Output |
|---|-----------|-------|----------------------|
| 21 | Simple task | "Finish report tomorrow at 5pm" | `{ title: "Finish report", deadline: tomorrow_17:00, priority: 3 }` |
| 22 | Task with priority | "Important: Call client" | `{ title: "Call client", priority: 5 }` |
| 23 | Task with duration | "Meeting 30 minutes" | `{ title: "Meeting", duration: 30 }` |
| 24 | Task with tags | "Buy groceries #shopping" | `{ title: "Buy groceries", tags: ["shopping"] }` |
| 25 | Complex deadline | "Submit project next Monday 9am" | `{ title: "Submit project", deadline: next_monday_09:00 }` |

### Frontend UI Flow Tests

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 26 | Register via UI | Signup page → Fill form → Submit | Redirect to signin with success message |
| 27 | Login via UI | Signin page → Fill testdev credentials → Submit | Redirect to /dashboard |
| 28 | Login redirect loop fix | Login → Should land on /dashboard | NOT redirected back to /auth/signin |
| 29 | Protected route access | Access /dashboard without login | Redirect to /auth/signin |
| 30 | Protected route after login | Login → Access /dashboard | Shows dashboard content |
| 31 | Create task via UI | Dashboard → New task → Fill form → Submit | Task appears in list |
| 32 | Complete task via UI | Click complete on task | Status changes to DONE, moves to history |
| 33 | Delete task via UI | Click delete on task | Task removed from list |
| 34 | Filter tasks by date | Use date filter | Only tasks matching date shown |
| 35 | Filter tasks by tags | Use tag filter | Only tasks with matching tags shown |
| 36 | Command palette | Press Ctrl+K → Type task command | Task created from command |
| 37 | Dark/Light mode | Toggle theme | UI updates without page reload |
| 38 | Theme persists | Set theme → Refresh page | Theme preference maintained |

### Integration Test Results

Update this section after running tests:

**Auth Tests:**
- [ ] Test 1: Health check
- [ ] Test 2: Register success
- [ ] Test 3: Register duplicate email
- [ ] Test 4: Register missing fields
- [ ] Test 5: Login success
- [ ] Test 6: Login wrong password
- [ ] Test 7: Login non-existent email
- [ ] Test 8: Get current user
- [ ] Test 9: Get current user no token

**Task Tests:**
- [ ] Test 10: Get all tasks (empty)
- [ ] Test 11: Create task
- [ ] Test 12: Get task by id
- [ ] Test 13: Update task
- [ ] Test 14: Mark task done
- [ ] Test 15: Skip task
- [ ] Test 16: Get tasks by status
- [ ] Test 17: Get task stats
- [ ] Test 18: Delete task
- [ ] Test 19: Create task without auth
- [ ] Test 20: Get another user's task

**Parsing Tests:**
- [ ] Test 21: Simple task
- [ ] Test 22: Task with priority
- [ ] Test 23: Task with duration
- [ ] Test 24: Task with tags
- [ ] Test 25: Complex deadline

**UI Flow Tests:**
- [ ] Test 26: Register via UI
- [ ] Test 27: Login via UI
- [ ] Test 28: Login redirect loop fix
- [ ] Test 29: Protected route access
- [ ] Test 30: Protected route after login
- [ ] Test 31: Create task via UI
- [ ] Test 32: Complete task via UI
- [ ] Test 33: Delete task via UI
- [ ] Test 34: Filter tasks by date
- [ ] Test 35: Filter tasks by tags
- [ ] Test 36: Command palette
- [ ] Test 37: Dark/Light mode
- [ ] Test 38: Theme persists


### Frontend Environment Variables (Next.js)

Location: `Proyek Perangkat Lunak/.env`

Required variables for local development:

```bash
# Database Configuration
DB_USERNAME=root
DB_PASSWORD=0202
DB_NAME=taskplanner
DB_HOST=192.168.1.2
DB_PORT=3307
DB_DIALECT=mysql

# Prisma Database URL
DATABASE_URL="mysql://root:0202@192.168.1.2:3307/taskplanner"

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
# Production: NEXTAUTH_URL=https://taskplanner.dastrevas.com

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
# Production: NEXT_PUBLIC_API_URL=https://taskplanner.dastrevas.com
```

### Backend Environment Variables (Express)

Location: `Proyek Perangkat Lunak/backend/.env`

Required variables for backend development:

```bash
# Database Configuration
DATABASE_URL="mysql://root:your_password_here@192.168.1.2:3307/taskplanner"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
# Production: FRONTEND_URL=https://taskplanner.dastrevas.com

# Google OAuth (if migrated to Express backend)
# GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## 22. Focus Chain — Dashboard Auto-Refresh, Soft Delete, Skip Disable, Snackbar

Track progress for responsive dashboard, soft-delete backend, SKIPPED-disabled card, delete confirmation, and snackbar notifications.


- [x] Cari file terkait dashboard, task card, API, dan backend task
- [x] Inspeksi task card dan store
- [x] Inspeksi dashboard, modal, API client, backend task sebagian
- [x] Inspeksi task card detail dan schema
- [x] Implement auto-refresh state/counter/list/calendar setelah create/update/delete/skip
  - Dashboard mendengarkan custom event `tasks:changed`
  - `NewTaskModal` melempar event via `window.dispatchEvent(new CustomEvent('tasks:changed'))`
  - `CommandPalette` melempar event setelah task dibuat
  - `TaskCard` melempar event setelah complete dan delete
  - `onCreated` callback di modal memicu `loadTasks()` dan `loadStats()`
- [x] Implement soft delete backend dan filter `deletedAt: null`
  - Schema: `deletedAt DateTime?` + `@@index([deletedAt])`
  - Service: `deleteTask` → `update({ data: { deletedAt: new Date() } })` (bukan `delete`)
  - Query `getTasks`, `getTaskStats`, `autoSkipOverdueTasks` → filter `deletedAt: null`
  - `DELETE /api/tasks/:id` → soft delete
  - Frontend API client: `taskApi.delete(taskId)` → method `DELETE`
- [x] Tambahkan disabled DONE untuk SKIPPED, konfirmasi delete, dan snackbar
  - Status `SKIPPED` dimapping dari backend → frontend (`SKIPPED`)
  - Task card SKIPPED: visual muted (opacity-60), strikethrough title
  - Task card SKIPPED: tombol Done tidak dirender (null)
  - Task card SKIPPED: `handleComplete` early-return + `notify.error`
  - Delete button → confirmation modal (in-card, tema-aware)
  - Snackbar: create berhasil, delete berhasil, done berhasil, skip blocked
- [x] Jalankan validasi
  - `npm run lint` berhasil (hanya warning existing)
  - Backend TypeScript errors yang muncul adalah existing (calendar.refresh, task.skip) — tidak terkait
  - Frontend TypeScript compile berhasil
  - Perlu: jalankan `npx prisma db push` atau `prisma migrate dev` di backend untuk add kolom `deletedAt`
- [x] Commit dan push perubahan

### Database Migration Needed

Setelah schema diubah, jalankan salah satu:

```bash
# Development cepat (langsung push schema)
cd "Proyek Perangkat Lunak/backend" && npx prisma db push

# Atau migration formal
cd "Proyek Perangkat Lunak/backend" && npx prisma migrate dev --name add_task_deleted_at
```

### Files Changed

- `backend/prisma/schema.prisma` — field `deletedAt`, index
- `backend/src/modules/tasks/task.service.ts` — soft delete, filter deletedAt
- `src/app/(protected)/dashboard/page.tsx` — event listener, SKIPPED mapping, `onCreated`
- `src/components/tasks/NewTaskModal.tsx` — event dispatch, normalized status, snackbar
- `src/components/command/CommandPalette.tsx` — event dispatch, snackbar
- `src/components/tasks/TaskCard.tsx` — SKIPPED disabled, confirmation modal, snackbar, event dispatch
- `src/lib/api/client.ts` — `taskApi.delete()` method
- `src/lib/constants/icons.ts` — SKIPPED status icon
- `src/lib/utils/store.ts` — `SKIPPED` status type, `getTaskStats` + `skipped`, getter filter

---

## 23. AI / LLM Task Parsing — 9Router Integration

Smart Task Planner uses 9Router as an AI backend proxy to parse natural language task commands into structured task payloads. The API key lives server-side only in `backend/.env` and is never exposed to the browser.

### How It Works

1. User types a natural language task command in Command Palette (`Ctrl+K` or navbar button).
2. Frontend sends `POST /api/ai/parse-task` with the raw command text.
3. Backend proxies the request to 9Router (`$NINE_ROUTER_API/v1/chat/completions`) with a deterministic system prompt.
4. 9Router returns a JSON payload with: `title`, `description`, `deadline`, `priority`, `estimatedDuration`, `tags`, `reminderTime`.
5. Backend validates and returns the parsed payload to the frontend.
6. Frontend creates the task via `POST /api/tasks`.

If 9Router is unavailable or the LLM parse fails, Command Palette falls back to the existing regex-based parser.

### Environment Variables (Backend — `backend/.env`)

```bash
# 9Router AI / LLM Configuration
NINE_ROUTER_API=https://9router.dastrevas.com/v1/chat/completions
NINE_ROUTER_API_KEY=your_9router_api_key_here
NINE_ROUTER_MODEL=cx/gpt-5.2  # optional, defaults to cx/gpt-5.2
```

**IMPORTANT:** These variables must **never** be prefixed with `NEXT_PUBLIC_` or appear in the Next.js frontend `.env`. The API key is only consumed by the Express backend.

### Endpoint

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ai/parse-task` | Bearer token | Parse natural language command → structured task |

**Request body:**
```json
{ "command": "add meeting besok jam 3 sore high priority #work 45 menit" }
```

**Success response (HTTP 200):**
```json
{
  "success": true,
  "data": {
    "title": "Meeting",
    "description": "",
    "deadline": "2026-05-15T15:00:00.000Z",
    "priority": "HIGH",
    "estimatedDuration": 45,
    "tags": ["work"],
    "reminderTime": 60
  },
  "message": "Task command parsed successfully"
}
```

**Error responses:**
- HTTP 400 — command missing or too long
- HTTP 401 — unauthorized
- HTTP 500 — 9Router error or LLM parsing failure

### AI Parsing Rules (System Prompt)

The 9Router system prompt instructs the LLM to:
- Return ONLY valid JSON, no markdown, no explanation.
- Parse both Indonesian and English natural language.
- Extract `title` (clean, no date/time/duration tokens).
- `deadline` as absolute ISO-8601 datetime; default to tomorrow 09:00 if omitted.
- `priority` default MEDIUM; HIGH for "important/urgent/penting/mendesak"; LOW for "low/santai/rendah".
- `estimatedDuration` default 60 minutes.
- `reminderTime` default 60 minutes before deadline.
- Extract `#tags` from input, omit `#` prefix, default `[]`.
- Never invent unrelated details.

### Files Added/Modified

- `backend/src/modules/ai/ai.service.ts` — LLM proxy service (9Router call + response parsing + normalization)
- `backend/src/modules/ai/ai.controller.ts` — Route handler
- `backend/src/modules/ai/ai.routes.ts` — Express route `POST /api/ai/parse-task`
- `backend/src/config/env.ts` — `NINE_ROUTER_API`, `NINE_ROUTER_API_KEY`, `NINE_ROUTER_MODEL`
- `backend/src/app.ts` — `app.use('/api/ai', aiRoutes)`
- `src/lib/constants/api.ts` — `API_ROUTES.AI.PARSE_TASK`
- `src/lib/api/client.ts` — `aiApi.parseTaskCommand()`, `ParsedTaskCommand` interface
- `src/components/command/CommandPalette.tsx` — LLM integration with fallback to regex parser

### Recommended Model

For simple task parsing, use the light model:

```bash
NINE_ROUTER_MODEL=cx/gpt-5.2
```

Avoid `openai/gpt-4o-mini` in this project unless OpenAI credentials are active in 9Router. If 9Router returns `No active credentials for provider: openai`, switch to one of the available `cx/*` models.

### Fallback Behavior

If 9Router is not configured, unavailable, or returns an error, Command Palette automatically falls back to the existing regex-based `parseAndCreateTask()` function. This ensures the command palette always works even without AI.

### AI Testing Checklist

Use these checks after changing the 9Router integration:

- [x] Restart Express backend after adding `/api/ai/parse-task`; otherwise the route can return 404.
- [x] Verify unauthenticated request returns 401, not 404:
  ```bash
  curl -i -X POST http://localhost:5000/api/ai/parse-task \
    -H "Content-Type: application/json" \
    -d '{"command":"add meeting besok jam 3 sore high priority #work 45 menit"}'
  ```
- [x] Register/login through Express backend and capture Bearer token.
- [x] Verify authenticated AI parse returns HTTP 200 and structured JSON.
  - Test command: `"add meeting besok jam 3 sore high priority #work 45 menit"`
  - Result: `title=meeting`, `priority=HIGH`, `duration=45`, `tags=[work]`, `reminderTime=60`
- [ ] Verify command palette `Ctrl+K` creates a task from Indonesian input.
- [ ] Verify command palette navbar button opens the same AI-powered parser.
- [ ] Verify fallback parser still creates task when 9Router is unavailable.
- [x] Verify API key is only in `backend/.env`, never in frontend `.env` and never committed.

Expected successful parse shape:

```json
{
  "success": true,
  "data": {
    "title": "Meeting",
    "description": "",
    "deadline": "2026-05-15T15:00:00.000Z",
    "priority": "HIGH",
    "estimatedDuration": 45,
    "tags": ["work"],
    "reminderTime": 60
  }
}
```

---

### Environment Setup Guidelines

1. **Never commit `.env` files** - they contain sensitive credentials
2. **Use `.env.example` templates** - copy and customize for your environment
3. **Generate secure secrets** for production:
   ```bash
   # Generate NEXTAUTH_SECRET or JWT_SECRET
   openssl rand -base64 32
   ```
4. **Database connection**:
   - Local development uses `192.168.1.2:3307`
   - Production should use secure connection strings
   - Ensure MySQL server is accessible from development machine
5. **Port configuration**:
   - Frontend (Next.js): `3000`
   - Backend (Express): `5000`
   - Database (MySQL): `3307`
6. **OAuth credentials**:
   - Current credentials are for development/testing
   - Production requires separate Google OAuth app configuration
   - Configure authorized redirect URIs in Google Cloud Console
7. **CORS setup**:
   - Backend `FRONTEND_URL` must match Next.js app URL
   - Update for production deployment domain

### Production Environment Notes

For production deployment at `https://taskplanner.dastrevas.com`:

- Use environment-specific values for `NEXTAUTH_URL`, `NEXT_PUBLIC_API_URL`, and `FRONTEND_URL`
- Ensure all secrets are regenerated and stored securely
- Configure proper HTTPS certificates
- Use production-grade database credentials
- Enable appropriate CORS policies
- Set `NODE_ENV=production`
