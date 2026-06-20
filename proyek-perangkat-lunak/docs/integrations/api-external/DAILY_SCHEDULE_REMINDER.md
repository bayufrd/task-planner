# Daily Schedule Reminder

## Tujuan

Fitur **Daily Schedule Reminder** mengirim ringkasan jadwal harian ke WhatsApp personal user setiap hari secara terjadwal.

Fitur ini **berbeda** dari reminder deadline per-task yang sudah ada:

- reminder per-task aktif di scheduler [`TaskAutoSkipScheduler.run()`](../../../backend/src/modules/tasks/task.auto-skip.scheduler.ts:46) dan fokus pada trigger `24 jam`, `1 jam`, serta `tepat deadline`,
- Daily Schedule Reminder fokus pada **agenda harian user** dan dikirim **sekali per hari** pada pagi hari,
- Daily Schedule Reminder tidak memakai flag `reminder24hSent`, `reminder1hSent`, atau `reminderDeadlineSent` di [`TaskService.markWhatsappReminderSent()`](../../../backend/src/modules/tasks/task.service.ts:521), sehingga tidak bercampur dengan logika reminder deadline.

Dengan pemisahan ini, ringkasan harian tidak menambah duplikasi pada flow reminder deadline yang sudah ada.

## Waktu eksekusi

- cron job berjalan setiap hari pukul **06:00 WIB**,
- timezone yang dipakai harus **Asia/Jakarta**,
- scheduler mengambil semua user yang memiliki `whatsappNumber`,
- untuk tiap user, sistem mengumpulkan task dengan deadline **hari ini**.

Contoh ekspresi cron:

```text
0 6 * * *
```

Jika server berada di timezone lain, eksekusi tetap harus dihitung terhadap `Asia/Jakarta`, bukan timezone OS server.

## Cakupan data

Untuk setiap user yang memiliki nomor WhatsApp:

1. cari user dengan `whatsappNumber` terisi,
2. hitung boundary awal dan akhir hari dalam timezone `Asia/Jakarta`,
3. ambil task user yang deadline-nya berada di rentang hari ini,
4. susun caption berdasarkan ada atau tidak adanya jadwal,
5. kirim **pesan bergambar** ke endpoint WhatsApp personal.

Saran filter task:

- hanya task dengan `deletedAt: null`,
- status bisa ditampilkan apa adanya (`PENDING`, `DONE`, `SKIPPED`) agar ringkasan harian informatif,
- urutkan berdasarkan `deadline ASC` agar agenda terbaca kronologis.

## Arsitektur integrasi

Daily Schedule Reminder sebaiknya dibuat sebagai scheduler terpisah dari reminder deadline yang sekarang aktif di [`task.auto-skip.scheduler.ts`](../../../backend/src/modules/tasks/task.auto-skip.scheduler.ts:1).

Pemisahan yang disarankan:

- scheduler deadline tetap menangani reminder `24h`, `1h`, `deadline`, dan auto-skip,
- scheduler harian baru hanya menangani ringkasan agenda pukul 06:00 WIB,
- service query harian dipisahkan dari [`TaskService.processWhatsappDeadlineReminders()`](../../../backend/src/modules/tasks/task.service.ts:402) agar concern tidak bercampur,
- pengiriman outbound tetap memakai endpoint personal WhatsApp yang sama, tetapi payload-nya `lampiran` base64.

Struktur implementasi yang selaras dengan proyek:

- scheduler baru di folder [`backend/src/modules/tasks/`](../../../backend/src/modules/tasks/task.auto-skip.scheduler.ts:1), misalnya file `task.daily-schedule.scheduler.ts`,
- helper query harian dapat ditempatkan di [`TaskService`](../../../backend/src/modules/tasks/task.service.ts:9),
- konfigurasi env mengikuti pola [`env`](../../../backend/src/config/env.ts:6).

## Gambar harian

Pesan **selalu** dikirim sebagai pesan bergambar menggunakan file lokal yang kemudian diubah ke base64 sebelum request outbound:

- asset awal: `proyek-perangkat-lunak/public/harian.webp`
- asset aktif yang lolos test gateway: `proyek-perangkat-lunak/public/harian-candidate-600.jpg`
- path aktif di backend: `public/harian-candidate-600.jpg`

Alasan memakai asset kompresi:

- file awal `harian.webp` berukuran terlalu besar saat diubah ke base64,
- gateway menolak request dengan respons `413 Payload Too Large`,
- asset `harian-candidate-600.jpg` sudah diuji dan berhasil terkirim.

Ukuran hasil uji:

- `harian.webp`: `92626` byte, base64 `123504` karakter,
- `harian-candidate-600.jpg`: `44800` byte, base64 `59736` karakter.

### Strategi pengiriman gambar yang dipakai

1. backend membaca file lokal reminder harian,
2. file diubah menjadi string base64,
3. base64 dikirim ke gateway pada field `lampiran`.

Contoh logika implementasi aktif:

```ts
const dailyImagePath = 'public/harian-candidate-600.jpg';
const lampiran = await buildBase64Attachment(dailyImagePath);
```

### Catatan deploy

Pada environment production, pastikan asset kompresi yang dipakai backend memang tersedia di server file system pada path yang sama atau sesuaikan path lokalnya di implementasi.

## Endpoint WhatsApp personal

Endpoint outbound:

```text
POST /api/whatsapp/send-personal
```

Header auth:

```text
Authorization: Bearer <WHATSAPP_API_TOKEN>
```

Fallback token:

- gunakan `WHATSAPP_API_TOKEN` jika tersedia,
- fallback ke `ADMIN_TOKEN` bila token WhatsApp khusus belum di-set.

### Body JSON kirim gambar

```json
{
  "nomor": "6281234567890",
  "pesan": "<konten jadwal harian atau ajakan + panduan + quote>",
  "lampiran": "<base64-image>"
}
```

### Body JSON kirim text-only

```json
{
  "nomor": "6281234567890",
  "pesan": "Halo, ini pesan dari backend gateway"
}
```

### Arti field payload

- `nomor`: nomor tujuan dalam format internasional tanpa simbol tambahan,
- `pesan`: isi pesan utama atau caption,
- `lampiran`: file gambar dalam format base64; field ini opsional untuk text-only.

Untuk fitur ini, nilai yang dipakai adalah:

- `nomor = whatsappNumber user`,
- `pesan = caption ringkasan harian`,
- `lampiran = base64 dari file gambar reminder harian`.

## Contoh curl lengkap

```bash
curl -X POST "https://api-whatsapp-bot.dastrevas.com/api/whatsapp/send-personal" \
  -H "Authorization: Bearer ${WHATSAPP_API_TOKEN:-$ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nomor": "6281234567890",
    "pesan": "Selamat pagi! Berikut jadwal Anda hari ini.",
    "lampiran": "<base64-image>"
  }'
```

## Format caption

Semua caption ditutup dengan **quote hardcode tentang disiplin waktu**.

### Skenario 1 - Ada jadwal hari ini

Struktur yang disarankan:

1. salam singkat,
2. judul agenda hari ini,
3. daftar task berurutan,
4. penutup singkat,
5. quote disiplin waktu.

Format isi daftar:

- judul task,
- jam/deadline dalam WIB,
- status task.

Contoh caption:

```text
Selamat pagi! Ini jadwal Anda untuk hari ini, Senin, 15 Juni 2026.

Jadwal hari ini:
1. Meeting client
   - Jam: 09.00 WIB
   - Status: PENDING
2. Review laporan sprint
   - Jam: 13.30 WIB
   - Status: DONE
3. Presentasi mingguan
   - Jam: 16.00 WIB
   - Status: PENDING

Tetap fokus dan kerjakan sesuai urutan prioritas.

"Disiplin waktu adalah bentuk sederhana dari menghargai masa depan sendiri."
```

### Skenario 2 - Tidak ada jadwal hari ini

Jika user tidak memiliki task untuk hari ini, caption harus tetap bernilai dan mendorong engagement.

Isi yang disarankan:

1. salam singkat,
2. informasi bahwa belum ada jadwal hari ini,
3. ajakan membuat task,
4. panduan singkat command WhatsApp yang mirror dengan bantuan saat ini di [`buildWhatsappHelpMessage()`](../../../backend/src/modules/whatsappInbound/whatsapp-inbound.routes.ts:117),
5. quote disiplin waktu.

Contoh caption:

```text
Selamat pagi! Hari ini belum ada jadwal yang tercatat.

Yuk buat task baru agar hari Anda tetap terarah.

Panduan singkat:
- daftar akun WA: user_id daftar
- lihat bantuan: task bantuan
- contoh tambah task: task tambah meeting besok jam 10 malam #urgent
- lihat task aktif: task lihat jadwal
- lihat task besok: task lihat jadwal besok
- overview: task overview

"Waktu yang diatur dengan disiplin akan berubah menjadi hasil yang konsisten."
```

## Quote disiplin waktu

Quote disimpan secara hardcode di backend, misalnya dalam array konstan.

Contoh daftar quote:

```ts
const DAILY_DISCIPLINE_QUOTES = [
  'Disiplin waktu adalah bentuk sederhana dari menghargai masa depan sendiri.',
  'Waktu yang diatur dengan disiplin akan berubah menjadi hasil yang konsisten.',
  'Jadwal yang dijaga hari ini akan membentuk pencapaian esok hari.',
  'Konsistensi kecil setiap hari lebih kuat daripada niat besar yang tertunda.'
];
```

### Strategi pemilihan quote

Ada tiga opsi umum:

- **tetap**: satu quote yang sama setiap hari; paling sederhana tetapi cepat terasa repetitif,
- **random**: pilih acak setiap eksekusi; variatif tetapi hasil tidak deterministik,
- **rotasi**: pilih berdasarkan indeks hari atau tanggal; variatif dan tetap deterministik.

Rekomendasi untuk proyek ini: **rotasi deterministik**.

Alasan:

- mudah dilacak di log,
- konsisten untuk seluruh user pada hari yang sama,
- tidak terasa monoton seperti quote tetap,
- tidak menimbulkan perilaku acak yang sulit direproduksi saat debugging.

Contoh strategi rotasi:

```ts
const quoteIndex = dayOfMonth % DAILY_DISCIPLINE_QUOTES.length;
const quote = DAILY_DISCIPLINE_QUOTES[quoteIndex];
```

## Environment variable yang dibutuhkan

Ikuti pola konfigurasi di [`backend/src/config/env.ts`](../../../backend/src/config/env.ts:6).

### Wajib

```env
WHATSAPP_BOT_URL=https://api-whatsapp-bot.dastrevas.com
FRONTEND_PUBLIC_URL=https://taskplanner.dastrevas.com
SCHEDULER_TIMEZONE=Asia/Jakarta
DAILY_SCHEDULE_SEND_HOUR=6
```

### Token auth outbound

```env
WHATSAPP_API_TOKEN=your_whatsapp_token_here
ADMIN_TOKEN=your_admin_token_here
```

### Fallback kompatibilitas

Karena saat ini backend sudah memiliki [`TOKEN_WHATSAPP`](../../../backend/src/config/env.ts:13) dan [`FRONTEND_URL`](../../../backend/src/config/env.ts:12), implementasi dapat memakai fallback berikut:

- token: `WHATSAPP_API_TOKEN || TOKEN_WHATSAPP || ADMIN_TOKEN`,
- asset gambar aktif: `public/harian-candidate-600.jpg`.

### Rekomendasi penamaan final

Agar jelas dan eksplisit, environment yang disarankan untuk fitur ini:

```env
WHATSAPP_API_TOKEN=
ADMIN_TOKEN=
FRONTEND_PUBLIC_URL=
SCHEDULER_TIMEZONE=Asia/Jakarta
DAILY_SCHEDULE_SEND_HOUR=6
```

Jika ingin fleksibel sampai level menit, bisa ditambah:

```env
DAILY_SCHEDULE_SEND_MINUTE=0
```

## Query task harian

Gunakan boundary hari lokal `Asia/Jakarta`, bukan UTC mentah. Ini penting agar task sekitar tengah malam tidak salah masuk hari sebelumnya/berikutnya.

Pendekatan yang disarankan:

- hitung `startOfDayJakarta`,
- hitung `endOfDayJakarta`,
- query task `deadline >= startOfDayJakarta` dan `deadline <= endOfDayJakarta`.

Prinsip ini konsisten dengan perhatian proyek saat ini terhadap boundary waktu lokal, misalnya pada [`getDailyTaskStats()`](../../../backend/src/modules/tasks/task.service.ts:188) yang sudah menghindari pergeseran hari akibat UTC.

## Perbedaan dengan reminder per-task agar tidak duplikat

Daily Schedule Reminder harus dianggap sebagai **channel notifikasi yang berbeda** dari reminder deadline.

Pemisahan yang wajib dijaga:

- Daily Schedule Reminder dikirim **sekali per hari** pada 06:00 WIB,
- reminder deadline tetap dikirim berdasarkan kedekatan deadline oleh [`TaskAutoSkipScheduler.run()`](../../../backend/src/modules/tasks/task.auto-skip.scheduler.ts:46),
- Daily Schedule Reminder tidak mengubah field dedup reminder deadline seperti `reminder24hSent`, `reminder1hSent`, atau `reminderDeadlineSent`,
- bila nanti dibutuhkan dedup khusus harian, gunakan field/log terpisah seperti `dailyScheduleSentAt`, bukan memakai flag reminder deadline.

Dengan demikian:

- user bisa menerima ringkasan agenda pagi,
- user tetap bisa menerima reminder deadline penting di waktu yang relevan,
- kedua fitur tidak saling menandai state satu sama lain.

## Contoh alur eksekusi

1. scheduler harian bangun pada 06:00 WIB,
2. ambil seluruh user dengan `whatsappNumber`,
3. untuk setiap user, query task hari ini,
4. pilih quote harian,
5. bangun caption sesuai skenario,
6. ubah gambar reminder menjadi base64 lalu kirim `lampiran` ke endpoint personal,
7. tulis log sukses/gagal per user.

Contoh log yang disarankan:

```text
[Daily Schedule Reminder] sent { userId, nomor, hasLampiran }
[Daily Schedule Reminder] failed { userId, nomor, hasLampiran, error }
```

## Catatan keamanan

- simpan `WHATSAPP_API_TOKEN` dan `ADMIN_TOKEN` hanya di environment variable, jangan hardcode di source code,
- jangan commit file `.env` ke repository,
- batasi akses ke endpoint gateway WhatsApp hanya melalui token bearer yang valid,
- hindari menulis token ke log,
- pastikan URL gambar publik hanya mengarah ke asset statis yang aman seperti `/harian.webp`,
- jika endpoint gateway dapat diakses publik, pertimbangkan IP allowlist atau reverse proxy restriction di sisi infrastruktur,
- jika memakai fallback `ADMIN_TOKEN`, dokumentasikan bahwa token tersebut memiliki scope lebih luas sehingga penggunaannya harus sementara dan diawasi.

## Rekomendasi implementasi ringkas

Agar selaras dengan struktur proyek saat ini, implementasi backend disarankan dibagi menjadi tiga bagian:

1. **scheduler harian baru**
   - trigger cron 06:00 WIB,
   - loop per user WhatsApp.
2. **service query + formatter**
   - ambil task hari ini,
   - bangun caption,
   - pilih quote.
3. **sender outbound media**
   - kirim payload `nomor` + `pesan` + `lampiran` ke endpoint `/api/whatsapp/send-personal`,
   - pakai token dengan fallback yang terdokumentasi.

Dengan struktur ini, fitur Daily Schedule Reminder tetap rapi, terpisah dari flow inbound command WhatsApp, dan tidak mengganggu reminder deadline yang sudah berjalan.

## Manual trigger untuk testing/debugging

Script manual trigger tersedia di [`docs/tools/manual-trigger-daily-schedule-reminder.js`](../../tools/manual-trigger-daily-schedule-reminder.js).

Karakteristik:

- default **dry-run**,
- membaca environment otomatis dari [`proyek-perangkat-lunak/.env`](../../../.env.example), [`proyek-perangkat-lunak/.env.local`](../../../.env.example), lalu [`proyek-perangkat-lunak/backend/.env`](../../../backend/.env.example),
- memakai query boundary hari `Asia/Jakarta` yang sama,
- memakai dedup key `daily-schedule:YYYY-MM-DD:userId`,
- bisa kirim sungguhan dengan flag `--send`,
- bisa menulis log sent ke tabel `Reminder` dengan flag `--mark-sent`.

Contoh pakai:

```bash
node docs/tools/manual-trigger-daily-schedule-reminder.js
node docs/tools/manual-trigger-daily-schedule-reminder.js --date=2026-06-21 --limit=3
node docs/tools/manual-trigger-daily-schedule-reminder.js --user-id=<userId>
node docs/tools/manual-trigger-daily-schedule-reminder.js --number=6281234567890
node docs/tools/manual-trigger-daily-schedule-reminder.js --send --mark-sent --date=2026-06-21
```

Opsi utama:

- `--send` → kirim ke gateway WhatsApp,
- `--mark-sent` → upsert log sent ke tabel `Reminder`,
- `--allow-sent` → abaikan dedup sent,
- `--no-image` → kirim text-only,
- `--image=public/harian-candidate-600.jpg` → override asset,
- `--date=YYYY-MM-DD` → pakai tanggal Jakarta tertentu,
- `--user-id=<id>` / `--number=<nomor>` → batasi target.