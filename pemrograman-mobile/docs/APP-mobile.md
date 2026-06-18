# Smart Task Planner - Mobile App Documentation

Complete technical documentation for the Smart Task Planner mobile application.

## Documentation Index

### Getting Started
- **[CHANGELOG](CHANGELOG.md)** - Version history and release notes

### Architecture & Design
- **[00-ERD](00-ERD.md)** - Entity Relationship Diagram and data models
- **[01-app-design](01-app-design.md)** - UI/UX design, color palette, typography, wireframes
- **[02-architecture](02-architecture.md)** - System architecture, folder structure, data flow

### Features & Implementation
- **[03-features](03-features.md)** - Feature specifications and user flows
- **[04-api](04-api.md)** - API documentation, endpoints, request/response schemas
- **[05-database](05-database.md)** - Database schema and relationships

### Development
- **[06-components](06-components.md)** - Reusable component library
- **[07-state](07-state.md)** - State management (Zustand + React Query)
- **[08-navigation](08-navigation.md)** - Routing structure and navigation

### Operations
- **[09-deployment](09-deployment.md)** - Build, testing, and deployment guide
- **[10-troubleshooting](10-troubleshooting.md)** - Common issues and solutions

---

## Quick Reference

### Tech Stack
| Component | Technology |
|-----------|------------|
| Framework | Expo SDK 54 |
| UI | React Native |
| Language | TypeScript 5.x |
| Routing | Expo Router 4.x |
| Global State | Zustand 5.x |
| Server State | React Query 5.x |
| Styling | NativeWind 4.x |
| HTTP | Axios 1.x |

### API Base URL
```
https://taskplanner.dastrevas.com/api
```

### Query Keys (React Query)
```typescript
['tasks']        // All tasks
['taskStats']    // Dashboard stats
['dailyStats']   // Daily chart data
['weeklyStats']  // Weekly chart data
```

### Navigation Routes
```
/                   → Dashboard
/overview          → Overview screen
/profile           → Profile screen
/new-task          → Create task
/new-task?taskId=x → Edit task
```

### Task Status Flow
```
PENDING → DONE (complete)
PENDING → SKIPPED (skip)
DONE → PENDING (undo)
SKIPPED → PENDING (reactivate)
```

---

## File Structure

```
pemrograman-mobile/
├── src/
│   ├── app/                    # Expo Router pages
│   ├── components/             # Reusable components
│   ├── services/               # API services
│   ├── store/                  # Zustand stores
│   ├── notifications/           # Push notifications
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utilities
├── docs/                       # This documentation
│   ├── APP-mobile.md           # (this file)
│   ├── 00-ERD.md              # Entity relationships
│   ├── 01-app-design.md        # UI/UX design
│   ├── 02-architecture.md      # System architecture
│   ├── 03-features.md          # Feature specs
│   ├── 04-api.md              # API documentation
│   ├── 05-database.md          # Database schema
│   ├── 06-components.md        # Component library
│   ├── 07-state.md            # State management
│   ├── 08-navigation.md        # Navigation setup
│   ├── 09-deployment.md        # Build & deploy
│   ├── 10-troubleshooting.md    # Common issues
│   └── CHANGELOG.md            # Version history
├── assets/                     # Images & icons
├── app.json                   # Expo configuration
└── package.json               # Dependencies
```

---

## Common Tasks

### Run Development Server
```bash
cd pemrograman-mobile
npx expo start --clear
```

### Build for Production
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### Add New Screen
1. Create file in `src/app/(main)/(tabs)/`
2. Add tab entry in `_layout.tsx`
3. Export default component

### Add New Component
1. Create file in `src/components/`
2. Define TypeScript props interface
3. Export default component
4. Import in parent screen

---

## Support

For issues or questions:
1. Check [troubleshooting guide](10-troubleshooting.md)
2. Review [API documentation](04-api.md)
3. Check Expo Router docs: https://docs.expo.dev/routing/introduction/
