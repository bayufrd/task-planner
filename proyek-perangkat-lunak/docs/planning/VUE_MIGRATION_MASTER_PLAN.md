# Vue Migration Master Plan

## Objective

Migrate the frontend experience from the Next.js application in `proyek-perangkat-lunak` into the Vue application in `pemrograman-basis-data/TaskPlanner-VueJS-Frontend` with the Next.js app as the single source of truth for layout, visual design, UX flow, interaction patterns, page structure, and feature scope.

This migration is **not** a loose adaptation. The target Vue result must mirror the Next.js app as closely as possible unless a Vue-side feature is extra, inconsistent, or blocks parity. In those cases, the Vue implementation should be removed, simplified, or refactored.

## Source Of Truth Hierarchy

1. `proyek-perangkat-lunak/src/app` for route flow and page-level UX.
2. `proyek-perangkat-lunak/src/components` for reusable UI behavior and composition.
3. `proyek-perangkat-lunak/src/components/providers` and `proyek-perangkat-lunak/src/lib` for state, auth bridging, notifications, language, and theme behavior.
4. `proyek-perangkat-lunak/public` for assets and visual references.
5. `pemrograman-basis-data/TaskPlanner-VueJS-Frontend` only as the delivery target, not the design authority.

## Confirmed Frontend Route Inventory

### Next.js reference routes

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | client landing variant | Large hero, theme toggle, language toggle, sign-in CTA. |
| `/(public)` -> `/` | public landing variant | Public-layout version with fixed header and Google sign-in CTA. |
| `/auth/signin` | sign-in page | Email/password, Google OAuth, Turnstile, callback support. |
| `/auth/signup` | sign-up page | Email/password, Google OAuth, Turnstile, callback support. |
| `/auth/callback` | auth token bridge | Stores token and routes to dashboard. |
| `/dashboard` | protected task workspace | Main task workflow. |
| `/overview` | protected analytics page | Stats, AI score, animal level, charts. |
| `/connectwhatsapp` | protected WhatsApp onboarding | QR, deep link, bot usage help. |

### Vue target routes

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | landing | Partial visual adaptation only. |
| `/login` | sign-in | No Google OAuth, no Turnstile, no callback route. |
| `/register` | sign-up | No Google OAuth, no Turnstile, no callback route. |
| `/dashboard` | task workspace | Simplified protected experience. |
| `/overview` | analytics | Partial parity only. |
| `/reminders` | reminders CRUD | Extra relative to current reference shell. |
| `/ai-assistant` | AI helper page | Transitional/extra relative to reference flow. |

## Migration Principles

- Match Next.js page anatomy before polishing Vue internals.
- Preserve visual parity over keeping old Vue patterns.
- Prefer structural refactor in Vue rather than patching around incompatible architecture.
- Remove Vue-only features that do not exist in Next.js or that distort parity.
- Delay backend-specific optimization until route, layout, and component parity are stable.
- Treat auth, layout shell, navigation, task flow, and styling system as foundational dependencies.
- Validate every route decision against the confirmed route inventory above.

## Current Application Snapshot

### Next.js reference app

- Uses App Router with clear split between public pages, auth pages, and protected pages.
- Uses Tailwind-heavy styling with gradients, translucent surfaces, sticky headers, hero media, and polished empty states.
- Supports theme toggle, language toggle, NextAuth Google OAuth, email/password auth, command palette, overview analytics, AI parsing, and WhatsApp connection flow.
- Protected layout centralizes header, profile menu, language/theme controls, command palette, and mobile bottom navigation.
- UX is richer and more consistent than the current Vue app.

### Current Vue target app

- Uses Vue Router with direct per-page composition and a simpler reactive store approach.
- Mimics selected parts of the public/auth/dashboard UI but still diverges in structure, copy, navigation, component density, and protected shell behavior.
- Uses JWT + refresh token auth only, with no Google OAuth, no theme system, no language system, no command palette, and no WhatsApp flow.
- Includes some pages absent in the Next.js protected navigation design, but most of them are simplified and not parity-grade.
- Has custom CSS-driven visuals rather than a reusable parity-oriented design system.

## End-To-End Frontend Flow Coverage

### Flow 1: first-time visitor to authenticated workspace

```text
Landing -> Sign in / Sign up -> Auth success -> Protected shell bootstrap -> Dashboard
```

Required parity checkpoints:

- landing header, hero, CTA, feature sections, pricing/stat section, final CTA, footer
- auth routing and callback handling
- protected redirect behavior when unauthenticated
- post-auth navigation landing on dashboard

### Flow 2: authenticated daily task management

```text
Protected shell -> Dashboard -> Open task creation -> Create/Edit/Complete/Skip/Delete -> Refresh stats and task surfaces
```

Required parity checkpoints:

- shared protected header and mobile nav
- command entry presence
- dashboard sticky topbar and visual hierarchy
- calendar/timeline overview
- stat strip
- hero media
- empty state vs populated task state
- modal-based task editing flow

### Flow 3: authenticated productivity review

```text
Protected shell -> Overview -> Load stats -> Load AI analysis -> Read charts/advice -> Refresh
```

Required parity checkpoints:

- same route availability from shared shell
- stats cards and AI score story order
- animal-level visual block
- charts and advice grouped in the same narrative order

### Flow 4: authenticated WhatsApp onboarding

```text
Protected shell -> Connect WhatsApp -> View QR/deep link -> Read bot guidance -> Open WhatsApp
```

Required parity checkpoints:

- route exists in Vue
- page sits inside protected shell
- copy and instructional surfaces mirror reference intent

### Flow 5: transitional or optional flows

```text
Auth callback
Google OAuth
Standalone AI helper
Reminders management
```

Required planning decision:

- either align to the reference product architecture,
- or explicitly mark as deferred/transitional/extra.

## High-Level Gap Summary

### Must keep from Next.js

- Public landing information architecture and hero hierarchy.
- Auth visual language and page flow.
- Protected shell pattern with shared header, profile actions, theme/language affordances, and mobile nav behavior.
- Dashboard composition: sticky header, timeline/calendar emphasis, stat strip, hero media, empty state, task list, modal-driven create/edit flow, and command-entry mental model.
- Overview analytics storytelling, animal-level visual system, and AI analysis presentation.
- Connect WhatsApp flow.
- Auth callback handling as a planned route decision even if implementation is deferred.

### Must remove or de-emphasize from current Vue app

- Vue-specific simplified reminders CRUD page if it remains detached from Next.js information architecture.
- Vue-only copy that frames the app as a separate "Vue version".
- Simplified navigation that exposes routes/features without matching Next.js shell expectations.
- Standalone AI helper page as currently implemented if Next.js behavior remains command-palette-first and not standalone-page-first.
- CSS patterns that cannot faithfully reproduce Next.js surfaces, spacing, gradients, and interaction details.
- Legacy scaffold leftovers such as `HelloWorld.vue` and unused starter assets if they are not part of the migration target.

### Must be rebuilt in Vue

- Global app shell and route grouping strategy.
- Styling token system mapped to the Next.js visual language.
- Theme support, language support, and profile/menu behavior.
- Protected-page navigation and command palette interaction model.
- Auth pages with parity-grade layout and controls.
- WhatsApp connection route and integration surface.
- Route-level parity matrix validation before execution sign-off.

## Domain-Based Migration Plan

### 1. Layout and shell

Refactor Vue to introduce route-group-equivalent layouts:

- Public layout
- Auth layout
- Protected layout

The protected layout must own:

- header/logo/navigation
- theme toggle
- language toggle
- profile menu
- mobile tab bar
- command palette mounting point
- auth gate handling
- route-consistent shell loading behavior

### 2. Navigation and routing

Re-map Vue routes to match Next.js route intent:

- `/`
- auth routes equivalent to `/auth/signin` and `/auth/signup` even if Vue keeps `/login` and `/register` aliases during transition
- `/dashboard`
- `/overview`
- `/connectwhatsapp`
- callback decision for `/auth/callback`

Additional routes such as `/reminders` and `/ai-assistant` should be retained only if they are explicitly re-homed into the Next.js-equivalent information architecture or confirmed as temporary implementation routes.

### 3. Styling system

Adopt a parity-oriented design layer in Vue:

- shared color tokens
- shared surface styles
- typography scale matching reference
- spacing scale aligned to Next.js layouts
- motion conventions for hover, blur, gradient, and reveal details
- asset mapping from Next.js `public` folder

### 4. Authentication

Vue currently uses email/password JWT with refresh token flow. Next.js uses hybrid auth with NextAuth + backend token sync.

Target decision:

- Keep Vue on backend token auth for now.
- Recreate only the visible UX and shell behavior first.
- Mark Google OAuth as a later-phase parity gap unless backend support is added to Vue target.
- Ensure route protection, user identity display, logout flow, and callback strategy visually mirror Next.js.

### 5. Task flow

Rebuild task flow to match the Next.js dashboard mental model:

- create/edit through modal
- stronger empty state
- richer task cards/list behavior
- status actions aligned to reference
- command-first entry points where possible
- consistent stat refresh after mutations

### 6. Analytics and overview

Vue overview should preserve existing backend compatibility, but its structure must be aligned to the Next.js overview page order:

- header and refresh affordance
- core stat cards
- AI productivity score
- animal-level hero
- insight list
- supporting chart surfaces
- reference imagery and spacing

### 7. AI and assistant interactions

The Vue standalone AI helper page is functionally useful but not reference-led. It should be treated as one of the following:

- temporary bridge page while command palette and inline AI-assisted task creation are rebuilt, or
- removable page if parity requires AI interaction to move into shared task creation flows.

### 8. Reminders

Current Vue reminders page is utility-driven and not parity-aligned. Unless the Next.js product surface explicitly requires it as a first-class page, it should be downgraded in priority, redesigned into the protected shell language, or folded into task-level flows later.

## Structural Refactor Recommendations For Vue

### Required refactor

- Replace page-local duplicated headers with shared layout components.
- Replace monolithic CSS approach with domain-scoped styling primitives or a tokenized shared stylesheet.
- Introduce `layouts`, `composables`, `modules`, and `shared` separation in Vue.
- Separate public/auth/protected route trees.
- Add a UI state layer for theme, language, command palette, and profile menu.
- Introduce a route registry or parity matrix used by implementation agents.

### Recommended target folder direction

```text
src/
  app/
    router/
    providers/
    layouts/
  modules/
    auth/
    dashboard/
    overview/
    tasks/
    whatsapp/
    reminders/
    ai/
  shared/
    components/
    ui/
    assets/
    utils/
    styles/
  stores/
  services/
```

This does not need to be implemented immediately, but the migration roadmap should move toward it to avoid repeated rework.

## Scope Decisions

### Keep

- Existing Vue API service integration shape where compatible.
- Existing refresh-token handling in Vue auth store.
- Existing chart/data fetching logic if it can be restyled and reorganized without behavioral regressions.

### Remove

- Copy stating "Vue version uses email/password authentication only" once migration starts.
- Any route or component kept solely because it already exists in Vue, but not because it serves Next.js parity.
- Utility-first CRUD screens that bypass the reference UX.
- Starter/demo components not part of the product surface.

### Replace

- Vue `AppHeader` with a shell modeled after the Next.js protected header and profile dropdown.
- Vue public/auth headers with layout-owned equivalents.
- Vue task list/card patterns with Next.js-inspired task surfaces.
- Vue route naming and page grouping where they block parity.
- Vue top-level `App.vue` shell behavior with layout-aware route architecture.

### Build later after foundation

- Google OAuth parity
- full command palette feature parity
- full language toggle parity if translation catalog is not ready in first pass
- exact backend parity for WhatsApp and calendar-specific features where Vue backend differs
- callback-route parity if auth implementation sequencing delays it

## Deliverables Expected From Execution Phase

- Shared migration tracker documents kept current.
- Vue route/layout refactor foundation.
- Page-by-page parity implementation against Next.js source.
- Removal of extra Vue-only UX paths that conflict with the reference app.
- Final parity QA pass with screenshot and interaction verification.
- Explicit route parity verification before closing the migration.
