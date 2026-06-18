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

Ini penting, tetapi bukan yang paling pertama jika target Anda adalah “integrasi cepat tanpa refactor besar”.

Kalau waktu terbatas, endpoint ini bisa ditunda ke fase stabilisasi, dengan catatan:

- mobile tahap awal masih bisa jalan memakai JWT lama seperti sekarang,
- nanti saat stabilisasi baru tambahkan refresh flow.

Jika tetap ingin ditambahkan sekarang, buat kontraknya terpisah dan jangan ubah cara kerja login web lama.

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

- [`POST /api/auth/login-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts),
- [`POST /api/auth/register-client`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts),
- [`POST /api/auth/google/mobile`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.routes.ts).

### 9.3 Reuse service lama, beda validation/controller layer

Yang paling aman:

- controller baru memanggil [`AuthService.login()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:43) yang sama,
- controller baru memanggil [`AuthService.register()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.service.ts:9) yang sama,
- beda hanya di validasi request dan kebijakan CAPTCHA.

Ini benar-benar minim perubahan dan minim risiko.

## 10. Roadmap Bertahap

### 10.1 Quick Win

Lakukan segera tanpa refactor besar:

1. tambah endpoint `login-client`,
2. tambah endpoint `register-client`,
3. tambah schema validasi baru untuk client/mobile,
4. pertahankan endpoint web lama tanpa perubahan kontrak,
5. tambahkan logging `clientType`, `platform`, dan `deviceId` bila ada,
6. tambahkan rate limit khusus endpoint client baru.

Hasilnya:

- mobile bisa mulai integrasi cepat,
- Next.js nyaris tidak tersentuh.

### 10.2 Stabilisasi

Setelah quick win berjalan:

1. tambah endpoint `google/mobile`,
2. tambah error code eksplisit seperti `CAPTCHA_REQUIRED`,
3. rapikan env config untuk mobile auth bila perlu,
4. rapikan CORS hanya jika memang ada flow browser-based baru,
5. tambahkan audit log auth minimal.

### 10.3 Refactor Nanti Jika Diperlukan

Tunda sampai ada kebutuhan nyata:

1. unify auth strategy web/mobile dalam service layer yang lebih formal,
2. tambahkan refresh token penuh,
3. tambahkan revocation dan session per device,
4. revisi flow Google agar scope login dan scope calendar dipisah,
5. rapikan arsitektur auth controller menjadi client-aware strategy.

Refactor ini bagus, tetapi tidak perlu jadi syarat untuk membuka integrasi baru.

## 11. Checklist Implementasi Backend

### 11.1 Bisa dilakukan segera tanpa refactor

- [ ] Tambah route baru `POST /api/auth/login-client`
- [ ] Tambah route baru `POST /api/auth/register-client`
- [ ] Tambah schema validasi baru tanpa `captchaToken` wajib
- [ ] Tambah controller baru yang reuse service lama
- [ ] Tambah logging `clientType`, `platform`, `deviceId`
- [ ] Tambah rate limiting untuk route baru
- [ ] Pastikan response tetap mengandung `token` dan `user`
- [ ] Jangan ubah logika [`syncNextAuth()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:144)
- [ ] Jangan ubah flow [`googleCallback()`](../proyek-perangkat-lunak/backend/src/modules/auth/auth.controller.ts:121) untuk web

### 11.2 Sebaiknya fase berikutnya

- [ ] Tambah `POST /api/auth/google/mobile`
- [ ] Tambah `POST /api/auth/refresh`
- [ ] Tambah revocation/session table
- [ ] Tambah adaptive challenge/CAPTCHA escalation

## 12. Checklist Dampak ke Next.js

### 12.1 Target dampak minimal

- [ ] Tidak perlu ubah [`src/app/auth/signin/page.tsx`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx)
- [ ] Tidak perlu ubah [`src/app/auth/signup/page.tsx`](../proyek-perangkat-lunak/src/app/auth/signup/page.tsx)
- [ ] Tidak perlu ubah [`src/lib/auth/sync.ts`](../proyek-perangkat-lunak/src/lib/auth/sync.ts)
- [ ] Tidak perlu ubah middleware auth web di [`src/middleware.ts`](../proyek-perangkat-lunak/src/middleware.ts)
- [ ] Tidak perlu ubah struktur cookie/token web yang ada sekarang

### 12.2 Hanya jika nanti diperlukan

- [ ] Tambah dokumentasi bahwa endpoint baru tersedia untuk mobile/client lain
- [ ] Bila ingin telemetry lebih baik, Next.js bisa mengirim `clientType=web` secara eksplisit nanti, tetapi ini bukan kebutuhan awal

## 13. Mana yang Bisa Dilakukan Segera dan Mana yang Ditunda

### 13.1 Lakukan segera

- tambah endpoint baru terpisah,
- tambah schema baru,
- reuse service auth lama,
- pertahankan endpoint web lama,
- tambahkan rate limit dan logging,
- dokumentasikan kontrak request/response.

### 13.2 Tunda dulu

- mewajibkan `clientType` di semua endpoint,
- menghapus CAPTCHA dari flow web lama,
- menyatukan semua flow Google web dan mobile,
- mengganti flow login Next.js,
- mengganti arsitektur sync NextAuth,
- refactor besar auth menjadi strategy engine penuh.

## 14. Rekomendasi Final yang Paling Disarankan

Keputusan final yang paling disarankan untuk prioritas sekarang:

- prioritas endpoint: `POST /api/auth/login-client`, lalu `POST /api/auth/register-client`, lalu `POST /api/auth/google/mobile`,
- `clientType`: opsional secara global, jangan diwajibkan pada endpoint lama; boleh dinormalisasi dan dicatat di backend,
- CAPTCHA: jangan skip otomatis hanya karena request mengaku mobile; lebih aman buat endpoint client baru tanpa CAPTCHA wajib, tetapi lindungi dengan rate limiting dan logging,
- Next.js: jangan diubah dulu kecuali untuk dokumentasi; flow [`signin`](../proyek-perangkat-lunak/src/app/auth/signin/page.tsx), [`sync`](../proyek-perangkat-lunak/src/lib/auth/sync.ts), dan Google web yang ada sekarang sebaiknya dibiarkan tetap berjalan,
- compatibility layer: pertahankan endpoint web lama apa adanya dan tambahkan endpoint baru terpisah agar client baru bisa jalan tanpa mengganggu web lama.

Jika hanya boleh memilih satu langkah paling prioritas, pilih ini:

1. tambahkan `POST /api/auth/login-client`,
2. jangan sentuh `POST /api/auth/login` lama,
3. jangan jadikan `clientType` wajib di web lama,
4. jangan skip CAPTCHA otomatis berbasis klaim mobile,
5. pasang rate limit di endpoint baru.

Itu adalah jalur paling aman, paling cepat, dan paling kecil risiko untuk menjaga aplikasi Next.js tetap stabil sambil membuka jalan integrasi mobile atau client lain.