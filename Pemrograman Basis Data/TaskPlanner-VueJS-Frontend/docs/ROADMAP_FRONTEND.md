# Frontend Roadmap

## Progress Checklist

- [x] Analyze Java backend README and endpoint documentation
- [x] Compare available backend features with Next.js reference app
- [x] Define Vue 3 SPA architecture and API adapter layer
- [x] Scaffold Vue 3 + TypeScript + Vite project
- [x] Add router, auth guard, and local JWT persistence
- [x] Implement landing, login, and register pages
- [x] Implement dashboard with task CRUD, stats, planner, and charts
- [x] Implement reminder management page
- [x] Implement AI helper page
- [x] Remove unsupported Google auth, theme toggle, and multi-language UI
- [x] Write documentation and API adaptation notes
- [ ] Add modal-based editing UX similar to the Next.js reference
- [ ] Add dedicated weekly chart visualization using `GET /api/tasks/stats/weekly`
- [ ] Add toast/snackbar feedback system
- [ ] Add endpoint smoke tests against running backend
- [ ] Add responsive empty/loading/skeleton states refinement

## API Adjustment Checklist Applied

- [x] Use JWT Bearer token for protected endpoints
- [x] Use local auth only
- [x] Use current Java task status values: `TODO`, `IN_PROGRESS`, `DONE`, `SKIPPED`
- [x] Use current Java priority values: `HIGH`, `MEDIUM`, `LOW`
- [x] Use `/api/planner/today` instead of Next.js-specific planner logic
- [x] Use in-memory reminder module as-is without persistence assumptions
- [x] Handle possible plain-text auth error responses
- [x] Keep UI text in English only
