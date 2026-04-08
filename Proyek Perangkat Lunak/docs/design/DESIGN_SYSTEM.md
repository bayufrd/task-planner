# Smart Task Planner - Design System

## Overview
Complete design system documentation for Smart Task Planner application. This document defines all UI components, colors, typography, spacing, and design patterns used throughout the application.

---

## 🎨 Color Palette

### Primary Colors
- **Blue**: `#3B82F6` (from-blue-600)
  - Light: `#EFF6FF` (blue-50)
  - Dark: `#1E3A8A` (blue-900)
  - Gradient: Blue → Cyan (`#06B6D4`)

- **Cyan**: `#06B6D4` (to-cyan-600)
  - Light: `#CFFAFE` (cyan-50)
  - Dark: `#164E63` (cyan-900)

### Status Colors
- **Success (Green)**: `#16A34A` (green-600)
  - Light: `#F0FDF4` (green-50)
  - Dark: `#15803D` (green-900)

- **Warning (Orange)**: `#EA580C` (orange-600)
  - Light: `#FFF7ED` (orange-50)
  - Dark: `#7C2D12` (orange-900)

- **Danger (Red)**: `#DC2626` (red-600)
  - Light: `#FEE2E2` (red-50)
  - Dark: `#7F1D1D` (red-900)

### Neutral Colors
- **Gray Scale**:
  - 50: `#F9FAFB` (Lightest)
  - 100: `#F3F4F6`
  - 200: `#E5E7EB`
  - 300: `#D1D5DB`
  - 400: `#9CA3AF`
  - 500: `#6B7280`
  - 600: `#4B5563`
  - 700: `#374151`
  - 800: `#1F2937`
  - 900: `#111827` (Darkest)
  - 950: `#030712` (Dark Mode Base)

### Dark Mode
- **Background**: `#030712` (gray-950)
- **Surface**: `#111827` (gray-900)
- **Surface Light**: `#1F2937` (gray-800)

---

## 📐 Typography

### Font Family
- **Primary**: System Font Stack
  - Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### Font Sizes & Weights

| Type | Size | Weight | Line Height | Use Case |
|------|------|--------|-------------|----------|
| Display | 32px | 700 | 40px | Page titles |
| Heading 1 | 28px | 600 | 36px | Section headers |
| Heading 2 | 24px | 600 | 32px | Subsection headers |
| Heading 3 | 20px | 600 | 28px | Card titles |
| Subheading | 16px | 500 | 24px | List item titles |
| Body Large | 16px | 400 | 24px | Main text |
| Body | 14px | 400 | 22px | Secondary text |
| Small | 12px | 400 | 18px | Captions |
| Tiny | 10px | 500 | 14px | Labels |

---

## 🎛️ Spacing System

All spacing follows a 4px base unit:

| Name | Value | Units |
|------|-------|-------|
| xs | 4px | 1x |
| sm | 8px | 2x |
| md | 12px | 3x |
| lg | 16px | 4x |
| xl | 24px | 6x |
| 2xl | 32px | 8x |
| 3xl | 48px | 12x |
| 4xl | 64px | 16x |

---

## 🔳 Border Radius

| Name | Value | Use Case |
|------|-------|----------|
| None | 0 | No radius |
| sm | 4px | Small buttons, input fields |
| md | 6px | Default components |
| lg | 8px | Cards, panels |
| xl | 12px | Larger cards, modals |
| 2xl | 16px | Large modals, containers |
| 3xl | 20px | Special components |
| full | 9999px | Badges, pills |

---

## 💫 Components

### 1. Header
**Purpose**: Main navigation and controls
**Colors**: White (light) / Gray-900 (dark)
**Components**:
- Logo with icon (CheckSquare2)
- Title with subtitle
- Command palette button (Search icon)
- Language toggle (EN/ID radio buttons with flags)
- Theme toggle (Moon/Sun icons)
- Menu button (Hamburger icon)

**Specs**:
- Height: 64px (h-16)
- Border: Bottom border (gray-200/50 light, gray-800/50 dark)
- Backdrop: blur-xl
- Background: white/80 (light), gray-950/80 (dark)

---

### 2. Calendar Timeline
**Purpose**: Month view with task indicators

**Key Sections**:
- Today Quick View Card
  - Layout: Horizontal flex
  - Background: Gradient (blue-50 → cyan-50)
  - Text: Calendar icon + "Today" label
  - Counter: Large number with gradient text

- Month Selector
  - Navigation: Chevron icons (previous/next)
  - "Today" button for reset
  - Month/Year display

- Calendar Grid
  - 7 columns (Sun-Sat)
  - Task count badges (orange/red colored)
  - Selected day: Gradient background (blue → cyan)
  - Today indicator: Border (2px blue)

**Colors**:
- Selected: `bg-gradient-to-br from-blue-600 to-cyan-600`
- Today: `border-2 border-blue-500`
- Task Badge: `bg-orange-100 dark:bg-orange-900/30`

---

### 3. Command Palette
**Purpose**: Quick task creation and command execution

**Key Features**:
- Input with Search icon
- Overlay backdrop with blur effect
- Gradient background for input area
- Suggestion list with icons
- Command history with back arrow indicator
- Help section with colored boxes (blue gradient, purple gradient)

**Specs**:
- Width: Max 2xl (672px)
- Border radius: 2xl (16px)
- Backdrop: blur-md
- Shadow: shadow-2xl

**Icon Indicators**:
- Command: Command icon (purple)
- Lightbulb: Yellow indicator (natural language)
- History: Back arrow indicator

---

### 4. Task Priority List
**Purpose**: Display tasks with priority scoring

**View Modes**:
- Today (Calendar icon)
- Upcoming (Zap icon)
- All (ListTodo icon)

**Button Styling** (selected):
- Background: `from-blue-600 to-cyan-600`
- Shadow: `shadow-blue-500/30`
- Scale: `scale-105`

**Statistics Cards**:
- Total Tasks: Blue gradient
- High Priority: Orange gradient
- Avg Score: Green gradient
- Layout: Grid, responsive (1 col mobile, 3 col desktop)

---

### 5. Task Card
**Purpose**: Individual task display with actions

**Layout**:
- Left: Status icon + Title + Meta info + Tags
- Right: Priority score box + Hours remaining

**Meta Info Badges**:
- Priority: Colored gradient with icon
- Deadline: Gray box with Clock icon
- Days until: Red if today, gray otherwise
- Duration: Clock icon + minutes
- Tags: Blue accent with # prefix

**Priority Badge Colors**:
- HIGH: `from-red-600 to-orange-600`
- MEDIUM: `from-yellow-600 to-orange-600`
- LOW: `from-green-600 to-emerald-600`

**Action Buttons**:
- Done/Undo: Green (CheckCircle2 icon)
- Start/Pause: Blue (Play/Pause icon)
- Delete: Red (Trash2 icon)

**Priority Score Box**:
- Background: Gradient (blue-50 → cyan-50)
- Rounded: xl
- Text: Gradient blue → cyan

---

### 6. Language Toggle
**Purpose**: Switch between EN/ID

**Desktop** (visible on sm and up):
- Two button radio group
- Selected: White background, shadow
- Unselected: Transparent with hover effect
- Text: "EN" / "ID"
- Flag emoji: 🇬🇧 / 🇮🇩

**Mobile** (hidden on sm):
- Single button with Globe icon
- Toggles between languages

---

## 🎭 Interaction Patterns

### Button States
- **Default**: Normal styling
- **Hover**: Slightly lighter/darker background
- **Active**: Gradient background + shadow + scale-105
- **Disabled**: Reduced opacity

### Transitions
- Default: `transition-all duration-200`
- Fast: `duration-200`
- Medium: `duration-300`
- Easing: ease-in-out (default)

### Animations
- Entrance: `fade-in slide-in-from-top-4 duration-200`
- Bounce: `animate-bounce` (empty state)
- Scale: `scale-105` (active items)

---

## 📱 Responsive Breakpoints

| Breakpoint | Size | Usage |
|-----------|------|-------|
| Mobile | < 640px (sm) | Single column, compact |
| Tablet | 640px - 1024px | Two columns, medium spacing |
| Desktop | ≥ 1024px | Three+ columns, full layout |

---

## ♿ Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- High priority (red) has distinct color besides saturation

### Focus States
- All interactive elements have visible focus indicators
- Focus style: Border or outline with primary color

### Keyboard Navigation
- Ctrl+K: Open command palette
- Arrow keys: Navigate history in command palette
- Tab: Navigate between elements
- Enter: Confirm actions

---

## 🎨 Figma Export Structure

```
Smart Task Planner
├── Colors
│   ├── Primary (Blue, Cyan)
│   ├── Status (Green, Orange, Red)
│   ├── Neutral (Gray scale)
│   └── Semantic (Success, Warning, Danger)
├── Typography
│   ├── Heading Styles
│   ├── Body Styles
│   └── Caption Styles
├── Components
│   ├── Header
│   ├── Calendar Timeline
│   ├── Command Palette
│   ├── Task Card
│   ├── Task List
│   ├── Buttons
│   └── Badges
├── Screens
│   ├── Empty State
│   ├── Main Dashboard
│   ├── Calendar View
│   └── Task Details
└── Patterns
    ├── Form Fields
    ├── Modal
    ├── Dropdown
    └── Toast
```

---

## 🚀 Implementation Guidelines

### When Adding New Components
1. Follow the spacing system (4px base unit)
2. Use existing color palette
3. Apply consistent border radius (default: lg/xl)
4. Include dark mode support
5. Test keyboard navigation
6. Ensure 4.5:1 contrast ratio

### CSS Classes Convention
- Use Tailwind utility classes
- Prefer semantic naming
- Dark mode: Always add `dark:` variants
- Responsive: Use breakpoint prefixes (sm:, md:, lg:)

### Icon Library
- Use Lucide React for all icons
- Icon size: 16px (w-4), 20px (w-5), 24px (w-6)
- Stroke width: 2 (default), 1.5 (light), 2.5 (bold)

---

## 📝 File Organization

```
src/
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── calendar/
│   │   └── CalendarTimeline.tsx
│   ├── tasks/
│   │   ├── TaskPriorityList.tsx
│   │   └── TaskCard.tsx
│   ├── command/
│   │   └── CommandPalette.tsx
│   └── providers/
│       ├── LanguageProvider.tsx
│       └── ThemeProvider.tsx
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── lib/
    └── i18n.ts
```

---

## 🔗 Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev
- **Next.js**: https://nextjs.org/docs
- **date-fns**: https://date-fns.org/docs

---

**Last Updated**: April 7, 2026
**Version**: 1.0.0
