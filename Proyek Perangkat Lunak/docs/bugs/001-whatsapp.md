# Bug 001 - Investigasi WhatsApp inbound salah identitas pengirim

## Ringkasan

Bug ini terjadi pada alur inbound WhatsApp internal di [`handleWhatsappInbound()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:459). Pesan user yang seharusnya diproses sebagai command task terdaftar justru dianggap berasal dari nomor yang belum terhubung.

Kasus nyata yang dianalisis:

- user mengirim pesan: `Task besok kuliah malam jam 9 malam`
- bot WhatsApp eksternal mengenali prefix `task`
- backend Smart Task Planner mengenali intent `CREATE_TASK`
- tetapi backend gagal memetakan pengirim ke user terdaftar karena nomor yang dipakai bukan nomor WhatsApp asli pengirim

Dampaknya, command task tidak pernah masuk ke flow create task. Sistem malah mengirim balasan bahwa nomor belum terhubung ke Task Planner.

## Aplikasi dan area terdampak

Dokumen arsitektur terkait:

- [`APP-express.md`](../APP-express.md)
- [`APP-nextjs.md`](../APP-nextjs.md)
- [`WHATSAPP_INBOUND.md`](../integrations/api-external/WHATSAPP_INBOUND.md)

Area implementasi utama:

- [`handleWhatsappInbound()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:459)
- [`extractWaNumber()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:14)
- [`normalizeSafeWhatsappNumber()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:20)

## Gejala produksi yang terlihat

Berdasarkan log bot dan backend:

1. user mengirim command task yang valid
2. provider bot berhasil mendeteksi bahwa pesan harus diteruskan ke endpoint internal
3. backend berhasil mendeteksi intent `CREATE_TASK`
4. backend memakai identitas `@lid` sebagai sumber nomor pengirim
5. hasil normalisasi menjadi nomor yang salah
6. lookup user berdasarkan `whatsappNumber` gagal
7. backend mengirim balasan fallback bahwa nomor belum terhubung

Jadi masalah utama bukan pada deteksi intent task. Masalah utama terjadi sebelum eksekusi task, yaitu saat backend menentukan identitas WhatsApp pengirim.

## Bukti log yang relevan

### 1. Log bot eksternal menunjukkan nomor pengirim asli tersedia

Dari log `be-wa-bot`, terlihat data penting berikut:

- `remoteJid: "51153194758269@lid"`
- `senderPn: "6282177177767@s.whatsapp.net"`
- `commandPrefixCandidate: "task"`
- `externalCommand: "besok kuliah malam jam 9 malam"`
- request diteruskan ke `https://api-taskplanner.dastrevas.com/internal/wa/inbound`

Maknanya:

- bot sebenarnya sudah mengetahui identitas pengirim yang lebih dekat ke nomor asli, yaitu `senderPn`
- tetapi payload yang dipakai backend tidak memastikan nilai ini masuk ke field yang dibaca oleh backend

### 2. Log backend menunjukkan nomor yang dipakai salah

Dari log `dt-task-be`, terlihat:

- `waNumber: '51153194758269'`
- `normalizedWaNumber: '6251153194758269'`
- `intent: 'CREATE_TASK'`
- `registrationCommand: false`
- backend menyimpulkan nomor tidak linked ke user

Maknanya:

- backend tidak gagal membaca command
- backend tidak gagal mendeteksi intent
- backend gagal pada tahap resolusi identitas WhatsApp user

## Analisis akar masalah

## 1. Backend terlalu percaya pada `chatId` atau `remoteJid`

Resolusi nomor saat ini di [`handleWhatsappInbound()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:459) mengikuti urutan field yang dijelaskan juga di [`WHATSAPP_INBOUND.md`](../integrations/api-external/WHATSAPP_INBOUND.md):

1. `user.waNumber`
2. `user.participant`
3. `user.chatId`
4. `context.remoteJid`

Masalahnya, pada kasus ini field awal kosong atau tidak berguna, lalu backend jatuh ke `user.chatId` atau `context.remoteJid` yang nilainya `51153194758269@lid`.

Untuk identitas `@lid`, nilai tersebut bukan nomor WhatsApp E.164 yang aman dipakai sebagai `whatsappNumber` user.

## 2. [`extractWaNumber()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:14) hanya mengekstrak bagian sebelum `@`

Fungsi ini akan mengubah:

- `51153194758269@lid` menjadi `51153194758269`
- `6282177177767@s.whatsapp.net` menjadi `6282177177767`

Secara sintaks, fungsi ini memang bekerja. Tetapi secara bisnis, hasil dari `@lid` tidak boleh diperlakukan sama dengan hasil dari `@s.whatsapp.net` atau nomor plain.

Artinya bug bukan sekadar parsing string, tetapi salah asumsi domain data.

## 3. [`normalizeSafeWhatsappNumber()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:20) memperparah salah identitas

Setelah `51153194758269` lolos dari ekstraksi, fungsi normalisasi mengubahnya menjadi `6251153194758269`.

Normalisasi ini konsisten dengan rule internal nomor Indonesia, tetapi input dasarnya memang bukan nomor telepon yang valid untuk user. Akibatnya backend menghasilkan nomor yang tampak valid secara format, padahal identitas aslinya salah.

Ini membuat bug menjadi lebih berbahaya karena:

- lookup user gagal ke nomor yang salah
- outbound balasan juga berisiko dikirim ke nomor yang salah atau nomor invalid
- log backend terlihat seolah hanya masalah user belum registrasi, padahal akar masalahnya salah identitas

## 4. Kontrak payload antara bot dan backend tidak cukup aman

Bot eksternal memiliki `senderPn`, tetapi backend saat ini tidak membacanya karena field itu tidak menjadi bagian kontrak inbound yang aktif.

Dokumentasi di [`WHATSAPP_INBOUND.md`](../integrations/api-external/WHATSAPP_INBOUND.md) juga masih mengasumsikan bahwa `chatId` atau `remoteJid` aman dijadikan fallback nomor WhatsApp. Untuk kasus `@lid`, asumsi itu tidak benar.

Jadi secara praktis ada dua lapis masalah:

- bot tidak menjamin nomor pengirim asli dipetakan ke `user.waNumber`
- backend tidak memiliki guard untuk menolak identitas `@lid` sebagai nomor user

## Kenapa ini tetap masalah di sisi app ini

Walaupun bot eksternal ikut berperan, bug tetap sah dikategorikan masalah pada app ini karena backend di [`handleWhatsappInbound()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:459) saat ini:

- menerima fallback `chatId` atau `remoteJid` tanpa validasi tipe identitas
- tidak membedakan `@lid` dari `@s.whatsapp.net` atau format nomor biasa
- langsung menormalkan hasil ekstraksi
- langsung memakai hasil itu untuk lookup user dan outbound message

Dengan kata lain, backend tidak fail-safe. Saat input identitas ambigu, backend tidak berhenti dengan error yang jelas, tetapi tetap melanjutkan flow dengan identitas yang salah.

## Dampak ke fitur

Fitur yang terdampak langsung:

- create task via WhatsApp
- edit task via WhatsApp
- complete task via WhatsApp
- list task via WhatsApp
- overview task via WhatsApp
- semua flow non-registrasi yang membutuhkan pemetaan `whatsappNumber` ke user

Risiko tambahan:

- balasan outbound bisa diarahkan ke nomor hasil normalisasi yang salah
- investigasi operasional menjadi menyesatkan karena log akhir terlihat seperti masalah registrasi user
- user terdaftar akan mengalami false negative seolah-olah belum link WhatsApp

## Kesimpulan investigasi

Akar masalah utama adalah backend WhatsApp inbound memakai identitas `@lid` sebagai nomor WhatsApp user, lalu menormalkannya seolah-olah itu nomor telepon valid. Ini menyebabkan lookup user gagal walaupun intent task sebenarnya sudah terdeteksi dengan benar.

Dalam kasus log ini:

- nomor yang seharusnya lebih layak dipakai adalah identitas pengirim asli seperti `senderPn` dari bot
- backend justru memakai `chatId` atau `remoteJid` bernilai `51153194758269@lid`
- hasil akhirnya menjadi `6251153194758269`, yang kemudian tidak cocok dengan `user.whatsappNumber` manapun

Jadi bug inti bukan AI parsing, bukan intent detection, dan bukan frontend. Bug inti ada pada resolusi identitas WhatsApp di backend internal app ini.

## Rekomendasi perbaikan

### Prioritas 1 - perbaiki kontrak payload inbound

Bot wajib mengirim nomor pengirim asli ke field yang memang dibaca backend, idealnya `user.waNumber`.

Contoh arah aman:

- `user.waNumber = 6282177177767`
- `user.chatId` boleh tetap disimpan untuk konteks chat
- `context.remoteJid` hanya untuk metadata, bukan sumber utama nomor user

## Prioritas 2 - tambahkan guard di backend untuk identitas `@lid`

Di [`extractWaNumber()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:14) atau langsung di [`handleWhatsappInbound()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:459), backend perlu menolak sumber identitas yang berakhiran `@lid` bila tidak ada nomor pengirim asli lain.

Perilaku yang lebih aman:

- jangan ubah `@lid` menjadi nomor user
- jika semua source nomor hanya mengarah ke `@lid`, kembalikan error resolusi nomor atau log internal yang eksplisit
- jangan kirim outbound ke nomor hasil normalisasi dari `@lid`

## Prioritas 3 - perbarui dokumentasi integrasi

Dokumen [`WHATSAPP_INBOUND.md`](../integrations/api-external/WHATSAPP_INBOUND.md) perlu diperjelas bahwa:

- tidak semua `jid` aman dijadikan nomor user
- `@lid` bukan fallback yang valid untuk linking `whatsappNumber`
- integrator harus mengirim nomor pengirim asli secara eksplisit

## Prioritas 4 - tambahkan test kasus regresi

Minimal perlu test untuk payload berikut:

1. `user.waNumber` berisi nomor valid -> harus berhasil lookup user
2. `user.waNumber` kosong, `chatId` = `628xxx@s.whatsapp.net` -> masih boleh fallback
3. `user.waNumber` kosong, `chatId` = `511xxx@lid` -> harus ditolak, bukan dinormalisasi
4. `remoteJid` `@lid` tetapi ada `senderPn` valid -> backend harus memakai nomor pengirim valid

## Status

- status bug: terkonfirmasi dari log produksi
- root cause: teridentifikasi
- fix code: sudah diterapkan sebagian pada backend inbound WhatsApp
- validasi build/runtime setelah fix: belum sepenuhnya selesai di production payload nyata

## Update implementasi

Perbaikan yang sudah diterapkan di [`handleWhatsappInbound()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:538) dan helper terkait:

- backend sekarang membangun daftar kandidat identitas nomor dari beberapa field, termasuk `user.waNumber`, `user.senderPn`, `context.senderPn`, `message.senderPn`, `user.participant`, `user.chatId`, dan `context.remoteJid`
- backend sekarang memprioritaskan kandidat non-`@lid` yang bisa dinormalisasi dengan aman
- identitas `@lid` tidak lagi otomatis dipakai sebagai nomor user jika tidak ada nomor pengirim valid lain
- jika payload hanya membawa identitas `@lid`, backend sekarang gagal lebih aman dengan `400 VALIDATION_ERROR` daripada salah menormalkan nomor lalu mengirim balasan ke target yang salah
- payload normalized response sekarang menyertakan metadata `numberResolution` agar investigasi operasional lebih mudah
- payload normalized response juga menyimpan `senderPn` jika tersedia untuk membantu tracing integrasi bot

Implementasi helper baru ada di:

- [`classifyWhatsappIdentity()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:28)
- [`buildWhatsappNumberCandidates()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:59)
- [`resolveWhatsappNumber()`](../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:105)

## Dampak setelah implementasi

Perilaku baru yang diharapkan:

1. jika bot mengirim `senderPn` valid, backend akan memilih sumber itu dibanding `chatId` atau `remoteJid` yang berupa `@lid`
2. jika `user.waNumber` valid, flow tetap berjalan seperti sebelumnya
3. jika hanya tersedia `@lid`, backend akan menolak request sebagai payload tidak cukup aman
4. outbound reply tidak lagi memakai nomor hasil normalisasi dari `@lid` saja

Dengan perubahan ini, false negative "nomor belum terhubung" akibat salah resolusi identitas bisa dicegah pada kasus yang sebelumnya terdokumentasi.

## Yang sudah selesai

- [x] identifikasi akar masalah berdasarkan log produksi
- [x] hardening resolusi nomor WhatsApp di backend inbound
- [x] penolakan eksplisit untuk payload yang hanya membawa identitas `@lid`
- [x] penambahan metadata resolusi nomor pada normalized response
- [x] pembaruan dokumen investigasi dengan status implementasi

## Yang belum selesai

- [ ] verifikasi end-to-end dengan payload nyata dari bot production yang sudah mengirim `senderPn`
- [ ] update kontrak resmi integrasi pada [`WHATSAPP_INBOUND.md`](../integrations/api-external/WHATSAPP_INBOUND.md) agar `senderPn` atau `user.waNumber` menjadi requirement eksplisit
- [ ] tambahkan automated test regresi khusus untuk kombinasi `senderPn`, `@s.whatsapp.net`, dan `@lid`
- [ ] validasi apakah service bot eksternal sudah mengirim field `senderPn` ke body request inbound

## Checklist tindak lanjut

- [ ] pastikan bot eksternal mengirim `senderPn` atau langsung mengisi `user.waNumber`
- [ ] uji payload dengan `remoteJid=@lid` + `senderPn=628...@s.whatsapp.net`
- [ ] uji payload dengan hanya `remoteJid=@lid` untuk memastikan backend mengembalikan `400`
- [ ] uji registrasi `user_id daftar` agar tetap kompatibel setelah perubahan resolusi nomor
- [ ] update dokumentasi integrasi dan contoh payload final setelah kontrak bot dikonfirmasi
