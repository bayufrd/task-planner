# State Management - Smart Task Planner Mobile

## Overview

The app uses a dual state management approach:
- **Zustand** for global client state (auth, UI)
- **React Query (TanStack Query)** for server state (tasks, stats)

## Zustand - Global State

### Auth Store

```typescript
// src/store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: () => boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      isAuthenticated: () => !!get().token,

      setAuth: (token: string, user: User) => {
        set({ token, user });
      },

      clearAuth: () => {
        set({ token: null, user: null });
      },

      initAuth: () => {
        // Called on app start to restore auth state
        // Zustand persist handles this automatically
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Usage in Components

```tsx
// Accessing state
const user = useAuthStore((state) => state.user);
const token = useAuthStore((state) => state.token);

// Actions
const setAuth = useAuthStore((state) => state.setAuth);
const clearAuth = useAuthStore((state) => state.clearAuth);

// Check auth status
const isAuth = useAuthStore((state) => state.isAuthenticated());
```

## React Query - Server State

### Configuration

```typescript
// src/app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,     // 10 minutes (formerly cacheTime)
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Keys

```typescript
const QUERY_KEYS = {
  tasks: ['tasks'],
  task: (id: string) => ['tasks', id],
  taskStats: ['taskStats'],
  dailyStats: (days: number) => ['dailyStats', days],
  weeklyStats: (weeks: number) => ['weeklyStats', weeks],
};
```

### Task Queries

```typescript
// Fetch all tasks
const { data: tasks, isLoading, refetch } = useQuery({
  queryKey: QUERY_KEYS.tasks,
  queryFn: taskService.getTasks,
  staleTime: 5 * 60 * 1000,
});

// Fetch single task
const { data: task } = useQuery({
  queryKey: QUERY_KEYS.task(taskId),
  queryFn: () => taskService.getTask(taskId),
  enabled: !!taskId,
});

// Fetch stats
const { data: stats } = useQuery({
  queryKey: QUERY_KEYS.taskStats,
  queryFn: taskService.getStats,
  staleTime: 2 * 60 * 1000,
});
```

### Task Mutations

```typescript
// Create task
const createMutation = useMutation({
  mutationFn: (data: Partial<Task>) => taskService.createTask(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.taskStats });
  },
});

// Update task
const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
    taskService.updateTask(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.taskStats });
  },
});

// Update status
const statusMutation = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    taskService.updateTaskStatus(id, status),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.taskStats });
  },
});

// Delete task
const deleteMutation = useMutation({
  mutationFn: (id: string) => taskService.deleteTask(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.taskStats });
  },
});
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT FLOW                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     ZUSTAND (Client State)                     │ │
│  │                                                                 │ │
│  │   ┌─────────┐    ┌─────────┐    ┌─────────────────────────┐  │ │
│  │   │  User   │    │  Token  │    │    initAuth()           │  │ │
│  │   │ Profile │    │  JWT    │    │    setAuth()            │  │ │
│  │   └─────────┘    └─────────┘    │    clearAuth()          │  │ │
│  │       │              │           └─────────────────────────┘  │ │
│  │       │              │                                      │ │
│  │       └──────┬───────┘                                      │ │
│  │              ▼                                               │ │
│  │      ┌──────────────┐                                       │ │
│  │      │ AsyncStorage │ (Persisted)                            │ │
│  │      │ @auth-token  │                                       │ │
│  │      └──────────────┘                                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                  REACT QUERY (Server State)                     │ │
│  │                                                                 │ │
│  │   ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐     │ │
│  │   │   tasks[]   │   │ taskStats   │   │ dailyStats[]    │     │ │
│  │   │  (5 min)   │   │  (2 min)   │   │   (10 min)     │     │ │
│  │   └─────────────┘   └─────────────┘   └─────────────────┘     │ │
│  │          │                 │                    │               │ │
│  │          └────────┬────────┴────────┬──────────┘               │ │
│  │                   ▼                 ▼                           │ │
│  │           ┌────────────────────────────────┐                   │ │
│  │           │        API Response            │                   │ │
│  │           │   (Cached in QueryClient)     │                   │ │
│  │           └────────────────────────────────┘                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                         AXIOS INSTANCE                          │ │
│  │                                                                 │ │
│  │   Request Interceptor: Add Authorization header                 │ │
│  │   Response Interceptor: Handle 401 → clearAuth()                 │ │
│  │                                                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## State Synchronization

### Login Flow
```
User submits credentials
    ↓
API call → Get token + user
    ↓
setAuth(token, user) → Zustand store
    ↓
Navigate to Dashboard
    ↓
React Query fetches tasks with token
```

### Logout Flow
```
User taps Logout
    ↓
clearAuth() → Zustand store (clears token + user)
    ↓
Navigate to Login
    ↓
React Query cache cleared
```

### Task Update Flow
```
User completes task
    ↓
statusMutation.mutate({ id, status: 'DONE' })
    ↓
API call → Update task
    ↓
onSuccess: invalidateQueries(['tasks'], ['taskStats'])
    ↓
React Query refetches → UI updates
```

## Best Practices

1. **Use selectors** to avoid unnecessary re-renders
2. **Invalidate related queries** on mutations
3. **Set appropriate stale times** based on data volatility
4. **Handle errors** in mutation callbacks
5. **Use optimistic updates** for better UX (optional)
6. **Persist auth state** but not server data
