# Component Library - Smart Task Planner

## 📦 Components Overview

Comprehensive component library documentation with code examples and specifications.

---

## 1. Header Component

### Overview
Main navigation bar with branding, controls, and theme switching.

### Structure
```
Header
├── Logo Section
│   ├── Logo Icon (CheckSquare2)
│   ├── Title
│   └── Subtitle
├── Controls Section
│   ├── Command Palette Button
│   ├── Language Toggle (Desktop)
│   ├── Theme Toggle
│   └── Menu Button
└── Mobile Menu
    ├── Menu Items
    └── Language Selector
```

### Specifications

| Aspect | Value |
|--------|-------|
| Height | 64px (h-16) |
| Background | white/80 light, gray-950/80 dark |
| Border | Bottom (1px, gray-200/50 light) |
| Backdrop | blur-xl |
| Padding | 16px (px-4) |
| Icons | Lucide React (strokeWidth: 2) |

### Props
```typescript
interface HeaderProps {
  onToggleTheme: () => void
  currentTheme: string
  onOpenCommand?: () => void
}
```

### Responsive Behavior
- **Mobile** (< sm): Hide command button text, show icon only
- **Tablet** (sm-md): Show command text, hide kbd hint
- **Desktop** (≥ lg): Full layout with all elements

### Color Variants
**Light Mode**:
- Background: White
- Text: Gray-900
- Hover: Gray-100/80

**Dark Mode**:
- Background: Gray-950/80
- Text: Gray-50
- Hover: Gray-800/80

---

## 2. Calendar Timeline Component

### Overview
Monthly calendar view with task indicators and quick today view.

### Structure
```
CalendarTimeline
├── Today Quick View Card
│   ├── Calendar Icon
│   ├── Today Label
│   ├── Date
│   └── Task Counter
├── Month Navigation
│   ├── Previous Month Button
│   ├── Month/Year Display
│   ├── Today Button
│   └── Next Month Button
└── Calendar Grid
    ├── Day Headers (Sun-Sat)
    └── Day Cells (7x6 grid)
        ├── Date
        └── Task Count Badge
```

### Specifications

| Aspect | Value |
|--------|-------|
| Today Card Height | 80px |
| Calendar Height | Total ~280px |
| Grid Columns | 7 (weekdays) |
| Cell Height | ~40px |
| Spacing | 8px (gap-2) |
| Border Radius | xl (12px) |

### Day Cell States
- **Selected**: Gradient blue→cyan, white text, scale-105
- **Today**: Blue border (2px), no background
- **Other Month**: Disabled state (gray-400)
- **With Tasks**: Orange badge with count

### Props
```typescript
interface CalendarTimelineProps {}
// Uses: useTaskStore, useLanguage
```

---

## 3. Command Palette Component

### Overview
Modal for quick task creation and command execution.

### Structure
```
CommandPalette
├── Backdrop (blur-md)
└── Modal (rounded-2xl)
    ├── Input Section
    │   ├── Search Icon
    │   ├── Input Field
    │   └── Close Button
    ├── Suggestions List
    │   ├── Natural Language Items
    │   └── Slash Command Items
    └── Help Section
        ├── Natural Language Box
        └── Slash Commands Box
```

### Specifications

| Aspect | Value |
|--------|-------|
| Width | max-w-2xl (672px) |
| Border Radius | 2xl (16px) |
| Max Height | h-80 (320px) |
| Backdrop Blur | blur-md |
| Shadow | shadow-2xl |
| Overlay Opacity | 40% (black/40) |

### Keyboard Shortcuts
- **Ctrl+K**: Toggle modal
- **Escape**: Close modal
- **Arrow Up/Down**: Navigate history
- **Enter**: Execute command

### Suggestion Types
1. **Natural Language** (💡 icon)
   - Green highlight on hover
   - Example: "add meeting tomorrow 3pm high"

2. **Slash Commands** (⌘ icon)
   - Purple highlight on hover
   - /add, /list, /today, /help

3. **History** (↳ indicator)
   - Gray text
   - Sorted newest first
   - Max 10 items

### Props
```typescript
interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}
```

---

## 4. Task Priority List Component

### Overview
Displays tasks with priority scoring and view mode switching.

### Structure
```
TaskPriorityList
├── View Mode Selector
│   ├── Today (Calendar icon)
│   ├── Upcoming (Zap icon)
│   └── All (ListTodo icon)
├── Empty State (optional)
│   ├── Icon
│   ├── Heading
│   ├── Description
│   └── CTA Button
├── Task List
│   └── Task Cards (grid)
└── Statistics Cards (optional)
    ├── Total Tasks
    ├── High Priority Count
    └── Average Score
```

### View Modes
- **Today**: Today's tasks only
- **Upcoming**: Next 7 days
- **All**: All active tasks

### Empty State
Displays when no tasks in current view:
- Icon: ListTodo (gray-400)
- Size: w-16 h-16
- Text: "No tasks in this view"

### Statistics
Grid layout (1 col mobile, 3 col desktop):
- **Total Tasks**: Blue gradient
- **High Priority**: Orange gradient
- **Avg Score**: Green gradient

### Props
```typescript
interface TaskPriorityListProps {}
// Uses: useTaskStore, useLanguage
```

---

## 5. Task Card Component

### Overview
Individual task display with metadata and actions.

### Structure
```
TaskCard
├── Left Content
│   ├── Status Icon
│   ├── Task Title
│   ├── Description (optional)
│   ├── Meta Badges
│   │   ├── Priority Badge
│   │   ├── Deadline
│   │   ├── Days Until
│   │   └── Duration (optional)
│   └── Tags (optional)
└── Right Content
    ├── Priority Score Box
    └── Time Until Reminder
└── Action Buttons
    ├── Done / Undo
    ├── Start / Pause
    └── Delete
```

### Specifications

| Aspect | Value |
|--------|-------|
| Height | ~90px |
| Border Left | 4px (colored) |
| Border Radius | xl (12px) |
| Padding | 16px (p-4) |
| Shadow | md → lg on hover |
| Gap Between Items | 8px (gap-2) |

### Priority Badge Colors
- **HIGH**: Red→Orange gradient
  - Icon: 🔴
  - Colors: from-red-600 to-orange-600

- **MEDIUM**: Yellow→Orange gradient
  - Icon: 🟡
  - Colors: from-yellow-600 to-orange-600

- **LOW**: Green→Emerald gradient
  - Icon: 🟢
  - Colors: from-green-600 to-emerald-600

### Status Icons
- **TODO**: 📝
- **IN_PROGRESS**: ⏳
- **DONE**: ✅

### Action Buttons

| Button | Icon | Color | States |
|--------|------|-------|--------|
| Done/Undo | CheckCircle2/RotateCcw | Green | Task incomplete/completed |
| Start/Pause | Play/Pause | Blue | Task inactive/in progress |
| Delete | Trash2 | Red | Always available |

### Metadata Badges
- **Priority**: Colored gradient, white text, icon prefix
- **Deadline**: Gray box, Clock icon, date (MMM d format)
- **Days Until**: Red if today, gray otherwise
- **Duration**: Clock icon + minutes
- **Tags**: Blue accent, # prefix, max 3 shown

### Props
```typescript
interface TaskCardProps {
  task: Task
  scoreInfo: TaskWithScore
}
```

---

## 6. Language Toggle Component

### Overview
Switch between English and Indonesian languages.

### Variants

#### Desktop (visible on sm+)
- Two-button radio group
- Selected: White bg, shadow
- Unselected: Transparent, hover effect
- Labels: "EN" / "ID" with flags
- Container: Gray-100 bg, rounded-lg

#### Mobile (hidden on sm+)
- Single button
- Icon: Globe
- Toggle behavior
- Size: p-2

### Styling

| State | Background | Text | Shadow |
|-------|-----------|------|--------|
| Selected | white | gray-900 | shadow-sm |
| Unselected | transparent | gray-600 | none |
| Hover (unselected) | transparent | gray-700 | none |

### Props
```typescript
// Via useLanguage hook
{
  language: 'en' | 'id'
  setLanguage: (lang) => void
  t: (key: string) => string
}
```

---

## 7. Button Variants

### Primary Button
```
Background: gradient-to-r from-blue-600 to-cyan-600
Text: white
Padding: px-6 py-3
Border Radius: xl (12px)
Shadow: shadow-lg shadow-blue-500/30
Hover: scale-105 + shadow-xl
```

### Secondary Button
```
Background: gray-100/80 (light), gray-800/80 (dark)
Text: gray-700 (light), gray-300 (dark)
Padding: px-4 py-2.5
Border Radius: lg (8px)
Hover: bg-gray-200/80 (light)
```

### Icon Button
```
Background: hover:bg-gray-100/80
Padding: p-2
Border Radius: lg (8px)
Size: w-5 h-5 (icon)
```

---

## 8. Badge Variants

### Priority Badge
- HIGH: Red gradient
- MEDIUM: Yellow gradient
- LOW: Green gradient
- Padding: px-3 py-1.5
- Border Radius: lg (8px)
- Text: white, font-semibold, xs

### Status Badge
- Padding: px-2 py-1
- Border Radius: md (6px)
- Size: text-xs

### Tag Badge
- Background: blue-100/80 light
- Color: blue-700 light
- Padding: px-2 py-1
- Border Radius: md (6px)

---

## 9. Empty State Component

### Structure
```
EmptyState
├── Icon Container
│   ├── Background Circle
│   └── Icon (centered)
├── Heading
├── Description
└── Primary CTA Button
```

### Styling
- Icon Container: w-20 h-20, rounded-3xl, gradient bg
- Heading: text-3xl, font-bold, gradient text
- Description: text-sm, gray text
- Button: Primary variant with icon

---

## 10. Modal Component

### Specifications
- Width: max-w-2xl (672px)
- Border Radius: 2xl (16px)
- Backdrop: blur-md, black/40 opacity
- Shadow: shadow-2xl
- Animation: fade-in slide-in-from-top-4 duration-200
- Exit: Esc key or click outside

### Sections
1. Header: Input with search icon
2. Content: Scrollable list
3. Footer: Help section (if needed)

---

## Color Reference

### Gradients
- **Primary**: from-blue-600 to-cyan-600
- **Success**: from-green-600 to-emerald-600
- **Warning**: from-yellow-600 to-orange-600
- **Danger**: from-red-600 to-orange-600

### Shadows
- **Light**: shadow-sm, shadow-md
- **Medium**: shadow-lg
- **Heavy**: shadow-2xl
- **Colored**: shadow-blue-500/30 (colored tint)

---

## Typography

### Headings
- H1: text-3xl font-bold
- H2: text-2xl font-semibold
- H3: text-xl font-semibold

### Body
- Large: text-base font-medium
- Normal: text-sm font-normal
- Small: text-xs font-medium

### Special
- Labels: text-xs uppercase tracking-widest
- Captions: text-xs text-gray-500 dark:text-gray-400

---

## Spacing Guidelines

### Padding
- Container: px-4 sm:px-6 lg:px-8
- Card: p-4 or p-5
- Section: py-6 or py-8

### Gaps
- Components: gap-2 or gap-3
- Sections: space-y-4 or space-y-6

### Margins
- Top margin: mt-1, mt-2, mt-4, mt-6
- Bottom margin: mb-2, mb-4, mb-6

---

## Accessibility

### Focus States
All interactive elements have visible focus:
- Border or outline with primary color
- Outline offset for clarity

### Color Contrast
- Normal text: 4.5:1 (WCAG AA)
- Large text: 3:1 (WCAG AA)

### Keyboard Navigation
- Tab: Move focus forward
- Shift+Tab: Move focus backward
- Enter: Activate focused element
- Escape: Close modals/dropdowns
- Arrow keys: Navigate lists/options

---

## Animation & Transitions

### Defaults
- Duration: duration-200 (fast)
- Easing: ease-in-out

### Effects
- Entrance: fade-in slide-in-from-top
- Scale: scale-105 on active
- Opacity: opacity-0 to opacity-100

---

## File Organization

All components are in `src/components/` organized by feature:

```
src/components/
├── layout/
│   └── Header.tsx
├── calendar/
│   └── CalendarTimeline.tsx
├── tasks/
│   ├── TaskPriorityList.tsx
│   └── TaskCard.tsx
├── command/
│   └── CommandPalette.tsx
└── providers/
    ├── LanguageProvider.tsx
    └── ThemeProvider.tsx
```

---

**Last Updated**: April 7, 2026
**Version**: 1.0.0
