# Bug Report 003: Salah Interpretasi Waktu WhatsApp dan Deadline Tertimpa Saat Edit Task

## Status
- **ID**: BUG-003
- **Severity**: High
- **Component**: Backend Express, WhatsApp Inbound, AI Parsing, Deadline Normalization
- **Reported Date**: 2026-06-16
- **Status**: Resolved

## Ringkasan Masalah
Flow WhatsApp untuk task berbahasa Indonesia salah menginterpretasikan frasa waktu lokal seperti `jam 7 malam` / `jam 7 nanti malam`. Sistem berhasil menentukan tanggal yang benar, tetapi jam berubah menjadi `07.00` alih-alih `19.00`. Setelah itu, flow edit task juga tidak bersifat partial: perintah edit judul yang memuat frasa waktu seperti `malam ini` ikut menimpa `deadline` menjadi `20.00`, walaupun pengguna tidak meminta perubahan jam. Perintah koreksi lanjutan `jam 7 bukan jam 8` juga gagal dipahami dengan benar karena logika matching dan normalisasi deadline masih salah.

## Konteks Arsitektur
Berdasarkan [`proyek-perangkat-lunak/docs/APP-express.md`](proyek-perangkat-lunak/docs/APP-express.md) dan [`proyek-perangkat-lunak/README.md`](proyek-perangkat-lunak/README.md):
- Backend menerima command WhatsApp melalui endpoint internal [`POST /internal/wa/inbound`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:565).
- Modul WhatsApp memanggil AI untuk menentukan action plan dan hasil parsing task melalui [`AiService.resolveWhatsappPlan()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:326) dan [`AiService.parseTaskCommand()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:218).
- Normalisasi waktu Indonesia dilakukan lagi secara deterministik di [`applyIndonesianTimeHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:139) dan [`normalizeDeadlineWithCommandHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:208).
- Persistence bukan sumber utama bug, karena [`TaskService.updateTask()`](proyek-perangkat-lunak/backend/src/modules/tasks/task.service.ts:96) hanya menyimpan field yang sudah dibentuk lebih awal oleh flow inbound.

## Kronologi Teknis Berdasarkan Log

### 1. Create task awal sudah salah sebelum disimpan
Pesan user pada log WhatsApp bot:

```text
Task meeting jam 7 nanti malam #kuliah
```

Di backend, request diterima sebagai command:

```text
meeting jam 7 nanti malam #kuliah
```

Lalu backend mencatat hasil parsing AI dengan deadline berikut:

```text
aiParsedTask.deadline: '2026-06-16T00:00:00.000Z'
```

Bukti ini muncul di log backend [`proyek-perangkat-lunak/backend/dist/logs/logs-task-be`](proyek-perangkat-lunak/backend/dist/logs/logs-task-be). Nilai `2026-06-16T00:00:00.000Z` sama dengan `16 Jun 2026 07:00 WIB`, dan reply yang disiapkan backend juga menampilkan:

```text
🕒 16 Jun 2026, 07.00
```

Kesimpulan: perubahan menjadi `07.00` terjadi **sebelum** penyimpanan database dan **sebelum** formatting reply. Jadi ini bukan sekadar bug tampilan timezone.

### 2. Edit title ikut mengubah jam menjadi 20.00
Pesan berikutnya pada log:

```text
Task edit meeting malam ini ganti title jadi meeting zoom pemrograman fullstack
```

Backend mencatat action plan berikut:

```text
action: 'UPDATE_TASK'
targetText: 'meeting malam ini'
dateHint: 'malam ini'
```

Lalu reply yang disiapkan backend menjadi:

```text
🕒 16 Jun 2026, 20.00
```

Bukti ini ada di [`proyek-perangkat-lunak/backend/dist/logs/logs-task-be`](proyek-perangkat-lunak/backend/dist/logs/logs-task-be) sekitar baris 525-549 dan menunjukkan bahwa perintah edit judul telah mengubah `deadline`, bukan hanya `title`.

### 3. Percobaan koreksi pertama gagal menemukan task
Pesan berikutnya:

```text
Task edit task meeting nanti malam jam jam 7 malam bukan jam 8
```

Backend menyusun plan:

```text
action: 'UPDATE_TASK'
targetText: 'meeting'
dateHint: 'nanti malam jam 7 malam, bukan jam 8'
```

Balasan backend:

```text
⚠️ Task untuk diedit tidak ditemukan.
🔎 Pencarian: meeting nanti malam jam 7 malam, bukan jam 8
```

Artinya token waktu dan negasi ikut terbawa ke petunjuk pencarian task, sehingga petunjuk identifikasi task tercampur dengan instruksi perubahan deadline.

### 4. Percobaan koreksi kedua berhasil match task, tetapi jam kembali menjadi 07.00
Pesan berikutnya:

```text
Task edit meeting zoom pemrograman fullstack nanti malam jam 7 bukan jam 8
```

Plan yang dicatat backend:

```text
action: 'UPDATE_TASK'
targetText: 'meeting zoom pemrograman fullstack'
dateHint: 'nanti malam jam 7 bukan jam 8'
```

Task kali ini berhasil ditemukan, tetapi reply akhir tetap:

```text
🕒 16 Jun 2026, 07.00
```

Ini membuktikan bahwa walaupun matching task berhasil, normalisasi frasa `nanti malam jam 7 bukan jam 8` tetap salah dan tidak menghormati koreksi eksplisit pengguna.

### 5. State akhir task mengonfirmasi deadline yang salah tersimpan
Saat user meminta jadwal hari ini, backend menampilkan:

```text
• meeting zoom pemrograman fullstack | 16 Jun 2026, 07.00 | MEDIUM | SKIPPED
• meeting | 16 Jun 2026, 07.00 | MEDIUM | SKIPPED
```

Bukti ini menegaskan bahwa deadline salah memang telah tersimpan / dipertahankan di layer data, bukan hanya salah render di satu response.

## Titik Perubahan Waktu yang Paling Mungkin dan Bukti Kodenya

### A. Perubahan `jam 7 malam` menjadi `07.00` terjadi di layer parsing + normalisasi, bukan di formatter
Bukti utama dari log adalah `aiParsedTask.deadline: '2026-06-16T00:00:00.000Z'`. Formatter reply hanya menampilkan nilai itu dalam WIB. Karena ISO hasil parsing sudah merepresentasikan `07:00 WIB`, maka sumber masalah ada sebelum [`TaskService.createTask()`](proyek-perangkat-lunak/backend/src/modules/tasks/task.service.ts:17).

Di sisi kode, jalur create task memanggil [`AiService.parseTaskCommand()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:218), lalu hasilnya dipakai untuk membuat task melalui handler WhatsApp pada [`handleWhatsappInbound`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:565).

Normalisasi lokal Indonesia dilakukan di [`applyIndonesianTimeHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:139) dengan regex berikut:

```ts
const jamMatch = /\b(?:jam|pukul)\s+(\d{1,2})(?:(?::|\.)(\d{2}))?\s*(pagi|siang|sore|malam)?\b/
```

Masalah pada regex ini: ia hanya menangkap penanda periode (`pagi|siang|sore|malam`) jika periodenya berada tepat setelah ekspresi `jam 7`. Untuk input alami seperti `jam 7 nanti malam`, kata `malam` terpisah oleh `nanti`, sehingga `jamMatch` sangat mungkin hanya mengenali `jam 7` tanpa konteks malam. Akibatnya jam tetap `7`, bukan dikonversi ke `19`.

Ini konsisten dengan gejala log:
- tanggal benar: konteks `hari ini` / `nanti malam` masih terbaca sebagai tanggal yang benar,
- jam salah: konversi 12-jam ke 24-jam gagal,
- hasil akhir menjadi `07.00`.

### B. Edit title mengubah jam karena update flow memaksa parse ulang deadline
Pada flow update, backend lebih dulu menyusun `updateInput` melalui [`sanitizeTaskUpdateInput()`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:491).

Namun pada handler update di [`handleWhatsappInbound`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:565), ada fallback yang secara efektif berkata: jika command mengandung kata-kata waktu, tetapi AI plan tidak memberi `updates.deadline`, backend akan memanggil parse task penuh lagi dan mengisi `updateInput.deadline` dari hasil parse tersebut.

Dengan kata lain, edit title yang kebetulan memuat `malam ini` tidak diperlakukan sebagai "ubah title saja", melainkan sebagai command yang layak memicu re-derivasi deadline. Itulah sebabnya judul berubah sekaligus waktu bergeser menjadi `20.00`.

Akar masalahnya bukan pada [`TaskService.updateTask()`](proyek-perangkat-lunak/backend/src/modules/tasks/task.service.ts:96), karena service itu hanya menyimpan field yang diberikan. Deadline sudah tercemar sebelum mencapai service layer.

### C. Koreksi `bukan jam 8` gagal karena sistem tidak punya model negasi/correction yang eksplisit
Pada kasus `nanti malam jam 7 bukan jam 8`, ada dua kegagalan berbeda:

1. **Kegagalan matching task**
   - `dateHint` berisi kalimat panjang `nanti malam jam 7 malam, bukan jam 8`.
   - Petunjuk waktu ini ikut masuk ke proses pencarian task pada [`findBestTaskMatch()`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:440).
   - Akibatnya clue pencarian bukan lagi hanya identitas task, tetapi tercampur dengan deskripsi perubahan waktu.

2. **Kegagalan parsing deadline**
   - Saat task sudah berhasil ditemukan pada percobaan kedua, sistem tetap menghasilkan `07.00`.
   - Ini menunjukkan backend belum punya aturan eksplisit bahwa frasa `bukan jam 8` adalah koreksi / penolakan terhadap kandidat lain.
   - Sistem tampaknya hanya mengambil satu kandidat waktu dari parse AI + post-processing lokal, tanpa tahap conflict resolution untuk ekspresi negasi.

## Klasifikasi Akar Masalah

### 1. Prompt / AI output
Ada indikasi AI belum cukup dipaksa untuk mengembalikan interpretasi yang stabil untuk frasa Indonesia seperti `jam 7 nanti malam` dan koreksi seperti `bukan jam 8`. Namun bukti terkuat bukan pada prompt saja, karena backend masih menjalankan normalisasi tambahan setelah AI.

### 2. Parser lokal Indonesia
Ini adalah akar masalah terkuat untuk kasus `07.00`. [`applyIndonesianTimeHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:139) terlalu kaku terhadap urutan kata, sehingga tidak aman untuk variasi bahasa alami Indonesia seperti:
- `jam 7 nanti malam`
- `jam 7 malam ini`
- `nanti malam jam 7`

### 3. Timezone handling
Timezone bukan akar utama bug ini. Sistem justru konsisten memakai WIB saat menampilkan hasil. Masalahnya adalah nilai UTC yang dibentuk sudah salah sejak awal. `2026-06-16T00:00:00.000Z` memang ekuivalen dengan `07.00 WIB`, jadi formatter hanya menampilkan data yang sudah salah.

### 4. Backend merge / update logic
Ini adalah akar masalah terkuat untuk kasus edit title berubah jam. Flow update tidak benar-benar partial karena ada fallback reparsing deadline berdasarkan kemunculan token waktu di command. Perilaku ini membuat `title-only edit` dapat mengubah deadline secara diam-diam.

### 5. Task matching logic
Matching task terlalu dipengaruhi `dateHint` yang mengandung instruksi perubahan waktu. Akibatnya frasa koreksi yang seharusnya dipakai untuk update deadline malah ikut merusak identifikasi target task.

## Root Cause Paling Kuat
Root cause paling kuat adalah **kombinasi dua cacat implementasi backend**:

1. **Normalisasi waktu Indonesia di [`applyIndonesianTimeHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:139) terlalu kaku terhadap urutan kata**, sehingga frasa alami seperti `jam 7 nanti malam` tidak dikonversi menjadi `19:00`.
2. **Flow update WhatsApp di [`handleWhatsappInbound`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:565) tidak menjaga partial update**, karena command edit yang memuat kata waktu dapat memicu parse ulang deadline dan menimpa nilai existing meskipun user hanya meminta perubahan title.

Bug ketiga yang memperburuk kasus koreksi adalah **task matching dan dateHint belum dipisahkan secara semantik**, sehingga `bukan jam 8` ikut mengganggu identifikasi task dan tidak pernah diperlakukan sebagai aturan koreksi waktu.

## Dampak
- User Indonesia kehilangan kepercayaan pada interpretasi waktu lokal.
- Edit task menjadi tidak deterministik: perubahan judul dapat mengubah deadline.
- Perintah koreksi natural language tidak aman untuk dipakai di WhatsApp.
- Reminder, auto-skip, dan jadwal harian menjadi salah karena bergantung pada deadline yang sudah salah tersimpan.

## Checklist Implementasi
- [x] Perbaiki parser waktu Indonesia agar konteks `malam` tetap terbaca pada frasa seperti `jam 7 nanti malam` dan `nanti malam jam 7`.
- [x] Pastikan parser mengabaikan kandidat waktu yang berada setelah negasi seperti `bukan jam 8`.
- [x] Hapus fallback reparsing deadline pada flow edit task agar update title tidak lagi menimpa `deadline` secara diam-diam.
- [x] Pisahkan prioritas matching task dari `targetText` dan `dateHint`, sehingga koreksi waktu tidak lagi merusak identifikasi task.
- [x] Verifikasi kompilasi backend berhasil setelah perubahan.
- [x] Verifikasi perilaku inti dengan skenario reproduksi bug.

## Fix Summary
1. [`applyIndonesianTimeHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:139) diubah agar tidak lagi bergantung pada token periode yang menempel langsung setelah `jam`. Implementasi final membaca konteks `pagi|siang|sore|malam` dari jendela kata di sekitar ekspresi jam, sehingga frasa seperti `jam 7 nanti malam`, `hari ini jam 7 malam`, dan `nanti malam jam 7` kini dikonversi menjadi `19:00 WIB` dengan benar.
2. [`applyIndonesianTimeHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:139) juga diubah untuk memilih kandidat jam pertama yang tidak didahului negasi `bukan`, sehingga frasa `jam 7 bukan jam 8` akan mempertahankan `07/19` dari kandidat pertama dan tidak membiarkan `jam 8` menimpa hasil akhir.
3. [`handleWhatsappInbound`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:565) tidak lagi melakukan fallback `parseTaskCommand(command)` saat update task hanya karena command memuat token waktu. Dengan ini, edit title seperti `edit meeting malam ini ganti title ...` tidak lagi mengubah deadline menjadi `20.00` jika AI plan tidak secara eksplisit meminta update deadline.
4. [`findBestTaskMatch()`](proyek-perangkat-lunak/backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:440) diubah agar matching judul memprioritaskan [`targetText`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:376) dan hanya memakai [`dateHint`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:377) untuk filter tanggal. Ini mencegah clue seperti `nanti malam jam 7 bukan jam 8` merusak pencarian task bernama `meeting zoom pemrograman fullstack`.

## Verifikasi
- Build backend berhasil melalui `zsh -lc '... npm run build'`.
- Verifikasi logika parser dengan skenario reproduksi menunjukkan hasil berikut:
  - `meeting jam 7 nanti malam #kuliah` -> `2026-06-16T12:00:00.000Z` (`19.00 WIB`)
  - `meeting hari ini jam 7 malam` -> `2026-06-16T12:00:00.000Z` (`19.00 WIB`)
  - `meeting zoom pemrograman fullstack nanti malam jam 7 bukan jam 8` -> `2026-06-16T12:00:00.000Z` (`19.00 WIB`)
  - `meeting malam ini ganti title jadi meeting zoom pemrograman fullstack` tetap tidak menggeser deadline berbasis jam pada parser hint, dan pada flow update kini tidak lagi memicu fallback overwrite deadline.

## Kesimpulan Final
Masalah utama bukan pada database atau formatter timezone, melainkan pada kombinasi parser waktu lokal dan orchestration update WhatsApp. Deadline `07.00` pertama kali salah dihasilkan pada tahap parsing / normalisasi command, kemungkinan besar saat [`AiService.parseTaskCommand()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:218) dipadukan dengan [`applyIndonesianTimeHints()`](proyek-perangkat-lunak/backend/src/modules/ai/ai.service.ts:139). Setelah itu, flow edit task memperparah keadaan karena backend menganggap token waktu di command edit sebagai alasan untuk mem-parse ulang deadline, sehingga edit title dapat mengubah jam menjadi `20.00`. Perintah koreksi `jam 7 bukan jam 8` lalu gagal karena target matching dan instruksi perubahan deadline tidak dipisahkan, sementara parser juga tidak memahami negasi secara eksplisit.