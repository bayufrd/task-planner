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

Saat dokumentasi ini dibuat, folder backend baru berisi dokumentasi migrasi. Implementasi Express belum dibuat.

Checklist awal:

- [ ] Inisialisasi `package.json` khusus backend.
- [ ] Tambahkan Express.
- [ ] Tambahkan TypeScript backend.
- [ ] Tambahkan konfigurasi `tsconfig.json`.
- [ ] Tambahkan struktur `src/server.ts`.
- [ ] Tambahkan middleware JSON parser.
- [ ] Tambahkan CORS configuration untuk frontend Next.js.
- [ ] Tambahkan environment config.
- [ ] Integrasikan Prisma client.
- [ ] Tambahkan error handler standar.
- [ ] Tambahkan response helper standar.
- [ ] Tambahkan route health check.
- [ ] Tambahkan route auth.
- [ ] Tambahkan route tasks.
- [ ] Tambahkan route reminders.
- [ ] Tambahkan route calendar sync.

## Struktur Folder Rekomendasi

```text
backend/
├── README.md
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── server.ts
    ├── app.ts
    ├── config/
    │   ├── env.ts
    │   └── cors.ts
    ├── lib/
    │   ├── prisma.ts
    │   ├── response.ts
    │   └── errors.ts
    ├── middleware/
    │   ├── auth.ts
    │   ├── error-handler.ts
    │   └── validate.ts
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.routes.ts
    │   │   ├── auth.controller.ts
    │   │   └── auth.service.ts
    │   ├── tasks/
    │   │   ├── task.routes.ts
    │   │   ├── task.controller.ts
    │   │   ├── task.service.ts
    │   │   └── task.validation.ts
    │   ├── reminders/
    │   └── calendar/
    └── utils/
        └── priority.ts
```

## Target Endpoint Express

### Health

- [ ] `GET /health`

### Auth

- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/me`
- [ ] Google OAuth flow, final path to be decided:
  - [ ] `GET /api/auth/google`
  - [ ] `GET /api/auth/google/callback`

### Tasks

- [ ] `GET /api/tasks`
- [ ] `POST /api/tasks`
- [ ] `GET /api/tasks/:id`
- [ ] `PATCH /api/tasks/:id`
- [ ] `DELETE /api/tasks/:id`
- [ ] `PATCH /api/tasks/:id/status`
- [ ] `POST /api/tasks/:id/complete`
- [ ] `POST /api/tasks/:id/skip`
- [ ] `GET /api/tasks/stats`
- [ ] `POST /api/tasks/priority`

### Calendar Sync

- [ ] `POST /api/sync/calendar`

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

## Catatan Migrasi dari Next.js API

Selama migrasi:

1. Jangan menghapus Next.js API lama sebelum Express endpoint pengganti selesai dan frontend sudah diarahkan ke backend baru.
2. Tandai endpoint Next.js lama sebagai legacy.
3. Buat mapping endpoint lama ke endpoint Express baru.
4. Pastikan response contract konsisten.
5. Pastikan auth dan user ownership tetap aman.
6. Update dokumentasi dan roadmap setiap endpoint selesai dimigrasikan.