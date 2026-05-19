# WhatsApp AI Inbound API

Dokumentasi ini menjelaskan endpoint internal [`POST /internal/wa/inbound`](../src/app.ts:225) pada backend Smart Task Planner.

Endpoint ini adalah **entrypoint tunggal** untuk semua command WhatsApp yang sudah lebih dulu difilter oleh penyedia bot WhatsApp. Backend tidak perlu memikirkan filtering chat non-task di layer ini. Backend cukup membaca field `command`, mengenali intent, lalu meneruskan ke flow yang sesuai.

Saat ini endpoint ini sudah menangani registrasi/linking nomor WhatsApp ke user Task Planner melalui pattern `user_id daftar`, AI-first resolver untuk create/edit/delete/complete/list/overview, create task berbasis AI dari command `task ...`, melihat daftar task aktif, melihat task berdasarkan tanggal sederhana, menandai task selesai berdasarkan pencocokan judul + tanggal, serta reminder deadline WhatsApp personal untuk task `PENDING`. Flow ini juga sudah memakai parsing waktu Indonesia/Jakarta untuk frasa seperti `jam 9 malam`, `jam 9 pagi`, dan `jam 6 sore`.

## Tujuan Endpoint

Endpoint [`POST /internal/wa/inbound`](../src/app.ts:225) digunakan untuk:

- menerima semua payload chat task dari bot WhatsApp internal,
- memvalidasi otorisasi internal service,
- membaca `command` sebagai sumber utama instruksi user,
- mendeteksi command registrasi dengan format `user_id daftar`,
- menjadikan nomor WhatsApp sebagai identitas penghubung ke `user_id` Task Planner,
- menjadi gateway untuk intent AI WhatsApp seperti tambah task, edit, done, overview, dan list task,
- mengirim pesan balasan WhatsApp sesuai kondisi sukses/gagal,
- mengembalikan payload normalized untuk logging atau integrasi service lain.

## Lokasi Implementasi

Implementasi utama berada di file berikut:

- [`handleWhatsappInbound()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:451)
- [`sendWhatsappMessage()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:38)
- [`sendWhatsappRegistrationSuccess()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:101)
- [`detectWhatsappIntent()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:238)
- [`findBestTaskMatch()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:326)
- [`buildListMessage()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:301)
- [`buildOverviewMessage()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:217)
- [`handleTaskCompletion()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:393)
- [`AiService.parseTaskCommand()`](../src/modules/ai/ai.service.ts:175)
- [`AiService.resolveWhatsappAction()`](../src/modules/ai/ai.service.ts:283)
- [`applyIndonesianTimeHints()`](../src/modules/ai/ai.service.ts:128)
- [`TaskService.processWhatsappDeadlineReminders()`](../src/modules/tasks/task.service.ts:404)
- [`TaskService.autoSkipOverdueTasks()`](../src/modules/tasks/task.service.ts:328)
- [`TaskAutoSkipScheduler.run()`](../src/modules/tasks/task.auto-skip.scheduler.ts:46)
- route registration di [`createApp()`](../src/app.ts:14)

## Security

Endpoint ini bersifat **internal** dan bukan untuk konsumsi public client/frontend.

### Header Wajib

Request wajib mengirim kedua header berikut:

```http
Authorization: Bearer <TOKEN_WHATSAPP>
x-service-secret: <TOKEN_WHATSAPP>
```

Validasi dilakukan di [`handleWhatsappInbound()`](../src/app.ts:232) sampai [`handleWhatsappInbound()`](../src/app.ts:243).

### Aturan Auth

- Jika [`TOKEN_WHATSAPP`](../src/config/env.ts) belum dikonfigurasi, endpoint mengembalikan HTTP `500`.
- Jika bearer token atau `x-service-secret` tidak cocok, endpoint mengembalikan HTTP `401`.

## Request Body

Endpoint menerima payload fleksibel dari provider/service WhatsApp internal.

### Field yang Dibaca

Field yang saat ini dibaca oleh backend:

- `command`
- `rawMessage`
- `source`
- `service`
- `message.body`
- `message.id`
- `message.timestamp`
- `user.waNumber`
- `user.name`
- `user.chatId`
- `user.participant`
- `user.isGroup`
- `context.remoteJid`
- `context.groupId`
- `context.pushName`
- `context.senderIsAdmin`

Parsing dilakukan di [`handleWhatsappInbound()`](../src/app.ts:247).

### Body Minimum

```json
{
  "command": "USER_ID daftar",
  "user": {
    "chatId": "6281234567890@c.us",
    "waNumber": "6281234567890",
    "name": "Bayu"
  }
}
```

### Contoh Payload Lengkap

```json
{
  "source": "whatsapp",
  "service": "internal-wa",
  "command": "clx123abc daftar",
  "rawMessage": "clx123abc daftar",
  "message": {
    "id": "wamid.HBgLN...",
    "timestamp": "1716091200",
    "body": "clx123abc daftar"
  },
  "user": {
    "waNumber": "081234567890",
    "name": "Bayu Farid",
    "chatId": "6281234567890@c.us",
    "participant": "6281234567890@c.us",
    "isGroup": false
  },
  "context": {
    "groupId": null,
    "remoteJid": "6281234567890@c.us",
    "pushName": "Bayu Farid",
    "senderIsAdmin": false
  }
}
```

## Resolusi Nomor WhatsApp

Backend akan mencoba mengambil nomor WhatsApp dari beberapa field secara berurutan di [`handleWhatsappInbound()`](../src/app.ts:255):

1. [`user.waNumber`](../src/app.ts:256)
2. [`user.participant`](../src/app.ts:257)
3. [`user.chatId`](../src/app.ts:258)
4. [`context.remoteJid`](../src/app.ts:259)

Nomor lalu dinormalisasi oleh:

- [`extractWaNumber()`](../src/app.ts:23)
- [`normalizeSafeWhatsappNumber()`](../src/app.ts:29)

### Normalisasi Nomor

Aturan normalisasi saat ini:

- semua karakter non-digit dihapus,
- jika diawali `62` maka dipakai apa adanya,
- jika diawali `0` maka diubah menjadi `62...`,
- selain itu otomatis diprefix `62`.

Contoh:

- `081234567890` → `6281234567890`
- `6281234567890` → `6281234567890`
- `6281234567890@c.us` → `6281234567890`

## Validasi Dasar

### 1. Command wajib ada

Jika `command` kosong atau tidak dikirim, endpoint mengembalikan:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "command is required"
  }
}
```

Validasi ada di [`handleWhatsappInbound()`](../src/app.ts:261).

### 2. Nomor WhatsApp harus bisa di-resolve

Jika backend tidak bisa menemukan nomor dari payload, endpoint mengembalikan:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Unable to resolve WhatsApp number from payload"
  }
}
```

Validasi ada di [`handleWhatsappInbound()`](../src/app.ts:266).

## Pola Umum Command WhatsApp

Secara konsep, backend membaca semua instruksi dari field `command`.

Ada 2 kelompok besar command:

1. **Command registrasi/linking**
   - format khusus: `user_id daftar`
   - tujuan: menghubungkan nomor WhatsApp ke user Task Planner.
2. **Command operasional task berbasis AI**
   - format awalan: `task ...`
   - tujuan: membuat, mengedit, menyelesaikan, melihat overview, dan melihat daftar task.

Karena provider bot sudah memfilter chat yang relevan, backend fokus pada parsing `command` dan routing intent.

## Format Command Registrasi

Command registrasi dikenali dengan regex [`/^(\S+)\s+daftar$/i`](../src/app.ts:271).

### Format

```text
user_id daftar
```

### Contoh valid

```text
clx123abc daftar
USER123 daftar
abc-001 daftar
```

### Hasil parsing

- token pertama akan dianggap sebagai `taskPlannerUserId`,
- kata `daftar` menjadi trigger registrasi,
- flag `registrationCommand` akan bernilai `true`.

Jika command tidak cocok format di atas, endpoint tetap menerima payload namun tidak menjalankan flow linking user.

## Flow Registrasi `user_id daftar`

Flow utama dimulai di [`handleWhatsappInbound()`](../src/app.ts:116).

### Kondisi 1 — User ditemukan dan belum punya nomor WhatsApp

Kondisi:

- `user_id` ada di database,
- field [`whatsappNumber`](../src/app.ts:130) user masih kosong/null,
- nomor pengirim tidak sedang dipakai user lain.

Aksi backend:

1. normalisasi nomor WhatsApp,
2. cek konflik nomor dengan user lain di [`handleWhatsappInbound()`](../src/app.ts:190),
3. update user dengan:
   - `whatsappNumber`
   - `whatsappChatId`
4. kirim pesan sukses via [`sendWhatsappRegistrationSuccess()`](../src/app.ts:62).

### Pesan WhatsApp sukses

```text
Halo {name}! Nomor WhatsApp Anda sudah berhasil terhubung ke Smart Task Planner by Dastrevas AI.

Mulai sekarang Anda bisa kirim perintah dengan awalan *task* untuk mengelola tugas langsung dari WhatsApp.

Contoh:
- task tambah meeting besok jam 10 malam #urgent
- task tanggal 10 ada meeting jam 9 malam di apartement #kerjaan

AI kami dari dastrevas.com akan membantu membaca pesan Anda dan mengubahnya menjadi task dengan lebih akurat.

Silakan coba sekarang dengan format awalan *task*.
```

Sumber pesan ada di [`sendWhatsappRegistrationSuccess()`](../src/app.ts:62).

### Response sukses registrasi

```json
{
  "success": true,
  "data": {
    "source": "whatsapp",
    "service": "internal-wa",
    "command": "clx123abc daftar",
    "rawMessage": "clx123abc daftar",
    "registrationCommand": true,
    "taskPlannerUserId": "clx123abc",
    "user": {
      "waNumber": "6281234567890",
      "name": "Bayu Farid",
      "chatId": "6281234567890@c.us",
      "participant": "6281234567890@c.us",
      "isGroup": false
    },
    "message": {
      "id": "wamid.HBgLN...",
      "timestamp": "1716091200",
      "body": "clx123abc daftar"
    },
    "context": {
      "groupId": null,
      "remoteJid": "6281234567890@c.us",
      "pushName": "Bayu Farid",
      "senderIsAdmin": false
    },
    "receivedAt": "2026-05-19T04:00:00.000Z",
    "registration": {
      "linked": true,
      "user": {
        "id": "clx123abc",
        "name": "Bayu Farid",
        "email": "bayu@example.com",
        "whatsappNumber": "6281234567890",
        "whatsappChatId": "6281234567890@c.us",
        "updatedAt": "2026-05-19T04:00:00.000Z"
      }
    },
    "registrationNotification": {
      "sent": true,
      "number": "6281234567890",
      "type": "registration-success"
    }
  },
  "message": "WhatsApp registration captured and saved"
}
```

## Kondisi Gagal / Alternatif pada Registrasi

### Kondisi 2 — `user_id` tidak ditemukan

Kondisi:

- command cocok format `user_id daftar`,
- user dengan `id = user_id` tidak ada di database.

Aksi backend:

- backend **tidak** membuat user baru,
- backend mengirim pesan balasan ke nomor pengirim.

### Pesan WhatsApp jika user tidak ditemukan

```text
user id tidak terdaftar pada Task Planner silahkan daftar dengan mengunjungi https://taskplanner.dastrevas.com/auth/signup?callbackUrl=%2Fdashboard
```

Implementasi ada di [`handleWhatsappInbound()`](../src/app.ts:136).

### Response HTTP

Endpoint tetap mengembalikan HTTP `201` dengan payload sukses terstruktur, namun status registrasi menunjukkan gagal link.

```json
{
  "success": true,
  "data": {
    "registrationCommand": true,
    "taskPlannerUserId": "unknown-user",
    "registration": {
      "linked": false,
      "reason": "USER_NOT_FOUND",
      "userId": "unknown-user"
    },
    "registrationNotification": {
      "sent": true,
      "number": "6281234567890",
      "type": "user-not-found",
      "message": "user id tidak terdaftar pada Task Planner silahkan daftar dengan mengunjungi https://taskplanner.dastrevas.com/auth/signup?callbackUrl=%2Fdashboard"
    }
  },
  "message": "WhatsApp registration captured and saved"
}
```

### Kondisi 3 — User sudah punya nomor WhatsApp

Kondisi:

- `user_id` ada,
- field `whatsappNumber` user sudah terisi.

Aksi backend:

- backend tidak melakukan update nomor,
- backend mengirim pesan bahwa user sudah terdaftar.

### Pesan WhatsApp jika user sudah terdaftar

```text
user untuk {user_id} atas nama {name} sudah terdaftar
```

Implementasi ada di [`handleWhatsappInbound()`](../src/app.ts:163).

### Response HTTP

Endpoint tetap mengembalikan HTTP `201`.

```json
{
  "success": true,
  "data": {
    "registrationCommand": true,
    "taskPlannerUserId": "clx123abc",
    "registration": {
      "linked": false,
      "reason": "WHATSAPP_ALREADY_REGISTERED",
      "user": {
        "id": "clx123abc",
        "name": "Bayu Farid",
        "email": "bayu@example.com",
        "whatsappNumber": "6281234567890",
        "whatsappChatId": "6281234567890@c.us",
        "updatedAt": "2026-05-19T04:00:00.000Z"
      }
    },
    "registrationNotification": {
      "sent": true,
      "number": "6281234567890",
      "type": "already-registered",
      "message": "user untuk clx123abc atas nama Bayu Farid sudah terdaftar"
    }
  },
  "message": "WhatsApp registration captured and saved"
}
```

### Kondisi 4 — Nomor WhatsApp sudah dipakai user lain

Kondisi:

- `user_id` target ada,
- target user belum punya nomor,
- tetapi nomor pengirim ternyata sudah dipakai oleh user lain.

Aksi backend:

- backend menghentikan proses,
- backend tidak mengirim flow sukses,
- endpoint mengembalikan konflik.

### Response konflik

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "WhatsApp number is already registered to another user"
  }
}
```

Implementasi ada di [`handleWhatsappInbound()`](../src/app.ts:198).

### Kondisi 5 — Nomor gagal dinormalisasi

Jika nomor ditemukan tetapi gagal dinormalisasi, endpoint mengembalikan:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Unable to normalize WhatsApp number"
  }
}
```

Implementasi ada di [`handleWhatsappInbound()`](../src/app.ts:119).

## Command Task Berbasis AI

Selain flow registrasi, tujuan utama endpoint ini adalah menjadi pintu masuk command WhatsApp berbasis AI.

### Status implementasi saat ini

Saat ini backend sudah mengimplementasikan:

- validasi auth internal,
- parsing payload inbound,
- resolusi nomor WhatsApp,
- flow registrasi `user_id daftar`,
- lookup user berdasarkan `whatsappNumber`,
- AI-first multi-action resolver berbasis plan untuk `CREATE_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `COMPLETE_TASK`, `LIST_TASKS`, `LIST_BY_DATE`, `OVERVIEW`, dan `HELP`,
- fallback ke intent ringan bila resolver AI gagal total,
- eksekusi berurutan untuk banyak aksi dalam satu chat,
- dukungan banyak target task dalam satu command tanpa splitter rule-based sebagai jalur utama,
- create task via AI parser untuk command natural bahasa Indonesia/Inggris,
- parsing waktu Indonesia/Jakarta untuk frasa `jam ... pagi/siang/sore/malam`,
- list task aktif,
- list task berdasarkan tanggal sederhana (`hari ini`, `besok`, `lusa`, `tanggal N`),
- complete/delete/update task berdasarkan pencocokan title + date hint,
- overview/ringkasan singkat,
- agregasi balasan WhatsApp untuk hasil multi-aksi,
- menu bantuan command untuk user publik dan user terdaftar,
- auto-help setelah registrasi berhasil,
- normalized response payload.

Di luar inbound command, backend juga sudah memiliki scheduler reminder WhatsApp personal untuk task `PENDING` yang memiliki nomor WhatsApp user terdaftar. Reminder ini berjalan setiap 1 menit dan mengirim notifikasi pada H-24 jam, H-1 jam, tepat saat deadline, dan setelah task otomatis berubah menjadi `SKIPPED`.

### Prinsip arsitektur

- provider bot WhatsApp sudah memfilter chat yang relevan,
- backend menerima payload lewat [`POST /internal/wa/inbound`](../src/app.ts:225),
- backend membaca field `command`,
- AI menyusun `plan.actions[]` dari satu chat,
- setiap item plan dieksekusi berurutan oleh backend ke service internal yang sesuai,
- jika satu aksi gagal, aksi lain tetap bisa dilanjutkan dan hasilnya diringkas ke user,
- AI yang sudah dibekali knowledge tidak boleh “lari” dari domain Task Planner.

### Peran nomor WhatsApp

Nomor WhatsApp yang sudah linked melalui flow `user_id daftar` menjadi kunci untuk menentukan task milik user mana yang akan diproses.

Artinya, sebelum command seperti tambah/edit/done/list dijalankan penuh, backend idealnya harus bisa memetakan nomor WhatsApp pengirim ke `user_id` yang valid.

### Prefix command yang diharapkan

Untuk operasional task, prefix yang direkomendasikan adalah:

```text
task ...
```

Contoh:

```text
task bantuan
task tambah meeting besok jam 10 malam #urgent
task tanggal 10 ada meeting jam 9 malam di apartement #kerjaan
task edit meeting besok jadi jam 9 malam
task selesai kan task meeting client
task overview hari ini
task lihat daftar task saya
```

### Bantuan command ke user

Backend sekarang menyediakan pesan bantuan yang bisa dibalaskan ke user WhatsApp.

Kondisi pemakaiannya:

- sesudah registrasi berhasil,
- ketika nomor WA belum terdaftar,
- ketika user mengirim `task bantuan`, `task help`, `task menu`, atau command yang belum dikenali.

Isi bantuan publik mencakup:

- cara link akun dengan `user_id daftar`,
- contoh command create task,
- link daftar web: `https://taskplanner.dastrevas.com/auth/signup?callbackUrl=%2Fdashboard`.

Jika user sudah terdaftar, bantuan juga mencakup:

- `task lihat jadwal`,
- `task lihat jadwal besok`,
- `task selesai meeting client`,
- `task overview`.

### Katalog command WhatsApp yang direncanakan

Saat ini ada **6 command group utama** yang perlu dimiliki oleh AI WhatsApp:

| Grup Command | Intent | Fungsi |
|---|---|---|
| Registrasi | `REGISTER_WHATSAPP` | link nomor WA ke `user_id` |
| Tambah task | `CREATE_TASK` | membuat task baru dari bahasa natural |
| Edit task | `UPDATE_TASK` | mengubah task yang sudah ada |
| Selesaikan task | `COMPLETE_TASK` | mengubah status task menjadi `DONE` |
| Lihat daftar/jadwal task | `LIST_TASKS` | menampilkan daftar task atau task pada tanggal tertentu |
| Overview/ringkasan | `OVERVIEW_TASKS` | menampilkan summary produktivitas user |

### Intent yang direncanakan

Dokumen ini menyamakan arah implementasi bahwa AI WhatsApp akan mengubah command menjadi intent terstruktur berikut:

| Intent | Contoh command | Arah aksi |
|---|---|---|
| `REGISTER_WHATSAPP` | `clx123abc daftar` | link nomor WA ke user |
| `CREATE_TASK` | `task tambah meeting besok jam 10 malam #urgent` | buat task baru |
| `UPDATE_TASK` | `task edit meeting besok jadi jam 9 malam` | ubah task yang cocok |
| `COMPLETE_TASK` | `task selesai meeting client` | tandai task `DONE` |
| `LIST_TASKS` | `task lihat daftar task saya` | tampilkan task aktif / terfilter |
| `LIST_TASKS_BY_DATE` | `task lihat jadwal tanggal 10` | tampilkan task pada tanggal tertentu |
| `OVERVIEW_TASKS` | `task overview hari ini` | tampilkan ringkasan/summary |

### Goal AI WhatsApp

AI WhatsApp sebaiknya bekerja mirip dengan flow AI Command Palette, tetapi dengan rule yang disesuaikan untuk media chat WhatsApp:

- memahami kalimat natural bahasa Indonesia/Inggris,
- tetap terbatas pada domain Task Planner,
- menentukan satu atau banyak aksi yang benar dari satu chat,
- memecah target task menjadi aksi terpisah saat memang berbeda,
- menyusun payload endpoint yang sesuai,
- memilih endpoint internal/backend yang tepat,
- menghasilkan respons balasan yang ringkas dan membantu.

### Format plan AI yang diimplementasikan

Resolver AI sekarang tidak lagi berhenti pada satu intent tunggal. Backend meminta AI mengembalikan plan terstruktur dengan bentuk:

```json
{
  "confidence": 0.92,
  "replyStyle": "NORMAL",
  "actions": [
    {
      "action": "DELETE_TASK",
      "confidence": 0.93,
      "targetText": "meeting selesai",
      "dateHint": "besok",
      "replyStyle": "NORMAL"
    },
    {
      "action": "DELETE_TASK",
      "confidence": 0.91,
      "targetText": "meeting yang jam 22.00",
      "dateHint": "besok",
      "replyStyle": "NORMAL"
    }
  ]
}
```

Prinsip utamanya:

- satu chat boleh menghasilkan banyak aksi,
- satu task target idealnya menjadi satu action,
- urutan action harus mengikuti urutan permintaan user,
- backend tetap menjadi executor final,
- jika AI gagal total, backend fallback ke satu intent ringan agar tidak memblokir user sepenuhnya.

### Arah routing intent ke backend

Arah integrasi yang disarankan:

- `CREATE_TASK` → gunakan flow setara create task / [`POST /api/tasks`](../README.md)
- `UPDATE_TASK` → gunakan flow setara update task existing
- `COMPLETE_TASK` → gunakan flow setara update status task menjadi `DONE`
- `LIST_TASKS` → gunakan flow get tasks milik user
- `LIST_TASKS_BY_DATE` → gunakan flow get tasks milik user + filter tanggal/deadline
- `OVERVIEW_TASKS` → gunakan flow statistik/ringkasan task user

Implementasi routing ini bisa dibuat terpisah dari flow registrasi agar rule WhatsApp lebih jelas dan tidak bercampur dengan parser command palette web.

### Requirement AI agar tetap satu arah

Agar konsisten, AI WhatsApp perlu punya rule seperti ini:

- jika ada kata `tambah`, arahkan ke action create,
- jika ada kata `edit`, arahkan ke action update,
- jika ada kata `selesai`, `done`, atau `beres`, arahkan ke complete,
- jika ada kata `overview`, arahkan ke summary,
- jika ada kata `lihat`, `daftar`, atau `list` dalam konteks task, arahkan ke list task,
- jika ada kata `tanggal`, `hari ini`, `besok`, `minggu ini`, arahkan ke list/filter jadwal,
- jika format `user_id daftar`, prioritaskan sebagai flow registrasi, bukan list,
- jika user menyebut dua task berbeda, keluarkan dua action terpisah,
- jika user mencampur create/update/delete/list dalam satu chat, pertahankan urutan action sesuai kalimat user,
- jangan menggabungkan banyak target berbeda ke satu `targetText` bila masih bisa dipisah aman.

## Spesifikasi Per Perintah WhatsApp

### 1. Registrasi WhatsApp

Format utama:

```text
user_id daftar
```

Contoh:

```text
clx123abc daftar
```

Tujuan:

- menghubungkan nomor WA pengirim ke `user_id`,
- menjadi syarat agar perintah task berikutnya bisa dipetakan ke user yang benar.

### 2. Tambah task

Format umum:

```text
task tambah ...
```

Contoh:

```text
task tambah meeting besok jam 10 malam #urgent
task tanggal 10 ada meeting jam 9 malam di apartement #kerjaan
```

Hasil yang diharapkan dari AI:

- `title`
- `description`
- `deadline`
- `priority`
- `estimatedDuration`
- `tags`
- `reminderTime`

Prinsipnya sama seperti AI command palette web: AI membaca bahasa natural lalu menyusun payload task create yang valid.

### 3. Edit task

Format umum:

```text
task edit ...
```

Contoh:

```text
task edit meeting besok jadi jam 9 malam
task ubah task laporan jadi prioritas tinggi
task ganti deadline presentasi ke tanggal 12 jam 8 pagi
```

#### Cara menentukan task yang diedit

Secara prioritas, AI/backend sebaiknya mencari task target dengan urutan:

1. **ID task eksplisit** jika suatu saat disediakan di response WhatsApp.
2. **Pencocokan title paling mirip** pada task aktif user.
3. **Konteks tanggal/deadline** bila disebutkan user.
4. **Status aktif** — utamakan `PENDING`, hindari `DONE` kecuali user menyebut histori.

Jika ada lebih dari satu task yang mirip, response sebaiknya tidak langsung update, tetapi meminta klarifikasi singkat.

Contoh klarifikasi:

```text
Saya menemukan 2 task yang mirip:
1. Meeting client — besok 10:00
2. Meeting client — tanggal 10 21:00
Balas dengan nomor task yang ingin diedit.
```

### 4. Selesaikan task

Format umum:

```text
task selesai ...
```

Contoh:

```text
task selesai meeting client
task done laporan bulanan
task beres presentasi marketing
```

#### Cara menyelesaikan task

Secara default, task diselesaikan berdasarkan:

1. **ID task** jika tersedia.
2. **Title task paling cocok** milik user terkait nomor WA tersebut.
3. **Filter status aktif**: hanya task `PENDING` yang boleh diubah ke `DONE`.
4. **Konteks waktu/deadline** jika user menyebut tanggal tertentu.

Jika match lebih dari satu, backend/AI sebaiknya meminta klarifikasi, bukan memilih secara acak.

Output akhirnya mengikuti rule backend: status diubah menjadi `DONE`, bukan dihapus.

### 5. Lihat daftar task

Format umum:

```text
task lihat daftar task saya
task list task
task task saya apa saja
```

Tujuan:

- menampilkan daftar task aktif user,
- default fokus ke task `PENDING`,
- dapat dibatasi oleh filter ringan seperti priority atau waktu.

#### Format output WhatsApp yang disarankan

Karena tidak ada card/chart seperti frontend, daftar task sebaiknya berupa list teks ringkas:

```text
Daftar Task Anda:
1. Meeting client — besok 10:00 — HIGH
2. Laporan bulanan — tanggal 10 21:00 — MEDIUM
3. Follow up vendor — Jumat 14:00 — LOW
```

### 6. Lihat jadwal / task berdasarkan tanggal

Format umum:

```text
task lihat jadwal tanggal 10
task ada apa besok
task jadwal hari ini
task task minggu ini
```

Tujuan:

- menampilkan task pada tanggal atau rentang waktu tertentu,
- berfungsi sebagai versi WhatsApp dari konteks kalender/timeline frontend,
- hasil disajikan sebagai list teks, bukan chart.

#### Mapping ke konsep frontend

Di frontend ada komponen timeline/kalender. Di WhatsApp, padanannya adalah daftar task berdasarkan tanggal.

Contoh output:

```text
Jadwal Anda untuk tanggal 10:
1. Meeting apartement — 21:00 — #kerjaan
2. Kirim revisi desain — 14:00 — HIGH
3. Follow up client — 16:30 — MEDIUM
```

Jika tidak ada task:

```text
Tidak ada task terjadwal pada tanggal 10.
```

### 7. Overview / ringkasan

Format umum:

```text
task overview
task overview hari ini
task ringkasan saya
task summary minggu ini
```

#### Mapping ke frontend overview

Di frontend [`overview/page.tsx`](../src/app/(protected)/overview/page.tsx:203), overview memuat:

- total tugas,
- jumlah selesai,
- jumlah pending,
- jumlah skipped,
- completion rate,
- skip rate,
- analisis/insight AI.

Di WhatsApp, chart dan visual level sebaiknya diubah menjadi ringkasan teks.

#### Format output overview WhatsApp yang disarankan

```text
Overview Task Anda:
- Total task: 12
- Pending: 5
- Done: 6
- Skipped: 1
- Completion rate: 50.0%
- Skip rate: 8.3%

Insight AI:
Fokus Anda cukup baik minggu ini, tetapi masih ada beberapa task tertunda. Prioritaskan task dengan deadline terdekat hari ini.
```

#### Catatan output overview

- tidak perlu chart,
- tidak perlu image/animal badge,
- cukup angka utama + insight AI singkat,
- tetap konsisten dengan data backend yang dipakai frontend.

### Parsing waktu Indonesia/Jakarta

Parser AI task sekarang memakai normalisasi waktu Indonesia/Jakarta di [`applyIndonesianTimeHints()`](../src/modules/ai/ai.service.ts:128). Tujuannya agar frasa natural seperti berikut tidak bergeser ke timezone server:

- `jam 9 malam` → `21:00 WIB`
- `jam 9 pagi` → `09:00 WIB`
- `jam 12 malam` → `00:00 WIB`
- `jam 6 sore` → `18:00 WIB`

Helper [`getJakartaDateParts()`](../src/modules/ai/ai.service.ts:85) dan [`createJakartaDate()`](../src/modules/ai/ai.service.ts:110) dipakai untuk memastikan input Indonesia dibentuk sebagai waktu `Asia/Jakarta`, bukan waktu lokal server yang bisa berbeda.

### Reminder WhatsApp personal berbasis scheduler

Reminder deadline personal tidak diproses di endpoint inbound, tetapi oleh scheduler backend yang otomatis dijalankan saat server start di [`startServer()`](../src/server.ts:8).

Komponen utamanya:

- interval scheduler: [`AUTO_SKIP_INTERVAL_MS`](../src/modules/tasks/task.auto-skip.scheduler.ts:4)
- loop utama reminder + auto-skip: [`TaskAutoSkipScheduler.run()`](../src/modules/tasks/task.auto-skip.scheduler.ts:46)
- sender outbound personal: [`sendWhatsappMessage()`](../src/modules/tasks/task.auto-skip.scheduler.ts:27)
- query candidate reminder: [`TaskService.processWhatsappDeadlineReminders()`](../src/modules/tasks/task.service.ts:404)
- auto-skip overdue: [`TaskService.autoSkipOverdueTasks()`](../src/modules/tasks/task.service.ts:328)
- dedup flag update: [`TaskService.markWhatsappReminderSent()`](../src/modules/tasks/task.service.ts:521) dan [`TaskService.markSkippedNotificationSent()`](../src/modules/tasks/task.service.ts:532)

Perilaku reminder yang aktif saat ini:

- hanya untuk task dengan status `PENDING`,
- hanya untuk user yang memiliki `whatsappNumber`,
- scheduler berjalan setiap **1 menit**,
- kirim reminder personal saat sisa deadline **24 jam**,
- kirim reminder personal saat sisa deadline **1 jam**,
- kirim reminder personal **tepat pada deadline**,
- pada pesan deadline, user diperingatkan bahwa task akan otomatis menjadi `SKIPPED` jika belum ditandai selesai,
- tolerance auto-skip mengikuti `estimatedDuration` task dengan minimum/default `60` menit,
- setelah task benar-benar auto-`SKIPPED`, backend mengirim notifikasi personal lagi jika nomor WhatsApp tersedia.

Dedup reminder disimpan pada field schema task di [`schema.prisma`](../prisma/schema.prisma):

- `reminder24hSent`
- `reminder1hSent`
- `reminderDeadlineSent`
- `skippedNotificationSent`

## Non-Registration Command Saat Ini

Jika command **bukan** format `user_id daftar`, maka endpoint saat ini akan:

- menormalisasi nomor WA,
- mencari user berdasarkan `whatsappNumber`,
- mengirim bantuan publik jika nomor belum terdaftar,
- mendeteksi intent internal,
- menjalankan operasi internal sesuai intent,
- mengirim bantuan command jika user meminta `task bantuan` atau command belum dikenali,
- mengirim balasan ke endpoint WhatsApp reply,
- mengembalikan payload normalized dengan `intent`, `operation`, dan `whatsappReply`.

Message HTTP sukses sekarang menggunakan text:

```text
WhatsApp inbound command processed
```

## Struktur Response Normalized

Semua request sukses menggunakan format [`sendSuccess()`](../src/lib/response.ts).

### Top-level response

```json
{
  "success": true,
  "data": {
    "source": "whatsapp",
    "service": "internal-wa",
    "command": "clx123abc daftar",
    "rawMessage": "clx123abc daftar",
    "registrationCommand": true,
    "taskPlannerUserId": "clx123abc",
    "user": {},
    "message": {},
    "context": {},
    "receivedAt": "2026-05-19T04:00:00.000Z",
    "registration": {},
    "registrationNotification": {}
  },
  "message": "WhatsApp registration captured and saved"
}
```

### Arti field penting

- `registrationCommand`: apakah command cocok flow `user_id daftar`
- `taskPlannerUserId`: hasil parsing token pertama command
- `intent`: hasil deteksi intent internal WhatsApp
- `operation`: hasil eksekusi internal untuk create/list/done/overview/unknown
- `whatsappReply.sent`: apakah pengiriman WhatsApp balasan berhasil
- `registration.linked`: apakah nomor berhasil dihubungkan ke user
- `registration.reason`: alasan gagal link jika ada
- `registrationNotification.sent`: apakah pengiriman WhatsApp balasan registrasi berhasil
- `registrationNotification.type`: tipe notifikasi (`registration-success`, `user-not-found`, `already-registered`)

## HTTP Status Summary

| Kondisi | HTTP Status | Keterangan |
|---|---:|---|
| registrasi berhasil | `201` | nomor tersimpan dan pesan sukses dikirim/dicoba kirim |
| user id tidak ditemukan | `201` | payload sukses, tetapi registrasi tidak terhubung |
| user sudah punya nomor | `201` | payload sukses, tetapi registrasi tidak terhubung |
| create/list/done/overview berhasil | `201` | operasi internal berhasil dan balasan WA dikirim/dicoba kirim |
| nomor WA belum terdaftar | `201` | operasi ditolak, user diminta daftar/link terlebih dahulu |
| command tidak dikenali | `201` | operasi gagal dikenali, tetapi balasan WA tetap dikirim |
| token salah | `401` | unauthorized |
| command kosong | `400` | validation error |
| wa number tidak ditemukan | `400` | validation error |
| nomor gagal normalisasi | `400` | validation error |
| nomor sudah dipakai user lain | `409` | conflict |
| config token kosong | `500` | config error |

## Contoh cURL

### Registrasi berhasil

```bash
curl -X POST http://localhost:8000/internal/wa/inbound \
  -H "Authorization: Bearer YOUR_TOKEN_WHATSAPP" \
  -H "x-service-secret: YOUR_TOKEN_WHATSAPP" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "whatsapp",
    "service": "internal-wa",
    "command": "clx123abc daftar",
    "rawMessage": "clx123abc daftar",
    "message": {
      "id": "wamid.001",
      "timestamp": "1716091200",
      "body": "clx123abc daftar"
    },
    "user": {
      "waNumber": "081234567890",
      "name": "Bayu Farid",
      "chatId": "6281234567890@c.us",
      "participant": "6281234567890@c.us",
      "isGroup": false
    },
    "context": {
      "remoteJid": "6281234567890@c.us",
      "pushName": "Bayu Farid",
      "senderIsAdmin": false
    }
  }'
```

### User tidak ditemukan

```bash
curl -X POST http://localhost:8000/internal/wa/inbound \
  -H "Authorization: Bearer YOUR_TOKEN_WHATSAPP" \
  -H "x-service-secret: YOUR_TOKEN_WHATSAPP" \
  -H "Content-Type: application/json" \
  -d '{
    "command": "unknown-user daftar",
    "user": {
      "waNumber": "081234567890",
      "chatId": "6281234567890@c.us"
    }
  }'
```

### Non-registration inbound

```bash
curl -X POST http://localhost:8000/internal/wa/inbound \
  -H "Authorization: Bearer YOUR_TOKEN_WHATSAPP" \
  -H "x-service-secret: YOUR_TOKEN_WHATSAPP" \
  -H "Content-Type: application/json" \
  -d '{
    "command": "task tambah meeting besok jam 10 malam #urgent",
    "user": {
      "waNumber": "081234567890",
      "chatId": "6281234567890@c.us"
    }
  }'
```

### Fitur internal WhatsApp yang sudah aktif

- `task bantuan` → kirim daftar command dan contoh penggunaan
- `task tambah meeting besok jam 10 malam #urgent` → create task via AI parser internal
- `task edit meeting besok jadi jam 9 malam` → update task via AI-first resolver + pencocokan task terbaik
- `task hapus meeting client besok` → soft delete task via AI-first resolver + pencocokan task terbaik
- `task lihat jadwal` → list task aktif
- `task lihat jadwal besok` → list task by date
- `task selesai meeting client` → tandai DONE berdasarkan judul/date hint yang match
- `task overview` → kirim ringkasan task user
- nomor belum terdaftar → kirim bantuan publik + link daftar web + cara link `user_id daftar`
- registrasi berhasil → kirim pesan sukses + auto tampilkan bantuan command
- reminder personal H-24, H-1, tepat deadline, dan notifikasi auto-`SKIPPED`

### Catatan arsitektur endpoint internal

Flow WhatsApp ini **tidak** memanggil endpoint web-auth biasa seperti [`/api/tasks`](../src/modules/tasks/task.routes.ts) melalui HTTP internal. Endpoint [`POST /internal/wa/inbound`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:451) langsung menggunakan service internal backend:

- [`AiService.parseTaskCommand()`](../src/modules/ai/ai.service.ts:175)
- [`AiService.resolveWhatsappAction()`](../src/modules/ai/ai.service.ts:283)
- [`TaskService.createTask()`](../src/modules/tasks/task.service.ts:10)
- [`TaskService.getTasks()`](../src/modules/tasks/task.service.ts:51)
- [`TaskService.updateTask()`](../src/modules/tasks/task.service.ts:93)
- [`TaskService.updateTaskStatus()`](../src/modules/tasks/task.service.ts:148)
- [`TaskService.deleteTask()`](../src/modules/tasks/task.service.ts:171)
- [`TaskService.getTaskStats()`](../src/modules/tasks/task.service.ts:187)
- [`TaskService.getDailyTaskStats()`](../src/modules/tasks/task.service.ts:197)

Dengan pola ini, WhatsApp AI punya akses internal tanpa login session user web, tetapi tetap aman karena konteks user selalu diambil dari nomor WhatsApp yang sudah terdaftar.

## Catatan Integrasi Lanjutan

Arah implementasi yang sekarang berlaku:

- [`POST /internal/wa/inbound`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:451) adalah pintu masuk semua command task dari WhatsApp,
- filtering chat non-task sudah menjadi tanggung jawab provider bot WhatsApp,
- backend fokus pada pembacaan `command`, pemetaan nomor WA ke user, dan routing intent,
- flow `user_id daftar` tetap menjadi prerequisite untuk linking identitas user,
- flow AI WhatsApp sudah memakai service internal backend, bukan endpoint web auth biasa,
- resolver utama sekarang adalah [`AiService.resolveWhatsappAction()`](../src/modules/ai/ai.service.ts:283) dengan fallback ringan ke [`detectWhatsappIntent()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:238),
- parser task natural sekarang menjaga konteks waktu Indonesia/Jakarta melalui [`applyIndonesianTimeHints()`](../src/modules/ai/ai.service.ts:128),
- setelah setiap operasi, backend mencoba mengirim balasan ke endpoint WhatsApp reply melalui [`sendWhatsappMessage()`](../src/modules/whatsappInbound/whatsapp-inbound.routes.ts:38),
- scheduler reminder personal berjalan paralel di background melalui [`TaskAutoSkipScheduler.start()`](../src/modules/tasks/task.auto-skip.scheduler.ts:11).

Dengan arah ini, AI WhatsApp sekarang sudah dapat menentukan apakah sebuah command harus menuju create, update, delete, complete, overview, atau list, lalu menyusun payload backend yang sesuai tanpa keluar dari domain Smart Task Planner berbasis AI dari dastrevas.com.

## Rekomendasi Tahap Berikutnya

Tahap teknis berikutnya yang direkomendasikan:

- tambahkan test otomatis/service-level untuk AI resolver WhatsApp dan scheduler reminder,
- tambahkan strategi disambiguasi yang lebih kuat berbasis `id`, `title`, deadline, atau top-N candidate,
- tambahkan formatter output yang lebih kaya untuk overview dan list,
- jalankan migration atau [`prisma db push`](../README.md:271) untuk field dedup reminder terbaru,
- regenerate Prisma client agar field reminder tidak lagi perlu raw SQL workaround.

## Rekomendasi Testing

Checklist manual/QC yang disarankan:

- [ ] test request tanpa header auth → harus `401`
- [ ] test request tanpa `command` → harus `400`
- [ ] test request tanpa sumber nomor WA → harus `400`
- [ ] test `user_id daftar` dengan user valid tanpa nomor → harus link berhasil + kirim pesan sukses
- [ ] test `user_id daftar` dengan user tidak ditemukan → harus kirim pesan signup
- [ ] test `user_id daftar` dengan user yang sudah punya nomor → harus kirim pesan sudah terdaftar
- [ ] test nomor WA yang sudah dipakai user lain → harus `409`
- [ ] test command non-registrasi dari nomor belum terdaftar → harus kirim bantuan publik + link daftar web
- [ ] test `task bantuan` dari user terdaftar → harus menampilkan daftar command
- [ ] test `task help` atau command unknown dari user terdaftar → harus menampilkan bantuan command
- [ ] test registrasi berhasil → harus kirim pesan sukses + bantuan command
- [ ] test `task tambah meeting besok jam 10 malam #urgent` → harus diparse ke create task dan task tersimpan
- [ ] test `task edit meeting besok jadi jam 9 malam` → harus route ke update task
- [ ] test `task hapus meeting client besok` → harus route ke delete task
- [ ] test `task lihat jadwal` → harus menampilkan task aktif user terkait
- [ ] test `task lihat jadwal besok` → harus memfilter berdasarkan tanggal besok
- [ ] test `task lihat jadwal tanggal 10` → harus route ke list by date
- [ ] test `task selesai meeting client` → harus route ke complete task
- [ ] test `task selesai` tanpa judul → harus minta judul task
- [ ] test title ambigu untuk done/update/delete → harus minta user lebih spesifik
- [ ] test `task overview` → harus mengembalikan ringkasan task user
- [ ] test frasa `jam 9 malam`, `jam 9 pagi`, `jam 6 sore` → harus tersimpan sebagai WIB yang benar
- [ ] test scheduler reminder H-24, H-1, tepat deadline, dan auto-`SKIPPED`
- [ ] test user tanpa `whatsappNumber` → reminder personal tidak dikirim
- [ ] verifikasi isi `operation` dan `whatsappReply` pada setiap skenario
- [ ] verifikasi pesan WhatsApp benar-benar terkirim dari service bot
- [ ] jalankan build backend setelah perubahan
- [ ] jalankan `git status --short` untuk review file berubah
