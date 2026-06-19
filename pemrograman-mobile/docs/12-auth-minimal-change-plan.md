# Rencana Implementasi Auth Minim Perubahan

## 1. Tujuan Modifikasi Jangka Pendek yang Paling Aman

Target jangka pendek yang paling aman adalah menambah kemampuan backend agar client mobile atau client lain bisa login tanpa memaksa perubahan besar pada aplikasi web Next.js yang sudah berjalan.

Keputusan utamanya:

- jangan ubah flow login web yang sekarang sudah dipakai di [`src/app/auth/signin/page.tsx`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx),
- jangan ubah mekanisme sync NextAuth di [`src/lib/auth/sync.ts`](../proyek-perangkat-lunak/src/lib/auth/sync.ts),
- jangan ubah asumsi middleware web yang masih membaca token backend cookie dan session NextAuth di [`src/middleware.ts`](../proyek-perangkat-lunak/src/middleware.ts),
- tambahkan endpoint dan compatibility layer di backend Express terlebih dahulu,
- buat aturan baru bersifat opt-in untuk client non-web.

Tujuan praktisnya bukan merapikan seluruh arsitektur auth sekarang, tetapi membuka jalur integrasi baru secepat mungkin dengan risiko regresi paling kecil pada web.

## 2. Kenapa Pendekatan “Tambahkan Endpoint Dulu, Refactor Nanti” Masuk Akal

Pendekatan ini masuk akal karena kondisi proyek saat ini memang hybrid:

- login web credentials langsung ke backend lewat [`auth.controller.ts`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts),
- login Google web melewati NextAuth lalu sinkron ke backend lewat [`syncNextAuth()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:144),
- Next.js masih mengandalkan kontrak respons login yang sederhana: `token` + `user`,
- validasi login/register di backend masih ketat karena `captchaToken` wajib di [`loginSchema`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.validation.ts:10) dan [`registerSchema`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.validation.ts:3).

Kalau langsung refactor besar:

- ada risiko memutus form login web,
- ada risiko memutus flow Google sync web,
- ada risiko menambah coupling baru antara Next.js dan backend,
- waktu habis untuk merapikan desain, bukan membuka jalur integrasi baru.

Sebaliknya, jika backend ditambah endpoint baru yang kompatibel dengan kontrak lama:

- Next.js tetap jalan seperti sekarang,
- mobile bisa mulai integrasi tanpa ikut aturan web yang terlalu browser-centric,
- refactor bisa dilakukan nanti setelah jalur baru stabil.

Jadi untuk kasus ini, strategi paling aman memang: tambah endpoint baru, pertahankan flow lama, ubah validasi lama seminimal mungkin.

## 3. Prinsip Keputusan yang Disarankan

Keputusan yang disarankan:

- flow web lama tetap dianggap baseline kompatibilitas,
- semua perilaku baru untuk mobile dibuat eksplisit, bukan mengubah default web,
- `clientType` bersifat opsional pada tahap awal,
- CAPTCHA web tetap dipertahankan,
- skip CAPTCHA untuk mobile tidak dilakukan otomatis hanya dari klaim client,
- endpoint baru diprioritaskan untuk membuka integrasi, bukan untuk menyelesaikan seluruh desain auth final.

## 4. Endpoint yang Sebaiknya Ditambahkan Lebih Dulu

Prioritas endpoint yang paling masuk akal:

### 4.1 Prioritas 1 — [`POST /api/auth/login-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts)

Tujuan:

- endpoint login credentials baru untuk mobile/client non-web,
- tidak menyentuh kontrak [`POST /api/auth/login`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:12) yang dipakai Next.js.

Kenapa ini paling prioritas:

- aman untuk Next.js karena endpoint lama tidak berubah,
- mobile tidak perlu ikut schema web yang mewajibkan CAPTCHA,
- backend bisa mulai membedakan kebijakan berdasarkan jenis client.

Request yang disarankan:

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "clientType": "mobile",
  "deviceId": "optional-device-id",
  "appVersion": "optional-app-version",
  "platform": "android"
}
```

Response yang disarankan:

```json
{
  "success": true,
  "data": {
    "token": "jwt-access-token",
    "user": {
      "id": "user-id",
      "name": "User",
      "email": "user@example.com"
    },
    "authContext": {
      "clientType": "mobile",
      "captchaRequired": false
    }
  }
}
```

Catatan penting:

- format `success/data/token/user` harus tetap mirip dengan endpoint login lama,
- tambahan metadata boleh ada, tetapi jangan mengubah struktur lama.

### 4.2 Prioritas 2 — [`POST /api/auth/register-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts)

Tujuan:

- membuka registrasi client mobile/non-web tanpa memaksa pola CAPTCHA web,
- menghindari perubahan pada [`POST /api/auth/register`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:11).

Request yang disarankan:

```json
{
  "name": "User Baru",
  "email": "baru@example.com",
  "password": "secret123",
  "clientType": "mobile",
  "deviceId": "optional-device-id"
}
```

Response yang disarankan tetap mengikuti kontrak lama register:

```json
{
  "success": true,
  "data": {
    "token": "jwt-access-token",
    "user": {
      "id": "user-id",
      "name": "User Baru",
      "email": "baru@example.com"
    }
  }
}
```

### 4.3 Prioritas 3 — [`POST /api/auth/google/mobile`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts)

Tujuan:

- memberi jalur Google login untuk mobile tanpa menyentuh flow web NextAuth,
- menjaga [`POST /api/auth/sync`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:19) tetap khusus web sync.

Request minimum yang disarankan:

```json
{
  "idToken": "google-id-token",
  "clientType": "mobile",
  "deviceId": "optional-device-id",
  "platform": "ios"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "jwt-access-token",
    "user": {
      "id": "user-id",
      "name": "User",
      "email": "user@example.com"
    },
    "provider": "google"
  }
}
```

Kenapa bukan memakai endpoint [`/api/auth/sync`](../proyek-perangkat-lunak/src/lib/auth/sync.ts:36):

- endpoint sync sekarang didesain untuk session web NextAuth,
- mobile tidak punya konteks session NextAuth,
- mencampur keduanya akan memperbesar risiko bug kompatibilitas.

### 4.4 Prioritas 4 — [`POST /api/auth/refresh`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts)

Endpoint ini sekarang sudah ditambahkan sebagai bagian dari rollout minimal-change, tetapi tetap diposisikan sebagai kontrak mobile terpisah agar tidak mengubah flow login web lama.

Status implementasi saat ini:

- mobile auth backend sudah dapat menerbitkan pasangan `token` + `refreshToken`,
- endpoint [`POST /api/auth/refresh`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:34) sudah tersedia untuk rotasi refresh token,
- penyimpanan refresh minimal sementara memakai model `Session` yang sudah ada di backend,
- konsumsi refresh flow di client mobile masih bertahap dan belum menjadi auto-refresh penuh.

Artinya, fase stabilisasi berikutnya lebih berfokus pada konsumsi client, storage aman, dan lifecycle device session; bukan lagi pada ketersediaan route backend dasarnya.

## 5. Endpoint yang Tidak Perlu Diubah Sekarang

Endpoint berikut sebaiknya dibiarkan apa adanya pada tahap pertama:

- [`POST /api/auth/login`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:12),
- [`POST /api/auth/register`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:11),
- [`GET /api/auth/me`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:13),
- [`POST /api/auth/logout`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:14),
- [`POST /api/auth/sync`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:19),
- flow Google web di [`GoogleOAuthService`](../proyek-perangkat-lunak/backend/src/modules/auth/google-oauth.service.ts).

Alasannya sederhana: semua ini sudah terhubung ke Next.js yang berjalan sekarang.

## 6. Rekomendasi Desain Request/Response yang Kompatibel

Prinsip paling aman:

- endpoint baru boleh menerima field tambahan,
- endpoint lama jangan dipaksa menerima perilaku baru yang mengubah logika default,
- struktur response baru harus tetap kompatibel dengan bentuk respons lama.

Format response yang direkomendasikan untuk semua endpoint auth baru:

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "name": "User",
      "email": "user@example.com"
    }
  }
}
```

Field tambahan boleh ditaruh di samping `token` dan `user`, misalnya:

- `refreshToken`,
- `tokenType`,
- `expiresIn`,
- `provider`,
- `authContext`,
- `sessionId`.

Tetapi `token` dan `user` harus tetap ada dan tidak berganti nama agar mudah dipakai client baru tanpa memecah kontrak mental sistem yang sudah ada.

## 7. Apakah `clientType` Sebaiknya Wajib atau Opsional

Keputusan yang disarankan: `clientType` opsional pada tahap awal, tetapi sangat dianjurkan untuk endpoint baru.

### 7.1 Kenapa jangan wajib global sekarang

Kalau `clientType` langsung diwajibkan di semua endpoint lama:

- Next.js sign-in di [`page.tsx`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx:123) harus diubah,
- sign-up web juga harus diubah,
- testing lama, Postman lama, dan integrasi lain bisa rusak,
- risiko regresi lebih besar daripada manfaatnya.

### 7.2 Kenapa tetap perlu ada

`clientType` tetap berguna untuk:

- logging,
- telemetry,
- kebijakan CAPTCHA,
- rule keamanan yang berbeda,
- transisi ke multi-client auth.

### 7.3 Rekomendasi implementatif

- pada endpoint lama: `clientType` opsional, default diasumsikan `web`,
- pada endpoint baru: `clientType` boleh dibuat default `mobile` atau tetap divalidasi opsional dengan fallback internal,
- di service/backend internal: selalu normalisasi `clientType` ke `web`, `mobile`, atau `unknown`.

Rekomendasi final: jangan paksa `clientType` sebagai required field global sekarang.

## 8. Apakah Skip CAPTCHA untuk Mobile Masuk Akal

Keputusan yang disarankan: jangan skip CAPTCHA otomatis hanya karena request mengaku `clientType=mobile`.

Itu terlalu mudah disalahgunakan.

### 8.1 Risiko jika skip otomatis berdasarkan `clientType`

Abuse vector yang langsung muncul:

- bot cukup mengirim `clientType=mobile`,
- credential stuffing lewat endpoint mobile menjadi lebih murah,
- register spam bisa pindah ke endpoint mobile,
- backend kehilangan satu lapis friction tanpa pengganti.

Karena `clientType` dari request body/header adalah klaim client, itu bukan bukti kuat.

### 8.2 Kapan skip bisa diterima

Skip CAPTCHA bisa diterima hanya jika ada pembatas tambahan, misalnya:

- endpoint baru khusus mobile bukan endpoint lama,
- ada rate limit ketat per IP dan per email,
- ada lockout/cooldown untuk percobaan gagal,
- ada observability/logging yang jelas,
- endpoint dipakai hanya untuk login, bukan register publik masif,
- ada fallback error seperti `CAPTCHA_REQUIRED` bila pola abuse terdeteksi.

### 8.3 Rekomendasi yang lebih aman

Daripada skip otomatis, lebih aman pakai kebijakan ini:

- web lama: tetap wajib CAPTCHA,
- endpoint mobile baru: CAPTCHA tidak wajib secara default,
- tetapi backend memasang rate limiting dan bisa mengembalikan `CAPTCHA_REQUIRED` atau `RISK_CHALLENGE_REQUIRED` saat pola abuse naik.

Ini tetap “lebih longgar” untuk mobile, tetapi tidak membuka bypass total pada seluruh auth surface.

### 8.4 Keputusan final soal CAPTCHA

Rekomendasi terbaik:

- jangan ubah endpoint web lama,
- jangan hapus kewajiban CAPTCHA dari [`loginSchema`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.validation.ts:10) dan [`registerSchema`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.validation.ts:3) untuk flow web lama,
- buat schema baru untuk endpoint client/mobile,
- pada schema baru, CAPTCHA opsional atau tidak dipakai dulu,
- kompensasi dengan rate limiting dan logging.

## 9. Fallback Compatibility Layer yang Disarankan

Untuk menjaga web lama tetap jalan sambil endpoint baru ditambahkan, gunakan compatibility layer sederhana di backend:

### 9.1 Pertahankan flow lama apa adanya

- [`POST /api/auth/login`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:12) tetap memakai CAPTCHA wajib,
- [`POST /api/auth/register`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:11) tetap memakai CAPTCHA wajib,
- [`POST /api/auth/sync`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:19) tetap untuk NextAuth.

### 9.2 Tambahkan flow baru terpisah

- [`POST /api/auth/login-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:26),
- [`POST /api/auth/register-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:25),
- [`POST /api/auth/google/mobile`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:33),
- [`POST /api/auth/refresh`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:34).

### 9.3 Reuse service lama, beda validation/controller layer

Yang paling aman:

- controller baru memanggil [`AuthService.login()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:43) yang sama,
- controller baru memanggil [`AuthService.register()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:9) yang sama,
- beda hanya di validasi request dan kebijakan CAPTCHA.

Ini benar-benar minim perubahan dan minim risiko.

## 10. Keputusan Implementasi dan Posisi Dokumen

### 10.1 Apakah rencana pada dokumen ini layak mulai diterapkan sekarang

Ya, rencana pada dokumen ini layak mulai diterapkan sekarang dengan status **layak untuk fase implementasi awal**.

Alasannya praktis:

- perubahan difokuskan pada endpoint baru sehingga tidak memaksa refactor pada flow web lama,
- kontrak penting web tetap dipertahankan pada [`POST /api/auth/login`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:12), [`POST /api/auth/register`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:11), dan [`POST /api/auth/sync`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:19),
- reuse service lama di [`AuthService.register()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:9) dan [`AuthService.login()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:43) membuat risiko perubahan tetap kecil,
- hambatan terbesar mobile saat ini memang ada di layer validasi dan kontrak endpoint, bukan pada domain auth inti.

Namun, layak diterapkan sekarang tidak berarti seluruh desain auth mobile final sudah siap. Batas keputusan saat ini adalah:

- layak untuk membuka jalur login/register mobile native tanpa merusak web,
- refresh token minimal backend sudah tersedia, tetapi lifecycle mobile jangka panjang belum final,
- revocation per device dan secure storage mobile masih belum final,
- belum final untuk Google login native production-grade.

Keputusan operasionalnya: mulai implementasi fase awal sekarang, tetapi tetap anggap dokumen ini sebagai rollout plan sementara menuju target arsitektur pada [`11-mobile-login-architecture.md`](./11-mobile-login-architecture.md).

### 10.2 Apakah dokumen 11 dan 12 sebaiknya dipisah atau digabung

Keputusan yang disarankan: **tetap dipisah**.

Alasan arsitektur:

- [`11-mobile-login-architecture.md`](./11-mobile-login-architecture.md) berfungsi sebagai target architecture jangka menengah/panjang,
- dokumen ini berfungsi sebagai rollout plan jangka pendek yang sangat taktis,
- jika digabung, batas antara target final dan kompromi sementara akan kabur.

Alasan maintainability:

- perubahan jangka pendek akan lebih sering terjadi pada dokumen ini daripada pada dokumen arsitektur,
- tim bisa memperbarui checklist, phase, dan status rollout tanpa mengganggu narasi desain besar,
- risiko kontradiksi lebih kecil jika dokumen 11 dijaga sebagai north star dan dokumen 12 dijaga sebagai execution plan.

Alasan monitoring progres:

- progres implementasi lebih mudah dilacak jika checklist fase berada di satu dokumen operasional,
- reviewer bisa cepat menilai mana yang sudah dieksekusi dan mana yang masih target arsitektur,
- penghapusan solusi sementara nanti cukup dimonitor dari dokumen ini tanpa menulis ulang dokumen 11.

Aturan sinkronisasi dua dokumen:

- dokumen 11 menjawab “target akhirnya seperti apa”,
- dokumen 12 menjawab “langkah transisinya apa yang dikerjakan sekarang”,
- setiap perubahan future target di dokumen 12 harus tetap mengacu ke arah yang sudah dijelaskan di [`11-mobile-login-architecture.md`](./11-mobile-login-architecture.md).

## 11. Roadmap Implementasi Bertahap

### 11.1 Phase 0 - Baseline dan pagar kompatibilitas

Tujuan:

- menetapkan batas perubahan agar implementasi mobile baru tidak memutus flow web lama.

Ruang lingkup:

- inventaris endpoint auth lama yang tidak boleh berubah kontraknya,
- tetapkan kontrak minimal response untuk endpoint baru,
- tetapkan rule kompatibilitas terhadap flow Next.js dan NextAuth sync.

Dependency:

- pemahaman kontrak auth web pada [`page.tsx`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx:103), [`syncNextAuth()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:144), dan [`syncNextAuthToExpress()`](../proyek-perangkat-lunak/src/lib/auth/sync.ts:16).

Output/deliverable:

- daftar endpoint yang dipertahankan,
- kontrak request/response awal untuk endpoint client,
- keputusan eksplisit bahwa flow web lama tetap baseline kompatibilitas.

Risiko utama:

- tim mengubah endpoint web lama saat menambah endpoint baru,
- kontrak response baru terlalu berbeda dari kontrak lama.

Indikator selesai:

- semua pihak sepakat bahwa `login`, `register`, dan `sync` lama tidak diubah perilaku default-nya.

Checklist progres:

- [x] Konfirmasi [`POST /api/auth/login`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:12) tetap untuk web lama
- [x] Konfirmasi [`POST /api/auth/register`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:11) tetap untuk web lama
- [x] Konfirmasi [`POST /api/auth/sync`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:22) tetap khusus bridge NextAuth web
- [x] Bekukan format minimal response `token` + `user` untuk endpoint auth baru
- [x] Dokumentasikan asumsi kompatibilitas di backend dan mobile

### 11.2 Phase 1 - Quick win credentials mobile

Tujuan:

- membuka login dan register native untuk mobile secepat mungkin dengan perubahan paling kecil.

Ruang lingkup:

- tambah `POST /api/auth/login-client`,
- tambah `POST /api/auth/register-client`,
- tambah schema validasi baru untuk client/mobile,
- reuse service auth lama,
- tambahkan logging dasar dan rate limiting.

Dependency:

- route auth modular di [`auth.routes.ts`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts),
- service auth yang sudah ada di [`auth.service.ts`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts),
- policy CAPTCHA web lama di [`auth.validation.ts`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.validation.ts:3).

Output/deliverable:

- route dan controller baru untuk credentials mobile,
- schema baru tanpa `captchaToken` wajib,
- response kompatibel dengan `token` dan `user`,
- logging `clientType`, `platform`, `deviceId` bila tersedia.

Risiko utama:

- endpoint baru membuka abuse surface jika tidak diberi rate limiting,
- implementasi tanpa guard observability menyulitkan investigasi bila ada brute force.

Indikator selesai:

- mobile dapat login/register tanpa WebView,
- Next.js tidak perlu diubah,
- endpoint web lama tetap lulus smoke test yang sama.

Checklist progres:

- [x] Tambah route `POST /api/auth/login-client`
- [x] Tambah route `POST /api/auth/register-client`
- [x] Tambah schema request baru tanpa `captchaToken` wajib
- [x] Reuse [`AuthService.login()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:43)
- [x] Reuse [`AuthService.register()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:9)
- [x] Tambah rate limiting untuk route client baru
- [x] Tambah logging `clientType`, `platform`, `deviceId`
- [x] Pastikan response tetap mengandung `token` dan `user`
- [x] Tambah metadata response client ringan seperti `authContext` dan `provider` tanpa mengubah kontrak `token` + `user`
- [x] Verifikasi flow web di [`signin`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx:103) tidak perlu perubahan

### 11.3 Phase 2 - Hardening dan observability

Tujuan:

- membuat endpoint baru cukup aman dan terukur sebelum dipakai lebih luas.

Ruang lingkup:

- tambah error code eksplisit,
- tambah audit log auth minimal,
- rapikan telemetry dan fallback challenge,
- evaluasi kebutuhan penyesuaian CORS hanya jika ada flow browser tambahan.

Dependency:

- endpoint client dari phase 1 sudah aktif,
- logging backend tersedia,
- baseline traffic/auth error mulai terlihat.

Output/deliverable:

- error code seperti `CAPTCHA_REQUIRED` atau `RISK_CHALLENGE_REQUIRED`,
- log auth yang bisa dibedakan antara web dan mobile,
- catatan threshold abuse untuk endpoint baru.

Risiko utama:

- tim merasa endpoint sudah aman padahal belum ada metrik dasar,
- challenge ditambahkan terlalu cepat dan mengganggu UX mobile awal.

Indikator selesai:

- error auth client baru dapat dibaca dan dimonitor,
- ada data cukup untuk menilai apakah mobile perlu challenge tambahan.

Checklist progres:

- [x] Tambah error code auth yang eksplisit untuk challenge/risk
- [x] Tambah audit log auth minimal
- [x] Pisahkan telemetry web vs mobile pada log/monitoring
- [x] Review [`cors.ts`](../proyek-perangkat-lunak/backend/src/config/cors.ts:5) hanya jika ada kebutuhan origin browser baru
- [x] Dokumentasikan kondisi kapan challenge tambahan mulai diaktifkan

Kondisi aktivasi challenge tambahan saat ini:

- [`POST /api/auth/login-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:25) mengembalikan `RISK_CHALLENGE_REQUIRED` bila kombinasi IP + email melewati 5 percobaan dalam 1 menit.
- [`POST /api/auth/register-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:24) mengembalikan `CAPTCHA_REQUIRED` bila kombinasi IP + email melewati 3 percobaan dalam 5 menit.
- [`POST /api/auth/google/mobile`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:32) mengembalikan `RISK_CHALLENGE_REQUIRED` bila kombinasi IP + email identitas request melewati 5 percobaan dalam 1 menit.
- respons rate limit tetap memakai HTTP `429` dengan header `Retry-After`.
- detail respons bisa menyertakan `challengeType: "captcha"` untuk client yang perlu menyiapkan fallback challenge.
- pendekatan ini masih bersifat hardening awal berbasis in-memory limiter di [`rate-limit.ts`](../proyek-perangkat-lunak/backend/src/middleware/rate-limit.ts:1), belum distributed dan belum device-session aware.

### 11.4 Phase 3 - Google mobile terpisah dari web sync

Tujuan:

- membuka jalur login Google mobile tanpa mengganggu alur NextAuth web yang sudah berjalan.

Ruang lingkup:

- tambah `POST /api/auth/google/mobile`,
- verifikasi token provider mobile di backend,
- pertahankan [`syncNextAuth()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:144) khusus web.

Dependency:

- phase 1 stabil,
- strategi login Google native di mobile disepakati,
- backend siap memisahkan kontrak Google web dan mobile.

Output/deliverable:

- endpoint Google mobile baru,
- kontrak request/response terpisah dari web sync,
- dokumentasi boundary yang jelas antara web Google dan mobile Google.

Risiko utama:

- tim tergoda memakai endpoint `sync` untuk mobile dan mencampur dua konteks auth yang berbeda,
- scope provider dan callback flow tidak dipisah dengan jelas.

Indikator selesai:

- mobile tidak lagi bergantung pada flow Google web atau WebView untuk login Google,
- flow web Google tetap memakai jalur lama tanpa regresi.

Checklist progres:

- [x] Tambah route `POST /api/auth/google/mobile`
- [x] Definisikan payload minimum seperti `idToken`, `clientType`, `deviceId`, `platform`
- [x] Pertahankan [`POST /api/auth/sync`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts:22) khusus web
- [x] Tambah `provider: "google"` pada response mobile Google tanpa mengubah kontrak auth lama
- [x] Verifikasi flow [`googleCallback()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:169) tidak berubah
- [x] Dokumentasikan perbedaan web Google sync vs mobile Google native

### 11.5 Phase 4 - Transisi ke target arsitektur menengah

Tujuan:

- mengurangi solusi sementara dan bergerak menuju target arsitektur pada dokumen 11.

Ruang lingkup:

- tambah `POST /api/auth/refresh`,
- tambahkan refresh token rotation,
- tambahkan session/revocation per device,
- rapikan strategi auth agar lebih client-aware.

Dependency:

- phase 1 sampai phase 3 stabil,
- kebutuhan mobile production sudah jelas,
- strategi penyimpanan session/device minimum disepakati; implementasi saat ini sementara reuse model `Session` yang sudah ada.

Output/deliverable:

- refresh flow mobile yang eksplisit,
- mekanisme session/revocation minimum yang bisa dipakai tanpa migrasi schema besar,
- peta migrasi dari JWT tunggal ke token pair yang lebih sehat.

Risiko utama:

- refactor terlalu cepat sebelum endpoint dasar stabil,
- perubahan session lifecycle memukul kompatibilitas client lama jika tidak dirancang bertahap.

Indikator selesai:

- mobile tidak lagi mengandalkan token jangka panjang tunggal,
- arah arsitektur mulai selaras dengan target pada [`11-mobile-login-architecture.md`](./11-mobile-login-architecture.md).

Checklist progres:

- [x] Tambah route `POST /api/auth/refresh`
- [x] Definisikan refresh token rotation
- [x] Tambah session/revocation per device minimum via reuse model `Session`
- [ ] Review kebutuhan storage aman di mobile terhadap token pair
- [ ] Tandai bagian solusi sementara yang siap dipensiunkan

## 12. Checklist Dampak ke Next.js

### 12.1 Target dampak minimal

- [x] Tidak perlu ubah [`src/app/auth/signin/page.tsx`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx:103)
- [x] Tidak perlu ubah [`src/app/auth/signup/page.tsx`](../proyek-perangkat-lunak/src/app/auth/signup/page.tsx:109)
- [x] Tidak perlu ubah [`src/lib/auth/sync.ts`](../proyek-perangkat-lunak/src/lib/auth/sync.ts:16)
- [x] Tidak perlu ubah middleware auth web di [`src/middleware.ts`](../proyek-perangkat-lunak/src/middleware.ts:4)
- [x] Tidak perlu ubah struktur cookie/token web yang ada sekarang

### 12.2 Hanya jika nanti diperlukan

- [x] Tambah dokumentasi bahwa endpoint baru tersedia untuk mobile/client lain
- [x] Bila ingin telemetry lebih baik, Next.js bisa mengirim `clientType=web` secara eksplisit nanti, tetapi ini bukan kebutuhan awal
- [x] Evaluasi ulang flow web hanya setelah endpoint client baru stabil

## 13. Jembatan ke Target Arsitektur Dokumen 11

Dokumen ini sengaja tidak menyalin ulang seluruh target arsitektur pada [`11-mobile-login-architecture.md`](./11-mobile-login-architecture.md), tetapi menjadi jembatan transisinya.

Pemetaan transisinya:

- phase 1 menyelesaikan hambatan paling mendesak: mobile bisa login/register tanpa bergantung pada WebView,
- phase 2 menambah pagar keamanan dan observability agar endpoint baru tidak menjadi bypass tak terukur,
- phase 3 memisahkan Google mobile dari jalur [`sync`](../proyek-perangkat-lunak/src/lib/auth/sync.ts:16) yang khusus web,
- phase 4 mulai mengadopsi token lifecycle yang lebih sehat seperti yang sudah direkomendasikan pada dokumen 11.

Dengan struktur ini, solusi minimal-change tetap punya arah penghentian yang jelas dan tidak berhenti sebagai kompromi permanen.

## 13.1 Status implementasi batch saat ini

Batch implementasi yang sudah selesai pada fase minimal-change saat ini:

- mobile service di [`auth.service.ts`](../src/services/auth.service.ts:6) sudah menormalkan response `success/data` dan tetap membaca pasangan `token` + `user`,
- tipe response mobile di [`index.ts`](../src/types/index.ts:26) sudah diperluas secara kompatibel untuk `refreshToken`, `tokenType`, `expiresIn`, `sessionId`, `authContext`, dan `provider`,
- login screen native di [`login.tsx`](../src/app/(auth)/login.tsx:53) sudah memakai redirect konsisten ke route tab dashboard,
- backend client auth di [`auth.controller.ts`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:132) sekarang menambahkan `authContext` untuk route client, `provider` untuk Google mobile, dan token pair untuk route mobile,
- backend refresh minimal tersedia di [`refresh()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:239) dengan rotasi token di [`refreshMobileToken()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:145),
- flow web lama di [`signin`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx:103), [`callback`](../proyek-perangkat-lunak/src/app/auth/callback/page.tsx:7), dan [`sync`](../proyek-perangkat-lunak/src/lib/auth/sync.ts:16) tidak diubah.

Verifikasi batch ini:

- build backend lulus melalui [`npm run build`](../proyek-perangkat-lunak/backend/package.json:7),
- type-check mobile lulus melalui [`npx tsc --noEmit`](../pemrograman-mobile/package.json).

Follow-up yang masih terbuka untuk batch berikutnya sekarang lebih sempit:

- konsumsi `refreshToken` di client mobile masih perlu dirapikan,
- secure storage untuk token pair masih perlu direview,
- revocation/device session masih bersifat minimum dan belum device-metadata aware.

## 14. Rekomendasi Final yang Paling Disarankan

Keputusan final yang paling disarankan untuk prioritas sekarang:

- implementasi pada dokumen ini layak diteruskan dari fase awal ke hardening bertahap,
- dokumen 11 dan 12 sebaiknya tetap dipisah dengan peran yang berbeda,
- prioritas endpoint dasar sudah tercakup oleh `POST /api/auth/login-client`, `POST /api/auth/register-client`, `POST /api/auth/google/mobile`, dan `POST /api/auth/refresh`,
- `clientType`: opsional secara global, jangan diwajibkan pada endpoint lama; boleh dinormalisasi dan dicatat di backend,
- CAPTCHA: jangan skip otomatis hanya karena request mengaku mobile; endpoint client baru sekarang sudah dilindungi rate limiting in-memory dan challenge code adaptif awal,
- Next.js: jangan diubah dulu kecuali untuk dokumentasi; flow [`signin`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx), [`sync`](../proyek-perangkat-lunak/src/lib/auth/sync.ts), dan Google web yang ada sekarang sebaiknya dibiarkan tetap berjalan,
- compatibility layer: pertahankan endpoint web lama apa adanya dan tambahkan endpoint baru terpisah agar client baru bisa jalan tanpa mengganggu web lama.

Jika hanya boleh memilih satu langkah paling prioritas berikutnya, pilih ini:

1. simpan dan kelola `refreshToken` mobile dengan aman,
2. jangan sentuh `POST /api/auth/login` lama,
3. jangan jadikan `clientType` wajib di web lama,
4. jangan skip CAPTCHA otomatis berbasis klaim mobile,
5. lanjutkan hardening device-session dan auto-refresh secara bertahap.

Itu adalah jalur paling aman, paling cepat, dan paling kecil risiko untuk menjaga aplikasi Next.js tetap stabil sambil merapikan lifecycle auth mobile yang sudah mulai tersedia di backend.