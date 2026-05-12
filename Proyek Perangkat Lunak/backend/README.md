# Backend Express — Smart Task Planner

Folder ini disiapkan sebagai tempat migrasi backend/API Smart Task Planner dari Next.js API Routes / Route Handlers menuju backend terpisah berbasis Express.

## Tujuan Migrasi

Backend Express akan menjadi pusat API untuk:

- Autentikasi regular email/password jika disetujui.
- Integrasi Google OAuth jika dipindahkan dari NextAuth.js atau dikombinasikan dengan flow backend.
- CRUD task.
- Status task `PENDING`, `DONE`, dan `SKIPPED`.
- Statistik task: jumlah `pending`, `done`, dan `skipped`.
- Priority calculation endpoint jika diperlukan.
- Reminder dan notification service.
- Google Calendar synchronization.
- Integrasi Prisma dan MySQL.

## Status Saat Ini

Backend Express telah diimplementasikan dengan struktur lengkap.

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
- [x] Tambahkan route auth (register, login, me).
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
- [ ] `POST /api/auth/logout` (opsional, JWT stateless)
- [ ] Google OAuth flow (belum diimplementasikan):
  - [ ] `GET /api/auth/google`
  - [ ] `GET /api/auth/google/callback`

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

Copy `.env.example` ke `.env` dan isi nilai yang sesuai:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="mysql://user:password@localhost:3306/taskplanner"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

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

Server akan berjalan di `http://localhost:5000`

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
curl http://localhost:5000/health
```

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Tasks (dengan token)
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
