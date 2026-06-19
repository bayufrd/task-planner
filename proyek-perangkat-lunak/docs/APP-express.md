# Dokumentasi Backend Express — Smart Task Planner

## 1. Ringkasan

Backend pada proyek ini adalah backend terpisah berbasis [`Express`](../backend/package.json) dan [`TypeScript`](../backend/package.json) yang berada di folder [`proyek-perangkat-lunak/backend`](../backend). Backend ini berfungsi sebagai pusat API untuk autentikasi, manajemen task, reminder, integrasi kalender, AI task parsing, serta integrasi WhatsApp internal.

Dari implementasi saat ini, backend **bukan** menggunakan Java/Spring dan **bukan** menggunakan JDBC sebagai data access utama. Data access yang dipakai adalah [`Prisma ORM`](../backend/src/lib/prisma.ts:1) di atas database [`MySQL`](../backend/prisma/schema.prisma:8).

Secara arsitektur, backend ini menggunakan pola modular yang cukup jelas:

- entrypoint server di [`src/server.ts`](../backend/src/server.ts:1),
- inisialisasi aplikasi Express di [`src/app.ts`](../backend/src/app.ts:1),
- konfigurasi environment di [`src/config/env.ts`](../backend/src/config/env.ts:1),
- akses database terpusat melalui [`src/lib/prisma.ts`](../backend/src/lib/prisma.ts:1),
- fitur dipisah per domain dalam folder [`src/modules`](../backend/src/modules).

## 2. Identitas dan Tujuan Backend

Berdasarkan [`backend/README.md`](../backend/README.md:1), backend ini dibuat untuk memigrasikan API dari Next.js API Routes menuju backend terpisah berbasis Express.

Tujuan utamanya mencakup:

- autentikasi email/password,
- **Google OAuth** (fully implemented with `googleapis` library),
- CRUD task,
- status task `PENDING`, `DONE`, `SKIPPED`,
- statistik task,
- reminder,
- sinkronisasi Google Calendar,
- integrasi AI,
- integrasi WhatsApp internal.

Referensi tujuan migrasi dijelaskan di [`backend/README.md`](../backend/README.md:5).

## 3. Stack Teknologi Backend

## 3.1 Runtime dan Bahasa

Stack utama backend:

- [`Node.js`](../backend/package.json) sebagai runtime,
- [`TypeScript`](../backend/package.json:39) sebagai bahasa utama,
- [`Express 4`](../backend/package.json:27) sebagai web framework,
- [`tsx`](../backend/package.json:39) untuk development runner.

Bukti script dan dependency ada di [`backend/package.json`](../backend/package.json:6).

## 3.2 Library Inti

Dependency utama yang dipakai:

- [`express`](../backend/package.json:27) — framework HTTP API,
- [`cors`](../backend/package.json:25) — pengaturan cross-origin,
- [`dotenv`](../backend/package.json:26) — membaca environment variables,
- [`jsonwebtoken`](../backend/package.json:29) — autentikasi JWT,
- [`bcrypt`](../backend/package.json:24) — hashing password,
- [`zod`](../backend/package.json:30) — validasi schema request,
- [`googleapis`](../backend/package.json:28) — integrasi Google OAuth/Calendar,
- [`@prisma/client`](../backend/package.json:23) — ORM client Prisma.

Dev dependency penting:

- [`prisma`](../backend/package.json:38),
- [`typescript`](../backend/package.json:40),
- [`@types/express`](../backend/package.json:35),
- [`@types/node`](../backend/package.json:37).

## 3.3 Database Stack

Lapisan database yang dipakai saat ini adalah:

- database engine: [`MySQL`](../backend/prisma/schema.prisma:9),
- akses data: [`PrismaClient`](../backend/src/lib/prisma.ts:1),
- connection source: environment variable [`DATABASE_URL`](../backend/src/config/env.ts:7).

Konfigurasi datasource ada di [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma:8):

- provider = `mysql`,
- url = `env("DATABASE_URL")`.

## 4. Apakah Backend Ini Express?

Ya. Backend ini jelas menggunakan Express.

Buktinya:

- aplikasi dibuat melalui [`express()`](../backend/src/app.ts:15),
- tipe aplikasi memakai [`Application`](../backend/src/app.ts:1),
- routing memakai [`app.use()`](../backend/src/app.ts:28),
- server start melalui [`app.listen()`](../backend/src/server.ts:15).

Jadi file dokumentasi [`APP-express.md`](./APP-express.md) sangat sesuai untuk backend ini.

## 5. Arsitektur Umum Backend

## 5.1 Entry Point

Alur startup backend:

1. [`startServer()`](../backend/src/server.ts:8) membuat aplikasi dari [`createApp()`](../backend/src/app.ts:14).
2. Backend melakukan test koneksi database lewat [`prisma.$connect()`](../backend/src/server.ts:11).
3. Jika sukses, server listen pada port dari [`env.PORT`](../backend/src/config/env.ts:8).
4. Setelah server aktif, scheduler [`taskAutoSkipScheduler.start()`](../backend/src/server.ts:16) dijalankan.

Ini menunjukkan backend tidak hanya request-response API biasa, tetapi juga memiliki background job scheduler.

## 5.2 Composition Root Aplikasi

Pada [`createApp()`](../backend/src/app.ts:14), susunan middleware dan route adalah:

- [`cors(corsOptions)`](../backend/src/app.ts:18),
- [`express.json()`](../backend/src/app.ts:19),
- [`express.urlencoded()`](../backend/src/app.ts:20),
- health check di [`GET /health`](../backend/src/app.ts:23),
- route domain per modul,
- 404 handler di [`src/app.ts`](../backend/src/app.ts:37),
- global error handler di [`src/app.ts`](../backend/src/app.ts:49).

## 5.3 Pola Modular

Struktur modul backend dipisahkan berdasarkan domain bisnis:

- [`modules/auth`](../backend/src/modules/auth),
- [`modules/tasks`](../backend/src/modules/tasks),
- [`modules/reminders`](../backend/src/modules/reminders),
- [`modules/calendar`](../backend/src/modules/calendar),
- [`modules/ai`](../backend/src/modules/ai),
- [`modules/whatsappInbound`](../backend/src/modules/whatsappInbound).

Ini berarti backend mengikuti pendekatan **feature-based modular structure**, bukan struktur file tunggal.

## 6. Routing dan Endpoint Utama

Registrasi route pada [`src/app.ts`](../backend/src/app.ts:27):

- [`/internal/wa`](../backend/src/app.ts:28) → WhatsApp inbound,
- [`/api/auth`](../backend/src/app.ts:29) → autentikasi,
- [`/api/tasks`](../backend/src/app.ts:30) → task utama,
- [`/api/tasks`](../backend/src/app.ts:31) → task skip route tambahan,
- [`/api/reminders`](../backend/src/app.ts:32) → reminder,
- [`/api/calendars`](../backend/src/app.ts:33) → calendar,
- [`/api/calendars`](../backend/src/app.ts:34) → calendar refresh,
- [`/api/ai`](../backend/src/app.ts:35) → AI.

Catatan: di [`backend/README.md`](../backend/README.md:144) masih ada beberapa referensi endpoint calendar lama seperti `/api/calendar`, tetapi implementasi aktif di kode memakai prefix [`/api/calendars`](../backend/src/app.ts:33). Ini penting dicatat agar dokumentasi mengikuti kode aktual, bukan hanya README.

### 6.1 Cloudflare Tunnel Integration

Backend mendukung deployment dengan Cloudflare Tunnel untuk expose local development atau production environment secara aman tanpa mengkonfigurasi firewall atau port forwarding.

Setup detail ada di dokumentasi [`CLOUDFLARED_SETUP.md`](./integrations/CLOUDFLARED_SETUP.md).

Key points untuk integrasi Cloudflare Tunnel:

- **Frontend URL**: Environment [`FRONTEND_URL`](../backend/src/config/env.ts:12) perlu diubah ke domain Cloudflare Tunnel (misal `https://app.yourdomain.com`)
- **Google OAuth Callback**: [`GOOGLE_REDIRECT_URI`](../backend/src/config/env.ts:20) otomatis mengikuti `FRONTEND_URL` + path callback
- **CORS Configuration**: [`cors.ts`](../backend/src/config/cors.ts:4) perlu include domain tunnel di `allowedOrigins`

Contoh environment untuk Cloudflare Tunnel:

```env
FRONTEND_URL=https://app.yourdomain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Dengan setup ini:
- User mengakses frontend via `https://app.yourdomain.com`
- API requests diarahkan ke `https://api.yourdomain.com`
- Google OAuth callback ke `https://api.yourdomain.com/api/auth/google/callback`
- Cloudflare Tunnel route traffic ke local ports (5173 untuk Vue dev, 8000 untuk Express backend)

## 7. Modul Autentikasi

Route autentikasi didefinisikan di [`auth.routes.ts`](../backend/src/modules/auth/auth.routes.ts:1).

Endpoint yang aktif:

- [`POST /api/auth/register`](../backend/src/modules/auth/auth.routes.ts:11),
- [`POST /api/auth/login`](../backend/src/modules/auth/auth.routes.ts:12),
- [`GET /api/auth/me`](../backend/src/modules/auth/auth.routes.ts:13),
- [`POST /api/auth/logout`](../backend/src/modules/auth/auth.routes.ts:14),
- [`GET /api/auth/google`](../backend/src/modules/auth/auth.routes.ts:17),
- [`GET /api/auth/google/callback`](../backend/src/modules/auth/auth.routes.ts:18),
- [`POST /api/auth/sync`](../backend/src/modules/auth/auth.routes.ts:19).

Karakteristik teknis:

- request register/login divalidasi dengan middleware [`validate()`](../backend/src/modules/auth/auth.routes.ts:11),
- endpoint profil memakai middleware [`authenticate`](../backend/src/modules/auth/auth.routes.ts:13),
- password di-hash menggunakan [`bcrypt`](../backend/package.json:24),
- token otentikasi memakai [`jsonwebtoken`](../backend/package.json:29),
- Google OAuth didukung melalui [`googleapis`](../backend/package.json:28).

Dari schema database, autentikasi juga masih kompatibel dengan ekosistem NextAuth karena tetap menyimpan model [`Account`](../backend/prisma/schema.prisma:39), [`Session`](../backend/prisma/schema.prisma:60), dan [`VerificationToken`](../backend/prisma/schema.prisma:71).

## 8. Modul Task

Task adalah domain inti aplikasi.

Route task didefinisikan di [`task.routes.ts`](../backend/src/modules/tasks/task.routes.ts:1). Semua route task wajib autentikasi melalui [`router.use(authenticate)`](../backend/src/modules/tasks/task.routes.ts:11).

Endpoint aktif:

- [`GET /api/tasks`](../backend/src/modules/tasks/task.routes.ts:13),
- [`POST /api/tasks`](../backend/src/modules/tasks/task.routes.ts:14),
- [`GET /api/tasks/stats`](../backend/src/modules/tasks/task.routes.ts:15),
- [`GET /api/tasks/stats/daily`](../backend/src/modules/tasks/task.routes.ts:16),
- [`GET /api/tasks/stats/weekly`](../backend/src/modules/tasks/task.routes.ts:17),
- [`GET /api/tasks/:id`](../backend/src/modules/tasks/task.routes.ts:18),
- [`PATCH /api/tasks/:id`](../backend/src/modules/tasks/task.routes.ts:19),
- [`PATCH /api/tasks/:id/status`](../backend/src/modules/tasks/task.routes.ts:20),
- [`DELETE /api/tasks/:id`](../backend/src/modules/tasks/task.routes.ts:21),
- [`POST /api/tasks/:id/priority`](../backend/src/modules/tasks/task.routes.ts:22).

## 8.1 Karakteristik Implementasi Task

Berdasarkan [`TaskService`](../backend/src/modules/tasks/task.service.ts:9):

- create task memakai [`prisma.task.create()`](../backend/src/modules/tasks/task.service.ts:13),
- default status task baru adalah `PENDING` di [`task.service.ts`](../backend/src/modules/tasks/task.service.ts:22),
- soft delete dilakukan dengan mengisi [`deletedAt`](../backend/src/modules/tasks/task.service.ts:176), bukan hard delete,
- daftar task default menyembunyikan task `DONE` melalui filter [`where.status = { not: 'DONE' }`](../backend/src/modules/tasks/task.service.ts:58),
- akses task dijaga ownership melalui pengecekan [`task.userId !== userId`](../backend/src/modules/tasks/task.service.ts:86),
- statistik task dihitung langsung dari tabel task lewat [`prisma.task.count()`](../backend/src/modules/tasks/task.service.ts:188).

## 8.2 Catatan Konsistensi Status

Ada temuan penting pada schema:

- komentar schema di [`Task.status`](../backend/prisma/schema.prisma:90) masih menyebut `TODO`, `IN_PROGRESS`, `DONE`,
- tetapi logic service nyata memakai `PENDING`, `DONE`, `SKIPPED` di [`task.service.ts`](../backend/src/modules/tasks/task.service.ts:22) dan [`backend/README.md`](../backend/README.md:159).

Artinya, secara implementasi aplikasi sudah bergerak ke model status:

- `PENDING`,
- `DONE`,
- `SKIPPED`.

Namun komentar schema masih menyisakan jejak model lama. Dokumentasi perlu menegaskan bahwa **status operasional aktual adalah `PENDING`, `DONE`, dan `SKIPPED`**.

## 9. Modul Reminder dan Scheduler

Backend ini tidak hanya menyimpan reminder, tetapi juga menjalankan background scheduler.

Indikasi utama:

- scheduler di-start melalui [`taskAutoSkipScheduler.start()`](../backend/src/server.ts:16),
- scheduler dihentikan saat graceful shutdown di [`src/server.ts`](../backend/src/server.ts:32),
- model reminder disimpan di [`Reminder`](../backend/prisma/schema.prisma:134),
- flag reminder tambahan pada task disimpan di [`Task`](../backend/prisma/schema.prisma:93).

Flag reminder pada task:

- [`reminderSent`](../backend/prisma/schema.prisma:94),
- [`reminder24hSent`](../backend/prisma/schema.prisma:95),
- [`reminder1hSent`](../backend/prisma/schema.prisma:96),
- [`reminderDeadlineSent`](../backend/prisma/schema.prisma:97),
- [`skippedNotificationSent`](../backend/prisma/schema.prisma:98).

Ini menandakan reminder engine backend mendukung dedup notifikasi dan auto-skip task yang lewat deadline.

## 10. Modul Calendar

Backend memiliki modul kalender pada folder [`src/modules/calendar`](../backend/src/modules/calendar).

Fungsinya meliputi:

- penyimpanan data kalender user,
- multi-calendar support,
- sinkronisasi Google Calendar,
- refresh manual calendar sync.

Di schema database, model [`Calendar`](../backend/prisma/schema.prisma:155) memiliki field:

- `calendarId`,
- `name`,
- `description`,
- `type`,
- `color`,
- `isDefault`,
- `isSynced`.

Artinya integrasi kalender di backend bukan sekadar stateless proxy, melainkan menyimpan metadata kalender milik user di database.

## 11. Modul AI

Integrasi AI ada di [`AiService`](../backend/src/modules/ai/ai.service.ts:217).

## 11.1 Provider AI

Backend tidak memanggil OpenAI SDK langsung. Implementasi saat ini menggunakan endpoint kompatibel chat API melalui environment:

- [`NINE_ROUTER_API`](../backend/src/config/env.ts:16),
- [`NINE_ROUTER_API_KEY`](../backend/src/config/env.ts:17),
- [`NINE_ROUTER_MODEL`](../backend/src/config/env.ts:18).

Default model yang didefinisikan adalah [`cx/gpt-5.2`](../backend/src/modules/ai/ai.service.ts:45).

Artinya backend memakai **9Router / OpenAI-compatible endpoint style** dengan `fetch`, bukan SDK vendor tertentu.

## 11.2 Fungsi AI

Dua fungsi besar AI:

1. parsing command task natural language melalui [`parseTaskCommand()`](../backend/src/modules/ai/ai.service.ts:218),
2. resolver plan aksi WhatsApp melalui [`resolveWhatsappPlan()`](../backend/src/modules/ai/ai.service.ts:326).

Kemampuan parser:

- parsing bahasa Indonesia dan Inggris,
- menentukan title,
- deadline ISO-8601,
- priority,
- estimated duration,
- tags,
- reminder time.

## 11.3 Penanganan Waktu Indonesia

Backend punya helper internal untuk menjaga konteks waktu `Asia/Jakarta`:

- [`getJakartaDateParts()`](../backend/src/modules/ai/ai.service.ts:96),
- [`createJakartaDate()`](../backend/src/modules/ai/ai.service.ts:121),
- [`applyIndonesianTimeHints()`](../backend/src/modules/ai/ai.service.ts:139).

Ini penting karena command seperti “besok jam 9 malam” atau “jam 6 sore” dipaksa konsisten ke WIB, bukan timezone server.

## 12. Modul WhatsApp Internal

Backend memiliki endpoint internal WhatsApp di [`/internal/wa`](../backend/src/app.ts:28) dengan dokumentasi rinci di [`WHATSAPP_INBOUND.md`](./api-external/WHATSAPP_INBOUND.md).

Fungsi utama modul ini:

- linking nomor WhatsApp ke user,
- menerima command `task ...`,
- menjalankan AI-first resolution untuk action task,
- mengirim balasan WhatsApp personal,
- mengaktifkan reminder personal via scheduler.

Implementasi ini bersifat **internal service integration**, bukan public API frontend biasa.

## 13. Konfigurasi Environment

Environment dibaca dari file backend lokal melalui [`dotenv.config({ path: __dirname + '/../../.env' })`](../backend/src/config/env.ts:4).

Ini berarti backend mengharapkan file `.env` berada di folder [`proyek-perangkat-lunak/backend`](../backend), bukan di root workspace.

Environment penting:

- [`DATABASE_URL`](../backend/src/config/env.ts:7),
- [`PORT`](../backend/src/config/env.ts:8),
- [`NODE_ENV`](../backend/src/config/env.ts:9),
- [`JWT_SECRET`](../backend/src/config/env.ts:10),
- [`JWT_EXPIRES_IN`](../backend/src/config/env.ts:11),
- [`FRONTEND_URL`](../backend/src/config/env.ts:12),
- [`TOKEN_WHATSAPP`](../backend/src/config/env.ts:13),
- [`WHATSAPP_BOT_URL`](../backend/src/config/env.ts:14),
- [`NINE_ROUTER_API`](../backend/src/config/env.ts:16),
- [`NINE_ROUTER_API_KEY`](../backend/src/config/env.ts:17),
- [`NINE_ROUTER_MODEL`](../backend/src/config/env.ts:18),
- [`TURNSTILE_SECRET_KEY`](../backend/src/config/env.ts:22).

Validasi minimum environment saat startup mewajibkan:

- [`DATABASE_URL`](../backend/src/config/env.ts:26),
- [`JWT_SECRET`](../backend/src/config/env.ts:26).

## 14. CORS dan Integrasi Frontend

CORS dikonfigurasi di [`src/config/cors.ts`](../backend/src/config/cors.ts:1).

Origin yang diizinkan:

- [`env.FRONTEND_URL`](../backend/src/config/cors.ts:7),
- `http://localhost:3000`,
- `https://taskplanner.dastrevas.com`.

Method yang diizinkan tercantum di [`cors.ts`](../backend/src/config/cors.ts:19), dan header utama yang diizinkan adalah [`Content-Type`](../backend/src/config/cors.ts:20) serta [`Authorization`](../backend/src/config/cors.ts:20).

Ini menunjukkan backend memang dirancang untuk dikonsumsi frontend web Task Planner dan domain production Dastrevas.

## 15. Database yang Dipakai

## 15.1 Jenis Database

Database yang dipakai saat ini adalah **MySQL**.

Bukti utama:

- provider datasource Prisma adalah [`mysql`](../backend/prisma/schema.prisma:9),
- keyword project juga mencantumkan [`mysql`](../backend/package.json:18),
- contoh environment di README memakai URL koneksi MySQL di [`backend/README.md`](../backend/README.md:236).

## 15.2 Model Data Utama

Model utama pada schema:

- [`User`](../backend/prisma/schema.prisma:14),
- [`Account`](../backend/prisma/schema.prisma:39),
- [`Session`](../backend/prisma/schema.prisma:60),
- [`VerificationToken`](../backend/prisma/schema.prisma:71),
- [`Task`](../backend/prisma/schema.prisma:80),
- [`TaskTag`](../backend/prisma/schema.prisma:121),
- [`Reminder`](../backend/prisma/schema.prisma:134),
- [`Calendar`](../backend/prisma/schema.prisma:155),
- [`OverviewAnalysisCache`](../backend/prisma/schema.prisma:176).

## 15.3 Relasi Data

Relasi penting:

- satu [`User`](../backend/prisma/schema.prisma:14) punya banyak [`Task`](../backend/prisma/schema.prisma:30),
- satu [`Task`](../backend/prisma/schema.prisma:80) punya banyak [`TaskTag`](../backend/prisma/schema.prisma:110),
- satu [`User`](../backend/prisma/schema.prisma:14) punya banyak [`Reminder`](../backend/prisma/schema.prisma:31),
- satu [`Reminder`](../backend/prisma/schema.prisma:134) dapat terkait ke satu [`Task`](../backend/prisma/schema.prisma:139),
- satu [`User`](../backend/prisma/schema.prisma:14) punya banyak [`Calendar`](../backend/prisma/schema.prisma:32),
- satu [`User`](../backend/prisma/schema.prisma:14) punya satu cache overview [`OverviewAnalysisCache`](../backend/prisma/schema.prisma:33).

## 15.4 Akses Data Aktual

Akses data dominan memakai Prisma Client, misalnya:

- [`prisma.task.create()`](../backend/src/modules/tasks/task.service.ts:13),
- [`prisma.task.findMany()`](../backend/src/modules/tasks/task.service.ts:61),
- [`prisma.task.findUnique()`](../backend/src/modules/tasks/task.service.ts:75),
- [`prisma.task.update()`](../backend/src/modules/tasks/task.service.ts:117),
- [`prisma.task.count()`](../backend/src/modules/tasks/task.service.ts:189).

Ada juga penggunaan raw SQL terbatas melalui [`prisma.$executeRawUnsafe()`](../backend/src/modules/tasks/task.service.ts:29) untuk reset flag reminder setelah create task.

Jadi pola data access yang digunakan adalah:

- **utama**: ORM Prisma,
- **sekunder**: raw SQL Prisma untuk kasus khusus.

## 16. Apakah Bisa Menggunakan JDBC?

## 16.1 Jawaban Singkat

Untuk backend yang ada sekarang: **tidak secara native**.

Alasannya sederhana: JDBC adalah teknologi akses database dari ekosistem Java. Sementara backend ini berjalan di stack:

- [`Node.js`](../backend/package.json),
- [`TypeScript`](../backend/package.json:40),
- [`Express`](../backend/package.json:27).

Backend ini tidak memiliki runtime Java, tidak memakai Spring, dan tidak menggunakan driver JDBC di implementasinya.

## 16.2 Kenapa Tidak Menggunakan JDBC

JDBC membutuhkan:

- runtime Java,
- driver JDBC seperti MySQL Connector/J,
- codebase Java yang memanggil connection, statement, prepared statement, result set.

Sedangkan backend ini memakai:

- [`PrismaClient`](../backend/src/lib/prisma.ts:1),
- query model Prisma seperti [`prisma.task.findMany()`](../backend/src/modules/tasks/task.service.ts:61),
- environment style Node.js di [`env.ts`](../backend/src/config/env.ts:1).

Artinya, dari sisi teknologi, JDBC tidak cocok dimasukkan langsung ke backend Express ini.

## 16.3 Kalau Tetap Ingin Pakai JDBC, Bagaimana?

Ada 3 opsi realistis:

### Opsi A — Tetap pakai backend sekarang tanpa JDBC

Ini opsi paling konsisten.

Gunakan:

- Express + TypeScript,
- Prisma,
- MySQL.

Kelebihan:

- sesuai implementasi saat ini,
- maintenance lebih mudah,
- type-safe di TypeScript,
- migration dan schema terkelola Prisma.

### Opsi B — Bangun backend Java terpisah yang memakai JDBC

Kalau kebutuhan akademik atau mata kuliah mengharuskan JDBC, maka solusinya bukan memaksa JDBC ke backend Express, tetapi membuat **service Java terpisah**.

Menariknya, di repository ini memang sudah ada project Java backend terpisah di [`pemrograman-basis-data/TaskPlanner-Java-Backend`](../../pemrograman-basis-data/TaskPlanner-Java-Backend).

Itu bisa menjadi basis bila ingin:

- membangun API versi Java,
- memakai JDBC langsung,
- atau memakai Spring JDBC / JPA.

### Opsi C — Migrasi total backend Express ke Java

Bisa dilakukan, tetapi konsekuensinya besar:

- seluruh route Express perlu ditulis ulang,
- middleware auth perlu diganti,
- Prisma schema perlu diterjemahkan ke entity/repository Java,
- modul AI, WhatsApp, reminder scheduler, dan calendar perlu diport.

Ini bukan perubahan kecil.

## 16.4 Kesimpulan JDBC

- **Backend yang sedang dianalisis tidak memakai JDBC.**
- **Backend ini memakai Prisma ORM di atas MySQL.**
- **JDBC baru relevan jika memakai backend Java terpisah atau migrasi stack ke Java.**

## 17. ORM atau Query Manual?

Backend ini dominan memakai ORM, yaitu Prisma.

Kelebihan pendekatan ini dalam proyek sekarang:

- model data terpusat di [`schema.prisma`](../backend/prisma/schema.prisma),
- CRUD lebih cepat dikembangkan,
- relasi user-task-reminder-calendar lebih jelas,
- cocok dengan TypeScript,
- integrasi migration lebih mudah.

Namun ada indikasi satu area yang masih memakai workaround SQL manual di [`task.service.ts`](../backend/src/modules/tasks/task.service.ts:29). Ini memberi sinyal bahwa schema/database evolution masih aktif dan belum seluruhnya rapi pada level ORM murni.

## 18. Keamanan dan Validasi

Lapisan keamanan backend:

- validasi body menggunakan [`zod`](../backend/package.json:30),
- middleware autentikasi JWT melalui [`authenticate`](../backend/src/modules/auth/auth.routes.ts:13),
- CORS whitelist di [`cors.ts`](../backend/src/config/cors.ts:4),
- global error handler di [`errorHandler`](../backend/src/app.ts:49),
- validasi environment wajib di [`env.ts`](../backend/src/config/env.ts:25).

Untuk WhatsApp internal, keamanan tambahan memakai token service internal seperti dijelaskan di dokumentasi [`WHATSAPP_INBOUND.md`](./api-external/WHATSAPP_INBOUND.md).

## 19. Kelebihan Arsitektur Backend Saat Ini

Kelebihan utama backend ini:

1. **Modular** — domain dipisah per folder modul.
2. **Type-safe** — memakai TypeScript dan Prisma.
3. **Cukup lengkap** — auth, tasks, reminders, calendar, AI, WhatsApp.
4. **Mendukung background processing** — ada scheduler auto-skip/reminder.
5. **Siap integrasi frontend** — CORS dan route sudah jelas.
6. **Mendukung AI workflow modern** — parsing task natural language dan WhatsApp action plan.

## 20. Temuan Teknis Penting

Beberapa temuan yang penting untuk dicatat:

### 20.1 Ketidakkonsistenan dokumentasi vs implementasi

README backend masih memiliki referensi route calendar lama di [`backend/README.md`](../backend/README.md:144), sementara kode aktif memakai [`/api/calendars`](../backend/src/app.ts:33).

### 20.2 Komentar schema status belum sepenuhnya sinkron

Komentar di [`Task.status`](../backend/prisma/schema.prisma:90) belum mencerminkan penuh status operasional aktual.

### 20.3 Masih ada raw SQL workaround

Penggunaan [`prisma.$executeRawUnsafe()`](../backend/src/modules/tasks/task.service.ts:29) menunjukkan ada area yang masih perlu perapihan agar konsisten dengan Prisma/migration schema.

### 20.4 Integrasi AI bergantung pada environment eksternal

Fitur AI tidak akan berjalan jika [`NINE_ROUTER_API`](../backend/src/config/env.ts:16) dan [`NINE_ROUTER_API_KEY`](../backend/src/config/env.ts:17) belum diisi.

## 21. Rekomendasi Teknis

Rekomendasi untuk backend ini:

1. rapikan dokumentasi endpoint agar sama persis dengan route aktif di [`src/app.ts`](../backend/src/app.ts:27),
2. sinkronkan komentar schema task dengan status bisnis aktual,
3. kurangi penggunaan raw SQL workaround jika field Prisma sudah stabil,
4. tambahkan test otomatis untuk AI, scheduler, dan WhatsApp inbound,
5. pertahankan Prisma + MySQL bila targetnya konsistensi stack Node.js,
6. gunakan backend Java terpisah bila memang ada tuntutan penggunaan JDBC.

## 22. Kesimpulan Final

Backend pada [`proyek-perangkat-lunak/backend`](../backend) adalah **backend Express berbasis TypeScript** dengan **Prisma ORM** dan **database MySQL**.

Ringkasan akhir:

- framework backend: [`Express`](../backend/package.json:27),
- bahasa: [`TypeScript`](../backend/package.json:40),
- runtime: Node.js,
- ORM: [`Prisma`](../backend/src/lib/prisma.ts:1),
- database: [`MySQL`](../backend/prisma/schema.prisma:9),
- auth: JWT + Google OAuth,
- fitur domain: task, reminder, calendar, AI, WhatsApp inbound,
- background process: auto-skip scheduler dan reminder,
- **JDBC tidak digunakan dan tidak menjadi pilihan native pada backend ini**.

Jika pertanyaannya adalah “stack pakai apa dan database apa apakah bisa pakai JDBC atau tidak?”, maka jawaban paling tepat adalah:

> Backend ini memakai **Express + TypeScript + Prisma + MySQL**.
> Database-nya **MySQL**.
> **Tidak memakai JDBC** pada implementasi sekarang.
> Jika ingin JDBC, harus memakai backend Java terpisah atau migrasi stack ke Java.

## 23. Rekondisi Endpoint Auth untuk Kebutuhan Mobile Sementara

Bagian ini menjelaskan penyesuaian backend yang disarankan agar aplikasi mobile dapat memakai auth native tanpa memaksa refactor besar pada flow web yang sekarang berjalan di [`/auth/signin`](../src/app/auth/signin/page.tsx:103), [`/auth/signup`](../src/app/auth/signup/page.tsx:109), dan sinkronisasi NextAuth ke Express pada [`syncNextAuth()`](../backend/src/modules/auth/auth.controller.ts:144).

### 23.1 Kenapa endpoint khusus mobile diperlukan

Kebutuhan endpoint khusus mobile muncul karena flow auth web saat ini masih browser-centric:

- login/register web lama bergantung pada schema validasi yang mewajibkan `captchaToken` di [`auth.validation.ts`](../backend/src/modules/auth/auth.validation.ts:3),
- Google login web melewati NextAuth lalu disinkronkan ke backend melalui [`POST /api/auth/sync`](../backend/src/modules/auth/auth.routes.ts:19),
- aplikasi mobile saat ini masih memakai bridge WebView pada [`WebViewAuth`](../../pemrograman-mobile/src/components/WebViewAuth.tsx:13), bukan kontrak backend native yang bersih.

Karena itu, menambah endpoint client baru lebih aman daripada mengubah default endpoint auth lama yang sudah dipakai web.

### 23.2 Ruang lingkup sementara yang disarankan

Ruang lingkup penyesuaian backend sementara yang kini sudah diterapkan dibatasi pada:

- menambah [`POST /api/auth/login-client`](../backend/src/modules/auth/auth.routes.ts:26) untuk login credentials mobile/non-web,
- menambah [`POST /api/auth/register-client`](../backend/src/modules/auth/auth.routes.ts:25) untuk registrasi mobile/non-web,
- menambah [`POST /api/auth/google/mobile`](../backend/src/modules/auth/auth.routes.ts:33) untuk login Google mobile native,
- menambah [`POST /api/auth/refresh`](../backend/src/modules/auth/auth.routes.ts:34) untuk rotasi refresh token mobile tanpa mengubah flow web lama.

Prinsip implementasinya tetap reuse service auth yang sudah ada di [`AuthService.register()`](../backend/src/modules/auth/auth.service.ts:21) dan [`AuthService.login()`](../backend/src/modules/auth/auth.service.ts:55), lalu membedakan validation/controller layer untuk client baru di [`auth.validation.ts`](../backend/src/modules/auth/auth.validation.ts:18) dan [`AuthController`](../backend/src/modules/auth/auth.controller.ts:28).

### 23.3 Dampak ke backend yang sudah ada

Dampak yang diterapkan sengaja dibuat kecil:

- route auth bertambah, tetapi endpoint lama tetap dipertahankan,
- schema validasi baru ditambahkan tanpa menghapus validasi web lama,
- service domain auth tetap dipakai ulang,
- kontrak response tetap mempertahankan pasangan `token` dan `user` agar konsisten dengan pola lama,
- controller client baru menambahkan logging metadata dasar `clientType`, `platform`, `deviceId`, dan `appVersion` bila tersedia.

Dengan pendekatan ini, perubahan lebih banyak terjadi pada lapisan masuk request daripada pada inti domain auth.

### 23.4 Prinsip kompatibilitas terhadap flow web yang sudah berjalan

Agar flow web tetap stabil, prinsip kompatibilitasnya adalah:

- jangan ubah perilaku default [`POST /api/auth/login`](../backend/src/modules/auth/auth.routes.ts:12),
- jangan ubah perilaku default [`POST /api/auth/register`](../backend/src/modules/auth/auth.routes.ts:11),
- jangan ubah fungsi [`POST /api/auth/sync`](../backend/src/modules/auth/auth.routes.ts:19) sebagai bridge dari NextAuth web,
- jangan ubah callback Google web pada [`googleCallback()`](../backend/src/modules/auth/auth.controller.ts:121),
- semua perilaku baru untuk mobile harus bersifat opt-in melalui endpoint baru.

CAPTCHA web juga tetap dipertahankan pada flow lama. Endpoint mobile baru tidak mewajibkan CAPTCHA, tetapi kini kompensasinya sudah mencakup rate limiting in-memory per route client di [`rate-limit.ts`](../backend/src/middleware/rate-limit.ts:41), logging metadata dasar, serta challenge code awal seperti `CAPTCHA_REQUIRED` dan `RISK_CHALLENGE_REQUIRED` saat threshold abuse terlampaui.

### 23.5 Endpoint yang sekarang tersedia untuk mobile

Endpoint auth tambahan yang sekarang tersedia di backend adalah:

- [`POST /api/auth/register-client`](../backend/src/modules/auth/auth.routes.ts:25) menerima `name`, `email`, `password`, serta metadata opsional seperti `clientType`, `deviceId`, `platform`, dan `appVersion`.
- [`POST /api/auth/login-client`](../backend/src/modules/auth/auth.routes.ts:26) menerima `email`, `password`, serta metadata opsional yang sama.
- [`POST /api/auth/google/mobile`](../backend/src/modules/auth/auth.routes.ts:33) menerima `idToken` Google beserta metadata client opsional, lalu memverifikasi token ke Google `tokeninfo` sebelum menerbitkan JWT backend.
- [`POST /api/auth/refresh`](../backend/src/modules/auth/auth.routes.ts:34) menerima `refreshToken` beserta metadata client opsional untuk menerbitkan access token baru dan merotasi refresh token.

Keempat endpoint baru ini mengembalikan response auth yang tetap kompatibel dengan pola lama, yaitu tetap mengandung `token` dan `user`, lalu secara aditif bisa menambahkan `refreshToken`, `tokenType`, `expiresIn`, `sessionId`, `authContext`, atau `provider`.

### 23.6 Arah penyatuan atau penghapusan di masa depan

Endpoint khusus mobile ini sebaiknya diperlakukan sebagai **lapisan transisi**, bukan bentuk final arsitektur auth.

Arah jangka menengahnya:

- pisahkan dengan tegas flow Google mobile dari flow sync NextAuth web,
- rapikan session per device dari implementasi minimum saat ini yang masih reuse model `Session`,
- ubah backend menjadi auth authority multi-client yang lebih eksplisit seperti arah pada [`11-mobile-login-architecture.md`](../../pemrograman-mobile/docs/11-mobile-login-architecture.md),
- setelah kontrak multi-client stabil, evaluasi apakah endpoint sementara tetap dipertahankan sebagai public contract atau digabung ke surface auth yang lebih rapi.

Dengan kata lain, backend boleh menambah endpoint khusus mobile sekarang untuk membuka integrasi cepat, tetapi keputusan jangka panjang tetap mengarah pada penyederhanaan surface auth setelah kebutuhan mobile sudah mapan.

## 24. Endpoint Mobile Auth yang Sudah Tersedia

Section ini menambahkan ringkasan implementasi endpoint mobile di bagian paling bawah agar mudah dipakai saat integrasi aplikasi native.

### 24.1 Prinsip kompatibilitas

Endpoint mobile baru di [`auth.routes.ts`](../backend/src/modules/auth/auth.routes.ts:25) sampai [`auth.routes.ts`](../backend/src/modules/auth/auth.routes.ts:34) ditambahkan tanpa mengubah perilaku default endpoint web lama pada [`POST /api/auth/login`](../backend/src/modules/auth/auth.routes.ts:24), [`POST /api/auth/register`](../backend/src/modules/auth/auth.routes.ts:23), dan [`POST /api/auth/sync`](../backend/src/modules/auth/auth.routes.ts:35).

Artinya:

- form web lama tetap memakai CAPTCHA wajib,
- Next.js tetap memakai flow lama di [`signin`](../src/app/auth/signin/page.tsx:103) dan bridge [`syncNextAuthToExpress()`](../src/lib/auth/sync.ts:16),
- mobile mendapat endpoint opt-in yang lebih native-friendly.

### 24.2 `POST /api/auth/register-client`

Route aktif: [`auth.routes.ts`](../backend/src/modules/auth/auth.routes.ts:25)
Controller: [`registerClient()`](../backend/src/modules/auth/auth.controller.ts:132)
Schema: [`clientRegisterSchema`](../backend/src/modules/auth/auth.validation.ts:18)

Request minimum:

```json
{
  "name": "User Baru",
  "email": "baru@example.com",
  "password": "secret123",
  "clientType": "mobile",
  "platform": "android"
}
```

Karakteristik:

- tidak mewajibkan `captchaToken`,
- tetap reuse [`AuthService.register()`](../backend/src/modules/auth/auth.service.ts:21),
- response tetap mengandung `token` dan `user`,
- response juga menambahkan `refreshToken`, `tokenType`, `expiresIn`, `sessionId`, dan `authContext.clientType` untuk konteks client ringan.

### 24.3 `POST /api/auth/login-client`

Route aktif: [`auth.routes.ts`](../backend/src/modules/auth/auth.routes.ts:26)
Controller: [`loginClient()`](../backend/src/modules/auth/auth.controller.ts:157)
Schema: [`clientLoginSchema`](../backend/src/modules/auth/auth.validation.ts:28)

Request minimum:

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "clientType": "mobile",
  "platform": "android"
}
```

Karakteristik:

- tidak mengubah endpoint web login lama,
- tetap reuse [`AuthService.login()`](../backend/src/modules/auth/auth.service.ts:55),
- logging metadata client dilakukan di [`logClientAuthEvent()`](../backend/src/modules/auth/auth.controller.ts:35),
- response tetap kompatibel dengan pola lama dan kini menambahkan `refreshToken`, `tokenType`, `expiresIn`, `sessionId`, dan `authContext` ringan.

### 24.4 `POST /api/auth/google/mobile`

Route aktif: [`auth.routes.ts`](../backend/src/modules/auth/auth.routes.ts:33)
Controller: [`googleMobile()`](../backend/src/modules/auth/auth.controller.ts:187)
Schema: [`mobileGoogleSchema`](../backend/src/modules/auth/auth.validation.ts:37)

Request minimum:

```json
{
  "idToken": "google-id-token",
  "clientType": "mobile",
  "platform": "ios"
}
```

Karakteristik:

- memverifikasi `idToken` ke endpoint Google `tokeninfo` di [`googleMobile()`](../backend/src/modules/auth/auth.controller.ts:195),
- tidak memakai flow [`POST /api/auth/sync`](../backend/src/modules/auth/auth.routes.ts:35) yang tetap khusus NextAuth web,
- response auth tetap mengandung `token` dan `user`,
- response menambahkan `refreshToken`, `tokenType`, `expiresIn`, `sessionId`, `provider: "google"`, serta `authContext` ringan untuk client mobile.

### 24.5 `POST /api/auth/refresh`

Route aktif: [`auth.routes.ts`](../backend/src/modules/auth/auth.routes.ts:34)
Controller: [`refresh()`](../backend/src/modules/auth/auth.controller.ts:239)
Schema: [`refreshTokenSchema`](../backend/src/modules/auth/auth.validation.ts:45)

Request minimum:

```json
{
  "refreshToken": "mobile-refresh-token",
  "clientType": "mobile",
  "platform": "android"
}
```

Karakteristik:

- refresh token divalidasi terhadap session backend yang saat ini disimpan minimal lewat model [`Session`](../backend/prisma/schema.prisma:60),
- rotasi token dilakukan di [`refreshMobileToken()`](../backend/src/modules/auth/auth.service.ts:145),
- response tetap kompatibel karena masih mengandung `token` dan `user`,
- response juga mengembalikan `refreshToken` baru, `tokenType`, `expiresIn`, `sessionId`, dan `authContext`.

### 24.6 Catatan keamanan dan follow-up

Implementasi saat ini sengaja minimal dan kompatibel, tetapi belum final untuk hardening production mobile.

Follow-up yang masih terbuka:

- rate limiting route client baru sudah diterapkan, tetapi masih in-memory dan belum distributed,
- challenge/risk error code seperti `CAPTCHA_REQUIRED` atau `RISK_CHALLENGE_REQUIRED` sudah diterapkan sebagai hardening awal,
- session per device masih bersifat minimum karena reuse model `Session`, belum menyimpan metadata device secara penuh,
- secure storage dan auto-refresh di aplikasi mobile masih perlu dirapikan.

Jadi status saat ini adalah: endpoint mobile native dasar dan refresh minimal sudah tersedia, flow web lama tetap tidak disentuh, dan hardening lanjutan masih menjadi batch berikutnya.
