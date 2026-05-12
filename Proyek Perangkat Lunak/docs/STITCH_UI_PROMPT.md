# Google Stitch UI Prompt — Smart Task Planner

Use this prompt in Google Stitch to generate UI concepts for Smart Task Planner.

---

## Context

Smart Task Planner is an AI-powered universal task management web app for students, freelancers, and professionals. The product helps users capture, prioritize, filter, and complete tasks quickly using an automatic 4-factor priority algorithm:

- Urgency / deadline proximity: 40%
- Priority / importance: 35%
- Reminder signal: 15%
- Estimated duration: 10%

The app includes task CRUD, command palette with natural-language task input, dark/light mode, responsive layout, calendar timeline, priority ranking, filtering, and future Google Calendar sync.

Production domain:

```text
https://taskplanner.dastrevas.com
```

---

## Main Prompt

Design a modern, professional, responsive dashboard UI for **Smart Task Planner**, an AI-powered task management web application.

Create a polished SaaS-style interface for students, freelancers, and professionals who need intelligent task scheduling and automatic priority ranking.

The UI must include:

1. **Dashboard overview**
   - Today summary cards
   - Total tasks, completed tasks, urgent tasks, and upcoming deadlines
   - Clear productivity-focused hierarchy

2. **AI priority task list**
   - Ranked task cards based on urgency, importance, reminders, and duration
   - Priority badges: High, Medium, Low
   - Deadline, estimated duration, tags, and completion status
   - Quick actions for complete, edit, delete, and reschedule

3. **Command palette / chat command input**
   - Prominent `Ctrl+K` command trigger
   - Chat-style input for natural language commands
   - Example placeholder: `Add "Finish proposal" tomorrow at 10 AM priority high`

4. **Calendar timeline**
   - Weekly or multi-day task distribution
   - Visual deadline markers
   - Google Calendar sync status area

5. **Filtering and organization**
   - Filters for tags, date, priority, and completion status
   - Search field
   - Compact but readable layout

6. **Theme support**
   - Dark and light mode variants
   - Professional contrast and accessible colors
   - Persistent theme toggle in header

7. **Responsive behavior**
   - Desktop dashboard layout
   - Tablet-friendly two-column layout
   - Mobile-first stacked layout with bottom navigation or compact header

---

## Visual Direction

Style the UI as a clean productivity SaaS dashboard:

- Modern, minimal, and focused
- Rounded cards
- Subtle shadows
- Soft gradients
- Clear spacing
- Accessible typography
- Professional blue, indigo, violet, and emerald accents
- Avoid clutter and overly playful visuals

Suggested design mood:

```text
Notion productivity clarity + Linear polish + Google Calendar familiarity + AI assistant command experience
```

---

## Key Screens to Generate

Generate these screens as separate UI concepts:

1. **Landing / public homepage**
   - Hero section
   - Product value proposition
   - Feature highlights
   - CTA to sign in with Google
   - Preview of dashboard and command palette

2. **Authenticated dashboard**
   - Header with user profile and theme toggle
   - Summary cards
   - Priority task list
   - Calendar timeline
   - Command palette entry point

3. **Task creation modal**
   - Task title
   - Description
   - Deadline
   - Priority
   - Duration estimate
   - Reminder
   - Tags
   - Save/cancel actions

4. **Command palette**
   - Centered modal
   - Natural language input
   - Suggested commands
   - Recent actions
   - Keyboard shortcut hints

5. **Mobile dashboard**
   - Compact task list
   - Priority badges
   - Quick add button
   - Bottom navigation
   - Calendar preview

---

## Copy Guidelines

Use concise product copy:

- `Plan smarter. Finish faster.`
- `AI-ranked tasks based on urgency, priority, reminders, and duration.`
- `Press Ctrl+K to add tasks naturally.`
- `Sync deadlines with Google Calendar.`
- `Focus on what matters next.`

---

## Output Requirements

The generated UI should be suitable for implementation with:

- Next.js 14 App Router
- React 18
- TypeScript
- TailwindCSS
- Zustand
- NextAuth.js
- Prisma / MySQL
- Google Calendar API

Keep the design accessible, responsive, and production-ready for:

```text
taskplanner.dastrevas.com
```
