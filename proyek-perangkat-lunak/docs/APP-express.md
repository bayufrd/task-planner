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
