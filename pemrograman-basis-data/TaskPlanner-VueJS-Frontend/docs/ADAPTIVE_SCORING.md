# Adaptive Scoring System — Smart Task Planner

## Overview

The **Adaptive Scoring System** is the core intelligence behind Smart Task Planner's task prioritization. It automatically calculates a priority score (0-100) for each task based on four key factors:

1. **Urgency** (40% weight) — How close is the deadline?
2. **Priority** (35% weight) — How important is this task to you?
3. **Reminder** (15% weight) — How soon do you want to be reminded?
4. **Duration** (10% weight) — How long will it take to complete?

---

## The Scoring Formula

```
Score = (Urgency × 0.4) + (Priority × 0.35) + (Reminder × 0.15) + (Duration × 0.1)
```

### Why These Weights?

| Factor | Weight | Rationale |
|--------|--------|-----------|
| **Urgency** | 40% | Time pressure is the hardest constraint. Overdue tasks must be addressed regardless of their priority level. |
| **Priority** | 35% | User-defined importance. When two tasks have similar urgency, this breaks the tie. |
| **Reminder** | 15% | Signal of your intention. If you set a reminder 30 minutes before, you're serious about not missing it. |
| **Duration** | 10% | Feasibility check. A 15-minute task is "doable now" compared to a 4-hour task. |

---

## What is "Adaptive Syllabus"?

**Adaptive Syllabus** adalah sistem scoring otomatis yang menyesuaikan prioritas task berdasarkan **4 faktor dinamis**:

1. **Urgency** — Seberapa dekat deadline task?
2. **Priority** — Seberapa penting task ini menurut Anda?
3. **Reminder** — Kapan Anda ingin diingatkan tentang task ini?
4. **Duration** — Berapa lama waktu yang dibutuhkan untuk menyelesaikan task?

Sistem ini "adaptive" karena:
- Tidak menggunakan pendekatan statis atau manual
- Menghitung skor secara otomatis berdasarkan data real-time dari task
- Menyesuaikan peringatan berdasarkan pola perilaku user
- Memberikan rekomendasi personalisasi berdasarkan kebiasaan kerja

**Formula Scoring**:
```
Score = (Urgency × 0.4) + (Priority × 0.35) + (Reminder × 0.15) + (Duration × 0.1)
```

**Skala Skor**:
- **90–100**: **URGENT** — Kerjakan segera, ini prioritas tertinggi
- **75–89**: **HIGH** — Kerjakan hari ini, jangan tunda
- **60–74**: **MODERATE** — Schedule untuk hari ini atau besok
- **40–59**: **STANDARD** — Bisa ditunda tapi tetap diperhatikan
- **20–39**: **LOW** — Bisa ditunda atau diprioritaskan belakangan
- **0–19**: **TRIVIAL** — Opsional, bisa di-delegasikan

---

## Detailed Factor Breakdown

### 1. Urgency Score (40% Weight)

**Definition**: How imminent is the deadline?

| Time Until Deadline | Urgency Score | Interpretation |
|---------------------|---------------|----------------|
| `Overdue` (hours < 0) | **100** | Past deadline — **highest urgency** |
| `0 ≤ hours ≤ 2` | **90** | Today, within 2 hours |
| `2 < hours ≤ 6` | **80** | Within 6 hours |
| `6 < hours ≤ 24` | **60** | Tomorrow |
| `24 < hours ≤ 72` | **40** | Within 3 days |
| `72 < hours ≤ 168` | **20** | Within 1 week |
| `hours > 168` | **10** | More than 1 week away |

**Formula Logic** (`src/utils/priority.ts`):
```typescript
if (hoursUntilDeadline < 0) {
  urgencyScore = 100; // Overdue
} else if (hoursUntilDeadline <= 2) {
  urgencyScore = 90;
} else if (hoursUntilDeadline <= 6) {
  urgencyScore = 80;
} else if (hoursUntilDeadline <= 24) {
  urgencyScore = 60;
} else if (hoursUntilDeadline <= 72) {
  urgencyScore = 40;
} else if (hoursUntilDeadline <= 168) {
  urgencyScore = 20;
} else {
  urgencyScore = 10;
}
```

**Example Calculations**:
- Task overdue by 5 hours: **100**
- Task due in 1 hour: **90**
- Task due tomorrow: **60**
- Task due in 4 days: **40**

---

### 2. Priority Score (35% Weight)

**Definition**: Your explicit assessment of task importance.

| Priority Level | Priority Score | How to Set |
|----------------|----------------|------------|
| **HIGH** | **100** | Critical, time-sensitive, must-dos |
| **MEDIUM** | **60** | Important but flexible timing |
| **LOW** | **30** | Nice-to-have, can be postponed |

**Priority Levels**: Set via UI dropdown or natural language command like "urgent" or "penting".

**Example**:
- "Write final report" → HIGH (100)
- "Review team presentation" → MEDIUM (60)
- "Organize desk" → LOW (30)

---

### 3. Reminder Score (15% Weight)

**Definition**: When do you want to be notified about this task?

| Reminder Time Before Deadline | Reminder Score | Example |
|-------------------------------|----------------|---------|
| `≤ 30 minutes` | **100** | "Ingatkan 30 menit sebelum deadline" |
| `30–60 minutes` | **70** | "Ingatkan 1 jam sebelum" |
| `> 60 minutes` | **40** | "Ingatkan 2 jam atau lebih awal" |

**Why This Matters**:
- If you set reminder = 30 minutes, you're signaling "I need to start soon".
- If you set reminder = 120 minutes, you're comfortable with less frequent alerts.

**Example**:
- Task with reminder 15 min before deadline: **100**
- Task with reminder 45 min before deadline: **70**
- Task with no reminder or 2 hours before: **40**

---

### 4. Duration Score (10% Weight)

**Definition**: How long will it take to complete this task?

| Estimated Duration | Duration Score | Interpretation |
|--------------------|----------------|----------------|
| `≤ 30 minutes` | **100** | Quick win — can be done immediately |
| `30–60 minutes` | **70** | Medium effort |
| `> 60 minutes` | **40** | Long task — requires focused time block |

**Why This Matters**:
- Low duration = higher score because it's easier to fit into your day.
- High duration tasks get lower scores because they require planning.

**Example**:
- "Send email" (15 min): **100**
- "Review code" (45 min): **70**
- "Write report" (3 hours): **40**

---

## Complete Example Calculations

### Scenario A: Critical Overdue Task
```
Task: "Submit exam paper"
Deadline: Already overdue (5 hours ago)
Priority: HIGH
Reminder: 30 minutes before
Duration: 45 minutes

Urgency:    100 (overdue)
Priority:   100 (HIGH)
Reminder:   100 (≤30 min)
Duration:   70 (30-60 min)

Score = (100 × 0.4) + (100 × 0.35) + (100 × 0.15) + (70 × 0.1)
      = 40 + 35 + 15 + 7
      = 97 → "DO THIS NOW!"
```

### Scenario B: Upcoming Medium Priority Task
```
Task: "Prepare presentation slides"
Deadline: Tomorrow (18 hours)
Priority: MEDIUM
Reminder: 60 minutes before
Duration: 2 hours

Urgency:    60 (18 hours)
Priority:   60 (MEDIUM)
Reminder:   70 (60 min)
Duration:   40 (>60 min)

Score = (60 × 0.4) + (60 × 0.35) + (70 × 0.15) + (40 × 0.1)
      = 24 + 21 + 10.5 + 4
      = 59.5 ≈ 60 → "Plan for tomorrow"
```

### Scenario C: Long-Term Low Priority Task
```
Task: "Organize personal files"
Deadline: 2 weeks from now
Priority: LOW
Reminder: 120 minutes before
Duration: 2 hours

Urgency:    10 (>168 hours)
Priority:   30 (LOW)
Reminder:   40 (>60 min)
Duration:   40 (>60 min)

Score = (10 × 0.4) + (30 × 0.35) + (40 × 0.15) + (40 × 0.1)
      = 4 + 10.5 + 6 + 4
      = 24.5 ≈ 25 → "Can be postponed"
```

---

---

## Adaptive Behavioral Insights

The system doesn't just calculate scores — it **learns your behavior patterns** over time and adapts its recommendations.

### Apa Itu Adaptive Behavioral Insights?

**Adaptive Behavioral Insights** adalah fitur sistem yang menilai kebiasaan kerja Anda dan memberikan rekomendasi personalisasi. Sistem ini menganalisis bagaimana Anda mendekati task dan menyesuaikan strategi produktivitas Anda.

**Analogi Sistem**:
Sistem membagi user menjadi dua archetype berdasarkan pola perilaku mereka:

### Behavioral Archetypes

#### 1. "Siput Loading" (Slow Starter)

| Aspek | Deskripsi |
|-------|----------|
| **Pola** | Ada niat, tapi progress lambat |
| **Gejala** | Task menumpuk dan sering di-skip karena underestimated |
| **Tips** | Targetkan **15 menit fokus** per sesi |

**Karakteristik**:
- Task sering tidak selesai tepat waktu
- Cenderung underestimate durasi task
- Sering menunda meskipun urgency tinggi
- Sulit memulai task besar

**Strategi yang Disarankan**:
1. Pecah task besar menjadi chunk 15 menit
2. Set reminder ≤ 30 menit sebelum deadline
3. Prioritaskan task dengan urgency tinggi
4. Hindari membuat terlalu banyak task sekaligus

#### 2. "Naga Deadline" (Deadline Dragon)

| Aspek | Deskripsi |
|-------|----------|
| **Pola** | Mode legenda — task tunduk semua |
| **Gejala** | Selesai task di menit-menit terakhir dengan hasil tinggi |
| **Tips** | Pertahankan **standar tinggi!** |

**Karakteristik**:
- Berhasil menyelesaikan task besar dalam waktu singkat
- Produktivitas meningkat drastis saat deadline mendekat
- Mampu menghasilkan kualitas tinggi di bawah tekanan
- Tidak masalah dengan waktu yang ketat

**Strategi yang Disarankan**:
1. Manfaatkan energi tinggi saat deadline mendekat
2. Pertahankan standar kualitas meskipun di crunch time
3. Tambahkan buffer time untuk durasi estimasi
4. Gunakan sistem reminder untuk menjaga momentum

### How the System Adapts

1. **Historical Analysis**:
   - Tracks average time from task creation to completion
   - Monitors how often you skip vs complete tasks
   - Correlates task scores with actual completion patterns

2. **Pattern Recognition**:
   - Detects if you consistently underestimate duration
   - Identifies your most productive hours
   - Adjusts reminder suggestions based on your response time

3. **Dynamic Recommendations**:
   - If you always start 2 hours before deadline → suggest setting reminder earlier
   - If you frequently skip tasks with duration > 2 hours → recommend breaking them down
   - If your urgency score is always high but completion is low → suggest planning earlier

---

## Implementation Details

### Backend Implementation
**File**: [`proyek-perangkat-lunak/backend/src/utils/priority.ts`](../../backend/src/utils/priority.ts)

```typescript
export const calculatePriorityScore = (factors: PriorityFactors): number => {
  const now = new Date();
  const deadlineTime = factors.deadline.getTime();
  const currentTime = now.getTime();
  const hoursUntilDeadline = (deadlineTime - currentTime) / (1000 * 60 * 60);
  
  // 1. Urgency (40%)
  let urgencyScore = hoursUntilDeadline < 0 ? 100 :
                     hoursUntilDeadline <= 2 ? 90 :
                     hoursUntilDeadline <= 6 ? 80 :
                     hoursUntilDeadline <= 24 ? 60 :
                     hoursUntilDeadline <= 72 ? 40 :
                     hoursUntilDeadline <= 168 ? 20 : 10;

  // 2. Priority (35%)
  const priorityScore = factors.priority === 'HIGH' ? 100 :
                        factors.priority === 'MEDIUM' ? 60 : 30;

  // 3. Reminder (15%)
  const reminderScore = factors.reminderTime <= 30 ? 100 :
                        factors.reminderTime <= 60 ? 70 : 40;

  // 4. Duration (10%)
  const durationScore = factors.estimatedDuration <= 30 ? 100 :
                        factors.estimatedDuration <= 60 ? 70 : 40;

  // Calculate weighted score
  const totalScore = 
    urgencyScore * 0.4 + priorityScore * 0.35 + 
    reminderScore * 0.15 + durationScore * 0.1;

  return Math.round(totalScore);
};
```

### API Endpoints

#### Calculate Task Priority
```bash
POST /api/tasks/:id/priority
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "taskId": "task-id",
    "score": 85
  }
}
```

### Frontend Display
**Component**: [`pemrograman-basis-data/TaskPlanner-VueJS-Frontend/src/components/EducationModal.vue`](../../frontend/src/components/EducationModal.vue)

The formula and its components are displayed in the **Education Modal** to help users understand how their tasks are prioritized.

---

## Usage Guide for Users

### 1. Understanding Your Task Queue

- **Score 85–100**: **URGENT** — Do these first
- **Score 60–84**: **IMPORTANT** — Schedule for today/tomorrow
- **Score 40–59**: **MODERATE** — Plan for this week
- **Score 0–39**: **LOW** — Can be postponed or delegated

### 2. Improving Your Task Scores

To increase a task's priority score:

| Goal | Action |
|------|--------|
| **Higher Urgency** | Move deadline closer (make it due sooner) |
| **Higher Priority** | Set to HIGH if it's truly critical |
| **Higher Reminder** | Set reminder ≤ 30 minutes before deadline |
| **Higher Duration** | Estimate shorter time (but be realistic) |

### 3. Real-World Examples

**Before Optimization**:
- Task: "Write documentation"
- Deadline: 3 days
- Priority: MEDIUM
- Reminder: 2 hours
- Duration: 4 hours
- **Score: ~45**

**After Optimization**:
- Task: "Write documentation"
- Deadline: **1 day** (moved closer)
- Priority: **HIGH** (it's critical for release)
- Reminder: **30 min** (be serious about not missing)
- Duration: **1.5 hours** (broken down into manageable chunks)
- **Score: ~78** ← Much better prioritization!

### 4. Common Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Setting all tasks to HIGH priority | No differentiation — all scores become similar | Use HIGH only for truly critical tasks |
| Setting reminder too far ahead | Lowers reminder score significantly | Set reminder ≤ 30 minutes for urgent tasks |
| Underestimating duration | Frequent skips, demotivation | Be realistic; add 20% buffer to estimates |
| Ignoring overdue tasks | Score stays at 100 but gets emotionally frustrating | Break overdue tasks into smaller pieces |

---

## Design Philosophy

### Why This Approach Works

1. **Balances Time & Importance**: 
   - Not all urgent tasks are important (urgent but low priority = interrupt)
   - Not all important tasks are urgent (important but not urgent = strategic work)

2. **Adapts to Real-World Constraints**:
   - Considers your actual available time (duration)
   - Uses your reminder preferences as intention signals

3. **Behaviorally Informed**:
   - Recognizes different working styles (Siput Loading vs Naga Deadline)
   - Provides personalized recommendations based on patterns

4. **Transparent & Educational**:
   - Formula is visible in the UI
   - Users understand why tasks are prioritized
   - Empowers users to optimize their own workflow

---

## Related Documentation

- [Backend Express API](../backend/README.md) — Full API documentation
- [Task Service Implementation](../../backend/src/modules/tasks/task.service.ts) — Core task logic
- [Priority Utilities](../../backend/src/utils/priority.ts) — Scoring algorithm source

---

## Feedback & Suggestions

Have ideas to improve the Adaptive Scoring System? We'd love to hear from you!

- Submit an issue in the repository
- Join our Discord community
- Share your use cases and workflows

---

**Last Updated**: 2026-06-23
**Version**: 1.0.0
