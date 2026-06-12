# 🎯 Smart Task Planner - Customer Journey Maps

**Untuk Presentasi Gamma.site** | **Detailed User Flows & Interactions**

---

## 🎬 Journey Map 1: New User Onboarding

### **User Persona:** Sarah, Student
**Goal:** Create first task quickly  
**Time Budget:** 2 minutes  
**Device:** Desktop

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: LANDING PAGE DISCOVERY                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visual:                                                         │
│  • Hero video of AI Planner in action                            │
│  • "Plan Smarter, Work Better" headline                          │
│  • Three key differentiators displayed                           │
│  • "Sign In with Google" CTA button (prominent, blue)           │
│                                                                  │
│  User Thought Process:                                           │
│  "This looks modern... does it really work with Google Cal?"     │
│  "I'm already using Google Calendar, so this could save time"    │
│                                                                  │
│  Action: Clicks "Sign In with Google"                            │
│  Emotion: Curious, cautiously optimistic                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: GOOGLE OAUTH AUTHENTICATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visual:                                                         │
│  • Redirects to Google Sign-In                                   │
│  • User selects Google account                                   │
│  • Permissions screen (Calendar access)                          │
│  • Back to app loading screen                                    │
│                                                                  │
│  User Thought Process:                                           │
│  "Good, it uses Google OAuth - my data is safe"                  │
│  "It needs Calendar access - makes sense"                        │
│                                                                  │
│  Action: Approves Google permissions                             │
│  Emotion: Confident, proceeding with trust                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: DASHBOARD FIRST LOOK                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visual:                                                         │
│  • Welcome message: "Hi Sarah! 👋"                               │
│  • Empty task state with hero image                              │
│  • "Let's get started" prompt                                    │
│  • Command palette hint: "Press Ctrl+K to add task"              │
│  • Sidebar with navigation: Dashboard, Calendar, Settings        │
│  • Header with theme/language toggles                            │
│                                                                  │
│  User Thought Process:                                           │
│  "Wait, it's empty - makes sense, I just started"                │
│  "Ctrl+K to add task? That's keyboard shortcut... cool!"         │
│  "Should I read the tutorial or just try it?"                    │
│                                                                  │
│  Action: Presses Ctrl+K (or clicks command button)               │
│  Emotion: Excited, wants to try it immediately                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: COMMAND PALETTE - TASK CREATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visual:                                                         │
│  • Modal opens with search field                                 │
│  • Placeholder: "Type task naturally..."                         │
│  • Example commands shown below                                  │
│  • Dark overlay on background                                    │
│  • Keyboard shortcuts legend (optional)                          │
│                                                                  │
│  User Input: "add meeting with prof tomorrow 3pm high"           │
│                                                                  │
│  Real-time Processing:                                           │
│  • "add" → Recognized as CREATE action ✓                         │
│  • "meeting with prof" → Task title ✓                            │
│  • "tomorrow" → Deadline date ✓                                  │
│  • "3pm" → Specific time ✓                                       │
│  • "high" → Priority level HIGH ✓                                │
│                                                                  │
│  User Thought Process:                                           │
│  "Wow, I just typed naturally and it understood everything!"     │
│  "No forms, no clicking around... this is fast!"                 │
│                                                                  │
│  Action: Presses Enter to execute                                │
│  Emotion: Impressed, engaged                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: TASK CREATION SUCCESS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visual:                                                         │
│  • Command palette closes                                        │
│  • Task appears in timeline: "Tomorrow • 3:00 PM"                │
│  • Task card shows:                                              │
│    - Title: "Meeting with prof"                                  │
│    - Priority: HIGH (red badge)                                  │
│    - Priority score: 87/100                                      │
│    - Action buttons: ✓ Mark Done, ▶ Start, ✏️ Edit, ❌ Delete    │
│  • Toast notification: "Task created! ✓"                         │
│  • Timeline reorganizes (other tasks ranked below)               │
│                                                                  │
│  Priority Algorithm Breakdown Shown:                             │
│  • Urgency (1 day away): 40/100                                  │
│  • Importance (High): 35/100                                     │
│  • Reminders (1): 8/100                                          │
│  • Duration (30 min): 4/100                                      │
│  = Total Score: 87/100                                           │
│                                                                  │
│  User Thought Process:                                           │
│  "The app calculated everything! Urgency, importance..."         │
│  "It ranked this meeting as the top priority - that's right!"    │
│  "I have all the controls I need - complete, edit, delete"       │
│                                                                  │
│  Action: Either creates another task OR explores calendar        │
│  Emotion: Delighted, wants to do more                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: OPTIONAL - EXPLORE CALENDAR VIEW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visual:                                                         │
│  • Clicks "Calendar" in sidebar                                  │
│  • Month view appears with task count per day                    │
│  • Colors indicate priority distribution                         │
│  • Can switch to week view for details                           │
│  • Days with more tasks have darker shading                      │
│                                                                  │
│  User Thought Process:                                           │
│  "Oh! The calendar shows my tasks integrated here too"           │
│  "Tomorrow has 1 task (my meeting)"                              │
│  "Can I drag tasks around? No, but that's fine for MVP"          │
│                                                                  │
│  Action: Returns to dashboard                                    │
│  Emotion: Impressed by integration                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ JOURNEY COMPLETE - FIRST SESSION SUMMARY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Time Taken: ~2 minutes                                          │
│  Tasks Created: 1                                                │
│  Features Explored: 3 (Command Palette, Timeline, Calendar)      │
│                                                                  │
│  User Sentiment: 😍 Love it!                                    │
│  Likely Next Action: Add more tasks or check settings            │
│  Conversion: HIGH (would recommend to friends)                   │
│                                                                  │
│  Key Success Metrics:                                            │
│  ✅ First task created in < 30 seconds                           │
│  ✅ Zero learning curve needed                                   │
│  ✅ Positive emotional response                                  │
│  ✅ Engaged with multiple features                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Journey Map 2: Busy Professional - Daily Workflow

### **User Persona:** Alex, Project Manager
**Goal:** Manage 15+ tasks across projects with deadlines  
**Time Budget:** 15 minutes per day  
**Device:** Desktop + Mobile

```
┌─────────────────────────────────────────────────────────────────┐
│ MORNING ROUTINE: TASK REVIEW (5 minutes)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Opens Dashboard (already authenticated)                      │
│     • Sees timeline with TODAY section at top                    │
│     • 3 high-priority tasks highlighted in red                  │
│     • 5 medium-priority tasks in orange                         │
│     • Visual task count: "3 High, 5 Medium, 7 Low"              │
│                                                                  │
│  2. Scans Today's Tasks:                                         │
│     [1] Project kickoff (87/100) - HIGH - 10:00 AM              │
│     [2] Client presentation (76/100) - MEDIUM - 2:00 PM         │
│     [3] Budget review (72/100) - MEDIUM - 4:00 PM               │
│     [4] Team standup (45/100) - LOW - 9:30 AM                   │
│     [5] Email backlog (32/100) - LOW - Throughout day           │
│                                                                  │
│  3. Makes Mental Plan:                                           │
│     "Kickoff at 10am is critical, need to prepare"              │
│     "Presentation needs 1 hour prep before 2pm"                 │
│     "Budget review can be delegated"                            │
│                                                                  │
│  Emotion: Organized, prioritized, confident                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ MIDDAY: TASK MANAGEMENT (5 minutes)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  4. New Email Arrives: "New stakeholder request"                 │
│     • Alex presses Ctrl+K                                        │
│     • Types: "add stakeholder feedback review fri high"          │
│     • Task created and auto-ranked                              │
│                                                                  │
│  5. Marks Task Complete:                                         │
│     • Clicks ✓ on "Team standup" (just finished)                │
│     • Visual confirmation: task grayed out                       │
│     • Timeline reorders remaining tasks                         │
│                                                                  │
│  6. Marks In-Progress:                                           │
│     • Clicks ▶ on "Project kickoff" (starting now)              │
│     • Visual state changes: task highlighted                    │
│     • Timer indicator appears (optional feature)                │
│                                                                  │
│  Emotion: Productive, in control, efficient                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ AFTERNOON: CALENDAR PLANNING (3 minutes)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  7. Checks Calendar View:                                        │
│     • Switches to calendar tab                                   │
│     • Sees week view with task density                          │
│     • Friday shows 6 tasks (high workload day)                  │
│     • Monday shows 2 tasks (lighter)                            │
│                                                                  │
│  8. Planning Insight:                                            │
│     "Friday is packed - need to move non-urgent tasks"          │
│     "Could reschedule email backlog to Monday"                  │
│     "New stakeholder task fits Friday afternoon"                │
│                                                                  │
│  9. Edits Task Deadline:                                         │
│     • Clicks on "Email backlog"                                  │
│     • Opens edit modal                                          │
│     • Changes deadline from Thursday to Monday                  │
│     • Timeline updates in real-time                             │
│                                                                  │
│  Emotion: Strategic, planning-focused, optimized                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ EVENING: SETTINGS & SYNC (2 minutes)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  10. Checks Settings:                                            │
│      • Enables dark mode (evening comfort)                      │
│      • Verifies Google Calendar sync is active                  │
│      • Confirms language is English                             │
│      • Enables desktop notifications                            │
│                                                                  │
│  11. Tasks Auto-Sync:                                            │
│      • All task changes sync to Google Calendar                 │
│      • Personal calendar shows merged view                      │
│      • Mobile app will sync when used                           │
│                                                                  │
│  Emotion: Reassured, integrated, prepared for tomorrow          │
└─────────────────────────────────────────────────────────────────┘
```

**Session Metrics:**
- Total Time: 15 minutes
- Tasks Created: 1
- Tasks Completed: 1
- Tasks Updated: 2
- Features Used: 4 (Timeline, Calendar, Command, Settings)
- Efficiency Gain: Estimated 20+ minutes saved vs traditional task management

---

## 🎬 Journey Map 3: Student - Study Planning

### **User Persona:** Jamie, University Student
**Goal:** Plan exam preparation and assignment deadlines  
**Time Budget:** 10 minutes, 2-3x per week  
**Device:** Desktop (primary), Mobile (on-the-go)

```
┌─────────────────────────────────────────────────────────────────┐
│ WEEKLY PLANNING SESSION (10 minutes)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Scenario: Jamie has exams in 4 weeks, assignments due soon     │
│                                                                  │
│  STEP 1: Batch Task Creation (5 minutes)                        │
│  ──────────────────────────────────                             │
│  Jamie uses command palette repeatedly:                         │
│                                                                  │
│  Command 1: "add calculus assignment due next friday high"      │
│  → Task: Calculus Assignment                                    │
│  → Deadline: Friday (5 days away)                               │
│  → Priority: HIGH (87/100)                                      │
│                                                                  │
│  Command 2: "add physics exam study next month very high"       │
│  → Task: Physics Exam Study                                     │
│  → Deadline: April 30                                           │
│  → Priority: HIGH (92/100 - very urgent)                        │
│                                                                  │
│  Command 3: "add english essay due 2 weeks medium"              │
│  → Task: English Essay                                          │
│  → Deadline: 2 weeks                                            │
│  → Priority: MEDIUM (68/100)                                    │
│                                                                  │
│  Result: 3 major tasks created in rapid succession              │
│  Timeline now shows:                                            │
│  └─ This Week: Calculus (87) → "URGENT"                         │
│  └─ Next Week: Physics study begins (92)                        │
│  └─ In 2 Weeks: English Essay (68)                              │
│                                                                  │
│  User Thought: "Wow, it automatically figured out urgency!"      │
│  Emotion: Relieved, organized, less anxious                     │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  STEP 2: Break Down Large Task (3 minutes)                      │
│  ─────────────────────────────                                  │
│  Jamie realizes Physics exam study is too large:                │
│                                                                  │
│  Command 4: "add physics ch1-5 review due april 20 medium"      │
│  Command 5: "add physics ch6-10 review due april 27 high"       │
│  Command 6: "add physics practice tests due april 29 high"      │
│                                                                  │
│  Result: Large task broken into manageable subtasks             │
│  Timeline shows milestones leading to exam                      │
│                                                                  │
│  User Thought: "Now I have a study plan without creating one"   │
│  Emotion: Empowered, strategic                                  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  STEP 3: Add Reminders (2 minutes)                              │
│  ───────────────────────────                                    │
│  Jamie wants reminders for important deadlines:                 │
│                                                                  │
│  • Clicks on "Calculus Assignment"                              │
│  • Opens task detail modal                                      │
│  • Adds reminder: 1 day before (Thursday)                       │
│  • Adds reminder: 2 hours before (Friday morning)               │
│                                                                  │
│  • Clicks on "Physics ch6-10 review"                            │
│  • Adds reminder: 3 days before                                 │
│  • Sets daily reminder (until deadline)                         │
│                                                                  │
│  Result: Reminders will trigger on phone & desktop              │
│  User Thought: "I won't forget anything now"                    │
│  Emotion: Confident, prepared                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ DURING EXAM WEEK (Mobile Checks)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tuesday Morning:                                                │
│  • Opens app on phone                                           │
│  • Sees TODAY: Physics ch6-10 review (IN PROGRESS)              │
│  • Marks as COMPLETE when finished                              │
│  • Gets notification: "Great job! 1 of 3 exam tasks done"       │
│                                                                  │
│  Thursday Evening:                                               │
│  • Gets reminder: "Calculus assignment due TOMORROW"            │
│  • Opens app from notification                                  │
│  • Starts assignment (marks as IN PROGRESS)                     │
│  • Can access from desktop later to continue                    │
│                                                                  │
│  Friday:                                                         │
│  • Gets morning reminder: "Calculus due in 2 hours"             │
│  • Completes and submits assignment                             │
│  • Marks task COMPLETE in app                                   │
│  • Task moves to archive                                        │
│  • One less item to worry about!                                │
│                                                                  │
│  Emotion Throughout: Stress-free, on-track, accountable         │
└─────────────────────────────────────────────────────────────────┘
```

**Journey Outcome:**
- **Before TaskPlanner:** Scattered assignments, missed deadlines, constant anxiety
- **With TaskPlanner:** Organized timeline, timely reminders, reduced stress
- **Result:** Likely better grades, healthier mental state

---

## 📊 Emotion Arc Across All Journeys

```
Emotion Level
     ↑
  10 │        ╭─────────╮
     │       ╱ Excited   ╲
   8 │      ╱  Exploring  ╲                ╭─────────────╮
     │     ╱               ╲              ╱ Productive   ╲
   6 │    ╱ Curious         ╲            ╱  & Organized  ╲
     │   ╱                   ╲          ╱                  ╲
   4 │  ╱  Cautious (auth)    ╲────────╱ Confident         ╲
     │ ╱                                                     ╲
   2 │                                                       ╲
     │                                                         ╲────
   0 └────────────────────────────────────────────────────────────────
       Landing    Auth    First    Feature   Mid-usage    Long-term
       Page      (trust) Task    Exploration (productive) (habit)
```

---

## 🎯 Key Takeaways for Gamma Presentation

### **What Makes This Different:**
1. **Frictionless Onboarding** - No tutorials, no learning curve
2. **Natural Interaction** - Type like you talk, app understands
3. **Intelligent Ranking** - Automatic priority calculation, not manual
4. **Multi-Device Sync** - Desktop, mobile, calendar integration
5. **Emotional Journey** - Users go from anxious → organized → confident

### **Metrics to Highlight:**
| Stage | Metric | Outcome |
|-------|--------|---------|
| Onboarding | Time to first task | < 2 minutes |
| First session | Features explored | 3-4 |
| Daily usage | Time saved vs traditional | 15-20 min |
| Monthly | Retention rate | 85%+ (target) |
| Lifetime | Recommendation rate | 90%+ (target) |

---

**Ready to present on Gamma.site!** 🚀
