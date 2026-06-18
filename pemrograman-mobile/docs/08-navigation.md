# Navigation Structure - Smart Task Planner Mobile

## Overview

Uses **Expo Router** for file-based routing with a hybrid navigation pattern:
- **Stack Navigator**: Auth ↔ Main flow
- **Tab Navigator**: Main app screens

## Navigation Hierarchy

```
Root Stack
│
├── (Auth Stack)
│   └── login.tsx                    → /login
│
└── (Main Stack)
    │
    ├── (Tabs)
    │   ├── dashboard.tsx            → /
    │   ├── overview.tsx             → /overview
    │   └── profile.tsx              → /profile
    │
    └── new-task.tsx                 → /new-task
```

## File Structure

```
src/app/
├── _layout.tsx                    # Root layout (QueryClient, Auth check)
├── index.tsx                       # Entry point (redirect logic)
│
├── (auth)/                         # Auth group (unauthenticated)
│   └── login.tsx                   # /login
│
└── (main)/                         # Main group (authenticated)
    ├── _layout.tsx                 # Main stack layout
    ├── new-task.tsx               # /new-task
    │
    └── (tabs)/                     # Tab group
        ├── _layout.tsx             # Tab bar config
        ├── dashboard.tsx           # / (Home)
        ├── overview.tsx            # /overview
        └── profile.tsx            # /profile
```

## Layout Components

### Root Layout (`_layout.tsx`)

```tsx
// src/app/_layout.tsx
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

const queryClient = new QueryClient();

export default function RootLayout() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(main)" />
      </Stack>
    </QueryClientProvider>
  );
}
```

### Main Layout (`(main)/_layout.tsx`)

```tsx
// src/app/(main)/_layout.tsx
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="new-task" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  );
}
```

### Tab Layout (`(tabs)/_layout.tsx`)

```tsx
// src/app/(main)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { LayoutDashboard, BarChart3, User } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <LayoutDashboard color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color }) => (
            <BarChart3 color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    paddingTop: 8,
    paddingBottom: 25,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
});
```

## Screen Routing

### Index (Entry Point)

```tsx
// src/app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/auth.store";

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(main)/(tabs)/dashboard");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  return null;
}
```

### Login Screen

```tsx
// src/app/(auth)/login.tsx
import { useRouter } from "expo-router";
import WebViewAuth from "../../components/WebViewAuth";

export default function LoginScreen() {
  const router = useRouter();
  
  const handleSuccess = async (token: string, user: any) => {
    useAuthStore.getState().setAuth(token, user);
    router.replace("/(main)/(tabs)/dashboard");
  };

  return (
    <WebViewAuth
      onSuccess={handleSuccess}
      onError={(error) => Alert.alert("Error", error)}
    />
  );
}
```

### Dashboard Screen

```tsx
// src/app/(main)/(tabs)/dashboard.tsx
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();

  // Navigate to create task
  const handleAddTask = () => {
    router.push("/(main)/new-task");
  };

  // Navigate to edit task
  const handleEditTask = (taskId: string) => {
    router.push({ pathname: "/(main)/new-task", params: { taskId } });
  };
}
```

### New Task Screen

```tsx
// src/app/(main)/new-task.tsx
import { useLocalSearchParams, useRouter } from "expo-router";

export default function NewTaskScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const taskId = params.taskId as string | undefined;
  const isEditMode = !!taskId;

  // After successful save
  const handleSuccess = () => {
    router.back();
  };
}
```

## Navigation Methods

| Method | Usage | Description |
|--------|-------|-------------|
| `router.push()` | `router.push("/(main)/new-task")` | Navigate forward |
| `router.replace()` | `router.replace("/login")` | Replace current screen |
| `router.back()` | `router.back()` | Go back |
| `router.canGoBack()` | `router.canGoBack()` | Check if can go back |
| `useLocalSearchParams()` | `params.taskId` | Get URL params |

## Deep Linking

### Configuration (app.json)

```json
{
  "expo": {
    "scheme": "smarttaskplanner",
    "plugins": [
      [
        "expo-router",
        {
          "root": "./src/app"
        }
      ]
    ]
  }
}
```

### URL Schemes
- `smarttaskplanner://` - Custom scheme
- `https://taskplanner.dastrevas.com/` - Universal links

### Supported Routes
| Path | Screen | Params |
|------|--------|--------|
| `/` | Dashboard | - |
| `/overview` | Overview | - |
| `/profile` | Profile | - |
| `/new-task` | Create Task | - |
| `/new-task?taskId=xxx` | Edit Task | taskId |

## Tab Bar Styling

```typescript
const tabBarStyle = {
  height: 85,              // Safe area aware
  paddingTop: 8,
  paddingBottom: 25,      // Home indicator space
  backgroundColor: "#ffffff",
  borderTopWidth: 1,
  borderTopColor: "#e5e7eb",
};

const tabLabelStyle = {
  fontSize: 11,
  fontWeight: "500" as const,
};
```

## Presentation Modes

| Mode | Usage | Animation |
|------|-------|-----------|
| `card` | Default stack screens | Slide horizontal |
| `modal` | New task creation | Slide from bottom |
| `transparentModal` | Confirmation dialogs | Fade |
| `fullScreenModal` | Full screen takeover | Slide |

### Modal Configuration

```tsx
<Stack.Screen 
  name="new-task"
  options={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
    gestureEnabled: true,
  }}
/>
```
