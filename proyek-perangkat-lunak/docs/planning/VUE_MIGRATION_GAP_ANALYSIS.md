# Vue Migration Gap Analysis

## Compared Projects

- Reference: `proyek-perangkat-lunak`
- Target: `pemrograman-basis-data/TaskPlanner-VueJS-Frontend`

## 1. Canonical Route And Flow Matrix

| Route / flow | Next.js reference | Vue target | Status | Decision |
| --- | --- | --- | --- | --- |
| `/` landing | Yes | Yes | Partial | Rebuild to match exact Next.js content order, visuals, media, copy density, theme/language affordances, and CTA behavior. |
| `/auth/signin` | Yes | No exact route | Partial | Add parity route or alias strategy; `/login` can be transitional only. |
| `/auth/signup` | Yes | No exact route | Partial | Add parity route or alias strategy; `/register` can be transitional only. |
| `/auth/callback` | Yes | Missing | Missing | Document whether Vue needs a callback route or can handle auth return another way; do not leave undefined. |
| `/dashboard` | Yes | Yes | Partial | Needs layout-shell parity, command palette entry, hero section parity, richer empty state, and task interaction alignment. |
| `/overview` | Yes | Yes | Partial | Functionally closer than other pages, but still structurally and visually divergent. |
| `/connectwhatsapp` | Yes | No | Missing | Add as priority gap. |
| protected shell | Shared layout | Simple `AppHeader` | Missing | Rebuild as foundational shared layout. |
| command palette | Yes | No | Missing | Add as shared protected interaction layer. |
| theme toggle | Yes | No | Missing | Add in shared shell. |
| language toggle | Yes | No | Missing | Add or stub for parity-ready rollout. |
| Google OAuth auth path | Yes | No | Missing | Mark as deferred parity gap unless backend is extended. |
| reminders route | Not a primary protected route in current reference | Yes | Extra | Re-scope, redesign, or defer. |
| standalone AI helper route | Not a primary protected route in current reference | Yes | Extra/Transitional | Keep only as temporary bridge unless re-integrated into parity UX. |

## 2. End-To-End Frontend Flow Coverage

### Flow A - public discovery to authentication

```text
Landing -> Sign in / Sign up -> Auth submit or Google OAuth -> Callback / redirect -> Dashboard
```

Coverage result:

- Next.js: covered.
- Vue: partially covered; callback route, Google OAuth, Turnstile, and route naming parity are missing.

### Flow B - protected task execution

```text
Protected shell -> Dashboard -> Create/Edit task -> Complete/Skip/Delete -> Refresh -> Continue planning
```

Coverage result:

- Next.js: covered through protected layout, task modal flow, and event-driven refresh.
- Vue: partially covered; data operations exist, but shell and interaction richness are missing.

### Flow C - productivity review

```text
Protected shell -> Overview -> AI score -> Charts -> Advice -> Refresh
```

Coverage result:

- Next.js: covered.
- Vue: partially covered; page exists but sequence, shell, and design parity remain incomplete.

### Flow D - WhatsApp onboarding

```text
Protected shell -> Connect WhatsApp -> QR / deep link -> Bot guidance -> WhatsApp launch
```

Coverage result:

- Next.js: covered.
- Vue: missing entirely.

### Flow E - transitional utility flows

```text
Reminders CRUD
Standalone AI helper
```

Coverage result:

- Present in Vue but not confirmed as parity-grade routes.
- Must be explicitly classified as deferred, transitional, or removable.

## 3. Layout And Navigation Differences

### Next.js

- Public, auth, and protected experiences are segmented by route groups and shared layouts.
- Protected shell owns header, user controls, mobile navigation, profile menu, theme, language, and command palette.
- Public/auth pages use consistent translucent header language and shared branding.
- Root layout mounts providers for snackbar, language, theme, command palette, and auth session.

### Vue

- Repeats headers directly inside pages.
- Protected nav is simpler and lacks command palette, theme, language, and profile menu richness.
- Mobile/public navigation is page-specific instead of shell-driven.
- Top-level app shell only detects auth layout class and does not provide route-group-equivalent structure.

### Action

- Introduce Vue layouts as the first structural refactor before page-by-page parity.
- Add a route registry to keep aliases, canonical routes, and deferred routes consistent across all docs and implementation.

## 4. Styling And Visual System Differences

### Next.js reference characteristics

- Tailwind-based gradients and frosted-glass surfaces.
- Consistent logo framing and hero asset placement.
- Sticky headers and layered content sections.
- Strong empty-state illustrations and premium card styling.
- Dark/light theme support.
- Mixed English/Indonesian language support.
- Rich hero media and public page motion/interaction cues.

### Vue target characteristics

- Custom CSS approximation with simpler spacing and lower component density.
- PNG asset usage where Next.js uses optimized WebP assets.
- No theme system.
- No language system.
- Public/auth pages resemble the reference direction, but not precise enough.

### Action

- Build a parity styling token set from the Next.js visual system.
- Reuse matching assets from Next.js `public` where possible.
- Normalize icon sizing, border radius, shadow behavior, and section rhythm.
- Add screenshot-based parity review for every in-scope route.

## 5. Component Gap Mapping

| Reference component/domain | Vue equivalent | Gap |
| --- | --- | --- |
| protected `Header` with command, theme, language, profile | `AppHeader` | Major missing behavior and structure. |
| `CommandPalette` | none | Fully missing. |
| `CalendarTimeline` | dashboard calendar block | Partial parity only; structure and behavior differ. |
| `TaskPriorityList` / task modal flow | `TaskTable`, `TaskForm`, modal section | Simplified and not visually equivalent. |
| `NewTaskModal` / `EditTaskModal` / `TaskModal` | inline modal wrapper in dashboard | Needs redesign to match reference composition. |
| `CollectionSlider` and richer public sections | none | Missing. |
| `TurnstileWidget` | none | Missing on auth pages. |
| overview hero/animal/analysis surfaces | overview page | Partial; order and presentation differ. |
| WhatsApp connect experience | none | Missing. |
| auth callback handling page | none | Missing or undefined in Vue target. |
| provider stack | no Vue equivalent | Missing shell/state orchestration layer. |
| starter/demo product leftovers | `HelloWorld.vue` | Extra and removable. |

## 6. State Management Differences

### Next.js

- Zustand-style task state plus provider-based UI state.
- Separate providers for theme, language, snackbar, auth session, command palette.
- Event-driven refresh with `tasks:changed` in protected flows.

### Vue

- `reactive` singleton stores for app and auth.
- No dedicated UI/global interaction store for shell state.
- Good enough for data fetching, but not for parity-level shell coordination.

### Action

- Preserve existing auth/app data store logic where possible.
- Add separate UI store or composables for theme, language, profile menu, command palette, and shell loading behavior.
- Avoid mixing shell state into page-level components.

## 7. Authentication Differences

### Next.js reference

- Email/password auth.
- Google OAuth through NextAuth.
- CAPTCHA/Turnstile support on auth forms.
- Token synchronization between NextAuth and backend.
- Callback route for token bridge.

### Vue target

- Email/password + refresh token only.
- No Google OAuth.
- No CAPTCHA.
- No callback route.

### Decision

- Immediate goal: visual and route parity for auth pages.
- Deferred goal: functional Google OAuth parity.
- CAPTCHA should be treated as a likely parity requirement if supported by backend path later.
- Callback route behavior must be explicitly decided, not left implicit.

## 8. Data Flow And API Differences

### Next.js frontend behavior

- Talks to Express backend routes shaped around auth, tasks, stats, AI, calendar, reminders, and WhatsApp integrations.
- Some frontend behavior expects hybrid auth and provider-based context.

### Vue target behavior

- Talks to Java backend with `auth`, `tasks`, `planner`, `reminders`, and `ai` endpoints.
- Has solid API wrapper with refresh retry logic.

### Decision

- Keep Vue API layer intact where it can support reference UX.
- Adapt UI behavior to current backend instead of rewriting backend integration during the planning phase.
- Track any backend mismatch as execution risk, not as a reason to preserve mismatched UX.

## 9. Extra Vue Features Or Structures To Remove/Simplify

- Footer/resource links that expose protected routes from public pages without reference justification.
- "Vue version" explanatory footnotes in login/register pages.
- Standalone reminders CRUD page if not reintroduced as a designed product surface.
- Standalone AI helper page if command palette and inline AI task creation become the reference-aligned flow.
- Any chart implementation chosen only because it already exists, if the layout story diverges from Next.js.
- Starter/demo product leftovers such as `HelloWorld.vue` and unused default assets.

## 10. Priority Missing Features From Next.js

### P0 foundational gaps

- Protected layout shell parity.
- Theme toggle.
- Language toggle.
- Command palette foundation.
- `/connectwhatsapp` page.
- Shared public/auth layout parity.
- Callback route decision.

### P1 page parity gaps

- Landing hero/media/content sequence parity.
- Sign-in/sign-up exact surface parity.
- Dashboard composition parity.
- Overview sequence and visual polish parity.
- Public and protected route naming/alias consistency.

### P2 functional parity gaps

- CAPTCHA support.
- Google OAuth parity.
- Notification/snackbar parity.
- Task event synchronization patterns.

## 11. Recommended Implementation Order To Minimize Rework

1. Shared styling tokens and asset normalization.
2. Vue layout refactor for public/auth/protected shells.
3. Global UI state for theme/language/profile/command palette.
4. Canonical route registry and alias plan.
5. Auth page parity.
6. Landing page parity.
7. Protected navigation shell parity.
8. Dashboard parity.
9. Overview parity.
10. WhatsApp page implementation.
11. Re-scope reminders and AI helper based on final parity decisions.
12. QA and cleanup of extra Vue-specific behavior.
