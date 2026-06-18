# App Design - Smart Task Planner Mobile

## Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#3b82f6` | Primary actions, links, accents |
| Success Green | `#22c55e` | Completed states, success messages |
| Warning Orange | `#f97316` | Warnings, skipped tasks |
| Danger Red | `#ef4444` | Errors, delete actions, high priority |
| Purple | `#8b5cf6` | Time-related elements |
| Amber | `#f59e0b` | Medium priority, duration |
| Slate 50 | `#f8fafc` | Light backgrounds |
| Slate 100 | `#f1f5f9` | Borders, dividers |
| Slate 200 | `#e2e8f0` | Disabled states |
| Slate 400 | `#94a3b8` | Placeholder text |
| Slate 600 | `#475569` | Secondary text |
| Slate 800 | `#1e293b` | Primary text |
| Slate 950 | `#020617` | Dark backgrounds |

### Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 (Header Title) | System | 28px | 700 | 36px |
| H2 (Section Title) | System | 22px | 700 | 28px |
| H3 (Card Title) | System | 18px | 600 | 24px |
| Body | System | 15px | 400 | 22px |
| Body Small | System | 14px | 400 | 20px |
| Caption | System | 12px | 400 | 16px |
| Label | System | 13px | 500 | 18px |
| Button | System | 15px | 600 | 20px |

### Spacing System (8pt Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Small gaps |
| `md` | 12px | Default padding |
| `lg` | 16px | Section padding |
| `xl` | 20px | Card padding |
| `2xl` | 24px | Screen padding |
| `3xl` | 32px | Large sections |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 8px | Small elements |
| `md` | 12px | Buttons, inputs |
| `lg` | 16px | Cards |
| `xl` | 20px | Modals, badges |
| `full` | 9999px | Pills, avatars |

### Shadows

```typescript
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
```

## Screen Designs

### 1. Login Screen

```
┌─────────────────────────────┐
│         Status Bar          │
├─────────────────────────────┤
│                             │
│      [App Logo - 80x80]     │
│                             │
│       Smart Task Planner     │
│                             │
│   ┌─────────────────────┐   │
│   │  📧 Email            │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │  🔒 Password         │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │      Sign In         │   │
│   └─────────────────────┘   │
│                             │
│   ─────── OR ───────        │
│                             │
│   ┌─────────────────────┐   │
│   │  Sign in with Google│   │
│   └─────────────────────┘   │
│                             │
│   Don't have an account?    │
│   [Create Account]          │
│                             │
└─────────────────────────────┘
```

### 2. Dashboard Screen

```
┌─────────────────────────────┐
│         Status Bar          │
├─────────────────────────────┤
│  Tasks              [+ Add] │
│  Wednesday, Jun 18, 2025    │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │  ◀  June 2025  ▶   │    │
│  │  Su Mo Tu We Th Fr Sa│    │
│  │  [Calendar Grid]    │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  📊 Task Statistics │    │
│  │  ─────────────────  │    │
│  │  5 Pending  12 Done │    │
│  │  ████████░░ 75%     │    │
│  └─────────────────────┘    │
│                             │
│  Today's Tasks              │
│  ┌─────────────────────┐    │
│  │ ● Submit Report     │    │
│  │   📅 Today 14:00    │    │
│  │   [Edit] [Done] [🗑]│    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
│ 🏠 Home  │ 📊 Stats │ 👤 Profile │
└─────────────────────────────┘
```

### 3. New Task Screen (Step Flow)

```
┌─────────────────────────────┐
│         Status Bar          │
├─────────────────────────────┤
│  ←  New Task        Step 3/6│
├─────────────────────────────┤
│  ━━━━━━━○━━━━━━━○━━━━━━━   │
│                             │
│        Priority              │
│                             │
│  ┌─────────────────────┐    │
│  │  🔴 HIGH             │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  🟡 MEDIUM (selected)│    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  🟢 LOW             │    │
│  └─────────────────────┘    │
│                             │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │      Continue →      │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### 4. Task Detail Modal

```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│  ╔═══════════════════════╗  │
│  ║  Task Details    [✕] ║  │
│  ╠═══════════════════════╣  │
│  ║                       ║  │
│  ║  Submit Report        ║  │
│  ║  [● In Progress]     ║  │
│  ║                       ║  │
│  ║  🔥 Priority: HIGH    ║  │
│  ║  📅 Due: Wed, Jun 18  ║  │
│  ║  🕐 Time: 14:00       ║  │
│  ║  ⏱ Duration: 60 min   ║  │
│  ║                       ║  │
│  ║  Description:         ║  │
│  ║  ┌─────────────────┐  ║  │
│  ║  │ Complete the... │  ║  │
│  ║  └─────────────────┘  ║  │
│  ║                       ║  │
│  ║  [Edit] [Done] [🗑]  ║  │
│  ╚═══════════════════════╝  │
│                             │
└─────────────────────────────┘
```

### 5. Overview Screen

```
┌─────────────────────────────┐
│         Status Bar          │
├─────────────────────────────┤
│  Overview                  │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │ 🦅 Eagle Level       │    │
│  │ 2,450 XP (78%)      │    │
│  │ ████████████░░░░░    │    │
│  └─────────────────────┘    │
│                             │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│  │ 5 │ │12 │ │ 3 │ │78%│   │
│  │ ⏳ │ │ ✅ │ │ ⏭ │ │ 📈│   │
│  │    │ │    │ │    │ │   │   │
│  └───┘ └───┘ └───┘ └───┘   │
│                             │
│  Daily Tasks (Last 14 Days) │
│  ┌─────────────────────┐    │
│  │ [Bar Chart]         │    │
│  └─────────────────────┘    │
│                             │
│  Weekly Progress            │
│  ┌─────────────────────┐    │
│  │ [Line Chart]        │    │
│  └─────────────────────┘    │
│                             │
│  💡 Insights                │
│  ┌─────────────────────┐    │
│  │ • Complete high...   │    │
│  │ • 3 tasks due today │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

## Component Library Preview

### Buttons

| Type | Style | Usage |
|------|-------|-------|
| Primary | Blue bg, white text | Main CTA |
| Secondary | Light bg, colored text | Alternative actions |
| Danger | Red bg, white text | Delete, destructive |
| Ghost | Transparent, colored text | Subtle actions |
| Icon | Circular, icon only | Quick actions |

### Cards

| Type | Usage |
|------|-------|
| TaskCard | Task list items with actions |
| StatsCard | Statistics display |
| SummaryCard | Dashboard summary |
| LevelCard | Gamification display |

### Modals

| Type | Usage |
|------|-------|
| ConfirmationModal | Delete/Done confirmation |
| SuccessModal | Success feedback |
| TaskDetailModal | Full task view |
