# 🚀 CORE MVP EXTENSION (Agentic Simplified)

> ⚠️ Section ini adalah refinement dari MVP agar lebih fokus (tanpa menghapus fitur existing di bawah).

---

## 🧠 CORE IDEA

> “We don’t help users manage tasks.  
> We decide what they should do next.”

---

## 🎯 CORE MVP SCOPE (WAJIB ADA)

Fokus hanya pada 1 flow utama:

👉 **Generate Today Plan secara otomatis**

---

## 🔥 CORE MVP FLOW

```
User input task
↓
System calculate priority
↓
Generate Today Plan
↓
User complete / skip
↓
System adapt (basic)
```

---

## ⚙️ CORE AGENTIC ENGINE

Tambahkan logic di backend:

```java
int calculatePriority(Task task) {
    int score = 0;

    int daysLeft = getDaysLeft(task.getDeadline());

    if (daysLeft <= 1) score += 5;
    else if (daysLeft <= 3) score += 3;
    else score += 1;

    if (task.getDifficulty().equals("hard")) score += 3;
    else if (task.getDifficulty().equals("medium")) score += 2;

    if (task.getSkipCount() > 3) score -= 2;

    return score;
}
```

---

## 🧠 NEW SERVICE (CORE)

Tambahkan file:

```
service/
 └── PlannerService.java   // CORE DECISION ENGINE
```

---

## 📋 CORE ENDPOINTS (WAJIB MVP)

Tambahkan endpoint berikut:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/planner/today` | Generate today's plan |
| POST | `/api/tasks/{id}/complete` | Mark task done |
| POST | `/api/tasks/{id}/skip` | Skip task |

---

## 🗄️ DATABASE EXTENSION

Tambahkan kolom:

```sql
ALTER TABLE Task ADD COLUMN difficulty VARCHAR(10);
ALTER TABLE Task ADD COLUMN skipCount INT DEFAULT 0;
ALTER TABLE Task ADD COLUMN priorityScore INT DEFAULT 0;
```

---

## 📌 IMPLEMENTATION NOTE

- Priority dihitung di `Service Layer`
- Sorting dilakukan sebelum response
- Limit task harian: **3–5 task saja**
- Fokus: keputusan cepat, bukan banyak fitur

---

# ⚖️ MVP vs EXISTING FEATURES

## ✅ CORE MVP (Fokus Utama)

- Input task (title, deadline, difficulty)
- Priority calculation
- Generate Today Plan
- Complete / Skip task
- Basic adaptation (skip behavior)

---

## 🟡 EXISTING FEATURES (Tetap Ada, Tapi Secondary)

Fitur di bawah ini tetap dipertahankan dari sistem kamu:

- CRUD Task (`/api/tasks`)
- Pagination
- Filtering
- Priority level endpoint
- Database structure existing
- Repository (JDBC)
- Service layer existing

👉 Tapi:
> **Tidak menjadi fokus utama MVP**

---

# 🚀 UPGRADE MVP (PHASE 2)

Tambahkan setelah MVP tervalidasi:

## 🧠 Advanced Agentic
- Behavior prediction
- Smart reschedule
- Dynamic difficulty

## 🤖 AI Integration
- Natural language input
- AI suggestion
- Task auto breakdown

## 📊 Dashboard
- Productivity score
- Streak system
- Analytics

## 🔔 Reminder System
- Smart notification
- Adaptive reminder

## 📱 Platform Expansion
- Mobile app
- Desktop app

---

# 🧠 FINAL INSIGHT

User tidak butuh banyak fitur.

User butuh:

> “Kasih tahu saya harus ngerjain apa hari ini.”

Kalau ini berhasil:
👉 aplikasi kamu sudah punya value yang beda.

---

# 🏁 CONCLUSION

## MVP:
- Simple
- Fast
- Decision-based

## Future:
- Intelligent
- Adaptive
- Personalized

---

**“We are not building a task manager.  
We are building a decision engine.”**
