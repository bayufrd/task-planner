# Vue Migration Roadmap And Handoff

## Recommended Roadmap

### Milestone 1 - Baseline freeze

**Goal**
Lock the migration baseline so future agents do not re-argue source of truth.

**Tasks**
- Freeze reference scope from `proyek-perangkat-lunak`.
- Freeze target execution branch in Vue frontend.
- Record all known parity gaps.

**Definition of done**
- Planning docs are committed.
- Agent team accepts Next.js as single source of truth.

**Risks**
- Drifting requirements if Vue existing behavior is treated as equally authoritative.

### Milestone 2 - Foundation refactor

**Goal**
Refactor Vue structure before page polishing.

**Tasks**
- Add layout system.
- Add UI/global state for theme, language, profile, command palette.
- Normalize router structure.
- Introduce shared styling tokens.

**Definition of done**
- Public/auth/protected layouts exist.
- Page-local duplicated chrome begins to disappear.
- New pages can be built on stable shared primitives.

**Risks**
- Skipping this step causes repeated rework across every page.

**Dependencies**
- Milestone 1 complete.

### Milestone 3 - Public/auth parity

**Goal**
Make landing and auth flows visually and structurally equivalent first.

**Tasks**
- Rebuild landing page.
- Rebuild sign-in page.
- Rebuild sign-up page.
- Normalize shared branding/assets.

**Definition of done**
- Public and auth pages match reference hierarchy and visual language.
- No duplicated custom variants remain unless documented.

**Risks**
- Copy and layout drift if old Vue markup is incrementally patched instead of restructured.

**Dependencies**
- Milestone 2 complete.

### Milestone 4 - Protected shell parity

**Goal**
Recreate the shared product shell before deep page work.

**Tasks**
- Port protected header behavior.
- Add profile dropdown behavior.
- Add mobile bottom nav.
- Add command palette entry surface.
- Align auth redirect and loading shell behavior.

**Definition of done**
- Dashboard and overview render inside a parity-grade shared shell.

**Risks**
- Protected pages will keep diverging if built before the shell is stabilized.

**Dependencies**
- Milestone 2 complete.

### Milestone 5 - Dashboard and overview parity

**Goal**
Port the highest-value protected product surfaces.

**Tasks**
- Rebuild dashboard section order and UI surfaces.
- Rebuild task modal flow.
- Rebuild overview sequence and analysis presentation.
- Validate task/overview refresh interactions.

**Definition of done**
- Dashboard and overview are visually, structurally, and behaviorally close to reference.

**Risks**
- Backend data mismatches can tempt UX compromise. Document them instead of redesigning around them.

**Dependencies**
- Milestone 4 complete.

### Milestone 6 - Remaining parity gaps and cleanup

**Goal**
Close high-priority missing features and remove conflicting extras.

**Tasks**
- Implement connect WhatsApp page.
- Decide fate of reminders and AI helper routes.
- Remove extra Vue-only explanations and route exposure.
- Clean CSS and component leftovers.

**Definition of done**
- In-scope routes reflect the reference app with no major contradictory UX.

**Risks**
- Keeping legacy routes/features alive too long creates scope confusion.

**Dependencies**
- Milestone 5 complete.

### Milestone 7 - Final QA and monitoring

**Goal**
Validate parity and keep progress visible.

**Tasks**
- Run build/tests.
- Perform per-route visual comparison.
- Record open gaps with severity.
- Update checklist percentages.

**Definition of done**
- Migration status is measurable and the remaining work is explicit.

## Progress Monitoring Model

Track progress by milestone and by route.

### Suggested status scale

- `0%` not started
- `25%` structure in place
- `50%` first parity pass complete
- `75%` interaction/styling aligned
- `100%` verified and signed off

### Suggested tracker fields

| Area | Owner | Status | Blocker | Last verified | Notes |
| --- | --- | --- | --- | --- | --- |
| Layout foundation | | | | | |
| Styling tokens | | | | | |
| Landing | | | | | |
| Sign in | | | | | |
| Sign up | | | | | |
| Protected shell | | | | | |
| Dashboard | | | | | |
| Overview | | | | | |
| WhatsApp connect | | | | | |
| Reminders decision | | | | | |
| AI helper decision | | | | | |
| QA | | | | | |

## Operational Notes For Next Agent

### Analysis-time condition

- Next.js app is significantly more complete, polished, and architecturally layered than the Vue target.
- Vue app already contains useful API wiring and partial visual borrowing, but it is still a simplified adaptation.
- Current Vue reminders and AI helper pages are function-first rather than parity-first.

### Assumptions used

- Next.js remains the canonical frontend reference.
- Vue backend compatibility should not override parity-driven frontend structure.
- Google OAuth parity may require separate backend/auth work and is therefore not assumed for the first migration wave.

### Decisions already made

- Do not preserve legacy Vue UX when it conflicts with the Next.js reference.
- Start with structural/layout refactor before page-level pixel work.
- Treat command palette, theme, language, and protected shell as foundational gaps.
- Treat `/connectwhatsapp` as a required missing page.
- Treat reminders and AI helper as potentially removable or redesignable features rather than fixed product requirements.

### Recommended next action

1. Build the shared Vue layout system.
2. Add a UI state layer for theme/language/command/profile.
3. Refactor auth and landing pages onto the new layouts.

### What must not be changed too early

- Do not heavily polish dashboard internals before protected layout is rebuilt.
- Do not redesign reminders or AI helper in isolation before route scope decisions are finalized.
- Do not commit to old Vue CSS architecture if it blocks tokenized shared styling.

### High-risk areas if touched first

- Dashboard page before shell refactor.
- Overview visuals before shared token system.
- Route naming changes before guard/layout strategy is set.
- Auth behavior changes before confirming backend capability for parity features.

### Re-check before implementation continues

- Confirm whether Vue should add alias routes for `/auth/signin` and `/auth/signup`.
- Confirm whether Google OAuth is deferred or in scope.
- Confirm whether reminders remain as a first-class route in the final product.
- Confirm whether AI parsing should live in command palette, modal flow, or a dedicated page during the transition.

## Suggested Commit Message Pattern For Future Execution Work

- `[chore] normalize vue app shell for nextjs parity`
- `[feat] port nextjs auth pages into vue layouts`
- `[refactore] rebuild vue dashboard to match nextjs reference`
- `[delete] remove legacy vue-only ux paths blocking parity`
