# Roadmap API Endpoint Java vs Express

Dokumen ini membandingkan cakupan endpoint pada backend Java [`TaskPlanner-Java-Backend`](pemrograman-basis-data/TaskPlanner-Java-Backend) dengan backend Express [`proyek-perangkat-lunak/backend`](proyek-perangkat-lunak/backend).

Analisis dibuat berdasarkan route yang benar-benar terdaftar pada source code saat ini, terutama di [`TaskController`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:33), [`AuthController`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:23), dan [`createApp()`](proyek-perangkat-lunak/backend/src/app.ts:14).

## Ringkasan Singkat

- Backend Java **sudah mencakup hampir semua endpoint utama** untuk area task, reminder, dan AI yang ada di backend Express.
- Backend Java saat ini sudah memiliki:
  - health check
  - auth register/login/refresh/me/logout
  - CRUD task dasar
  - statistik task
  - update status task
  - skip task
  - kalkulasi priority task
  - reminders
  - AI endpoints
- Gap utama yang masih tersisa dibanding backend Express:
  - `POST /api/auth/sync`
  - Google OAuth endpoints
  - route internal WhatsApp webhook
  - beberapa detail logic masih versi sederhana/mock pada reminder dan AI

---

## 1. Checklist Ketersediaan Endpoint

### A. Health

- [x] Java memiliki `GET /api/health` via [`health()`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:18)
- [x] Express memiliki `GET /health` via [`createApp()`](proyek-perangkat-lunak/backend/src/app.ts:23)
- [x] Roadmap target dokumentasi health sudah disamakan ke `GET /api/health`

### B. Auth

- [x] Java memiliki `POST /api/auth/register` via [`register()`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:40)
- [x] Java memiliki `POST /api/auth/login` via [`login()`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:98)
- [x] Java memiliki `POST /api/auth/refresh` via [`refresh()`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:160)
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
- [x] Java memiliki `GET /api/tasks/stats`
- [x] Java memiliki `GET /api/tasks/stats/daily`
- [x] Java memiliki `GET /api/tasks/stats/weekly`
- [x] Java memiliki `PATCH /api/tasks/{id}/status`
- [x] Java memiliki `POST /api/tasks/{id}/priority`
- [x] Java memiliki `POST /api/tasks/{id}/skip`

### D. Reminders

- [x] Java sudah memiliki module reminders dasar setara endpoint Express
- [x] Java memiliki `POST /api/reminders`
- [x] Java memiliki `GET /api/reminders`
- [x] Java memiliki `GET /api/reminders/due`
- [x] Java memiliki `GET /api/reminders/{id}`
- [x] Java memiliki `PATCH /api/reminders/{id}`
- [x] Java memiliki `DELETE /api/reminders/{id}`

### E. AI

- [x] Java sudah memiliki module AI dasar setara endpoint Express
- [x] Java memiliki `POST /api/ai/parse-task`
- [x] Java memiliki `POST /api/ai/overview-analysis`

### F. Internal / Integrasi Lain

- [ ] Java belum memiliki route internal WhatsApp seperti `app.use('/internal/wa', ...)` pada [`createApp()`](proyek-perangkat-lunak/backend/src/app.ts:28)

---

## 2. Daftar Endpoint Express yang Menjadi Acuan

Berikut endpoint yang ditemukan dari route backend Express:

### Health
- `GET /api/health` *(target penyamaan untuk dokumentasi roadmap; implementasi Express saat ini masih `GET /health`)*

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/sync`
- `GET /api/auth/google` *(ditunda, checklist tetap dikosongkan)*
- `GET /api/auth/google/callback` *(ditunda, checklist tetap dikosongkan)*

Sumber: [`auth.routes.ts`](proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:11)

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

Sumber: [`task.routes.ts`](proyek-perangkat-lunak/backend/src/modules/tasks/task.routes.ts:13) dan [`task.skip.routes.ts`](proyek-perangkat-lunak/backend/src/modules/tasks/task.skip.routes.ts:7)

### Reminders
- `POST /api/reminders`
- `GET /api/reminders`
- `GET /api/reminders/due`
- `GET /api/reminders/:id`
- `PATCH /api/reminders/:id`
- `DELETE /api/reminders/:id`

Sumber: [`reminder.routes.ts`](proyek-perangkat-lunak/backend/src/modules/reminders/reminder.routes.ts:11)

### AI
- `POST /api/ai/parse-task`
- `POST /api/ai/overview-analysis`

Sumber: [`ai.routes.ts`](proyek-perangkat-lunak/backend/src/modules/ai/ai.routes.ts:9)

---

## 3. Tabel Perbandingan Endpoint

| Area | Endpoint Express | Status di Java | Endpoint Java Saat Ini | Catatan |
|---|---|---|---|---|
| Health | `GET /api/health` | Sebagian ada | `GET /api/health` | Java sudah sesuai target roadmap, Express masih `GET /health` |
| Auth | `POST /api/auth/register` | Ada | `POST /api/auth/register` | Sudah setara dasar |
| Auth | `POST /api/auth/login` | Ada | `POST /api/auth/login` | Sudah ada JWT login dengan message error terstruktur untuk email tidak terdaftar, password salah, dan server error |
| Auth | `POST /api/auth/refresh` | Ada | `POST /api/auth/refresh` | Sudah ada refresh access token dengan token rotation |
| Auth | `GET /api/auth/me` | Ada | `GET /api/auth/me` | Sudah mengambil profil user dari access token |
| Auth | `POST /api/auth/logout` | Ada | `POST /api/auth/logout` | Sudah mengosongkan token lokal pada account |
| Auth | `POST /api/auth/sync` | Belum ada | - | Perlu endpoint sinkronisasi session/token |
| Auth | `GET /api/auth/google` | Belum ada | - | Ditunda, tidak dikerjakan dahulu |
| Auth | `GET /api/auth/google/callback` | Belum ada | - | Ditunda, tidak dikerjakan dahulu |
| Tasks | `GET /api/tasks` | Ada | `GET /api/tasks` | Sudah ada list/pagination/filter |
| Tasks | `POST /api/tasks` | Ada | `POST /api/tasks` | Sudah ada create task |
| Tasks | `GET /api/tasks/:id` | Ada | `GET /api/tasks/{id}` | Sudah ada detail |
| Tasks | `PATCH /api/tasks/:id` | Sebagian ada | `PUT /api/tasks/{id}` | Fungsi update ada, method berbeda |
| Tasks | `PATCH /api/tasks/:id/status` | Ada | `PATCH /api/tasks/{id}/status` | Sudah ada update status khusus |
| Tasks | `DELETE /api/tasks/:id` | Ada | `DELETE /api/tasks/{id}` | Sudah ada delete |
| Tasks | `GET /api/tasks/stats` | Ada | `GET /api/tasks/stats` | Sudah ada statistik task |
| Tasks | `GET /api/tasks/stats/daily` | Ada | `GET /api/tasks/stats/daily` | Sudah ada statistik harian |
| Tasks | `GET /api/tasks/stats/weekly` | Ada | `GET /api/tasks/stats/weekly` | Sudah ada statistik mingguan |
| Tasks | `POST /api/tasks/:id/priority` | Ada | `POST /api/tasks/{id}/priority` | Sudah ada kalkulasi prioritas per endpoint |
| Tasks | `POST /api/tasks/:id/skip` | Ada | `POST /api/tasks/{id}/skip` | Sudah ada skip task |
| Reminders | `POST /api/reminders` | Ada | `POST /api/reminders` | Sudah ada implementasi reminder dasar in-memory |
| Reminders | `GET /api/reminders` | Ada | `GET /api/reminders` | Sudah ada list reminder |
| Reminders | `GET /api/reminders/due` | Ada | `GET /api/reminders/due` | Sudah ada due reminder |
| Reminders | `GET /api/reminders/:id` | Ada | `GET /api/reminders/{id}` | Sudah ada detail reminder |
| Reminders | `PATCH /api/reminders/:id` | Ada | `PATCH /api/reminders/{id}` | Sudah ada update reminder |
| Reminders | `DELETE /api/reminders/:id` | Ada | `DELETE /api/reminders/{id}` | Sudah ada delete reminder |
| AI | `POST /api/ai/parse-task` | Ada | `POST /api/ai/parse-task` | Sudah ada parser task heuristik |
| AI | `POST /api/ai/overview-analysis` | Ada sebagian | `POST /api/ai/ai/overview-analysis` | Java sudah ada overview analysis berbasis data task, tetapi belum ada cache/persistence database seperti `overviewAnalysisCache` di Express |
| Internal | `/internal/wa` | Belum ada | - | Integrasi internal belum ada |

---

## 4. Daftar Endpoint Java yang Sudah Ada

Berdasarkan implementasi saat ini di backend Java:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/stats`
- `GET /api/tasks/stats/daily`
- `GET /api/tasks/stats/weekly`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`
- `POST /api/tasks/{id}/priority`
- `POST /api/tasks/{id}/skip`
- `GET /api/tasks/priority/{level}`
- `POST /api/reminders`
- `GET /api/reminders`
- `GET /api/reminders/due`
- `GET /api/reminders/{id}`
- `PATCH /api/reminders/{id}`
- `DELETE /api/reminders/{id}`
- `POST /api/ai/parse-task`
- `POST /api/ai/overview-analysis`

Referensi implementasi:
- [`TaskPlannerApplication`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:12)
- [`AuthController`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:23)
- [`TaskController`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:33)

---

## 5. Apakah Endpoint Java Sudah Semua?

**Belum 100%.**

Jika backend Express dijadikan target acuan fitur, maka backend Java untuk area task, reminder, dan AI **sudah jauh lebih selaras**, tetapi masih belum lengkap pada area auth lanjutan dan integrasi internal.

### Yang masih belum ada pada Java

#### Auth
- `POST /api/auth/sync`
- `GET /api/auth/google` *(ditunda)*
- `GET /api/auth/google/callback` *(ditunda)*

#### Internal
- route internal `/internal/wa`

### Catatan perbedaan implementasi

#### Tasks
- `PATCH /api/tasks/{id}` sudah ada, tetapi Java juga masih mempertahankan `PUT /api/tasks/{id}`.

#### Reminders
- Endpoint reminders sudah ada, tetapi implementasi saat ini masih memakai penyimpanan in-memory pada [`ReminderController`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:16), belum persistence database seperti backend Express.

#### AI
- Endpoint AI sudah ada dan Java sudah memakai provider AI melalui [`AiService.analyzeOverview()`](pemrograman-basis-data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/service/AiService.java:123), tetapi hasil overview belum memiliki cache/persistence database seperti [`prisma.overviewAnalysisCache.upsert()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:657) di backend Express.

---

## 6. Prioritas Roadmap Implementasi untuk Java

Urutan prioritas yang disarankan:

### Prioritas 1 — Menyamakan Auth & Integrasi Inti
- [x] integrasikan frontend auto refresh terhadap `POST /api/auth/refresh`
- [ ] `POST /api/auth/sync`
- [ ] internal WhatsApp route

### Prioritas 2 — Integrasi Lanjutan
- [ ] Google OAuth flow

### Prioritas 3 — Pematangan Implementasi
- [ ] persistence database untuk reminders
- [ ] cache/persistence database untuk overview analysis AI
- [ ] penyelarasan logic AI agar setara backend Express

---

## 7. Kesimpulan

Jika tujuan backend Java hanya CRUD task dasar dan auth register/login/refresh/me/logout sederhana, implementasi sekarang sudah lebih dari cukup dan sudah mencakup task analytics, reminders, serta AI endpoints dasar.

Jika tujuan backend Java adalah menyamai backend Express di [`proyek-perangkat-lunak/backend`](proyek-perangkat-lunak/backend), maka untuk area endpoint task, reminder, dan AI Java **sudah hampir setara secara route**, frontend refresh token juga sudah terintegrasi, dan login sekarang sudah mengembalikan message error terstruktur. Bagian yang masih tertinggal ada pada `POST /api/auth/sync`, Google OAuth, route internal WhatsApp, persistence reminder, cache/persistence overview analysis AI, dan kedalaman logic AI. Endpoint Google OAuth tetap dikosongkan sebagai bagian yang ditunda.