# Backend Express — Smart Task Planner

Folder ini disiapkan sebagai tempat migrasi backend/API Smart Task Planner dari Next.js API Routes / Route Handlers menuju backend terpisah berbasis Express.

## Tujuan Migrasi

Backend Express akan menjadi pusat API untuk:

- Autentikasi regular email/password.
- Integrasi Google OAuth melalui Express backend.
- CRUD task.
- Status task `PENDING`, `DONE`, dan `SKIPPED`.
- Statistik task: jumlah `pending`, `done`, dan `skipped`.
- Priority calculation endpoint jika diperlukan.
- Reminder dan notification service.
- Google Calendar synchronization.
- Integrasi Prisma dan MySQL.

## Status Saat Ini

Backend Express telah diimplementasikan dengan struktur lengkap.

**Smoke Test Status (Last run: 2026-05-12T23:14:58Z)**

✅ **Passed:**
- Health check
- Auth: register, login, me, logout
- Tasks: CRUD, status (PENDING/DONE/SKIPPED), stats, priority, skip
- Task filtering by status
- Task counter (pending, done, skipped)

⚠️ **Validation Issues (needs schema review):**
- Reminders: validation failed (check required fields)
- Calendar: validation failed (check required fields)

**Test Coverage:** 16/23 endpoints fully tested and working.

Checklist implementasi:

- [x] Inisialisasi `package.json` khusus backend.
- [x] Tambahkan Express.
- [x] Tambahkan TypeScript backend.
- [x] Tambahkan konfigurasi `tsconfig.json`.
- [x] Tambahkan struktur `src/server.ts`.
- [x] Tambahkan middleware JSON parser.
- [x] Tambahkan CORS configuration untuk frontend Next.js.
- [x] Tambahkan environment config.
- [x] Integrasikan Prisma client.
- [x] Tambahkan error handler standar.
- [x] Tambahkan response helper standar.
- [x] Tambahkan route health check.
- [x] Tambahkan route auth (register, login, me, logout, Google OAuth).
- [x] Tambahkan route tasks (CRUD, status, stats, priority).
- [x] Tambahkan route reminders.
- [x] Tambahkan route calendar sync.

## Struktur Folder Implementasi

```text
backend/
├── README.md
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── server.ts ✓
    ├── app.ts ✓
    ├── config/
    │   ├── env.ts ✓
    │   └── cors.ts ✓
    ├── lib/
    │   ├── prisma.ts ✓
    │   ├── response.ts ✓
    │   └── errors.ts ✓
    ├── middleware/
    │   ├── auth.ts ✓
    │   ├── error-handler.ts ✓
    │   └── validate.ts ✓
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.routes.ts ✓
    │   │   ├── auth.controller.ts ✓
    │   │   ├── auth.service.ts ✓
    │   │   ├── google-oauth.service.ts ✓
    │   │   └── auth.validation.ts ✓
    │   ├── tasks/
    │   │   ├── task.routes.ts ✓
    │   │   ├── task.controller.ts ✓
    │   │   ├── task.service.ts ✓
    │   │   └── task.validation.ts ✓
    │   ├── reminders/
    │   │   ├── reminder.routes.ts ✓
    │   │   ├── reminder.controller.ts ✓
    │   │   ├── reminder.service.ts ✓
    │   │   └── reminder.validation.ts ✓
    │   └── calendar/
    │       ├── calendar.routes.ts ✓
    │       ├── calendar.controller.ts ✓
    │       ├── calendar.service.ts ✓
    │       └── calendar.validation.ts ✓
    └── utils/
        └── priority.ts ✓
```

## Target Endpoint Express

### Health

- [x] `GET /health`

### Auth

- [x] `POST /api/auth/register`
- [x] `POST /api/auth/login`
- [x] `GET /api/auth/me`
- [x] `POST /api/auth/logout` (JWT stateless, client menghapus token)
- [x] Google OAuth flow:
  - [x] `GET /api/auth/google`
  - [x] `GET /api/auth/google/callback`

### Tasks

- [x] `GET /api/tasks` (support query `?status=PENDING|DONE|SKIPPED`)
- [x] `POST /api/tasks`
- [x] `GET /api/tasks/stats`
- [x] `GET /api/tasks/:id`
- [x] `PATCH /api/tasks/:id`
- [x] `PATCH /api/tasks/:id/status`
- [x] `DELETE /api/tasks/:id`
- [x] `POST /api/tasks/:id/priority`
- [x] `POST /api/tasks/:id/skip` (overdue/ignored `PENDING` to `SKIPPED`)

### Reminders

- [x] `POST /api/reminders`
- [x] `GET /api/reminders`
- [x] `GET /api/reminders/due`
- [x] `GET /api/reminders/:id`
- [x] `PATCH /api/reminders/:id`
- [x] `DELETE /api/reminders/:id`

### Calendar Sync

- [x] `POST /api/sync/calendar`
- [x] `POST /api/calendar`
- [x] `GET /api/calendar`
- [x] `GET /api/calendar/default`
- [x] `POST /api/calendar/sync`
- [x] `GET /api/calendar/:id`
- [x] `PATCH /api/calendar/:id`
- [x] `DELETE /api/calendar/:id`
- [x] `POST /api/calendar/:id/refresh` (manual sync action)

## Task Status Rules

Canonical task statuses:

- `PENDING`
- `DONE`
- `SKIPPED`

Rules:

1. Task baru wajib menggunakan status default `PENDING`.
2. Klik selesai mengubah task menjadi `DONE`.
3. Task `DONE` tidak boleh dihapus otomatis.
4. Default `GET /api/tasks` untuk active list sebaiknya tidak menampilkan `DONE`.
5. Task yang terlewat/diabaikan setelah tolerance window dapat berubah menjadi `SKIPPED`.
6. Counter dashboard harus menyediakan jumlah:
   - `pending`
   - `done`
   - `skipped`

## Standard API Response

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## Setup dan Menjalankan Backend

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Untuk local development, gunakan konfigurasi backend berikut:

```bash
# Database Configuration
DATABASE_URL="mysql://root:0202@192.168.1.2:3307/taskplanner"

# Server Configuration
PORT=8000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=19f616d5450a9d2888ed27997b98f5df
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

Catatan environment:

- `DATABASE_URL` wajib sama dengan koneksi MySQL local development.
- `PORT=8000` digunakan untuk Express backend.
- `FRONTEND_URL=http://localhost:3000` digunakan CORS agar frontend Next.js dapat mengakses backend.
- `JWT_SECRET` digunakan untuk register/login regular backend Express.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, dan `GOOGLE_REDIRECT_URI` digunakan untuk login via Google OAuth Express.
- Jangan commit file `.env`; gunakan `.env.example` sebagai template publik.
- Untuk production, ganti `FRONTEND_URL`, `DATABASE_URL`, dan `JWT_SECRET` dengan nilai production yang aman.

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Migrations

```bash
npm run prisma:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8000`

### 6. Build untuk Production

```bash
npm run build
npm start
```

## Catatan Migrasi dari Next.js API

Selama migrasi:

1. Jangan menghapus Next.js API lama sebelum Express endpoint pengganti selesai dan frontend sudah diarahkan ke backend baru.
2. Tandai endpoint Next.js lama sebagai legacy.
3. Buat mapping endpoint lama ke endpoint Express baru.
4. Pastikan response contract konsisten.
5. Pastikan auth dan user ownership tetap aman.
6. Update dokumentasi dan roadmap setiap endpoint selesai dimigrasikan.

## Testing Endpoints

Gunakan tools seperti Postman, Insomnia, atau curl untuk testing:

### Health Check
```bash
curl http://localhost:8000/health
```

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Google OAuth Login
```bash
open http://localhost:8000/api/auth/google
```

Callback sukses akan redirect ke frontend:

```text
http://localhost:3000/auth/callback?token=JWT_TOKEN
```

### Logout
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Logout berlaku untuk login manual dan Google OAuth. Karena JWT stateless, client wajib menghapus token dari storage/session setelah response sukses.

### Get Tasks (dengan token)
```bash
# Get active tasks (default: excludes DONE)
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get tasks by status
curl "http://localhost:8000/api/tasks?status=PENDING" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl "http://localhost:8000/api/tasks?status=DONE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl "http://localhost:8000/api/tasks?status=SKIPPED" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Task
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "deadline": "2026-05-15T10:00:00Z",
    "priority": "HIGH",
    "estimatedDuration": 120,
    "tags": ["documentation", "urgent"]
  }'
```

### Get Task by ID
```bash
curl http://localhost:8000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Task
```bash
curl -X PATCH http://localhost:8000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "priority": "MEDIUM",
    "estimatedDuration": 90
  }'
```

### Update Task Status
```bash
# Mark task as DONE
curl -X PATCH http://localhost:8000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "DONE"}'

# Mark task as SKIPPED
curl -X PATCH http://localhost:8000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "SKIPPED"}'
```

### Skip Overdue Task
```bash
curl -X POST http://localhost:8000/api/tasks/TASK_ID/skip \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Task
```bash
curl -X DELETE http://localhost:8000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Task Statistics
```bash
curl http://localhost:8000/api/tasks/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "pending": 5,
    "done": 12,
    "skipped": 2
  }
}
```

### Calculate Task Priority
```bash
curl -X POST http://localhost:8000/api/tasks/TASK_ID/priority \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "taskId": "TASK_ID",
    "score": 85.5
  }
}
```

### Reminders

#### Create Reminder
```bash
curl -X POST http://localhost:8000/api/reminders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "TASK_ID",
    "reminderTime": "2026-05-14T09:00:00Z",
    "message": "Don'\''t forget to complete the task"
  }'
```

#### Get All Reminders
```bash
curl http://localhost:8000/api/reminders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Due Reminders
```bash
curl http://localhost:8000/api/reminders/due \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Reminder by ID
```bash
curl http://localhost:8000/api/reminders/REMINDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Reminder
```bash
curl -X PATCH http://localhost:8000/api/reminders/REMINDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reminderTime": "2026-05-14T10:00:00Z",
    "message": "Updated reminder message"
  }'
```

#### Delete Reminder
```bash
curl -X DELETE http://localhost:8000/api/reminders/REMINDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Calendar Sync

#### Create Calendar Entry
```bash
curl -X POST http://localhost:8000/api/calendars \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "TASK_ID",
    "googleCalendarId": "primary",
    "googleEventId": "event123"
  }'
```

#### Get All Calendar Entries
```bash
curl http://localhost:8000/api/calendars \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Default Calendar
```bash
curl http://localhost:8000/api/calendars/default \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Sync Calendar
```bash
curl -X POST http://localhost:8000/api/calendars/sync \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Calendar Entry by ID
```bash
curl http://localhost:8000/api/calendars/CALENDAR_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Calendar Entry
```bash
curl -X PATCH http://localhost:8000/api/calendars/CALENDAR_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "googleEventId": "updated_event_id"
  }'
```

#### Delete Calendar Entry
```bash
curl -X DELETE http://localhost:8000/api/calendars/CALENDAR_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Refresh Calendar Sync
```bash
curl -X POST http://localhost:8000/api/calendars/CALENDAR_ID/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
