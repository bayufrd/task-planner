# Architecture Overview - Smart Task Planner Mobile

## High Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile Client                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Expo Go   │  │   Android   │  │         iOS             │ │
│  │   (Dev)     │  │    APK      │  │        IPA              │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                    React Native Layer                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │   Screens   │  │  Components │  │     Services     │  │  │
│  │  │  (expo-router) │ │  (UI Kit)  │  │  (API, Notif)   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  │                              │                            │  │
│  │  ┌───────────────────────────┴───────────────────────┐  │  │
│  │  │                 State Management                  │  │  │
│  │  │   Zustand (Global)    │    React Query (Server)  │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend Server                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Express.js │  │    MySQL    │  │      9Router AI         │ │
│  │   REST API  │  │   Database  │  │      (AI Proxy)         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Expo SDK | 54 | Mobile development |
| Runtime | React Native | 0.76+ | UI rendering |
| Language | TypeScript | 5.x | Type safety |
| Routing | Expo Router | 4.x | File-based navigation |
| State (Global) | Zustand | 5.x | Auth, UI state |
| State (Server) | React Query | 5.x | API caching |
| Styling | NativeWind | 3.x | Tailwind for mobile |
| HTTP Client | Axios | 1.x | API requests |
| Icons | Lucide React | Latest | Icon system |
| Navigation | Expo Router | 4.x | Tab + Stack nav |

## Folder Structure

```
pemrograman-mobile/
├── src/
│   ├── app/                          # Expo Router pages
│   │   ├── _layout.tsx                # Root layout (providers)
│   │   ├── index.tsx                 # Redirect/splash
│   │   ├── (auth)/                   # Auth screens
│   │   │   └── login.tsx             # Login page
│   │   └── (main)/                   # Protected screens
│   │       ├── _layout.tsx           # Main stack layout
│   │       ├── new-task.tsx          # Create/edit task
│   │       └── (tabs)/               # Tab navigation
│   │           ├── _layout.tsx       # Tab bar config
│   │           ├── dashboard.tsx     # Home tab
│   │           ├── overview.tsx     # Stats tab
│   │           └── profile.tsx       # Profile tab
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── ConfirmationModal.tsx    # Delete/Done confirm
│   │   ├── SuccessModal.tsx         # Success feedback
│   │   ├── TaskDetailModal.tsx      # Task details view
│   │   ├── Turnstile.tsx            # Captcha widget
│   │   └── WebViewAuth.tsx          # OAuth webview
│   │
│   ├── services/                     # API services
│   │   ├── api.ts                   # Axios instance + interceptors
│   │   ├── auth.service.ts          # Auth API calls
│   │   └── task.service.ts         # Task CRUD operations
│   │
│   ├── store/                        # Zustand stores
│   │   └── auth.store.ts            # User auth state
│   │
│   ├── notifications/               # Push notification handling
│   │   └── notification.service.ts # Notification setup
│   │
│   ├── types/                      # TypeScript interfaces
│   │   └── index.ts                # User, Task, TaskStats types
│   │
│   └── utils/                      # Utility functions
│       └── priority.ts             # Priority score calculation
│
├── assets/                          # Static assets
│   ├── icon.png                     # App icon
│   ├── splash-icon.png              # Splash screen
│   └── 1.webp - 10.webp            # Onboarding images
│
├── docs/                           # Documentation
│   ├── 00-ERD.md                   # Entity relationships
│   ├── 01-app-design.md            # UI/UX design
│   ├── 02-architecture.md          # System architecture
│   ├── 03-features.md              # Feature specs
│   ├── 04-api.md                   # API documentation
│   ├── 05-database.md              # DB schema
│   ├── 06-components.md            # Component library
│   ├── 07-state.md                 # State management
│   ├── 08-navigation.md            # Navigation setup
│   ├── 09-deployment.md            # Build & deploy
│   ├── 10-troubleshooting.md       # Common issues
│   └── CHANGELOG.md                # Version history
│
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── babel.config.js                # Babel config
└── tailwind.config.js             # Tailwind config
```

## Data Flow

### Authentication Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User   │────▶│ LoginScreen │────▶│ auth.service│────▶│    API      │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                         │
                                                         ▼
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ WebView │◀────│ Google OAuth│◀────│   Backend   │◀────│  Auth Store │
│  Auth   │     │  Callback   │     │   (JWT)     │     │  (Zustand)  │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Task Creation Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User   │────▶│ NewTaskScreen│───▶│  taskService │────▶│    API      │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                      │                                         │
                      ▼                                         ▼
              ┌─────────────┐                           ┌─────────────┐
              │  React Query │◀─────────────────────────│   Success   │
              │  Mutation    │                           │   Modal     │
              └─────────────┘                           └─────────────┘
                      │
                      ▼
              ┌─────────────┐     ┌─────────────┐
              │ Invalidate │────▶│  Dashboard  │
              │  tasks     │     │  Refetch    │
              └─────────────┘     └─────────────┘
```

### State Management Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Query Cache                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  tasks   │  │ taskStats│  │ dailyStats│ │weeklyStats│       │
│  │  (5min) │  │  (2min) │  │  (10min) │  │  (30min) │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Zustand Global Stores                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                       Auth Store                          │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │  │
│  │  │  user   │  │  token  │  │ isAuth  │  │  initAuth   │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Service Layer Pattern

```typescript
// services/task.service.ts
export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },
  // ... other methods
};
```

### 2. React Query for Server State

```typescript
// In components
const { data, isLoading, refetch } = useQuery({
  queryKey: ['tasks'],
  queryFn: taskService.getTasks,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 3. Zustand for Global State

```typescript
// store/auth.store.ts
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: () => !!get().token,
    }),
    { name: 'auth-storage' }
  )
);
```

### 4. File-Based Routing

```
app/
├── (auth)/
│   └── login.tsx          → /login
├── (main)/
│   ├── new-task.tsx       → /new-task
│   └── (tabs)/
│       ├── dashboard.tsx  → /
│       ├── overview.tsx   → /overview
│       └── profile.tsx    → /profile
```
