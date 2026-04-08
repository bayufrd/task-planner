# Architecture & Design Decisions

## 🏗️ Architecture Overview

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 14 App Router           │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────────┐   │
│  │    React Components (TSX)      │   │
│  │  - Header                      │   │
│  │  - CalendarTimeline            │   │
│  │  - TaskPriorityList            │   │
│  │  - CommandPalette              │   │
│  └────────────────────────────────┘   │
│                  ▲                     │
│                  │ (uses)              │
│  ┌────────────────────────────────┐   │
│  │   Zustand State Management     │   │
│  │  - tasks[]                     │   │
│  │  - selectedDate                │   │
│  │  - filters                     │   │
│  └────────────────────────────────┘   │
│                  ▲                     │
│                  │ (uses)              │
│  ┌────────────────────────────────┐   │
│  │  Utility Functions             │   │
│  │  - priorityScheduling.ts       │   │
│  │  - dateUtils.ts                │   │
│  │  - taskUtils.ts                │   │
│  └────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│        TailwindCSS + Dark Mode          │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Input (Command Palette)
    ↓
Parse Natural Language
    ↓
Create Task Object
    ↓
Add to Zustand Store
    ↓
Component Re-renders
    ↓
Calculate Priority Scores (priorityScheduling.ts)
    ↓
Display in TaskPriorityList
```

## 📊 State Management Strategy

### Using Zustand

**Why Zustand?**
- Lightweight (no Redux boilerplate)
- Built-in persist middleware
- Great TypeScript support
- Easy to understand

**State Structure:**
```typescript
{
  tasks: Task[]              // All tasks
  selectedDate: Date         // Currently selected date
  searchQuery: string        // Search input
  filterPriority: string     // Filter by priority
}
```

**Actions:**
- `addTask()` - Create new task
- `updateTask()` - Modify existing task
- `deleteTask()` - Remove task
- `setSelectedDate()` - Change date
- `getTodayTasks()` - Get today's tasks
- `getUpcomingTasks()` - Get tasks for next 7 days

## 🤖 Priority Scheduling Algorithm

### Scoring Formula

```
Final Score = (U × 0.4) + (P × 0.35) + (R × 0.15) + (D × 0.1)

Where:
U = Urgency Score (deadline proximity)
P = Priority Score (user-set priority)
R = Reminder Score (reminder urgency)
D = Duration Score (task length)
```

### Score Ranges

- **Urgency (0-100)**
  - < 0 days (overdue): 100
  - 0 days (today): 95
  - 1 day (tomorrow): 85
  - 2-3 days: 70
  - 4-7 days: 50
  - 8-14 days: 30
  - > 14 days: 10

- **Priority (0-100)**
  - HIGH: 90
  - MEDIUM: 60
  - LOW: 30

- **Reminder (0-100)**
  - 0 hours: 100
  - 1 hour: 95
  - 3 hours: 80
  - 6 hours: 60
  - 12 hours: 40
  - 24 hours: 20
  - > 24 hours: 5

- **Duration (0-100)**
  - ≤ 15 min: 80
  - ≤ 30 min: 70
  - ≤ 60 min: 60
  - ≤ 2 hours: 50
  - ≤ 4 hours: 35
  - > 4 hours: 20

### Example Calculation

Task: "Project Review" due today at 3pm, HIGH priority, 90 min duration, reminder 1 hour before

```
U = 95 (today)
P = 90 (high priority)
R = 95 (1 hour reminder)
D = 50 (90 minutes)

Score = (95 × 0.4) + (90 × 0.35) + (95 × 0.15) + (50 × 0.1)
       = 38 + 31.5 + 14.25 + 5
       = 88.75
```

Result: **Very high priority (88.75/100)** - Do immediately!

## 💾 Database Schema

### Entities

**User**
- Manages user data and settings
- Links to tasks and reminders
- Stores theme preference
- Tracks Google Calendar sync status

**Task**
- Core entity for task management
- Linked to user and tags
- Has deadline, priority, status
- Tracks Google Calendar integration

**TaskTag**
- Categorization/labeling system
- Many-to-many relationship with tasks
- Searchable and filterable

**Reminder**
- Scheduled notifications
- Linked to tasks
- Tracks sent status

**Calendar**
- Support for multiple calendars
- Google Calendar integration ready
- User-defined calendar types

### Relationships

```
User (1) ──────────── (Many) Task
  │                        │
  │                        └─── (Many) TaskTag
  │                        │
  │                        └─── (Many) Reminder
  │
  └──────────────────────────── (Many) Calendar
```

## 🎨 UI/UX Design Decisions

### Layout Structure

**Why this layout?**

```
┌─────────────────────────────────────┐
│         HEADER (Sticky)             │  - Navigation & theme toggle
├─────────────────────────────────────┤
│                                     │
│  CALENDAR TIMELINE (Flex-shrink)    │  - Quick date navigation
│  (doesn't grow/shrink much)         │  - Visual task overview
├─────────────────────────────────────┤
│                                     │
│  TASK LIST (Flex-grow)              │  - Main content area
│  (scrollable)                       │  - Prioritized task display
│                                     │
├─────────────────────────────────────┤
│  COMMAND PALETTE (Fixed Bottom)     │  - Always accessible
│  (modal-like)                       │  - ChatGPT-style input
└─────────────────────────────────────┘
```

**Why?**
- Follows modern SaaS design (Discord, Slack style)
- Command palette is always accessible (Ctrl+K)
- Calendar is always visible (context)
- Task list is the main focus area
- Mobile-responsive with hamburger menu

### Dark Mode Implementation

- Uses CSS `dark:` classes from TailwindCSS
- Theme stored in `localStorage`
- Respects system preference on first load
- Context provider for global theme state

### Color Scheme

- **Primary Blue**: Main actions, highlights
- **Green**: Complete, success, low priority
- **Yellow/Orange**: Medium priority, warnings
- **Red**: High priority, urgent, delete actions

## 🔐 Security Considerations

### Current State (MVP)
- Client-side only storage (Zustand + localStorage)
- No authentication required
- No database persistence yet

### When Adding Backend

1. **Authentication**
   - Use NextAuth.js for OAuth
   - Validate all API requests
   - Implement CSRF protection

2. **Database**
   - Use Prisma for ORM (SQL injection safe)
   - Validate all inputs
   - Implement rate limiting

3. **API Security**
   - API key authentication
   - CORS configuration
   - Request validation

## 🚀 Performance Optimizations

### Current
- Component lazy loading ready
- TailwindCSS purges unused CSS
- Next.js automatic code splitting

### Future
- Add Image optimization
- Implement virtual scrolling for large task lists
- Database query optimization with Prisma
- Caching strategies

## 🧪 Testing Strategy

### Recommended Testing Libraries

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

### Test Coverage Plan

1. **Unit Tests**
   - Priority scheduling algorithm
   - Date utilities
   - Task validation

2. **Integration Tests**
   - Component rendering with state
   - Command palette parsing
   - Store actions

3. **E2E Tests**
   - User workflows (create → update → complete task)
   - Command palette usage
   - Calendar navigation

---

**Document Version**: 1.0  
**Last Updated**: April 2026
