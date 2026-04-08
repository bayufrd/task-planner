# 🎨 Smart Task Planner - Detailed Screen Wireframes

**Untuk Gamma.site Presentation** | **Visual Layout & Component Specifications**

---

## 📱 Screen 1: Landing Page - Hero Section

### **Visual Layout**
```
┌───────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ [Logo] TaskPlanner     [Language: EN/ID] [Theme Toggle]     │ │
│  │                                        [Sign In] →          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  HERO SECTION (Dark Gradient: Navy → Indigo)                     │
│  ┌──────────────────────┬─────────────────────────────────────┐  │
│  │                      │                                     │  │
│  │  Plan Smarter,       │                                     │  │
│  │  Work Better         │   [VIDEO PLAYING]                  │  │
│  │                      │   AI Planner in Action              │  │
│  │  Subtitle:           │   (4-6 seconds, looping)            │  │
│  │  "An AI-powered      │                                     │  │
│  │   assistant that     │                                     │  │
│  │   understands        │                                     │  │
│  │   casual language"   │                                     │  │
│  │                      │                                     │  │
│  │  [Sign In] [Learn]   │                                     │  │
│  │                      │                                     │  │
│  └──────────────────────┴─────────────────────────────────────┘  │
│                                                                  │
│  Trust Badge: Google Calendar • Multi-language • Secure OAuth    │
└───────────────────────────────────────────────────────────────────┘
```

### **Specifications**

| Component | Details |
|-----------|---------|
| **Video** | 16:9 ratio, ~30-60 seconds, shows task creation flow |
| **Headline** | 48-72px bold, gradient text (blue → indigo) |
| **Subheading** | 18-24px, regular weight, subtitle color |
| **CTA Button** | Gradient bg (blue→indigo), 16px font, rounded-lg |
| **Theme** | Dark mode default, responsive to light mode toggle |

### **Interactive Elements**
- ✓ Sign In Button → Google OAuth Flow
- ✓ Language Toggle (EN/ID) → Instant translation
- ✓ Theme Toggle (Moon/Sun) → Dark/Light switch
- ✓ Video plays automatically on load

---

## 📱 Screen 2: Landing Page - Feature Showcase

### **Visual Layout**
```
┌───────────────────────────────────────────────────────────────────┐
│  SECTION: "The Three Things Google Calendar Can't Do"             │
│                                                                  │
│  Title: Large, centered heading                                   │
│  Subtitle: "We enhance Google Calendar with..."                   │
│                                                                  │
│  ┌─────────────────────┬─────────────────────────────────────┐  │
│  │                     │                                     │  │
│  │  Feature 1:         │  [VIDEO 1]                          │  │
│  │  Casual Language    │  Young professional typing          │  │
│  │  ────────────────   │  naturally into phone               │  │
│  │  "Just speak your   │                                     │  │
│  │   task naturally"   │                                     │  │
│  │                     │                                     │  │
│  │  Description text   │                                     │  │
│  │  (supporting info)  │                                     │  │
│  │                     │                                     │  │
│  └─────────────────────┴─────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────┬─────────────────────────────────────┐  │
│  │  [VIDEO 2]          │  Feature 2:                         │  │
│  │  Smartwatch         │  Haptic Reminders                   │  │
│  │  notification       │  ────────────────                   │  │
│  │                     │  "5x more effective than alerts"    │  │
│  │                     │                                     │  │
│  │                     │  Description text                   │  │
│  └─────────────────────┴─────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────┬─────────────────────────────────────┐  │
│  │                     │                                     │  │
│  │  Feature 3:         │  [VIDEO 3]                          │  │
│  │  Works With         │  Calendar sync animation            │  │
│  │  Your Calendar      │                                     │  │
│  │  ────────────────   │                                     │  │
│  │  "Sync directly     │                                     │  │
│  │   with Google Cal"  │                                     │  │
│  │                     │                                     │  │
│  │  Description text   │                                     │  │
│  │                     │                                     │  │
│  └─────────────────────┴─────────────────────────────────────┘  │
│                                                                  │
└───────────────────────────────────────────────────────────────────┘
```

### **Layout Notes**
- **Mobile (< 640px):** Stacked vertically, video full width
- **Tablet (640px-1024px):** Single column with side-by-side on larger sections
- **Desktop (> 1024px):** 2-column grid layout alternating L/R

### **Video Specifications**
- Video 1: Young professional typing naturally (10-15 sec)
- Video 2: Smartwatch haptic notification demo (8-12 sec)
- Video 3: Calendar sync animation (10-15 sec)
- All videos: 16:9 aspect ratio, auto-play, loop, muted

---

## 📱 Screen 3: Dashboard - Main View

### **Visual Layout**
```
┌────────────────────────────────────────────────────────────────────┐
│ HEADER                                                             │
│ ┌──────────────────────────────────────────────────────────────┐  │
│ │ [Logo] TaskPlanner   [Search/Cmd] [Theme] [Lang] [Profile] │  │
│ │                      Ctrl+K                                 │  │
│ └──────────────────────────────────────────────────────────────┘  │
├─────────────┬─────────────────────────────────────────────────────┤
│             │                                                     │
│  SIDEBAR    │  MAIN CONTENT AREA                                │
│  ──────     │  ──────────────────                               │
│             │                                                     │
│ [≡] Menu    │  Welcome back, Sarah! 👋                          │
│             │                                                     │
│  • Dashboard│  Today's Tasks                                      │
│  • Calendar │  ┌──────────────────────────────────────────────┐ │
│  • Settings │  │ [HIGH] Project Kickoff (87/100)             │ │
│  • Profile  │  │ ┌─ TODAY • 10:00 AM                          │ │
│             │  │ ├─ Prepare slides & handouts                │ │
│             │  │ └─ [✓] [▶] [✏️] [❌]                         │ │
│             │  │                                               │ │
│             │  │ [MEDIUM] Client Presentation (76/100)        │ │
│             │  │ ┌─ TODAY • 2:00 PM                           │ │
│             │  │ ├─ Review deck with team                     │ │
│             │  │ └─ [✓] [▶] [✏️] [❌]                         │ │
│             │  │                                               │ │
│             │  │ [LOW] Email Backlog (32/100)                 │ │
│             │  │ ┌─ TODAY • Throughout                        │ │
│             │  │ ├─ Respond to pending emails                 │ │
│             │  │ └─ [✓] [▶] [✏️] [❌]                         │ │
│             │  └──────────────────────────────────────────────┘ │
│             │                                                     │
│             │  Tomorrow's Tasks                                   │
│             │  ┌──────────────────────────────────────────────┐ │
│             │  │ [MEDIUM] Budget Review (72/100)              │ │
│             │  │ [MEDIUM] Team Standup (45/100)               │ │
│             │  └──────────────────────────────────────────────┘ │
│             │                                                     │
│             │  Next Week's Tasks                                  │
│             │  ┌──────────────────────────────────────────────┐ │
│             │  │ [HIGH] Stakeholder Feedback (68/100)         │ │
│             │  │ [LOW] Archive Old Emails (28/100)            │ │
│             │  └──────────────────────────────────────────────┘ │
│             │                                                     │
└─────────────┴─────────────────────────────────────────────────────┘
```

### **Task Card Anatomy**
```
┌─────────────────────────────────────────────────────────────┐
│ [PRIORITY BADGE]  Task Title                    [Score]     │
│ (HIGH/RED)        (Bold, 18px)                  (87/100)    │
│                                                              │
│ 📅 When: TODAY • 10:00 AM                                    │
│ 📝 Details: Prepare slides & handouts                        │
│ 🏷️ Tags: [project] [urgent]                                 │
│                                                              │
│ Priority Breakdown:                                          │
│ ├─ Urgency (today): 40/100                                   │
│ ├─ Importance (high): 35/100                                │
│ ├─ Reminders (1): 8/100                                      │
│ └─ Duration (1hr): 4/100                                     │
│                                                              │
│ [✓ Mark Done] [▶ Start] [✏️ Edit] [❌ Delete]              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### **Task States**
| State | Visual | Behavior |
|-------|--------|----------|
| **TO DO** | Normal opacity, white bg | Default state |
| **IN PROGRESS** | Blue left border, slightly highlighted | Started working |
| **DONE** | Gray text, strikethrough, reduced opacity | Completed |
| **OVERDUE** | Red badge, pulsing animation | Past deadline |

---

## 📱 Screen 4: Command Palette

### **Visual Layout**
```
┌─────────────────────────────────────────────────────────────┐
│  (Transparent overlay on background)                         │
│                                                              │
│         ┌─────────────────────────────────────┐             │
│         │  COMMAND PALETTE                    │             │
│         │  (Dark theme, 60% width, centered) │             │
│         │                                     │             │
│         │  ┌─────────────────────────────┐   │             │
│         │  │ 🔍 Type task naturally...   │   │             │
│         │  └─────────────────────────────┘   │             │
│         │                                     │             │
│         │  Recent Commands                    │             │
│         │  ────────────────                   │             │
│         │  1. add meeting tomorrow 3pm        │             │
│         │  2. complete project proposal       │             │
│         │  3. mark budget review done         │             │
│         │                                     │             │
│         │  Example Commands                   │             │
│         │  ─────────────────                  │             │
│         │  • "add [task] [deadline] [priority]"             │
│         │  • "list all high priority tasks"   │             │
│         │  • "complete [task name]"           │             │
│         │  • "delete [task name]"             │             │
│         │                                     │             │
│         │  Keyboard Shortcuts                 │             │
│         │  ──────────────────                 │             │
│         │  ↑ ↓ Navigate | Enter Execute | ESC Close         │
│         │                                     │             │
│         └─────────────────────────────────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### **Interaction Flow**
1. User presses `Ctrl+K` (or Cmd+K on Mac)
2. Palette appears with overlay + focus on input
3. Type naturally: "add meeting tomorrow 3pm high"
4. Real-time parsing shows recognized elements:
   - ✓ Action: ADD
   - ✓ Title: "meeting"
   - ✓ Deadline: "tomorrow"
   - ✓ Time: "3pm"
   - ✓ Priority: "high"
5. Press Enter to execute
6. Palette closes, task appears in timeline

---

## 📱 Screen 5: Calendar View

### **Visual Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ CALENDAR VIEW                                               │
│                                                              │
│  [< Month View] [Week View] [Day View] [>]                  │
│                                                              │
│  APRIL 2026                                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SUN | MON | TUE | WED | THU | FRI | SAT             │  │
│  │     │  1  │  2  │  3  │  4  │  5  │  6             │  │
│  │  0  │  1  │  2  │  1  │  3  │  5  │  0             │  │
│  │  📊 │  📊 │  📊 │  📊 │  📊 │  📊 │     (tasks)     │  │
│  │─────────────────────────────────────────────────────│  │
│  │  7  │  8  │  9  │ 10  │ 11  │ 12  │ 13             │  │
│  │  2  │  2  │  3  │  2  │  1  │  4  │  1             │  │
│  │  🟢 │ 🟠 │ 🔴 │  🟢 │ 🟢 │ 🔴🔴 │ 🟠             │  │
│  │─────────────────────────────────────────────────────│  │
│  │ 14  │ 15  │ 16  │ 17  │ 18  │ 19  │ 20             │  │
│  │  1  │  3  │  2  │  0  │  2  │  5  │  3             │  │
│  │  🟢 │ 🔴🔴 │ 🔴  │     │ 🟠 │ 🔴🔴 │ 🟠             │  │
│  │─────────────────────────────────────────────────────│  │
│  │ 21  │ 22  │ 23  │ 24  │ 25  │ 26  │ 27             │  │
│  │  2  │  1  │  2  │  1  │  3  │  0  │  1             │  │
│  │  🟢 │ 🟠 │ 🟠 │ 🟢 │ 🔴 │     │ 🟢             │  │
│  │─────────────────────────────────────────────────────│  │
│  │ 28  │ 29  │ 30  │     │     │     │                 │  │
│  │  3  │  2  │  1  │     │     │     │                 │  │
│  │ 🔴🔴 │ 🟠  │ 🟢 │     │     │     │                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Legend: 🔴 High | 🟠 Medium | 🟢 Low | (5) Total tasks    │
│                                                              │
│  April 15 Selected (3 tasks):                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ┌─ Project Kickoff (87/100) - HIGH - 10:00 AM       │   │
│  │ ├─ Client Presentation (76/100) - MEDIUM - 2:00 PM  │   │
│  │ └─ Budget Review (72/100) - MEDIUM - 4:00 PM        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### **Interaction**
- Click date → Shows tasks for that day
- Hover → Preview task count
- Color coding → Priority at a glance
- (Future) Drag-drop → Reschedule tasks

---

## 📱 Screen 6: Settings Page

### **Visual Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ SETTINGS                                                    │
│                                                              │
│ ┌─ Theme Settings ───────────────────────────────────────┐ │
│ │                                                         │ │
│ │ Theme Preference:                                       │ │
│ │ ○ Light Mode   ● Dark Mode   ○ System Auto             │ │
│ │                                                         │ │
│ │ Current: Dark Mode (🌙)                                 │ │
│ │                                                         │ │
│ │ [Toggle Theme Button]                                   │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─ Language Settings ────────────────────────────────────┐ │
│ │                                                         │ │
│ │ Select Language:                                        │ │
│ │ [EN 🇬🇧] [ID 🇮🇩]                                       │ │
│ │                                                         │ │
│ │ Current: English (en)                                   │ │
│ │ (UI will change immediately on selection)              │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─ Notification Settings ────────────────────────────────┐ │
│ │                                                         │ │
│ │ ☑️ Desktop Notifications (Enabled)                      │ │
│ │ ☐ Email Reminders (Disabled)                           │ │
│ │ ☑️ Browser Notifications (Enabled)                      │ │
│ │                                                         │ │
│ │ Quiet Hours: 10:00 PM - 8:00 AM                        │ │
│ │ (No notifications during these hours)                  │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─ Calendar Integration ─────────────────────────────────┐ │
│ │                                                         │ │
│ │ Google Calendar Sync: ☑️ Connected                      │ │
│ │ Account: user@gmail.com                                │ │
│ │ Last Sync: 2 minutes ago                               │ │
│ │                                                         │ │
│ │ [Sync Now] [Disconnect] [Resync]                       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─ Data & Privacy ───────────────────────────────────────┐ │
│ │                                                         │ │
│ │ [Export Tasks as CSV] [Clear All Data] [Delete Account] │ │
│ │                                                         │ │
│ │ Privacy Policy | Terms of Service | Contact Support    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─ Account ──────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │ Signed in as: Sarah Johnson (sarah@email.com)          │ │
│ │ User ID: 12345xyz                                       │ │
│ │                                                         │ │
│ │ [Edit Profile] [Change Password] [Sign Out]            │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Screen 7: Task Detail Modal (Edit)

### **Visual Layout**
```
┌──────────────────────────────────────────────────────────┐
│  Edit Task Modal (Dark overlay background)                │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │  EDIT TASK                                  [×]     │ │
│  │                                                    │ │
│  │  Task Title                                        │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ Project Kickoff                              │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  Deadline                                          │ │
│  │  ┌──────────────────┬──────────────────────────┐ │ │
│  │  │ 📅 April 15 2026 │ ⏰ 10:00 AM             │ │ │
│  │  └──────────────────┴──────────────────────────┘ │ │
│  │                                                    │ │
│  │  Priority Level                                    │ │
│  │  ○ High   ● Medium   ○ Low   ○ Custom            │ │
│  │                                                    │ │
│  │  Priority Score Explanation                       │ │
│  │  ├─ Urgency (today): 40/100                       │ │
│  │  ├─ Importance (medium): 35/100                   │ │
│  │  ├─ Reminders (1): 8/100                          │ │
│  │  └─ Duration (1hr): 4/100                         │ │
│  │  = Total: 87/100                                  │ │
│  │                                                    │ │
│  │  Reminders                                         │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ ☑️ 1 day before                               │ │ │
│  │  │ ☑️ 2 hours before                             │ │ │
│  │  │ [+ Add Reminder]                              │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  Tags                                              │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ [project] [work] [urgent]  [+]               │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  Description (Optional)                            │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ Prepare slides and handouts for morning      │ │ │
│  │  │ kickoff meeting with stakeholders            │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  [Save Changes] [Cancel] [Delete Task]             │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette & Theme System

### **Dark Mode (Default)**
| Element | Color | Usage |
|---------|-------|-------|
| Background | #0F172A (navy) | Main background |
| Surface | #1E293B (slate) | Cards, modals |
| Border | #334155/50% | Subtle dividers |
| High Priority | #EF4444 (red) | Urgent tasks |
| Medium Priority | #F97316 (orange) | Important tasks |
| Low Priority | #22C55E (green) | Can defer |
| Text Primary | #F1F5F9 (white) | Main text |
| Text Secondary | #94A3B8 (gray) | Helper text |
| Accent | #3B82F6 (blue) | Interactive elements |

### **Light Mode**
| Element | Color | Usage |
|---------|-------|-------|
| Background | #F8FAFC (slate) | Main background |
| Surface | #FFFFFF (white) | Cards, modals |
| Border | #E2E8F0 | Subtle dividers |
| Text Primary | #0F172A | Main text |
| Text Secondary | #64748B | Helper text |
| Accent | #0EA5E9 (sky) | Interactive elements |

---

## 📐 Typography System

```
Headlines
├─ H1: 48px Bold (Landing Hero)
├─ H2: 36px Bold (Section Titles)
├─ H3: 24px Bold (Subsections)
└─ H4: 20px Semibold (Card Titles)

Body Text
├─ Large: 18px Regular (Descriptions)
├─ Base: 16px Regular (Body content)
├─ Small: 14px Regular (Helper text)
└─ XSmall: 12px Regular (Captions)

Monospace (For code/timestamps)
└─ Family: SF Mono, Monaco, Courier New
```

---

## 🚀 Responsive Breakpoints

```
Mobile First Approach:
├─ XS: 320px (minimum)
├─ SM: 640px (tablets)
├─ MD: 768px (small laptops)
├─ LG: 1024px (desktop)
└─ XL: 1280px (widescreen)

Key Adjustments:
├─ Mobile: Single column, stacked layout
├─ Tablet: Two columns where appropriate
└─ Desktop: Full multi-column, sidebar navigation
```

---

**Ready to build on Gamma.site!** 🎨✨
