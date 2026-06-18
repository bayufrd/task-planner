# Changelog - Smart Task Planner Mobile

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-18

### Added
- **Task Detail Modal** - Full task view with Edit/Done/Delete actions
  - Displays title, description, status, priority, deadline, time, duration, difficulty, tags
  - Bottom sheet presentation for easy thumb access
- **Dashboard Task List** - Card tap opens detail modal instead of direct edit
- **Success Modal** - Confirmation after task operations
- **Confirmation Modal** - Delete/Done confirmation dialogs
- **WebView Authentication** - Google OAuth integration
- **Task Detail Modal** - Complete task view with all metadata
- **Expo SDK 54** - Mobile framework upgrade

### Changed
- **Dashboard** - Task cards now open detail modal on tap
- **New Task Screen** - Fixed mutation reference (`createTaskMutation` → `taskMutation`)
- **API Configuration** - Points to production backend
- **CORS Configuration** - Updated for Expo Go compatibility

### Fixed
- `ReferenceError: Property 'createTaskMutation' doesn't exist` in new-task.tsx

### Documentation Added
- Complete 12-section documentation structure
- ERD, App Design, Architecture, Features, API, Database, Components, State, Navigation, Deployment, Troubleshooting guides

---

## [0.1.0] - 2025-06-15

### Added
- **Expo Router Setup** - File-based routing implementation
- **Tab Navigation** - Home, Overview, Profile tabs
- **Zustand Auth Store** - Persistent authentication state
- **React Query Integration** - Server state management
- **NativeWind Styling** - Tailwind CSS for mobile
- **Task CRUD Operations** - Create, read, update, delete tasks
- **Calendar Dashboard** - Monthly calendar with task indicators
- **Statistics Display** - Pending, done, skipped counts
- **New Task Flow** - 7-step wizard (title → description → date → time → priority → duration → review)
- **Overview Screen** - Gamification levels and charts
- **Profile Screen** - User info and logout

### Screens
- Login screen with WebView auth
- Dashboard with calendar and task list
- New Task creation wizard
- Overview with statistics and AI insights
- Profile with user settings

### Components
- ConfirmationModal
- SuccessModal
- TaskDetailModal
- Turnstile (Captcha)
- WebViewAuth

### Services
- api.ts (Axios instance)
- auth.service.ts
- task.service.ts
- notification.service.ts

---

## Technology Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Expo SDK | 54 | Mobile framework |
| React Native | 0.76+ | UI runtime |
| TypeScript | 5.x | Type safety |
| Expo Router | 4.x | File-based routing |
| Zustand | 5.x | State management |
| React Query | 5.x | Server state |
| NativeWind | 3.x | Styling |
| Axios | 1.x | HTTP client |
| Lucide React | Latest | Icons |

---

## Migration Notes

### From v0.1.0 to v1.0.0

1. **Task Card Tap Behavior Changed**
   - Before: Navigates directly to edit screen
   - After: Opens detail modal first

2. **New Required Component**
   - TaskDetailModal.tsx must be imported in dashboard

3. **API Response Format**
   - Backend must return `{ success: true, data: ... }` format

---

## Upcoming Features

- [ ] Push notifications (local)
- [ ] Offline mode with sync
- [ ] Widget support
- [ ] Dark mode
- [ ] Task categories/projects
- [ ] Recurring tasks
- [ ] Calendar sync (Google Calendar)
- [ ] WhatsApp reminders integration

---

## Dependencies Timeline

```
v0.1.0 (Initial)
├── expo@~52
├── react-native@0.76
├── expo-router@~4
├── zustand@^5.0
├── @tanstack/react-query@^5.0
├── nativewind@^4.0
├── lucide-react-native@latest
└── axios@^1.7

v1.0.0 (Current)
├── expo@~54
├── react-native@0.76+
├── expo-router@~4
├── zustand@^5.0
├── @tanstack/react-query@^5.0
├── nativewind@^4.0
├── lucide-react-native@latest
└── axios@^1.7
```

---

## Credits

- Expo Team for mobile framework
- React Native for UI runtime
- Tailwind CSS for styling system
- Lucide for icons
- Dastrevas for project development
