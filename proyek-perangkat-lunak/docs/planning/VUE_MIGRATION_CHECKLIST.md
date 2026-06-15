# Vue Migration Checklist

## Master Execution Checklist

### Phase 0 - Audit lock

- [x] Confirm Next.js reference commit or snapshot used as migration baseline.
- [x] Confirm Vue target branch for migration execution.
- [x] Confirm agent will not preserve Vue-specific UX if it conflicts with Next.js parity.
- [x] Confirm required assets from `proyek-perangkat-lunak/public` are available to Vue target.
- [x] Confirm route naming strategy for auth aliases versus parity paths.
- [x] Confirm canonical in-scope route list and deferred route list.

### Phase 1 - Inventory and dependency mapping

- [x] Inventory all public pages in Next.js.
- [x] Inventory all auth pages in Next.js.
- [x] Inventory all protected pages in Next.js.
- [x] Inventory all shared components used by those pages.
- [x] Inventory all provider-driven UI behaviors in Next.js.
- [x] Inventory all Vue pages/components that can be reused safely.
- [x] Inventory backend/API assumptions in Vue that may constrain parity.
- [x] Document every missing route in Vue.
- [x] Document every extra route in Vue.
- [x] Document every end-to-end frontend flow that must survive migration.
- [x] Document starter/demo artifacts in Vue that should be removed.

### Phase 2 - Structural normalization in Vue

- [x] Create shared public layout.
- [x] Create shared auth layout.
- [x] Create shared protected layout.
- [ ] Move duplicated header logic out of individual pages.
- [x] Introduce global UI state for theme.
- [x] Introduce global UI state for language.
- [x] Introduce global UI state for command palette.
- [x] Introduce global UI state for profile dropdown/mobile nav behavior.
- [x] Normalize route guards around new layout boundaries.
- [x] Create route registry or parity matrix used by all implementation work.

### Phase 3 - Styling system alignment

- [x] Define shared design tokens matching Next.js colors, radii, shadows, spacing, and blur surfaces.
- [x] Normalize typography scale to match Next.js hierarchy.
- [x] Normalize button variants to match Next.js primary, secondary, ghost, and danger states.
- [x] Normalize card/surface variants to match Next.js glass and panel patterns.
- [x] Normalize icon sizing and spacing.
- [x] Port critical assets from Next.js public folder.
- [x] Add light/dark theme support.
- [ ] Validate mobile-safe footer/tab spacing.

### Phase 4 - Public and auth parity

- [x] Rebuild landing header to match Next.js.
- [x] Rebuild landing hero section to match Next.js.
- [x] Rebuild landing feature sections to match Next.js content order.
- [x] Rebuild landing CTA/footer sections to match Next.js.
- [x] Rebuild sign-in page structure to match Next.js.
- [x] Rebuild sign-up page structure to match Next.js.
- [x] Define and implement auth callback route behavior if needed.
- [x] Reintroduce CAPTCHA placeholder or integration plan if backend parity is not ready.
- [x] Remove Vue-only auth footnotes and mismatched copy.

### Phase 5 - Protected shell parity

- [x] Rebuild protected header with logo, command entry, theme toggle, language toggle, and profile trigger.
- [x] Rebuild desktop profile dropdown.
- [x] Rebuild mobile bottom navigation.
- [x] Add command palette mounting layer.
- [ ] Add shell-level loading and redirect handling.
- [ ] Align route availability with reference navigation.
- [ ] Validate protected route redirects against canonical route matrix.

### Phase 6 - Dashboard parity

- [x] Align dashboard page frame with sticky header layout.
- [x] Align new task CTA styling and placement.
- [x] Align calendar/timeline section hierarchy.
- [x] Align stat strip surfaces and labels.
- [x] Align hero image/media section.
- [x] Align empty state design and messaging.
- [x] Align task list/card presentation.
- [x] Align create/edit modal UX.
- [x] Align refresh behavior after mutations.
- [x] Remove legacy planner panel (not in Next.js reference).

### Phase 7 - Overview parity

- [ ] Align overview header and refresh action.
- [ ] Align stats card order and visuals.
- [ ] Align AI loading and analysis states.
- [ ] Align animal-level hero section.
- [ ] Align AI productivity score presentation.
- [ ] Align insight blocks and support imagery.
- [ ] Align chart panel ordering and density.
- [ ] Validate desktop/mobile readability against reference.

### Phase 8 - Missing feature parity

- [ ] Implement `/connectwhatsapp` route in Vue.
- [ ] Port WhatsApp onboarding copy and surface design.
- [ ] Decide whether reminders become hidden, redesigned, or integrated later.
- [ ] Decide whether standalone AI helper remains temporary or is folded into parity flows.
- [ ] Track Google OAuth parity as deferred or in-scope based on backend readiness.

### Phase 9 - Cleanup and feature removal

- [ ] Remove duplicated page-local headers after layout migration.
- [x] Remove Vue-only route explanations and footnotes.
- [ ] Remove UI paths that contradict reference navigation.
- [ ] Remove or de-prioritize extra pages not justified by the reference product.
- [ ] Remove dead CSS and orphaned assets.
- [ ] Remove starter/demo components not part of the product experience.

### Phase 10 - Validation and QA

- [ ] Run build successfully in Vue target.
- [ ] Run existing Vue tests or e2e checks.
- [ ] Add parity review checklist per page using screenshots.
- [ ] Validate theme behavior across public/auth/protected pages.
- [ ] Validate route guards and logout flow.
- [ ] Validate task CRUD and overview refresh behavior.
- [ ] Validate responsive behavior on desktop and mobile widths.
- [ ] Validate no extra Vue-only UX remains in critical flows.
- [ ] Validate all documented routes against implemented routes before sign-off.
- [ ] Validate all end-to-end frontend flows against the migration plan before sign-off.

## Route Parity Checklist

- [x] Canonical public route list documented.
- [x] Canonical auth route list documented.
- [ ] Canonical protected route list documented.
- [x] Deferred routes documented.
- [x] Extra Vue routes documented with disposition.
- [x] Alias routes documented.
- [x] Auth callback strategy documented.

## Flow Coverage Checklist

- [x] Landing -> auth -> dashboard flow documented and verified.
- [ ] Dashboard task CRUD flow documented and verified.
- [ ] Overview analytics flow documented and verified.
- [ ] WhatsApp onboarding flow documented and verified.
- [ ] Transitional reminders / AI helper decisions documented and verified.

## Definition Of Done By Area

### Layout done when

- Every page uses a shared layout.
- No duplicated shell header remains.
- Mobile and desktop nav are consistent.

### Styling done when

- Color, spacing, blur, and component surfaces clearly match the Next.js reference.
- Light/dark behavior exists where the reference provides it.

### Page parity done when

- Layout order, primary CTA placement, key assets, and interaction entry points match the reference.
- Remaining differences are documented as explicit deferred gaps.

### Routing done when

- In-scope routes, aliases, redirects, and deferred routes are all documented and implemented consistently.
- No page is reachable in a way that contradicts the planned product architecture.

### Migration done when

- Vue frontend behaves as a refactored equivalent of the Next.js frontend for all in-scope routes.
- Extra Vue-only UX has been removed or isolated with documented justification.
- Route parity and flow coverage have both been explicitly verified.
