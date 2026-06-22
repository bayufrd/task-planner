# TaskPlanner VueJS Frontend - Architecture Analysis

## Overview
This document provides a comprehensive architectural analysis of the TaskPlanner VueJS Frontend application. The analysis covers tech stack, routing, state management, API endpoints, component structure, and key design patterns.

## Tech Stack Analysis

### Core Technologies
- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript (strict mode with type safety)
- **Build Tool:** Vite (modern development server)
- **Styling:** Tailwind CSS (utility-first CSS framework)
- **Testing:** Playwright (end-to-end testing)

### Key Dependencies

#### Runtime Dependencies
- `vue` ^3.5.34 - Core Vue framework
- `pinia` ^2.2.0 - State management
- `vue-router` ^4.5.1 - Client-side routing
- `axios` ^1.7.0 - HTTP client
- `@lucide/vue` ^1.16.0 - Icon library
- `chart.js` ^4.5.1 - Data visualization
- `vue-chartjs` ^5.3.3 - Vue integration for charts

#### Development Dependencies
- `@vitejs/plugin-vue` ^6.0.6 - Vue plugin for Vite
- `vue-tsc` ^3.2.8 - TypeScript compiler for Vue
- `tailwindcss` ^3.4.0 - CSS framework
- `@playwright/test` ^1.60.0 - E2E testing framework
- `typescript` ~6.0.2 - TypeScript compiler

## Routing Configuration

### Router Setup
**File:** [`src/router/index.ts`](src/router/index.ts)

**Key Features:**
- Uses `createWebHistory` for clean URLs
- Centralized route registry via [`src/router/registry.ts`](src/router/registry.ts)
- Route guarding with meta fields
- Automatic scroll behavior reset

### Route Categories
1. **Public Routes** (`meta: routeMeta.public`)
   - `/` - Landing page

2. **Auth Routes** (`meta: routeMeta.auth`)
   - `/auth/signin` - Login page
   - `/auth/signup` - Registration page
   - `/auth/callback` - OAuth callback handling

3. **Protected Routes** (`meta: routeMeta.protected`)
   - `/dashboard` - Main dashboard
   - `/overview` - Task overview and analytics
   - `/connectwhatsapp` - WhatsApp integration setup

4. **Deferred Routes** (`meta: routeMeta.deferred`)
   - `/reminders` - Reminders management
   - `/ai-assistant` - AI assistant interface

### Navigation Guards
- **Authentication Guard:** Prevents unauthorized access to protected routes
- **Guest Guard:** Redirects authenticated users away from auth pages
- **Auto-fetch User:** Automatically fetches user profile on route navigation when token exists

## State Management (Pinia Stores)

### 1. Auth Store (`src/stores/auth.ts`)
**Purpose:** Manages authentication state and user session

**State Properties:**
- `token`: JWT access token
- `refreshToken`: Refresh token for token rotation
- `user`: User profile object
- `isAuthenticated`: Computed authentication status

**Actions:**
- `login(payload)`: Handle user login
- `logout()`: Handle user logout (both local and server)
- `logoutLocal()`: Clear local session only
- `refreshSession()`: Refresh access token
- `fetchMe()`: Fetch current user profile
- `setTokens()`: Store tokens in localStorage

### 2. App Store (`src/stores/app.ts`)
**Purpose:** Manages global application state

**State Properties:**
- `sidebarOpen`: Sidebar visibility state
- `theme`: Application theme (light/dark)
- `language`: Current UI language

### 3. UI Store (`src/stores/ui.ts`)
**Purpose:** Manages UI-specific state

**State Properties:**
- `notification`: Global notification messages
- `loading`: Loading state indicators
- `modal`: Active modal information

## API Service Layer

### Service Architecture
**File:** [`src/services/api.ts`](src/services/api.ts)

**Key Features:**
- Centralized API configuration with environment variables
- Automatic token injection for authenticated requests
- Token refresh mechanism on 401 responses
- Response unwrapping for consistent data structure
- Error handling with user-friendly messages

### API Categories

#### 1. Authentication API (`authApi`)
- `register(payload)` - User registration
- `login(payload)` - User login
- `refresh(refreshToken)` - Token refresh
- `me()` - Get current user profile
- `logout()` - User logout

#### 2. Task API (`taskApi`)
- `list(params)` - List tasks with filtering
- `create(payload)` - Create new task
- `update(id, payload)` - Update task
- `updateStatus(id, status)` - Update task status
- `complete(id)` - Mark task as complete
- `skip(id)` - Skip task
- `remove(id)` - Delete task
- `stats()` - Get task statistics
- `dailyStats(days)` - Get daily statistics
- `weeklyStats(weeks)` - Get weekly statistics
- `byPriority(level)` - Get tasks by priority level

#### 3. Planner API (`plannerApi`)
- `today(limit)` - Get today's planner items

#### 4. Reminder API (`reminderApi`)
- `list()` - List reminders
- `create(payload)` - Create reminder
- `update(id, payload)` - Update reminder
- `remove(id)` - Delete reminder

#### 5. AI API (`aiApi`)
- `parseTask(text)` - Parse natural language into task
- `overviewAnalysis()` - Generate overview analysis

### GET Endpoints Summary
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/me` | GET | Get current user profile |
| `/api/tasks` | GET | List tasks with optional filters |
| `/api/tasks/stats` | GET | Get task statistics |
| `/api/tasks/stats/daily` | GET | Get daily task statistics |
| `/api/tasks/stats/weekly` | GET | Get weekly task statistics |
| `/api/tasks/priority/{level}` | GET | Get tasks by priority level |
| `/api/planner/today` | GET | Get today's planner items |
| `/api/reminders` | GET | List all reminders |

## Component Architecture

### Page Components
**Location:** `src/views/`

1. **`DashboardPage.vue`** - Main dashboard with task overview
2. **`LandingPage.vue`** - Public landing page
3. **`LoginPage.vue`** - Authentication page (handles both login/signup)
4. **`RemindersPage.vue`** - Reminders management interface
5. **`AiAssistantPage.vue`** - AI assistant interaction
6. **`OverviewPage.vue`** - Task overview and analytics
7. **`ConnectWhatsappPage.vue`** - WhatsApp integration setup
8. **`AuthCallbackPage.vue`** - OAuth callback handling

### Layout Components
**Location:** `src/layouts/`

1. **`AuthLayout.vue`** - Layout for authentication pages
2. **`ProtectedLayout.vue`** - Layout for protected routes
3. **`PublicLayout.vue`** - Layout for public pages

### Reusable Components
**Location:** `src/components/`

1. **`AppHeader.vue`** - Application header with navigation
2. **`CommandPalette.vue`** - Global command palette
3. **`StatsCards.vue`** - Statistics display cards
4. **`TaskCharts.vue`** - Task visualization charts
5. **`TaskForm.vue`** - Task creation/editing form
6. **`TaskTable.vue`** - Task display table
7. **`GoogleLoginButton.vue`** - Google OAuth button

## Type System

### Type Definitions
**File:** [`src/types/index.ts`](src/types/index.ts)

**Key Type Categories:**
1. **Task Types:** `Task`, `TaskPriority`, `TaskStatus`
2. **Auth Types:** `AuthResult`, `LoginPayload`, `RegisterPayload`, `UserProfile`
3. **API Types:** `ApiEnvelope`, `PaginatedResponse`
4. **Analytics Types:** `TaskStats`, `DailyStatsItem`, `WeeklyStatsItem`
5. **AI Types:** `ParsedTaskDraft`, `OverviewAnalysis`

## Configuration Files

### Build Configuration
1. **`vite.config.ts`** - Vite build configuration
2. **`tsconfig.json`** - TypeScript compiler configuration
3. **`tsconfig.app.json`** - Application-specific TypeScript config
4. **`tsconfig.node.json`** - Node-specific TypeScript config

### Styling Configuration
1. **`tailwind.config.js`** - Tailwind CSS configuration
2. **`postcss.config.js`** - PostCSS configuration
3. **`src/style.css`** - Global CSS styles

### Environment Configuration
1. **`.env.example`** - Environment variable template
2. **`.env`** - Local environment variables

## Testing Strategy

### End-to-End Testing
- **Framework:** Playwright
- **Configuration:** `playwright.config.ts`
- **Test Files:** `tests/app.spec.ts`
- **Test Results:** Stored in `test-results/`

### Key Test Scenarios
1. Application loads landing page
2. Task creation and management
3. AI parsing functionality
4. Authentication flows

## Asset Management

### Public Assets
**Location:** `public/`
- **Icons:** Favicon sets, app icons
- **Images:** Hero images, background graphics
- **Videos:** Promotional and instructional videos
- **Leveling Images:** Achievement level images

### Source Assets
**Location:** `src/assets/`
- **Styles:** `tailwind.css` - Tailwind utilities
- **Images:** Brand logos and hero images

## Project Structure

```
TaskPlanner-VueJS-Frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Source assets
│   ├── components/           # Reusable components
│   │   ├── auth/            # Authentication components
│   │   └── ...              # Other component categories
│   ├── layouts/             # Layout components
│   ├── router/              # Routing configuration
│   ├── services/            # API services
│   ├── stores/              # Pinia stores
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   ├── views/               # Page components
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   └── style.css            # Global styles
├── tests/                   # E2E tests
├── docs/                    # Documentation
├── package.json            # Dependencies
└── vite.config.ts          # Build configuration
```

## Design Patterns and Best Practices

### 1. Composition API
- Uses Vue 3 Composition API with `<script setup>` syntax
- Logic separation with composable functions
- TypeScript integration for type safety

### 2. Centralized State Management
- Pinia stores for cross-component state
- Clear separation of concerns between stores
- Reactive state with computed properties

### 3. API Abstraction
- Service layer abstraction for API calls
- Consistent error handling
- Automatic token management

### 4. Route Guards
- Meta-based route protection
- Automatic authentication state management
- Clean redirect handling

### 5. Component Composition
- Reusable base components
- Layout components for consistent structure
- Props-based component configuration

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# E2E testing
npm run test:e2e

# E2E testing with UI
npm run test:e2e:ui
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080/api
# Other environment-specific variables
```

## Integration Points

### Backend Integration
- **Base URL:** Configurable via `VITE_API_BASE_URL`
- **Authentication:** JWT-based authentication with refresh tokens
- **Data Format:** JSON API with consistent envelope structure

### External Services
- **Google OAuth:** Authentication via Google
- **WhatsApp:** Integration for notifications
- **AI Services:** Natural language task parsing

## Security Considerations

1. **Token Storage:** Secure token storage in localStorage with refresh mechanism
2. **XSS Protection:** Vue's built-in XSS protection for template rendering
3. **CORS:** Backend configured for proper CORS headers
4. **Input Validation:** Both client-side and server-side validation
5. **Error Handling:** User-friendly error messages without exposing sensitive data

## Performance Optimizations

1. **Code Splitting:** Route-based code splitting
2. **Tree Shaking:** Vite's built-in tree shaking
3. **Asset Optimization:** Image and video optimization in public directory
4. **Lazy Loading:** Component lazy loading for deferred routes

## Future Considerations

1. **PWA Support:** Potential for Progressive Web App features
2. **Offline Capability:** Service workers for offline functionality
3. **Internationalization:** Multi-language support
4. **Accessibility:** Enhanced screen reader support
5. **Analytics Integration:** User behavior tracking

---

*Last Updated: June 22, 2026*  
*Analysis Generated from Codebase Exploration*