# Roadmap API Endpoint Java vs Express

Dokumen ini membandingkan cakupan endpoint pada backend Java [`TaskPlanner-Java-Backend`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend) dengan backend Express [`Proyek Perangkat Lunak/backend`](Proyek%20Perangkat%20Lunak/backend).

Analisis dibuat berdasarkan route yang benar-benar terdaftar pada source code saat ini, terutama di [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:33), [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:23), dan [`createApp()`](Proyek%20Perangkat%20Lunak/backend/src/app.ts:14).

## Ringkasan Singkat

- Backend Java **belum** mencakup semua endpoint yang ada di backend Express.
- Backend Java saat ini fokus pada:
  - health check
  - auth dasar register/login
  - CRUD task dasar
  - filter task berdasarkan prioritas
- Backend Express memiliki cakupan lebih luas:
  - auth lanjutan
  - statistik task
  - skip task
  - reminders
  - calendars
  - AI endpoints
  - internal WhatsApp webhook route

---

## 1. Checklist Ketersediaan Endpoint

### A. Health

- [x] Java memiliki `GET /api/health` via [`health()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:18)
- [x] Express memiliki `GET /health` via [`createApp()`](Proyek%20Perangkat%20Lunak/backend/src/app.ts:23)
- [ ] Roadmap target penyamaan path health: Java perlu mengikuti path `GET /health` atau Express perlu mengikuti `GET /api/health`

### B. Auth

- [x] Java memiliki `POST /api/auth/register` via [`register()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:36)
- [x] Java memiliki `POST /api/auth/login` via [`login()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:75)
- [ ] Java belum memiliki `GET /api/auth/me`
- [ ] Java belum memiliki `POST /api/auth/logout`
- [ ] Java belum memiliki `GET /api/auth/google`
- [ ] Java belum memiliki `GET /api/auth/google/callback`
- [ ] Java belum memiliki `POST /api/auth/sync`
- [ ] Java belum memiliki proteksi auth middleware seperti Express pada endpoint privat

### C. Tasks

- [x] Java memiliki `GET /api/tasks`
- [x] Java memiliki `POST /api/tasks`
- [x] Java memiliki `GET /api/tasks/{id}`
- [ ] Java memakai `PUT /api/tasks/{id}`, sedangkan Express memakai `PATCH /api/tasks/:id`
- [x] Java memiliki `DELETE /api/tasks/{id}`
- [ ] Java belum memiliki `GET /api/tasks/stats`
- [ ] Java belum memiliki `GET /api/tasks/stats/daily`
- [ ] Java belum memiliki `GET /api/tasks/stats/weekly`
- [ ] Java belum memiliki `PATCH /api/tasks/{id}/status`
- [ ] Java belum memiliki `POST /api/tasks/{id}/priority`
- [ ] Java belum memiliki `POST /api/tasks/{id}/skip`

### D. Reminders

- [ ] Java belum memiliki module reminders setara Express
- [ ] Java belum memiliki `POST /api/reminders`
- [ ] Java belum memiliki `GET /api/reminders`
- [ ] Java belum memiliki `GET /api/reminders/due`
- [ ] Java belum memiliki `GET /api/reminders/{id}`
- [ ] Java belum memiliki `PATCH /api/reminders/{id}`
- [ ] Java belum memiliki `DELETE /api/reminders/{id}`

### E. Calendars

- [ ] Java belum memiliki module calendars setara Express
- [ ] Java belum memiliki `POST /api/calendars`
- [ ] Java belum memiliki `GET /api/calendars`
- [ ] Java belum memiliki `GET /api/calendars/default`
- [ ] Java belum memiliki `POST /api/calendars/sync`
- [ ] Java belum memiliki `GET /api/calendars/{id}`
- [ ] Java belum memiliki `PATCH /api/calendars/{id}`
- [ ] Java belum memiliki `DELETE /api/calendars/{id}`
- [ ] Java belum memiliki `POST /api/calendars/{id}/refresh`

### F. AI

- [ ] Java belum memiliki module AI setara Express
- [ ] Java belum memiliki `POST /api/ai/parse-task`
- [ ] Java belum memiliki `POST /api/ai/overview-analysis`

### G. Internal / Integrasi Lain

- [ ] Java belum memiliki route internal WhatsApp seperti `app.use('/internal/wa', ...)` pada [`createApp()`](Proyek%20Perangkat%20Lunak/backend/src/app.ts:28)

---

## 2. Daftar Endpoint Express yang Menjadi Acuan

Berikut endpoint yang ditemukan dari route backend Express:

### Health
- `GET /api/health` *(target penyamaan untuk dokumentasi roadmap; implementasi Express saat ini masih `GET /health`)*

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `POST /api/auth/sync`

Sumber: [`auth.routes.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/auth/auth.routes.ts:11)

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/stats`
- `GET /api/tasks/stats/daily`
- `GET /api/tasks/stats/weekly`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/priority`
- `POST /api/tasks/:id/skip`

Sumber: [`task.routes.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/tasks/task.routes.ts:13) dan [`task.skip.routes.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/tasks/task.skip.routes.ts:7)

### Reminders
- `POST /api/reminders`
- `GET /api/reminders`
- `GET /api/reminders/due`
- `GET /api/reminders/:id`
- `PATCH /api/reminders/:id`
- `DELETE /api/reminders/:id`

Sumber: [`reminder.routes.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/reminders/reminder.routes.ts:11)

### Calendars
- `POST /api/calendars`
- `GET /api/calendars`
- `GET /api/calendars/default`
- `POST /api/calendars/sync`
- `GET /api/calendars/:id`
- `PATCH /api/calendars/:id`
- `DELETE /api/calendars/:id`
- `POST /api/calendars/:id/refresh`

Sumber: [`calendar.routes.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/calendar/calendar.routes.ts:11) dan [`calendar.refresh.routes.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/calendar/calendar.refresh.routes.ts:7)

### AI
- `POST /api/ai/parse-task`
- `POST /api/ai/overview-analysis`

Sumber: [`ai.routes.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/ai/ai.routes.ts:9)

---

## 3. Tabel Perbandingan Endpoint

| Area | Endpoint Express | Status di Java | Endpoint Java Saat Ini | Catatan |
|---|---|---|---|---|
| Health | `GET /api/health` | Sebagian ada | `GET /api/health` | Java sudah sesuai target roadmap, Express masih `GET /health` |
| Auth | `POST /api/auth/register` | Ada | `POST /api/auth/register` | Sudah setara dasar |
| Auth | `POST /api/auth/login` | Ada | `POST /api/auth/login` | Sudah ada JWT login |
| Auth | `GET /api/auth/me` | Belum ada | - | Perlu endpoint profil user login |
| Auth | `POST /api/auth/logout` | Belum ada | - | Perlu endpoint logout |
| Auth | `GET /api/auth/google` | Belum ada | - | Belum ada OAuth flow |
| Auth | `GET /api/auth/google/callback` | Belum ada | - | Belum ada OAuth callback |
| Auth | `POST /api/auth/sync` | Belum ada | - | Belum ada sinkronisasi session/token |
| Tasks | `GET /api/tasks` | Ada | `GET /api/tasks` | Sudah ada list/pagination/filter |
| Tasks | `POST /api/tasks` | Ada | `POST /api/tasks` | Sudah ada create task |
| Tasks | `GET /api/tasks/:id` | Ada | `GET /api/tasks/{id}` | Sudah ada detail |
| Tasks | `PATCH /api/tasks/:id` | Sebagian ada | `PUT /api/tasks/{id}` | Fungsi update ada, method berbeda |
| Tasks | `PATCH /api/tasks/:id/status` | Belum ada | - | Belum ada update status khusus |
| Tasks | `DELETE /api/tasks/:id` | Ada | `DELETE /api/tasks/{id}` | Sudah ada delete |
| Tasks | `GET /api/tasks/stats` | Belum ada | - | Belum ada statistik task |
| Tasks | `GET /api/tasks/stats/daily` | Belum ada | - | Belum ada statistik harian |
| Tasks | `GET /api/tasks/stats/weekly` | Belum ada | - | Belum ada statistik mingguan |
| Tasks | `POST /api/tasks/:id/priority` | Belum ada | - | Belum ada kalkulasi prioritas per endpoint |
| Tasks | `POST /api/tasks/:id/skip` | Belum ada | - | Baru ada di roadmap Java |
| Reminders | `POST /api/reminders` | Belum ada | - | Modul belum ada |
| Reminders | `GET /api/reminders` | Belum ada | - | Modul belum ada |
| Reminders | `GET /api/reminders/due` | Belum ada | - | Modul belum ada |
| Reminders | `GET /api/reminders/:id` | Belum ada | - | Modul belum ada |
| Reminders | `PATCH /api/reminders/:id` | Belum ada | - | Modul belum ada |
| Reminders | `DELETE /api/reminders/:id` | Belum ada | - | Modul belum ada |
| Calendars | `POST /api/calendars` | Belum ada | - | Modul belum ada |
| Calendars | `GET /api/calendars` | Belum ada | - | Modul belum ada |
| Calendars | `GET /api/calendars/default` | Belum ada | - | Modul belum ada |
| Calendars | `POST /api/calendars/sync` | Belum ada | - | Modul belum ada |
| Calendars | `GET /api/calendars/:id` | Belum ada | - | Modul belum ada |
| Calendars | `PATCH /api/calendars/:id` | Belum ada | - | Modul belum ada |
| Calendars | `DELETE /api/calendars/:id` | Belum ada | - | Modul belum ada |
| Calendars | `POST /api/calendars/:id/refresh` | Belum ada | - | Modul belum ada |
| AI | `POST /api/ai/parse-task` | Belum ada | - | Modul AI belum ada |
| AI | `POST /api/ai/overview-analysis` | Belum ada | - | Modul AI belum ada |
| Internal | `/internal/wa` | Belum ada | - | Integrasi internal belum ada |

---

## 4. Daftar Endpoint Java yang Sudah Ada

Berdasarkan implementasi saat ini di backend Java:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `GET /api/tasks/priority/{level}`

Referensi implementasi:
- [`TaskPlannerApplication`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:12)
- [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:23)
- [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:33)

---

## 5. Apakah Endpoint Java Sudah Semua?

**Belum.**

Jika backend Express dijadikan target acuan fitur, maka backend Java masih belum lengkap.

### Yang belum ada pada Java

#### Auth
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `POST /api/auth/sync`

#### Tasks
- `GET /api/tasks/stats`
- `GET /api/tasks/stats/daily`
- `GET /api/tasks/stats/weekly`
- `PATCH /api/tasks/{id}/status`
- `POST /api/tasks/{id}/priority`
- `POST /api/tasks/{id}/skip`

#### Reminders
- `POST /api/reminders`
- `GET /api/reminders`
- `GET /api/reminders/due`
- `GET /api/reminders/{id}`
- `PATCH /api/reminders/{id}`
- `DELETE /api/reminders/{id}`

#### Calendars
- `POST /api/calendars`
- `GET /api/calendars`
- `GET /api/calendars/default`
- `POST /api/calendars/sync`
- `GET /api/calendars/{id}`
- `PATCH /api/calendars/{id}`
- `DELETE /api/calendars/{id}`
- `POST /api/calendars/{id}/refresh`

#### AI
- `POST /api/ai/parse-task`
- `POST /api/ai/overview-analysis`

#### Internal
- route internal `/internal/wa`

---

## 6. Prioritas Roadmap Implementasi untuk Java

Urutan prioritas yang disarankan:

### Prioritas 1 — Menyamakan Core Task & Auth
- [ ] `GET /api/auth/me`
- [ ] `POST /api/auth/logout`
- [ ] `PATCH /api/tasks/{id}/status`
- [ ] `POST /api/tasks/{id}/skip`
- [ ] `GET /api/tasks/stats`

### Prioritas 2 — Statistik & Decision Support
- [ ] `GET /api/tasks/stats/daily`
- [ ] `GET /api/tasks/stats/weekly`
- [ ] `POST /api/tasks/{id}/priority`

### Prioritas 3 — Integrasi Produktivitas
- [ ] seluruh module reminders
- [ ] seluruh module calendars

### Prioritas 4 — Integrasi Lanjutan
- [ ] Google OAuth flow
- [ ] session sync endpoint
- [ ] AI endpoints
- [ ] internal WhatsApp route

---

## 7. Kesimpulan

Jika tujuan backend Java hanya CRUD task dasar dan auth sederhana, implementasi sekarang sudah cukup berjalan.

Jika tujuan backend Java adalah menyamai backend Express di [`Proyek Perangkat Lunak/backend`](Proyek%20Perangkat%20Lunak/backend), maka endpoint Java **masih belum lengkap** dan masih tertinggal pada area auth lanjutan, analytics task, skip/status task, reminders, calendars, AI, dan integrasi internal.