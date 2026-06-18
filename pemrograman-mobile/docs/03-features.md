# Features Specification - Smart Task Planner Mobile

## Feature Overview

### Core Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Authentication | Login/Register with email or Google OAuth | P0 |
| Dashboard | Calendar view, task list, statistics | P0 |
| Task Management | Create, Read, Update, Delete tasks | P0 |
| Task Detail | Full task view with actions | P0 |
| Overview | Statistics charts and AI insights | P1 |
| Profile | User settings and logout | P2 |

## Feature Specifications

### 1. Authentication

#### Login Flow
```
User opens app
    ↓
Check stored token (Zustand persist)
    ↓
[Token exists] → Validate with API → [Valid] → Dashboard
    ↓                                    [Invalid] → Login
[No Token] → Login Screen
    ↓
User enters credentials OR clicks Google Sign-In
    ↓
API call to /auth/login
    ↓
[Success] → Save token → Dashboard
[Failure] → Show error message
```

#### WebView Authentication
- Uses in-app WebView for OAuth flow
- Handles redirect with token in URL
- Persistent session via AsyncStorage

#### Props
```typescript
interface WebViewAuthProps {
  onSuccess: (token: string, user: User) => void;
  onError: (error: string) => void;
}
```

### 2. Dashboard

#### Calendar Component
- Monthly calendar grid
- Navigation (previous/next month)
- Day selection highlights tasks
- Task dots indicator (max 3 visible)

#### Statistics Bar
- Pending count
- Completed count
- Skipped count
- Progress percentage

#### Task List
- Filtered by selected date
- Shows: title, time, duration, difficulty, tags
- Card tap → Task Detail Modal

#### User Flows
```
Tap date on calendar
    ↓
Update selectedDate state
    ↓
Filter tasks for that date
    ↓
Re-render task list
```

### 3. Task Management

#### Task Creation Flow (NewTaskScreen)
```
Step 1: Title
    ↓
Step 2: Description (optional)
    ↓
Step 3: Date Selection
    ↓
Step 4: Time Selection (select mode or manual HH:MM)
    ↓
Step 5: Priority (HIGH / MEDIUM / LOW)
    ↓
Step 6: Duration (in minutes, presets: 30, 60, 90, 120)
    ↓
Step 7: Review & Confirm
    ↓
API: POST /tasks
    ↓
Show Success Modal
    ↓
Navigate back to Dashboard
```

#### Task Editing Flow
```
Open task from Dashboard (tap card)
    ↓
Show Task Detail Modal
    ↓
Tap Edit button
    ↓
Navigate to /new-task?taskId={id}
    ↓
Pre-fill form with existing data
    ↓
Same step flow as creation
    ↓
API: PATCH /tasks/{id}
    ↓
Navigate back to Dashboard
```

#### Task Actions
| Action | Confirmation | API Call |
|--------|-------------|----------|
| Mark Done | Yes (modal) | PATCH /tasks/{id}/status |
| Delete | Yes (modal) | DELETE /tasks/{id} |
| Edit | No (modal) | Navigate to edit form |

### 4. Task Detail Modal

#### Display Information
- Title
- Status badge (To Do / In Progress / Done)
- Priority (with color)
- Due Date & Time
- Estimated Duration
- Difficulty (if set)
- Tags (horizontal scroll)
- Description (if exists)

#### Action Buttons
| Button | Icon | Color | Action |
|--------|------|-------|--------|
| Edit | Edit3 | Blue | Navigate to edit screen |
| Done | Check | Green | Mark task complete |
| Delete | Trash2 | Red | Delete task (with confirm) |

### 5. Overview Screen

#### Gamification
- Level system based on XP/score
- Animal-themed levels (Fish → Eagle progression)
- Visual progress bar

#### Statistics Display
- Daily task completion chart (last 14 days)
- Weekly completion chart (last 8 weeks)
- Total stats: pending, done, skipped, rate

#### AI Insights
- Fetched from backend endpoint
- Cached in React Query
- Manual refresh available

### 6. Profile Screen

#### Display
- User avatar/name (if available)
- Email display

#### Settings
- Theme toggle (if implemented)
- Logout button

#### Actions
```
Tap Logout
    ↓
Show confirmation
    ↓
Clear Zustand store
    ↓
Navigate to Login
```

## Business Logic

### Priority Score Calculation
```typescript
// Factors
interface PriorityFactors {
  deadline: Date;           // How soon is the deadline
  urgency: number;         // 1-10, user-defined
  importance: number;       // 1-10, user-defined
  estimatedDuration: number; // Minutes
  hasDescription: boolean;   // Extra context
}

// Formula (simplified)
score = (
  (10 - daysUntilDeadline) * 10 +
  urgency * 2 +
  importance * 2 +
  (hasDescription ? 5 : 0)
) / 2.5

// Result: 0-100 score
```

### Status Transitions
```
PENDING → DONE (complete task)
PENDING → SKIPPED (skip task)
DONE → PENDING (undo completion)
SKIPPED → PENDING (reactivate task)
```

### Offline Handling
- Token persisted in AsyncStorage
- Last fetched tasks cached in React Query
- Actions queued for retry when online
- Graceful degradation with cached data

## Error Handling

| Scenario | Response |
|----------|----------|
| Network error | Toast with retry option |
| 401 Unauthorized | Clear auth, redirect to login |
| 404 Not Found | Navigate back, show error |
| 500 Server Error | Show generic error, log details |
| Validation Error | Inline field errors |

## User Feedback

| Action | Feedback |
|--------|----------|
| Task Created | Success modal (auto-close 2s) |
| Task Completed | Success modal |
| Task Deleted | Success modal |
| API Error | Alert with error message |
| Network Offline | Toast notification |
