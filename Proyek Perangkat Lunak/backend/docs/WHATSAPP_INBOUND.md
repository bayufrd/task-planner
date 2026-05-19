# WhatsApp AI Inbound API

Dokumentasi ini menjelaskan endpoint internal [`POST /internal/wa/inbound`](../src/app.ts:225) pada backend Smart Task Planner.

Endpoint ini adalah **entrypoint tunggal** untuk semua command WhatsApp yang sudah lebih dulu difilter oleh penyedia bot WhatsApp. Backend tidak perlu memikirkan filtering chat non-task di layer ini. Backend cukup membaca field `command`, mengenali intent, lalu meneruskan ke flow yang sesuai.

Saat ini flow yang sudah diimplementasikan penuh adalah registrasi/linking nomor WhatsApp ke user Task Planner melalui pattern `user_id daftar`. Ke depan, endpoint ini juga menjadi pintu masuk untuk command AI seperti tambah task, edit task, done task, overview, dan daftar task.

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

- [`handleWhatsappInbound()`](../src/app.ts:66)
- [`sendWhatsappMessage()`](../src/app.ts:40)
- [`sendWhatsappRegistrationSuccess()`](../src/app.ts:62)
- route registration di [`createApp()`](../src/app.ts:225)

## Security

Endpoint ini bersifat **internal** dan bukan untuk konsumsi public client/frontend.

### Header Wajib

Request wajib mengirim kedua header berikut:

```http
Authorization: Bearer <TOKEN_WHATSAPP>
x-service-secret: <TOKEN_WHATSAPP>
```

Validasi dilakukan di [`handleWhatsappInbound()`](../src/app.ts:67) sampai [`handleWhatsappInbound()`](../src/app.ts:79).

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

Parsing dilakukan di [`handleWhatsappInbound()`](../src/app.ts:85).

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

Backend akan mencoba mengambil nomor WhatsApp dari beberapa field secara berurutan di [`handleWhatsappInbound()`](../src/app.ts:93):

1. [`user.waNumber`](../src/app.ts:94)
2. [`user.participant`](../src/app.ts:95)
3. [`user.chatId`](../src/app.ts:96)
4. [`context.remoteJid`](../src/app.ts:97)

Nomor lalu dinormalisasi oleh:

- [`extractWaNumber()`](../src/app.ts:16)
- [`normalizeSafeWhatsappNumber()`](../src/app.ts:22)

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

Validasi ada di [`handleWhatsappInbound()`](../src/app.ts:99).

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

Validasi ada di [`handleWhatsappInbound()`](../src/app.ts:104).

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

Command registrasi dikenali dengan regex [`/^(\S+)\s+daftar$/i`](../src/app.ts:109).

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
- flag [`registrationCommand`](../src/app.ts:111) akan bernilai `true`.

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

### Prinsip arsitektur

- provider bot WhatsApp sudah memfilter chat yang relevan,
- backend menerima payload lewat [`POST /internal/wa/inbound`](../src/app.ts:225),
- backend membaca field `command`,
- backend mengidentifikasi intent,
- backend menyusun payload ke endpoint/service internal yang sesuai,
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
task tambah meeting besok jam 10 malam #urgent
task tanggal 10 ada meeting jam 9 malam di apartement #kerjaan
task edit meeting besok jadi jam 9 malam
task selesai kan task meeting client
task overview hari ini
task lihat daftar task saya
```

### Intent yang direncanakan

Dokumen ini menyamakan arah implementasi bahwa AI WhatsApp akan mengubah command menjadi intent terstruktur berikut:

| Intent | Contoh command | Arah aksi |
|---|---|---|
| `REGISTER_WHATSAPP` | `clx123abc daftar` | link nomor WA ke user |
| `CREATE_TASK` | `task tambah meeting besok jam 10 malam #urgent` | buat task baru |
| `UPDATE_TASK` | `task edit meeting besok jadi jam 9 malam` | ubah task yang cocok |
| `COMPLETE_TASK` | `task selesai kan task meeting client` | tandai task `DONE` |
| `LIST_TASKS` | `task lihat daftar task saya` | tampilkan task aktif / terfilter |
| `OVERVIEW_TASKS` | `task overview hari ini` | tampilkan ringkasan/summary |

### Goal AI WhatsApp

AI WhatsApp sebaiknya bekerja mirip dengan flow AI Command Palette, tetapi dengan rule yang disesuaikan untuk media chat WhatsApp:

- memahami kalimat natural bahasa Indonesia/Inggris,
- tetap terbatas pada domain Task Planner,
- menentukan intent yang benar,
- menyusun payload endpoint yang sesuai,
- memilih endpoint internal/backend yang tepat,
- menghasilkan respons balasan yang ringkas dan membantu.

### Arah routing intent ke backend

Arah integrasi yang disarankan:

- `CREATE_TASK` → gunakan flow setara [`POST /api/tasks`](../README.md)
- `UPDATE_TASK` → gunakan flow setara update task existing
- `COMPLETE_TASK` → gunakan flow setara update status task menjadi `DONE`
- `LIST_TASKS` → gunakan flow get tasks milik user
- `OVERVIEW_TASKS` → gunakan flow statistik/ringkasan task user

Implementasi routing ini bisa dibuat terpisah dari flow registrasi agar rule WhatsApp lebih jelas dan tidak bercampur dengan parser command palette web.

### Requirement AI agar tetap satu arah

Agar konsisten, AI WhatsApp nantinya perlu punya rule seperti ini:

- jika ada kata `tambah`, arahkan ke intent create,
- jika ada kata `edit`, arahkan ke intent update,
- jika ada kata `selesai`, `done`, atau `beres`, arahkan ke complete,
- jika ada kata `overview`, arahkan ke summary,
- jika ada kata `lihat`, `daftar`, atau `list` dalam konteks task, arahkan ke list task,
- jika format `user_id daftar`, prioritaskan sebagai flow registrasi, bukan list.

### Status implementasi saat ini

Saat ini backend baru mengimplementasikan penuh:

- validasi auth internal,
- parsing payload inbound,
- resolusi nomor WhatsApp,
- flow registrasi `user_id daftar`,
- normalized response payload.

Flow AI untuk create/update/done/list/overview **belum** diimplementasikan di handler ini, tetapi endpoint ini memang didesain sebagai pintu masuknya.

## Non-Registration Command Saat Ini

Jika command **bukan** format `user_id daftar`, maka pada implementasi saat ini:

- `registrationCommand` = `false`,
- `taskPlannerUserId` = `null`,
- `registration` = `null`,
- `registrationNotification` = `null`.

Endpoint tetap mengembalikan payload normalized dengan message:

```text
WhatsApp inbound payload captured
```

Ini berarti command task seperti `task tambah ...` saat ini sudah bisa ditangkap payload-nya, tetapi belum diproses ke intent task final di handler sekarang.

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
- `registration.linked`: apakah nomor berhasil dihubungkan ke user
- `registration.reason`: alasan gagal link jika ada
- `registrationNotification.sent`: apakah pengiriman WhatsApp balasan berhasil
- `registrationNotification.type`: tipe notifikasi (`registration-success`, `user-not-found`, `already-registered`)

## HTTP Status Summary

| Kondisi | HTTP Status | Keterangan |
|---|---:|---|
| registrasi berhasil | `201` | nomor tersimpan dan pesan sukses dikirim/dicoba kirim |
| user id tidak ditemukan | `201` | payload sukses, tetapi registrasi tidak terhubung |
| user sudah punya nomor | `201` | payload sukses, tetapi registrasi tidak terhubung |
| command biasa non registrasi | `201` | inbound dicatat sebagai payload biasa |
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

## Catatan Integrasi Lanjutan

Arah implementasi yang disepakati dari dokumentasi ini:

- [`POST /internal/wa/inbound`](../src/app.ts:225) adalah pintu masuk semua command task dari WhatsApp,
- filtering chat non-task sudah menjadi tanggung jawab provider bot WhatsApp,
- backend fokus pada pembacaan `command`, pemetaan nomor WA ke user, dan routing intent,
- flow `user_id daftar` tetap menjadi prerequisite untuk linking identitas user,
- flow AI berikutnya perlu dibuat khusus untuk WhatsApp agar rules-nya jelas, meski knowledge domain-nya bisa tetap sama dengan AI Command Palette.

Dengan arah ini, AI WhatsApp diharapkan dapat menentukan apakah sebuah command harus menuju create, update, complete, overview, atau list, lalu menyusun payload backend yang sesuai tanpa keluar dari domain Smart Task Planner berbasis AI dari dastrevas.com.

## Rekomendasi Tahap Berikutnya

Setelah dokumentasi ini disepakati, implementasi teknis yang direkomendasikan adalah membuat modul/service AI WhatsApp terpisah, misalnya:

- parser intent WhatsApp,
- resolver user dari nomor WA,
- router intent ke service task,
- formatter response WhatsApp.

Pemisahan ini akan memudahkan karena rule WhatsApp berbeda dari UI web command palette, walaupun keduanya tetap bisa berbagi knowledge domain Task Planner yang sama.

## Rekomendasi Testing

Checklist manual yang disarankan:

- [ ] test request tanpa header auth → harus `401`
- [ ] test request tanpa `command` → harus `400`
- [ ] test request tanpa sumber nomor WA → harus `400`
- [ ] test `user_id daftar` dengan user valid tanpa nomor → harus link berhasil
- [ ] test `user_id daftar` dengan user tidak ditemukan → harus kirim pesan signup
- [ ] test `user_id daftar` dengan user yang sudah punya nomor → harus kirim pesan sudah terdaftar
- [ ] test nomor WA yang sudah dipakai user lain → harus `409`
- [ ] test command non registrasi seperti `task tambah meeting besok jam 10 malam #urgent`
- [ ] verifikasi isi `registrationNotification` pada setiap skenario
- [ ] verifikasi pesan WhatsApp benar-benar terkirim dari service bot
