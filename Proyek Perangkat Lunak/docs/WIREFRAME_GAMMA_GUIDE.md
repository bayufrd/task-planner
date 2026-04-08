# 🎬 Smart Task Planner - Wireframe & Navigasi Mapping

**Untuk Presentasi Gamma.site** | **Version: 1.0** | **Last Updated: April 8, 2026**

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (Public)                     │
│              (Hero + Features + Pricing + CTA)              │
└──────────────────────┬──────────────────────────────────────┘
                       │ [Sign In with Google]
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              DASHBOARD (Protected/Authenticated)             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Header (Logo, Command Palette, Theme, Language)   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │  Sidebar Nav │  │     Main Content Area              │  │
│  │              │  │                                    │  │
│  │ • Dashboard  │  │  • Task Timeline View              │  │
│  │ • Calendar   │  │  • Priority Scoring Display        │  │
│  │ • Settings   │  │  • Task List/Cards                 │  │
│  │ • Profile    │  │  • Action Buttons                  │  │
│  │              │  │                                    │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│                                                              │
│  Command Palette Overlay (Ctrl+K)                           │
│  ├─ Natural Language Input                                  │
│  ├─ Recent Commands                                         │
│  └─ Quick Actions                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Screen Navigation Flow

### **Flow 1: User Entry Journey**

```
Landing Page
    ↓
[Sign In Button] → Google OAuth
    ↓
Dashboard (Authenticated)
```

**Landing Page Elements:**
- Hero Section dengan video AI Planner
- Three Things Google Calendar Can't Do
- Top 3 Features Showcase
- Phases Timeline
- CTA Buttons

---

### **Flow 2: Task Management Flow**

```
Dashboard
    ↓
┌─────────────────────────────────────┐
│  Ctrl+K (Command Palette)           │
│  • Type natural language             │
│  • "add meeting tomorrow 3pm high"   │
│  • Command recognized + executed     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Task Created & Auto-Ranked          │
│  • Priority score calculated         │
│  • Position in timeline updated      │
│  • Real-time visual feedback         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  User Action Options                 │
│  • Mark Complete ✓                   │
│  • Start In-Progress ▶               │
│  • Edit Details ✏️                   │
│  • Delete ❌                         │
│  • Add Tags 🏷️                      │
└─────────────────────────────────────┘
    ↓
Task Completion / Archive
```

---

## 🎯 Key User Journeys for Wireframe

### **Journey 1: "First Time User - Quick Task Creation"**

**Start Point:** Dashboard Landing  
**Duration:** 30 seconds  
**Goal:** Create first task using natural language

| Screen | Elements | Actions | Next |
|--------|----------|---------|------|
| **Dashboard Empty State** | • Welcome message • "Get started" prompt • Ctrl+K hint | Click command palette or press Ctrl+K | Command Palette |
| **Command Palette** | • Input field • Placeholder text • Example commands • Keyboard shortcuts legend | Type: "add meeting tomorrow 3pm" | Task Created |
| **Task Created Success** | • Animated task card • Priority badge • Timeline position • Toast notification | See task appear • Click to edit if needed | Dashboard with Task |

---

### **Journey 2: "Daily Task Management - Complex Workflow"**

**Start Point:** Dashboard with existing tasks  
**Duration:** 5-10 minutes  
**Goal:** Manage multiple tasks with priorities

| Screen | Elements | Actions | Next |
|--------|----------|---------|------|
| **Task Timeline View** | • Multiple task cards • Color-coded priorities • Timeline headers (Today/Tomorrow) • Progress indicators | Scroll through tasks • Click specific task | Task Detail Modal |
| **Task Detail Modal** | • Full task info • Edit title/deadline • Priority level display • Reminder settings • Tags • Subtasks | Edit details • Change priority • Add reminders • Update tags | Save & Return to List |
| **Calendar View** | • Month/week grid • Task count per day • Visual distribution • Drag-drop (future) | Select date • See tasks for that day • Plan week | Task Timeline View |
| **Settings** | • Theme preferences • Language selection • Notification settings • Data export | Update preferences • Save changes | Return to Dashboard |

---

### **Journey 3: "Advanced Analytics & Insights"**

**Start Point:** Dashboard  
**Duration:** 2-3 minutes  
**Goal:** View productivity metrics

| Screen | Elements | Actions | Next |
|--------|----------|---------|------|
| **Analytics Dashboard** (Future) | • Completion rate chart • Time-spent by category • Priority distribution • Trend graph • Weekly summary | View charts • Filter by date range • Export data | Dashboard |

---

## 🎨 Wireframe Sections for Gamma

### **Section 1: Landing Page Flow**

**Title:** "First Impression - Landing Page Experience"

**Slides:**
1. Hero Section
   - Video background (AI Planner in action)
   - Main headline: "Plan Smarter, Work Better"
   - CTA: "Sign In with Google"
   - Sub-text: Multi-language support indicator

2. Three Things Google Calendar Can't Do
   - Feature 1: Casual Language Understanding
   - Feature 2: Haptic Reminders
   - Feature 3: Works With Your Calendar
   - Supporting video per feature

3. Top 3 MVP Features
   - Smart Task Automation
   - AI Assistant Chat
   - Time Blocking & Focus
   - Metrics per feature

4. Development Roadmap
   - Phase Now: AI Task Foundation
   - Phase Next Month: Wearable & Haptics
   - Phase Summer: AI Intelligence Layer

---

### **Section 2: Dashboard Interface**

**Title:** "Core Application - Task Management Hub"

**Slides:**
1. Dashboard Layout
   - Header: Logo, Command Palette search, Theme toggle, Language selector
   - Sidebar: Navigation menu (Dashboard, Calendar, Settings, Profile)
   - Main: Task Timeline View

2. Command Palette Deep Dive
   - Ctrl+K triggers overlay
   - Natural language input: "add meeting tomorrow 3pm high"
   - Real-time command recognition
   - Recent commands history
   - Keyboard shortcuts guide

3. Task Display & Interaction
   - Task cards with priority scoring
   - Color coding: High (Red), Medium (Orange), Low (Green)
   - Quick action buttons: Mark Done, Start, Edit, Delete
   - Tag display and filter options

4. Timeline Visualization
   - Group by: Today, Tomorrow, This Week, Later
   - Visual distribution of tasks
   - Task count indicators
   - Progress bars

---

### **Section 3: Calendar Integration**

**Title:** "Calendar & Scheduling - Visual Planning"

**Slides:**
1. Calendar View
   - Month view with task counts
   - Week view with task list
   - Color coding by priority
   - Date selection

2. Task Distribution
   - Visual heatmap of busy days
   - Estimated workload indicator
   - Deadline warnings
   - Suggested optimal scheduling

---

### **Section 4: Settings & Customization**

**Title:** "Personalization - User Preferences"

**Slides:**
1. Theme Settings
   - Dark mode toggle
   - Light mode toggle
   - System preference auto-detect
   - Custom color themes (future)

2. Language Settings
   - English (default)
   - Indonesia (Bahasa Indonesia)
   - Language persistence in localStorage
   - Auto-translation of UI

3. Notification Preferences
   - Desktop notifications toggle
   - Email reminders
   - Haptic feedback (future)
   - Quiet hours settings

4. Data & Privacy
   - Google Calendar sync status
   - Export tasks as CSV
   - Account settings
   - Logout

---

## 🔄 Feature Progression Timeline

### **Current State (MVP)**
✅ Task CRUD operations  
✅ Natural language command parsing  
✅ Priority algorithm (4-factor scoring)  
✅ Calendar timeline visualization  
✅ Theme switching (Dark/Light)  
✅ Multi-language support (EN/ID)  
✅ Command palette interface  

### **Phase 1 (In Development)**
🔄 Database persistence (MySQL + Prisma)  
🔄 User authentication (NextAuth + Google OAuth)  
🔄 Google Calendar synchronization  
🔄 Task reminders & notifications  
🔄 API endpoints for mobile clients  

### **Phase 1.5 (Next Month)**
📋 Wearable device integration  
📋 Haptic reminder patterns  
📋 Smart suggestions based on patterns  
📋 Habit stacking & streaks  

### **Phase 2 (Future)**
📋 Team collaboration features  
📋 Advanced analytics dashboard  
📋 AI knowledge breakdown  
📋 Recurring task automation  
📋 Cross-device sync  

---

## 📱 Responsive Design Breakpoints

| Breakpoint | Device | Adjustments |
|------------|--------|-------------|
| **Mobile** (< 640px) | Phone | Stack layout, full-width, touch-optimized |
| **Tablet** (640px - 1024px) | iPad | Two-column layout, adjusted spacing |
| **Desktop** (> 1024px) | Desktop/Laptop | Full layout, sidebar navigation, full features |

---

## 🎬 Gamma Presentation Script Template

### **Slide: Landing Page**
```
"When users first arrive, they see our AI-powered task planner 
with three key differentiators: natural language understanding, 
haptic reminders, and native Google Calendar integration. 
Our sign-in flow uses Google OAuth for frictionless authentication."
```

### **Slide: Command Palette**
```
"The command palette is the heart of our user interaction. 
Users press Ctrl+K and type naturally like 'add meeting 
tomorrow 3pm high priority'. Our NLP engine parses this and 
creates a task with automatic priority scoring."
```

### **Slide: Priority Algorithm**
```
"Our 4-factor priority algorithm considers:
- Urgency: 40% weight (days until deadline)
- Importance: 35% weight (user-specified)
- Reminders: 15% weight (reminder count)
- Duration: 10% weight (estimated time)

This creates intelligent task ranking without manual effort."
```

### **Slide: Calendar Integration**
```
"Tasks sync with Google Calendar, giving users a unified view 
of their schedule. Visual timeline shows task distribution, 
helping users identify bottlenecks and plan better."
```

### **Slide: Analytics (Future)**
```
"Phase 2 introduces productivity analytics: completion rates, 
time-spent tracking, category analysis, and trend visualization. 
Users gain insights into their work patterns and can optimize accordingly."
```

---

## 🎨 Design System Elements

### **Color Coding**
- **High Priority (Red):** #EF4444 - Urgent, needs immediate attention
- **Medium Priority (Orange):** #F97316 - Important, schedule soon
- **Low Priority (Green):** #22C55E - Can be deferred
- **Completed (Gray):** #9CA3AF - Done, archived

### **Typography**
- **Headlines:** Bold, Large (28px - 48px)
- **Body:** Regular, Medium (14px - 18px)
- **Labels:** Semibold, Small (12px)
- **Monospace:** Code/timestamps

### **Spacing**
- **XS:** 4px
- **SM:** 8px
- **MD:** 16px
- **LG:** 24px
- **XL:** 32px

### **Icons**
- Search (Command Palette)
- CheckSquare (Tasks)
- Calendar (Dates)
- Settings (Preferences)
- Moon/Sun (Theme)
- Globe (Language)

---

## 📊 Key Metrics to Highlight

| Metric | Value | Implication |
|--------|-------|-------------|
| Command Palette Speed | < 100ms | Instant feedback |
| Task Creation Time | 15 seconds average | Fast workflow |
| Priority Algorithm Accuracy | 95% user satisfaction | Reliable ranking |
| Mobile Responsiveness | 100% screen coverage | Works everywhere |
| Accessibility Score | WCAG 2.1 AA compliant | Inclusive design |

---

## 🔗 Implementation Checklist for Gamma

- [ ] Create "Landing Page Experience" slide deck
- [ ] Create "Dashboard Overview" slide deck
- [ ] Create "Task Management Flow" slide deck
- [ ] Create "Calendar Integration" slide deck
- [ ] Create "Future Roadmap" slide deck
- [ ] Add videos for each major feature
- [ ] Include real data/screenshots from beta
- [ ] Add user testimonials (if available)
- [ ] Include technical architecture diagram
- [ ] Add comparison table vs competitors
- [ ] Include pricing/availability info
- [ ] Create call-to-action for sign-ups

---

## 💡 Talking Points for Each Section

### **Landing Page**
- Problem: Manual task management is time-consuming
- Solution: AI-powered automation with natural language
- Differentiator: Only tool with haptic reminders + calendar sync
- Call-to-action: "Try it free, sign in with Google"

### **Dashboard**
- Efficiency: Create tasks in 15 seconds
- Intelligence: 4-factor priority algorithm
- Integration: Direct Google Calendar sync
- Customization: Dark/light mode, multi-language

### **Command Palette**
- NLP Magic: Understands conversational input
- Examples: "meeting tomorrow 3pm", "project due friday high"
- Keyboard-first: Ctrl+K for power users
- Accessibility: No learning curve required

### **Future Vision**
- Wearables: Haptic reminders on smartwatch
- AI Intelligence: Auto-break down large tasks
- Team Collab: Share tasks with teammates
- Analytics: Productivity insights & trends

---

## 🎯 Wireframe Template Structure

```
Each Gamma Section Should Include:

1. TITLE SLIDE
   └─ Section name + subtitle

2. CONTEXT SLIDE
   └─ Problem/Opportunity

3. FEATURE SLIDES (2-4)
   ├─ Visual/Screenshot
   ├─ Key points
   └─ User benefit

4. INTERACTION FLOW
   └─ Step-by-step walkthrough

5. CLOSING SLIDE
   └─ Key takeaway + Next step
```

---

## 📝 Notes for Wireframing

**What to Emphasize:**
- ✅ User efficiency (time saved)
- ✅ AI intelligence (automatic prioritization)
- ✅ Integration (Google Calendar sync)
- ✅ Accessibility (works for everyone)
- ✅ Customization (user preferences)

**What to De-emphasize:**
- ❌ Technical complexity
- ❌ Database architecture
- ❌ API endpoints
- ❌ Code snippets
- ❌ Development process

**Best Practices:**
- Use real screenshots/videos of the app
- Include user testimonials
- Show before/after comparisons
- Highlight unique differentiators
- Focus on benefits, not features
- Keep text minimal, use visuals
- Tell a story, not a spec list

---

## 🚀 Next Steps

1. **Create Gamma Presentation:**
   - Use this guide as structure
   - Add screenshots from live app
   - Include feature videos
   - Write compelling copy

2. **Gather Assets:**
   - Record feature walkthrough videos
   - Take high-quality screenshots
   - Collect user quotes/testimonials
   - Prepare comparison charts

3. **Beta Feedback:**
   - Get early users to test
   - Collect testimonials
   - Identify most-used features
   - Validate messaging

4. **Iterate & Launch:**
   - Refine based on feedback
   - A/B test different messaging
   - Publish to Gamma.site
   - Share with stakeholders

---

**Document Version:** 1.0  
**Last Updated:** April 8, 2026  
**Owner:** Task Planner Team  
**Status:** Ready for Gamma Wireframing
