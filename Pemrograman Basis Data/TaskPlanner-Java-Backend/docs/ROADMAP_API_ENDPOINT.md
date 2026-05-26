# Roadmap API Endpoint Java vs Express

Dokumen ini membandingkan cakupan endpoint pada backend Java [`TaskPlanner-Java-Backend`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend) dengan backend Express [`Proyek Perangkat Lunak/backend`](Proyek%20Perangkat%20Lunak/backend).

Analisis dibuat berdasarkan route yang benar-benar terdaftar pada source code saat ini, terutama di [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:33), [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:23), dan [`createApp()`](Proyek%20Perangkat%20Lunak/backend/src/app.ts:14).

## Ringkasan Singkat

- Backend Java **belum** mencakup semua endpoint yang ada di backend Express.
- Backend Java saat ini fokus pada:
  - health check
  - auth register/login/me/logout
  - CRUD task dasar
  - filter task berdasarkan prioritas
- Backend Express memiliki cakupan lebih luas:
  - auth lanjutan non-Google
  - statistik task
  - skip task
  - reminders
  - AI endpoints
  - internal WhatsApp webhook route

---

## 1. Checklist Ketersediaan Endpoint

### A. Health

- [x] Java memiliki `GET /api/health` via [`health()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:18)
- [x] Express memiliki `GET /health` via [`createApp()`](Proyek%20Perangkat%20Lunak/backend/src/app.ts:23)
- [x] Roadmap target dokumentasi health sudah disamakan ke `GET /api/health`

### B. Auth

- [x] Java memiliki `POST /api/auth/register` via [`register()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:36)
- [x] Java memiliki `POST /api/auth/login` via [`login()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:75)
- [x] Java memiliki `GET /api/auth/me`
- [x] Java memiliki `POST /api/auth/logout`
- [ ] Java belum memiliki `POST /api/auth/sync`
- [x] Java sudah memiliki verifikasi `Bearer token` minimal pada endpoint privat auth
- [ ] Java belum memiliki `GET /api/auth/google`
- [ ] Java belum memiliki `GET /api/auth/google/callback`

### C. Tasks

- [x] Java memiliki `GET /api/tasks`
- [x] Java memiliki `POST /api/tasks`
- [x] Java memiliki `GET /api/tasks/{id}`
- [x] Java sudah memiliki endpoint update task, meski masih memakai `PUT /api/tasks/{id}` dan belum `PATCH /api/tasks/:id`
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

### E. AI

- [ ] Java belum memiliki module AI setara Express
- [ ] Java belum memiliki `POST /api/ai/parse-task`
- [ ] Java belum memiliki `POST /api/ai/overview-analysis`

### F. Internal / Integrasi Lain

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
- `POST /api/auth/sync`
- `GET /api/auth/google` *(ditunda, checklist tetap dikosongkan)*
- `GET /api/auth/google/callback` *(ditunda, checklist tetap dikosongkan)*

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
| Auth | `GET /api/auth/me` | Ada | `GET /api/auth/me` | Sudah mengambil profil user dari access token |
| Auth | `POST /api/auth/logout` | Ada | `POST /api/auth/logout` | Sudah mengosongkan token lokal pada account |
| Auth | `POST /api/auth/sync` | Belum ada | - | Perlu endpoint sinkronisasi session/token |
| Auth | `GET /api/auth/google` | Belum ada | - | Ditunda, tidak dikerjakan dahulu |
| Auth | `GET /api/auth/google/callback` | Belum ada | - | Ditunda, tidak dikerjakan dahulu |
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
| AI | `POST /api/ai/parse-task` | Belum ada | - | Modul AI belum ada |
| AI | `POST /api/ai/overview-analysis` | Belum ada | - | Modul AI belum ada |
| Internal | `/internal/wa` | Belum ada | - | Integrasi internal belum ada |

---

## 4. Daftar Endpoint Java yang Sudah Ada

Berdasarkan implementasi saat ini di backend Java:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
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
- `POST /api/auth/sync`
- `GET /api/auth/google` *(ditunda)*
- `GET /api/auth/google/callback` *(ditunda)*

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

#### AI
- `POST /api/ai/parse-task`
- `POST /api/ai/overview-analysis`

#### Internal
- route internal `/internal/wa`

---

## 6. Prioritas Roadmap Implementasi untuk Java

Urutan prioritas yang disarankan:

### Prioritas 1 — Menyamakan Core Task & Auth
- [ ] `POST /api/auth/sync`
- [ ] `PATCH /api/tasks/{id}/status`
- [ ] `POST /api/tasks/{id}/skip`
- [ ] `GET /api/tasks/stats`

### Prioritas 2 — Statistik & Decision Support
- [ ] `GET /api/tasks/stats/daily`
- [ ] `GET /api/tasks/stats/weekly`
- [ ] `POST /api/tasks/{id}/priority`

### Prioritas 3 — Integrasi Produktivitas
- [ ] seluruh module reminders

### Prioritas 4 — Integrasi Lanjutan
- [ ] Google OAuth flow
- [ ] AI endpoints
- [ ] internal WhatsApp route

---

## 7. Kesimpulan

Jika tujuan backend Java hanya CRUD task dasar dan auth register/login/me/logout sederhana, implementasi sekarang sudah cukup berjalan.

Jika tujuan backend Java adalah menyamai backend Express di [`Proyek Perangkat Lunak/backend`](Proyek%20Perangkat%20Lunak/backend), maka endpoint Java **masih belum lengkap** dan masih tertinggal pada area auth non-Google untuk `sync`, analytics task, skip/status task, reminders, AI, dan integrasi internal. Endpoint Google OAuth tetap dikosongkan sebagai bagian yang ditunda.