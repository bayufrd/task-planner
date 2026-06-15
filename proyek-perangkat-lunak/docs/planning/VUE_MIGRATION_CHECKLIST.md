# Vue Migration Checklist

## Master Execution Checklist

### Phase 0 - Audit lock

- [ ] Confirm Next.js reference commit or snapshot used as migration baseline.
- [ ] Confirm Vue target branch for migration execution.
- [ ] Confirm agent will not preserve Vue-specific UX if it conflicts with Next.js parity.
- [ ] Confirm required assets from `proyek-perangkat-lunak/public` are available to Vue target.
- [ ] Confirm route naming strategy for auth aliases versus parity paths.
- [ ] Confirm canonical in-scope route list and deferred route list.

### Phase 1 - Inventory and dependency mapping

- [ ] Inventory all public pages in Next.js.
- [ ] Inventory all auth pages in Next.js.
- [ ] Inventory all protected pages in Next.js.
- [ ] Inventory all shared components used by those pages.
- [ ] Inventory all provider-driven UI behaviors in Next.js.
- [ ] Inventory all Vue pages/components that can be reused safely.
- [ ] Inventory backend/API assumptions in Vue that may constrain parity.
- [ ] Document every missing route in Vue.
- [ ] Document every extra route in Vue.
- [ ] Document every end-to-end frontend flow that must survive migration.
- [ ] Document starter/demo artifacts in Vue that should be removed.

### Phase 2 - Structural normalization in Vue

- [ ] Create shared public layout.
- [ ] Create shared auth layout.
- [ ] Create shared protected layout.
- [ ] Move duplicated header logic out of individual pages.
- [ ] Introduce global UI state for theme.
- [ ] Introduce global UI state for language.
- [ ] Introduce global UI state for command palette.
- [ ] Introduce global UI state for profile dropdown/mobile nav behavior.
- [ ] Normalize route guards around new layout boundaries.
- [ ] Create route registry or parity matrix used by all implementation work.

### Phase 3 - Styling system alignment

- [ ] Define shared design tokens matching Next.js colors, radii, shadows, spacing, and blur surfaces.
- [ ] Normalize typography scale to match Next.js hierarchy.
- [ ] Normalize button variants to match Next.js primary, secondary, ghost, and danger states.
- [ ] Normalize card/surface variants to match Next.js glass and panel patterns.
- [ ] Normalize icon sizing and spacing.
- [ ] Port critical assets from Next.js public folder.
- [ ] Add light/dark theme support.
- [ ] Validate mobile-safe footer/tab spacing.

### Phase 4 - Public and auth parity

- [ ] Rebuild landing header to match Next.js.
- [ ] Rebuild landing hero section to match Next.js.
- [ ] Rebuild landing feature sections to match Next.js content order.
- [ ] Rebuild landing CTA/footer sections to match Next.js.
- [ ] Rebuild sign-in page structure to match Next.js.
- [ ] Rebuild sign-up page structure to match Next.js.
- [ ] Define and implement auth callback route behavior if needed.
- [ ] Reintroduce CAPTCHA placeholder or integration plan if backend parity is not ready.
- [ ] Remove Vue-only auth footnotes and mismatched copy.

### Phase 5 - Protected shell parity

- [ ] Rebuild protected header with logo, command entry, theme toggle, language toggle, and profile trigger.
- [ ] Rebuild desktop profile dropdown.
- [ ] Rebuild mobile bottom navigation.
- [ ] Add command palette mounting layer.
- [ ] Add shell-level loading and redirect handling.
- [ ] Align route availability with reference navigation.
- [ ] Validate protected route redirects against canonical route matrix.

### Phase 6 - Dashboard parity

- [ ] Align dashboard page frame with sticky header layout.
- [ ] Align new task CTA styling and placement.
- [ ] Align calendar/timeline section hierarchy.
- [ ] Align stat strip surfaces and labels.
- [ ] Align hero image/media section.
- [ ] Align empty state design and messaging.
- [ ] Align task list/card presentation.
- [ ] Align create/edit modal UX.
- [ ] Align refresh behavior after mutations.
- [ ] Evaluate whether planner panel remains, moves, or is absorbed into reference structure.

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
- [ ] Remove Vue-only route explanations and footnotes.
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

- [ ] Canonical public route list documented.
- [ ] Canonical auth route list documented.
- [ ] Canonical protected route list documented.
- [ ] Deferred routes documented.
- [ ] Extra Vue routes documented with disposition.
- [ ] Alias routes documented.
- [ ] Auth callback strategy documented.

## Flow Coverage Checklist

- [ ] Landing -> auth -> dashboard flow documented and verified.
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
