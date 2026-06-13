# Analisis Migrasi Requirement Java/JDBC ke Backend Express

## 1. Tujuan Dokumen

Dokumen ini menganalisis apakah backend [`proyek-perangkat-lunak/backend`](../../backend) dapat menyesuaikan requirement pada tugas [`pemrograman-basis-data/Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:1), dengan penegasan bahwa [`Express`](../../backend/package.json:27) **boleh dipakai sebagai tool integrasi lain**, selama aplikasi tetap terhubung ke **Oracle Database** seperti diminta pada [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:19). Yang tidak dipakai pada stack ini adalah [`JDBC`](../../../pemrograman-basis-data/Tugas-Besar.md:22), karena JDBC adalah mekanisme koneksi khusus Java.

Fokus utamanya:

- menilai kesesuaian requirement tugas terhadap backend Express,
- menjelaskan bagian yang **sudah diimplementasi**,
- menjelaskan bagian yang **belum diimplementasi** atau **tidak sesuai penuh**,
- menjelaskan apakah requirement Java/JDBC bisa diterjemahkan ke stack Express + Prisma + MySQL.

## 2. Ringkasan Jawaban Singkat

**Ya, backend Express bisa dipakai untuk menyesuaikan requirement tugas**, asalkan dibedakan dengan jelas antara **requirement inti** dan **contoh teknologi koneksi** yang disebut pada dokumen tugas.

Kesimpulan singkat:

1. [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:14) meminta aplikasi terhubung ke **Oracle Database** dan memberi contoh koneksi seperti **Java/JDBC** atau **C#/ODP.NET**.
2. Artinya, fokus utamanya adalah **aplikasi harus bisa konek ke Oracle**, bukan harus selalu memakai JDBC di semua bahasa.
3. Backend Express **bisa memenuhi inti aplikasi CRUD**, validasi, error handling, autentikasi, keamanan dasar, dokumentasi teknis, dan integrasi database relasional.
4. Backend Express **boleh dipakai sebagai tool integrasi lain**, tetapi jika dipakai maka koneksi Oracle-nya tidak melalui [`JDBC`](../../../pemrograman-basis-data/Tugas-Besar.md:22), melainkan melalui driver Oracle untuk Node.js.
5. Implementasi backend Express saat ini masih **belum sesuai penuh terhadap Oracle**, karena masih memakai **MySQL** melalui datasource [`mysql`](../../backend/prisma/schema.prisma:9).
6. Beberapa konsep database programming seperti transaksi atomik, keamanan query, evaluasi performa query, dan dokumentasi teknis **tetap bisa dipenuhi secara konsep**, hanya implementasinya berbeda dari pendekatan Java/JDBC.

## 3. Requirement Asli dari Tugas Besar

Requirement utama pada [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:12) adalah:

- database: **Oracle Database** di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:133)
- bahasa pemrograman: **Java atau C#** di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:134)
- koneksi: **JDBC atau ODP.NET** di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:135)
- fitur utama: CRUD data domain di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:136)
- validasi input di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:36)
- transaksi `COMMIT` dan `ROLLBACK` di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:45)
- error handling di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:60)
- keamanan dasar, prepared statement, dan user terbatas di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:69)
- pengujian performa query di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:79)
- dokumentasi teknis di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:89)

## 4. Stack Backend Express yang Sedang Dianalisis

Backend yang dibandingkan adalah [`proyek-perangkat-lunak/backend`](../../backend), dengan stack:

- framework: [`express`](../../backend/package.json:27)
- bahasa: [`typescript`](../../backend/package.json:40)
- ORM/data access: [`PrismaClient`](../../backend/src/lib/prisma.ts:1)
- database: [`mysql`](../../backend/prisma/schema.prisma:9)
- auth: [`jsonwebtoken`](../../backend/package.json:29) + [`bcrypt`](../../backend/package.json:24)
- validasi: [`zod`](../../backend/package.json:30)

Entry point dan route registry ada di [`createApp()`](../../backend/src/app.ts:14).

## 5. Apakah Express Bisa Menyesuaikan Requirement Tugas?

## 5.1 Jawaban Konseptual

Secara **konsep sistem**, backend Express ini **bisa menyesuaikan sebagian besar requirement**.

Artinya, jika yang dinilai adalah:

- ada koneksi ke database relasional,
- ada CRUD,
- ada validasi,
- ada error handling,
- ada keamanan query,
- ada dokumentasi teknis,

maka backend Express ini **bisa dijadikan pengganti arsitektur** untuk menunjukkan konsep yang sama.

## 5.2 Jawaban Formal Akademik

Secara **formal terhadap wording tugas**, backend Express ini perlu dibaca dengan hati-hati:

1. tugas mewajibkan aplikasi terhubung ke **Oracle Database** di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:19),
2. tugas memberi contoh koneksi **Java menggunakan JDBC** di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:21),
3. tugas juga memberi contoh **C# menggunakan ODP.NET** di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:23),
4. sehingga JDBC di dokumen tugas dapat dipahami sebagai **contoh mekanisme koneksi untuk Java**, bukan satu-satunya mekanisme yang mungkin untuk semua stack,
5. namun implementasi Express saat ini tetap belum identik, karena memakai TypeScript/Node.js dan masih memakai MySQL.

Jadi, untuk jawaban akademik yang jujur:

- **Express bisa dipakai jika diterima sebagai tool integrasi lain**,
- **JDBC tidak dipakai pada Express**,
- **syarat utamanya tetap Oracle Database**, bukan MySQL,
- **implementasi saat ini belum sepenuhnya sesuai karena database aktualnya masih MySQL**.

## 6. Tabel Kesesuaian Requirement

| Requirement Tugas | Status pada Express | Penilaian | Catatan |
|---|---|---|---|
| Oracle Database | Belum sesuai saat ini | Bisa disesuaikan | Backend masih memakai [`mysql`](../../backend/prisma/schema.prisma:9), tetapi secara arsitektur Express tetap bisa diarahkan ke Oracle |
| Java / C# | Tidak dipakai | Boleh berbeda jika tool lain diterima | Backend memakai [`typescript`](../../backend/package.json:40) |
| JDBC / ODP.NET | Tidak dipakai | Wajar pada Express | JDBC adalah contoh koneksi Java di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:22), bukan mekanisme untuk Node.js |
| Koneksi ke database relasional | Ada | Sesuai konsep | Koneksi lewat [`DATABASE_URL`](../../backend/src/config/env.ts:7) dan Prisma |
| CRUD | Ada | Sudah sesuai | Task CRUD tersedia di [`task.routes.ts`](../../backend/src/modules/tasks/task.routes.ts:13) |
| Validasi input | Ada | Sudah sesuai | Validasi memakai Zod, misalnya [`createReminderSchema`](../../backend/src/modules/reminders/reminder.validation.ts:3) |
| Transaksi atomik | Sebagian | Belum terdokumentasi penuh | Ada operasi DB multi-step, tetapi belum terlihat strategy transaksi eksplisit terpusat |
| Error handling | Ada | Sudah sesuai | Ada 404 handler dan global error handler di [`src/app.ts`](../../backend/src/app.ts:37) dan [`src/app.ts`](../../backend/src/app.ts:49) |
| Keamanan dasar | Ada | Sudah sesuai konsep | JWT, bcrypt, ownership check, ORM parameterization |
| Prepared statement / bind variable | Sebagian | Sesuai konsep modern | Prisma men-parameterize query, tetapi tidak memakai JDBC prepared statement literal |
| User DB terbatas | Belum terdokumentasi | Belum bisa diklaim | Perlu konfigurasi deployment DB terpisah |
| Pengujian performa query | Belum | Gap | Belum ada dokumen benchmark query formal |
| Dokumentasi teknis | Ada sebagian besar | Cukup kuat | Sudah ada banyak dokumen, tetapi belum fokus ke requirement Java/JDBC tugas ini |

## 7. Yang Sudah Diimplementasi di Backend Express

## 7.1 Koneksi Database

Backend Express sudah terhubung ke database relasional melalui Prisma.

Bukti:

- datasource database di [`schema.prisma`](../../backend/prisma/schema.prisma:8)
- provider [`mysql`](../../backend/prisma/schema.prisma:9)
- URL koneksi di [`DATABASE_URL`](../../backend/src/config/env.ts:7)
- koneksi diuji saat server start lewat [`prisma.$connect()`](../../backend/src/server.ts:11)

Penilaian:

- **sesuai konsep koneksi database**,
- **Express bisa dipakai untuk Oracle bila drivernya diganti**,
- **implementasi saat ini belum sesuai karena masih MySQL**,
- **JDBC tidak relevan untuk stack Express**.

## 7.2 CRUD Utama

Backend Express sudah memiliki CRUD untuk task, yang dalam konteks tugas besar dapat dianggap setara sebagai pembuktian fitur CRUD database.

Endpoint utama:

- [`GET /api/tasks`](../../backend/src/modules/tasks/task.routes.ts:13)
- [`POST /api/tasks`](../../backend/src/modules/tasks/task.routes.ts:14)
- [`GET /api/tasks/:id`](../../backend/src/modules/tasks/task.routes.ts:18)
- [`PATCH /api/tasks/:id`](../../backend/src/modules/tasks/task.routes.ts:19)
- [`DELETE /api/tasks/:id`](../../backend/src/modules/tasks/task.routes.ts:21)

Implementasi service:

- create lewat [`prisma.task.create()`](../../backend/src/modules/tasks/task.service.ts:13)
- read lewat [`prisma.task.findMany()`](../../backend/src/modules/tasks/task.service.ts:61)
- detail lewat [`prisma.task.findUnique()`](../../backend/src/modules/tasks/task.service.ts:75)
- update lewat [`prisma.task.update()`](../../backend/src/modules/tasks/task.service.ts:117)
- delete soft-delete lewat [`prisma.task.update()`](../../backend/src/modules/tasks/task.service.ts:176)

Penilaian:

- **sudah diimplementasi kuat**.

## 7.3 Validasi Input

Requirement validasi pada tugas sudah cukup selaras secara konsep.

Backend Express memakai validasi schema dengan Zod. Contoh:

- validasi auth di route [`validate(registerSchema)`](../../backend/src/modules/auth/auth.routes.ts:11)
- validasi task di [`validate(createTaskSchema)`](../../backend/src/modules/tasks/task.routes.ts:14)
- validasi reminder di [`createReminderSchema`](../../backend/src/modules/reminders/reminder.validation.ts:3)

Penilaian:

- **sudah ada dan berjalan**,
- walaupun contoh validasinya berbeda dari domain `NIM`/`nilai`, konsep requirement tetap terpenuhi.

## 7.4 Error Handling

Backend sudah memiliki penanganan error untuk request API.

Bukti:

- 404 response di [`src/app.ts`](../../backend/src/app.ts:37)
- global error handler di [`src/app.ts`](../../backend/src/app.ts:49)
- error not found / forbidden pada task di [`TaskService.getTaskById()`](../../backend/src/modules/tasks/task.service.ts:74)
- error manual pada refresh calendar di [`calendar.refresh.controller.ts`](../../backend/src/modules/calendar/calendar.refresh.controller.ts:22)

Penilaian:

- **sudah diimplementasi**.

## 7.5 Keamanan Dasar

Backend Express sudah memiliki beberapa keamanan dasar yang relevan terhadap tugas:

- autentikasi JWT melalui [`jsonwebtoken`](../../backend/package.json:29)
- hashing password via [`bcrypt`](../../backend/package.json:24)
- ownership check, misalnya [`task.userId !== userId`](../../backend/src/modules/tasks/task.service.ts:86)
- validasi input dengan Zod
- ORM query yang secara default lebih aman dibanding string interpolation mentah

Selain itu, ada route privat yang dilindungi middleware [`authenticate`](../../backend/src/modules/tasks/task.routes.ts:11).

Penilaian:

- **sudah kuat secara keamanan dasar aplikasi**.

## 7.6 Dokumentasi Teknis

Backend dan proyek sudah memiliki dokumentasi teknis yang cukup banyak:

- analisis backend di [`APP-express.md`](../APP-express.md)
- dokumentasi WhatsApp inbound di [`WHATSAPP_INBOUND.md`](./api-external/WHATSAPP_INBOUND.md)
- dokumentasi setup/deployment di folder [`setup`](../setup)
- laporan proyek di folder [`reports`](../reports)

Penilaian:

- **sudah cukup baik**,
- tetapi belum disusun spesifik mengikuti format akademik Java/JDBC/Oracle pada tugas besar.

## 8. Yang Sebagian Sudah Ada, tetapi Belum Sepenuhnya Sesuai

## 8.1 Transaksi Database Atomik

Requirement tugas meminta `COMMIT` dan `ROLLBACK` eksplisit pada operasi database di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:45).

Pada backend Express sekarang, ada operasi multi-step seperti create task:

- insert task di [`task.service.ts`](../../backend/src/modules/tasks/task.service.ts:13)
- reset flag reminder via raw SQL di [`task.service.ts`](../../backend/src/modules/tasks/task.service.ts:29)
- create tags di [`task.service.ts`](../../backend/src/modules/tasks/task.service.ts:36)

Namun, dari potongan implementasi yang dibaca saat ini, alur ini **belum dibungkus secara eksplisit dalam transaksi Prisma** seperti `prisma.$transaction(...)`.

Artinya:

- secara praktik database tetap melakukan operasi valid,
- tetapi **belum ada bukti kuat transaksi atomik eksplisit** sesuai tuntutan tugas.

Status:

- **sebagian ada**,
- **masih gap untuk kepatuhan penuh**.

## 8.2 Prepared Statement / Bind Variable

Requirement tugas menekankan prepared statement di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:75).

Pada backend Express:

- query ORM Prisma aman secara parameterization default,
- raw SQL yang ada masih memakai placeholder `?` pada [`prisma.$executeRawUnsafe()`](../../backend/src/modules/tasks/task.service.ts:29), [`prisma.$queryRawUnsafe()`](../../backend/src/modules/tasks/task.service.ts:333), dan [`prisma.$queryRawUnsafe()`](../../backend/src/modules/tasks/task.service.ts:410).

Catatan penting:

- secara teknis ini **lebih dekat ke bind parameter modern**,
- tetapi karena memakai method bernama `Unsafe`, perlu kehati-hatian ekstra bila suatu saat input user mentah dimasukkan ke SQL string.

Status:

- **sesuai konsep keamanan query**,
- **tidak bisa diklaim sebagai JDBC prepared statement literal**.

## 8.3 Dokumentasi DDL dan ERD Formal

Tugas meminta:

- ERD,
- skema tabel DDL,
- flowchart CRUD,
- deskripsi validasi dan transaksi,
- evaluasi keamanan.

Pada proyek Express saat ini:

- struktur data ada di [`schema.prisma`](../../backend/prisma/schema.prisma:14)
- dokumentasi backend ada di [`APP-express.md`](../APP-express.md)
- laporan dan dokumentasi proyek tersebar di [`reports`](../reports) dan [`project`](../project)

Namun belum ada satu dokumen tunggal yang menyusun semua aspek ini khusus untuk evaluasi requirement tugas besar database programming.

Status:

- **banyak bahan sudah ada**,
- **belum disusun dalam format akademik final yang spesifik**.

## 9. Yang Belum Diimplementasi atau Tidak Sesuai Penuh

## 9.1 Java dan JDBC

Bagian ini perlu ditegaskan ulang agar tidak salah paham.

Backend Express memang tidak menggunakan:

- Java,
- Spring,
- JDBC,
- `JdbcTemplate`,
- driver Oracle / MySQL JDBC.

Sebaliknya backend memakai:

- Node.js,
- Express,
- TypeScript,
- Prisma.

Namun ini **bukan berarti Express tidak bisa terhubung ke Oracle**.

Maknanya adalah:

- jika backend memakai Java, koneksi Oracle lazimnya lewat [`JDBC`](../../../pemrograman-basis-data/Tugas-Besar.md:22),
- jika backend memakai C#, koneksi Oracle bisa lewat [`ODP.NET`](../../../pemrograman-basis-data/Tugas-Besar.md:23),
- jika backend memakai Express/Node.js, koneksi Oracle dilakukan lewat driver Oracle untuk Node.js, **bukan JDBC**.

Status:

- **tidak sesuai literal untuk Java/JDBC**,
- **tetapi tetap bisa sesuai secara fungsional bila Express dihubungkan ke Oracle dengan driver yang tepat**.

## 9.2 Oracle Database

Requirement tugas menyebut Oracle di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:14), [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:19), dan [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:133).

Implementasi backend Express sekarang masih memakai MySQL di [`schema.prisma`](../../backend/prisma/schema.prisma:9).

Poin pentingnya:

- **Express tidak dilarang untuk Oracle**,
- yang belum sesuai adalah **database aktual proyek ini**, karena masih MySQL,
- jadi gap utamanya ada pada **engine database yang dipakai sekarang**, bukan pada fakta bahwa framework-nya Express.

Status:

- **belum sesuai pada implementasi saat ini**,
- **bisa disesuaikan jika koneksi dipindah ke Oracle**.

## 9.3 Domain Data Mahasiswa dan Mata Kuliah

Tugas asli menyebut CRUD untuk:

- Mahasiswa
- Mata Kuliah

Sedangkan backend Express sekarang berfokus pada domain:

- User
- Task
- Reminder
- Calendar
- Account
- Session

Lihat model schema di [`schema.prisma`](../../backend/prisma/schema.prisma:14).

Status:

- **tidak sesuai domain literal**,
- tetapi **konsep CRUD relasional tetap ada**.

## 9.4 User Oracle Terbatas

Tugas mengharuskan user DB khusus dan tidak memakai `SYS`/`SYSTEM` di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:76).

Pada backend Express, informasi user database hanya tampil sebagai [`DATABASE_URL`](../../backend/src/config/env.ts:7). Tidak ada dokumentasi eksplisit yang menunjukkan:

- user DB khusus,
- role/privilege terbatas,
- larangan penggunaan superuser.

Status:

- **belum terdokumentasi**, sehingga **belum aman untuk diklaim terpenuhi**.

## 9.5 Pengujian Performa Query Formal

Tugas mengharuskan laporan query kompleks, waktu eksekusi, dan evaluasi performa di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:79).

Pada backend Express belum ditemukan dokumen benchmark formal yang memuat:

- query apa yang diuji,
- durasi eksekusi,
- hasil analisis performa.

Status:

- **belum diimplementasi secara dokumentatif**.

## 10. Apakah Requirement Bisa Diterjemahkan Tanpa Java?

## 10.1 Bisa, jika fokusnya konsep

Jika dosen/penguji lebih menilai **konsep pemrograman basis data**, maka backend Express ini masih relevan untuk menunjukkan:

- koneksi ke DB relasional,
- CRUD,
- validasi,
- keamanan query,
- error handling,
- dokumentasi,
- background processing terkait data.

## 10.2 Tidak cukup, jika fokusnya tooling wajib

Jika requirement dinilai **harus literal** sebagai:

- Oracle wajib,
- Java wajib,
- JDBC wajib,

maka backend Express **tidak bisa menjadi pengganti penuh**.

Tetapi jika yang dianggap literal hanya:

- aplikasi harus konek ke Oracle,
- teknologi koneksi boleh mengikuti stack yang dipakai,

maka backend Express **masih bisa dipakai**, asalkan:

- database diganti ke Oracle,
- koneksi Oracle di Node.js memakai driver Node.js yang sesuai,
- bukan memakai MySQL seperti implementasi sekarang.

Jadi jawaban resminya harus dibedakan:

- **dari sisi konsep: bisa banyak menyesuaikan**,
- **dari sisi Express vs Oracle: bisa**,
- **dari sisi Express vs JDBC: tidak**, karena JDBC khusus Java,
- **dari sisi implementasi saat ini: belum sesuai karena masih MySQL**.

## 11. Strategi Jika Tetap Ingin Menjadikan Express Sebagai Dasar

Jika backend Express ingin dipakai sebagai basis pemenuhan tugas besar, maka strategi realistisnya adalah:

### Opsi A — Jadikan Express sebagai pembanding konsep

Gunakan backend Express sebagai:

- pembanding fitur,
- pembanding arsitektur,
- pembanding implementasi CRUD dan validasi,
- pembanding dokumentasi teknis.

Tetapi tetap akui bahwa:

- tugas formal Java/JDBC dikerjakan di project Java,
- Express hanya menjadi referensi evolusi arsitektur modern.

### Opsi B — Adaptasi requirement ke Express untuk proyek non-akademik

Kalau tujuannya bukan patuh literal ke tugas kuliah, backend Express ini sudah sangat layak dijadikan backend produksi/lanjutan, karena:

- fitur lebih luas,
- auth lebih kaya,
- AI dan WhatsApp integration ada,
- reminder persistence ada,
- arsitektur modular lebih matang.

### Opsi C — Tambah dokumen compliance khusus

Agar lebih dekat ke requirement tugas besar, bisa ditambahkan:

1. dokumen DDL SQL hasil turunan dari Prisma schema,
2. dokumen transaksi atomik pada operasi multi-step,
3. dokumen evaluasi keamanan query,
4. dokumen benchmark query performa,
5. catatan eksplisit bahwa backend modern memakai Prisma sebagai pengganti layer JDBC manual.

## 12. Checklist Kesesuaian Express terhadap Requirement Tugas

### Sudah ada

- [x] koneksi ke database relasional
- [x] CRUD utama
- [x] validasi input
- [x] error handling API
- [x] keamanan dasar aplikasi
- [x] dokumentasi teknis dasar
- [x] auth dan ownership control

### Ada tetapi perlu diperkuat

- [ ] transaksi atomik eksplisit untuk operasi multi-step
- [ ] dokumentasi DDL formal berbasis requirement tugas
- [ ] evaluasi keamanan query tertulis
- [ ] benchmark performa query tertulis
- [ ] dokumentasi user database dengan hak akses terbatas

### Belum sesuai literal dengan tugas

- [ ] Oracle Database
- [ ] Java
- [ ] JDBC / ODP.NET
- [ ] domain `Mahasiswa` dan `Mata Kuliah`

## 13. Kesimpulan Final

Backend [`proyek-perangkat-lunak/backend`](../../backend) **bisa menyesuaikan banyak requirement inti** dari [`pemrograman-basis-data/Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:12), terutama pada aspek:

- CRUD,
- validasi,
- error handling,
- keamanan dasar,
- dokumentasi teknis,
- penggunaan database relasional.

Kesimpulan penting yang harus ditegaskan dari dokumen tugas:

- requirement utama tugas adalah aplikasi harus **terhubung ke Oracle Database** di [`Tugas-Besar.md`](../../../pemrograman-basis-data/Tugas-Besar.md:19),
- [`JDBC`](../../../pemrograman-basis-data/Tugas-Besar.md:22) adalah **contoh cara koneksi untuk Java**,
- jadi [`Express`](../../backend/package.json:27) **boleh dipakai** bila diterima sebagai tool integrasi lain,
- tetapi kalau memakai Express maka koneksi Oracle-nya **bukan JDBC**,
- implementasi backend Express yang ada sekarang **belum sesuai penuh** karena masih memakai MySQL, belum Oracle,
- domain data aplikasi juga berbeda dari `Mahasiswa` dan `Mata Kuliah`.

Jadi jawaban paling tepat adalah:

> **Express bisa dipakai untuk Oracle Database, tetapi tidak memakai JDBC. JDBC adalah contoh koneksi untuk Java. Gap utama backend saat ini bukan karena memakai Express, melainkan karena database aktualnya masih MySQL dan domain aplikasinya berbeda dari domain tugas.**

## 14. Status Implementasi Express terhadap Requirement

### Sudah diimplementasi pada Express

- koneksi database relasional via [`PrismaClient`](../../backend/src/lib/prisma.ts:1)
- CRUD task lengkap via [`task.routes.ts`](../../backend/src/modules/tasks/task.routes.ts:13)
- validasi input via Zod, misalnya [`createReminderSchema`](../../backend/src/modules/reminders/reminder.validation.ts:3)
- JWT auth dan ownership checks
- error handling global dan per-controller
- reminder persistence di database via [`Reminder`](../../backend/prisma/schema.prisma:134)
- background scheduler di [`taskAutoSkipScheduler.start()`](../../backend/src/server.ts:16)
- integrasi AI dan WhatsApp internal

### Belum / belum matang pada Express untuk konteks requirement tugas

- transaksi atomik eksplisit dan terdokumentasi
- benchmark performa query formal
- user DB terbatas yang terdokumentasi
- compliance Oracle
- compliance Java/JDBC
- domain data akademik `Mahasiswa` / `Mata Kuliah`
- refresh calendar masih placeholder di [`calendar.refresh.controller.ts`](../../backend/src/modules/calendar/calendar.refresh.controller.ts:29)

## 15. Rekomendasi Lanjutan

Agar backend Express ini lebih mudah diposisikan sebagai hasil migrasi dari requirement Java/JDBC menuju stack modern, rekomendasi berikut paling penting:

1. tambahkan dokumen DDL SQL turunan dari [`schema.prisma`](../../backend/prisma/schema.prisma:14)
2. tambahkan transaksi Prisma pada operasi multi-step seperti create task + tag + reset reminder flag
3. dokumentasikan evaluasi query aman vs query raw
4. buat benchmark query untuk statistik task, reminder due, dan scheduler candidate query
5. jika tujuan akademik wajib literal, pertahankan project Java terpisah di [`pemrograman-basis-data/TaskPlanner-Java-Backend`](../../../pemrograman-basis-data/TaskPlanner-Java-Backend)
