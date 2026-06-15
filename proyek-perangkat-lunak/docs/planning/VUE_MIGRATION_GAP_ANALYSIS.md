# Vue Migration Gap Analysis

## Compared Projects

- Reference: `proyek-perangkat-lunak`
- Target: `pemrograman-basis-data/TaskPlanner-VueJS-Frontend`

## 1. Route And Page Mapping

| Next.js reference | Vue target | Status | Decision |
| --- | --- | --- | --- |
| `/` landing | `/` landing | Partial | Rebuild to match exact Next.js content order, visuals, media, copy density, theme/language affordances, and CTA behavior. |
| `/auth/signin` | `/login` | Partial | Keep temporary route alias if needed, but build parity page modeled after Next.js sign-in. |
| `/auth/signup` | `/register` | Partial | Keep temporary route alias if needed, but build parity page modeled after Next.js sign-up. |
| `/dashboard` | `/dashboard` | Partial | Needs layout-shell parity, command palette entry, hero section parity, richer empty state, and task interaction alignment. |
| `/overview` | `/overview` | Partial | Functionally closer than other pages, but still structurally and visually divergent. |
| `/connectwhatsapp` | none | Missing | Add as priority gap. |
| protected shell | simple `AppHeader` | Missing | Rebuild as foundational shared layout. |
| command palette | none | Missing | Add as shared protected interaction layer. |
| theme toggle | none | Missing | Add in shared shell. |
| language toggle | none | Missing | Add or stub for parity-ready rollout. |
| Google OAuth auth path | none | Missing | Mark as deferred parity gap unless backend is extended. |
| reminders route not prominent in reference shell | `/reminders` | Extra | Re-scope, redesign, or defer. |
| standalone AI helper route not central in reference shell | `/ai-assistant` | Extra/Transitional | Keep only as temporary bridge unless re-integrated into parity UX. |

## 2. Layout And Navigation Differences

### Next.js

- Public, auth, and protected experiences are segmented by route groups and shared layouts.
- Protected shell owns header, user controls, mobile navigation, profile menu, theme, language, and command palette.
- Public/auth pages use consistent translucent header language and shared branding.

### Vue

- Repeats headers directly inside pages.
- Protected nav is simpler and lacks command palette, theme, language, and profile menu richness.
- Mobile/public navigation is page-specific instead of shell-driven.

### Action

- Introduce Vue layouts as the first structural refactor before page-by-page parity.

## 3. Styling And Visual System Differences

### Next.js reference characteristics

- Tailwind-based gradients and frosted-glass surfaces.
- Consistent logo framing and hero asset placement.
- Sticky headers and layered content sections.
- Strong empty-state illustrations and premium card styling.
- Dark/light theme support.
- Mixed English/Indonesian language support.

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

## 4. Component Gap Mapping

| Reference component/domain | Vue equivalent | Gap |
| --- | --- | --- |
| protected `Header` with command, theme, language, profile | `AppHeader` | Major missing behavior and structure. |
| `CommandPalette` | none | Fully missing. |
| `CalendarTimeline` | dashboard calendar block | Partial parity only; structure and behavior differ. |
| `TaskPriorityList` / task modal flow | `TaskTable`, `TaskForm`, modal section | Simplified and not visually equivalent. |
| `NewTaskModal` / `EditTaskModal` / `TaskModal` | inline modal wrapper in dashboard | Needs redesign to match reference composition. |
| `CollectionSlider` and rich landing sections | none | Missing. |
| `TurnstileWidget` | none | Missing on auth pages. |
| overview hero/animal/analysis surfaces | overview page | Partial; order and presentation differ. |
| WhatsApp connect experience | none | Missing. |

## 5. State Management Differences

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
- Add separate UI store or composables for theme, language, profile menu, and command palette.
- Avoid mixing shell state into page-level components.

## 6. Authentication Differences

### Next.js reference

- Email/password auth.
- Google OAuth through NextAuth.
- CAPTCHA/Turnstile support on auth forms.
- Token synchronization between NextAuth and backend.

### Vue target

- Email/password + refresh token only.
- No Google OAuth.
- No CAPTCHA.

### Decision

- Immediate goal: visual and route parity for auth pages.
- Deferred goal: functional Google OAuth parity.
- CAPTCHA should be treated as a likely parity requirement if supported by backend path later.

## 7. Data Flow And API Differences

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

## 8. Extra Vue Features Or Structures To Remove/Simplify

- Footer/resource links that expose protected routes from public pages without reference justification.
- "Vue version" explanatory footnotes in login/register pages.
- Standalone reminders CRUD page if not reintroduced as a designed product surface.
- Standalone AI helper page if command palette and inline AI task creation become the reference-aligned flow.
- Any chart implementation chosen only because it already exists, if the layout story diverges from Next.js.

## 9. Priority Missing Features From Next.js

### P0 foundational gaps

- Protected layout shell parity.
- Theme toggle.
- Language toggle.
- Command palette foundation.
- `/connectwhatsapp` page.
- Shared public/auth layout parity.

### P1 page parity gaps

- Landing hero/media/content sequence parity.
- Sign-in/sign-up exact surface parity.
- Dashboard composition parity.
- Overview sequence and visual polish parity.

### P2 functional parity gaps

- CAPTCHA support.
- Google OAuth parity.
- Notification/snackbar parity.
- Task event synchronization patterns.

## 10. Recommended Implementation Order To Minimize Rework

1. Shared styling tokens and asset normalization.
2. Vue layout refactor for public/auth/protected shells.
3. Global UI state for theme/language/profile/command palette.
4. Auth page parity.
5. Landing page parity.
6. Protected navigation shell parity.
7. Dashboard parity.
8. Overview parity.
9. WhatsApp page implementation.
10. Re-scope reminders and AI helper based on final parity decisions.
11. QA and cleanup of extra Vue-specific behavior.
