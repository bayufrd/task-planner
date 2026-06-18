# Arsitektur dan Alur Login Mobile

## 1. Latar Belakang

Aplikasi mobile pada proyek ini dibangun dengan Expo/React Native dan saat ini memakai pendekatan login berbasis WebView ke halaman web Next.js, lalu mengambil token backend dari browser context untuk dipakai ulang di sisi native. Pendekatan ini terlihat pada implementasi WebView auth di aplikasi mobile, form auth dan Google login di aplikasi Next.js, serta endpoint auth terpusat di backend Express.

Secara praktis, arsitektur saat ini sudah memungkinkan satu backend melayani beberapa client:

- web Next.js,
- mobile React Native,
- integrasi internal yang memakai JWT backend.

Namun, cara login web dan mobile belum benar-benar dipisahkan secara arsitektural. Mobile masih sangat bergantung pada UI dan storage milik web, padahal kebutuhan mobile native berbeda pada area token storage, callback handling, CAPTCHA, Google OAuth, dan session lifecycle.

Dokumen ini merumuskan rancangan login mobile yang sinkron dengan implementasi proyek saat ini, tetapi juga memberi arah perbaikan yang realistis supaya arsitekturnya lebih aman, lebih stabil, dan lebih mudah dipelihara.

## 2. Tujuan Dokumen

Dokumen ini bertujuan untuk:

- menjelaskan alur login mobile end-to-end dari aplikasi React Native ke backend Express,
- menjelaskan hubungan login mobile dengan frontend Next.js yang sudah ada,
- mengidentifikasi penyesuaian backend yang dibutuhkan agar mendukung multi-client auth secara rapi,
- membedakan strategi development dan production,
- membahas CAPTCHA, Google login, CORS, dan keamanan mobile login secara spesifik,
- memberikan rekomendasi implementasi yang konkret untuk proyek ini.

## 3. Konteks Arsitektur Proyek Saat Ini

### 3.1 Komponen yang terlibat

Saat ini ada tiga lapisan utama yang relevan terhadap login:

1. aplikasi mobile React Native/Expo,
2. frontend web Next.js,
3. backend Express sebagai API auth dan domain service.

Peran masing-masing:

- Mobile dipakai sebagai client native dan menyimpan token di storage lokal.
- Next.js menangani auth UI web, Google login via NextAuth, middleware route protection, dan penyimpanan token backend untuk kebutuhan halaman protected.
- Express menjadi sumber kebenaran untuk akun aplikasi, JWT backend, endpoint `register`, `login`, `me`, `logout`, dan `sync`.

### 3.2 Pola auth yang berjalan sekarang

Saat ini sistem login proyek bersifat hybrid:

- email/password web langsung ke backend Express,
- Google login web melalui NextAuth di Next.js,
- session Google web lalu disinkronkan ke JWT Express melalui endpoint `POST /api/auth/sync`,
- mobile membuka halaman login web melalui WebView dan mengekstrak token backend dari localStorage web.

Artinya, backend Express sudah menjadi issuer token aplikasi, tetapi jalur masuknya masih berbeda-beda tergantung client.

### 3.3 Masalah utama dari pendekatan saat ini

Pendekatan sekarang bekerja, tetapi memiliki beberapa kelemahan:

- mobile bergantung pada halaman web dan localStorage web, bukan flow native,
- mobile belum punya refresh token flow yang eksplisit,
- schema validasi backend masih mewajibkan CAPTCHA untuk login/register biasa,
- Google login backend saat ini dirancang untuk callback web, belum menjadi mobile-native flow yang bersih,
- logout backend masih stateless, jadi belum ada revocation/session registry,
- CORS dikonfigurasi cukup permisif karena menyesuaikan banyak skenario sekaligus.

## 4. Arsitektur Login Mobile End-to-End

### 4.1 Gambaran umum yang direkomendasikan

Arsitektur utama yang direkomendasikan untuk proyek ini adalah:

- backend Express tetap menjadi auth authority untuk token aplikasi,
- Next.js tetap mengelola web login dan web session,
- mobile tidak lagi menjadikan WebView login web sebagai arsitektur utama,
- mobile memakai endpoint backend yang sama untuk email/password, tetapi dengan mode client yang eksplisit,
- mobile Google login memakai flow native/mobile OAuth lalu hasil provider diverifikasi oleh backend,
- backend menerbitkan access token dan refresh token yang khusus untuk aplikasi mobile.

### 4.2 Alur end-to-end yang disarankan untuk email/password mobile

Alur utama yang direkomendasikan:

1. user membuka aplikasi mobile,
2. mobile memeriksa access token dan refresh token pada secure storage,
3. jika access token masih valid, mobile langsung mengakses API backend,
4. jika access token expired tetapi refresh token valid, mobile memanggil endpoint refresh,
5. jika tidak ada token valid, user masuk ke layar login native,
6. mobile mengirim email/password ke backend Express,
7. backend memvalidasi kredensial, kebijakan CAPTCHA/risk rules, lalu menerbitkan access token + refresh token,
8. mobile menyimpan access token dan refresh token di secure storage,
9. mobile memakai access token pada header `Authorization: Bearer <token>` untuk semua API protected,
10. backend memverifikasi JWT access token pada middleware auth.

### 4.3 Alur end-to-end yang berjalan saat ini di mobile

Flow saat ini kurang lebih seperti berikut:

1. mobile membuka WebView ke halaman sign in Next.js,
2. user login melalui form web atau Google web flow,
3. Next.js menyimpan token backend ke localStorage web,
4. WebView mobile menginjeksi JavaScript untuk membaca localStorage,
5. token dan user dipostMessage ke React Native layer,
6. mobile menyimpan token ke AsyncStorage/Zustand,
7. mobile menggunakan token itu untuk memanggil backend.

Flow ini cukup cepat untuk bootstrap, tetapi secara arsitektur ia adalah bridge, bukan desain final yang ideal.

### 4.4 Peran Next.js dalam login mobile

Next.js tetap relevan untuk mobile dalam beberapa kondisi:

- sebagai referensi UX dan perilaku auth web,
- sebagai fallback browser-based auth bila native flow belum siap,
- sebagai pemilik NextAuth session untuk web,
- sebagai callback landing page untuk web-only OAuth flows.

Namun untuk mobile native, Next.js sebaiknya bukan dependency inti dari proses login normal. Mobile sebaiknya bisa login walau UI web berubah total.

## 5. Perbedaan Login Web vs Login Mobile

### 5.1 Perbedaan model session

Web:

- bisa mengandalkan cookie, NextAuth session, redirect browser, dan middleware berbasis request browser,
- lebih nyaman memakai hybrid session antara cookie dan localStorage.

Mobile:

- tidak memiliki browser session model yang identik,
- tidak cocok mengandalkan cookie browser sebagai sumber session utama,
- lebih tepat memakai token pair: access token + refresh token,
- lifecycle token harus dikelola penuh oleh aplikasi native.

### 5.2 Perbedaan callback dan redirect

Web memakai redirect URL seperti:

- `/auth/signin`,
- `/auth/callback`,
- callback provider pada domain web.

Mobile memakai konsep berbeda:

- deep link,
- custom scheme,
- universal link/app link,
- system browser callback ke aplikasi.

Karena itu, callback web yang sekarang tidak bisa dianggap langsung setara dengan callback mobile.

### 5.3 Perbedaan storage

Web saat ini memakai kombinasi cookie dan localStorage.

Mobile tidak sebaiknya menyimpan token sensitif di storage biasa seperti AsyncStorage untuk implementasi final. AsyncStorage bisa dipakai sementara untuk bootstrap, tetapi target production sebaiknya memakai secure storage.

### 5.4 Perbedaan proteksi abuse

Web lebih mudah memakai CAPTCHA visual seperti Cloudflare Turnstile.

Mobile native lebih sulit memakai CAPTCHA berbasis widget web secara konsisten. Karena itu backend perlu memiliki mekanisme risk-based security yang tidak memaksa semua client mengikuti pola browser web.

## 6. Kebutuhan Backend untuk Mendukung Mobile Login

### 6.1 Prinsip desain backend yang direkomendasikan

Backend sebaiknya menjadi auth gateway yang client-aware, bukan frontend-aware.

Artinya backend mengenali tipe client seperti:

- `web`,
- `mobile`,
- `internal`.

Ini bisa dilakukan dengan kombinasi:

- field `clientType` pada body,
- header seperti `X-Client-Type: mobile`,
- metadata tambahan seperti `deviceId`, `platform`, `appVersion`.

Tujuannya bukan membedakan user, tetapi membedakan kebijakan auth, callback, token TTL, dan kontrol keamanan.

### 6.2 Endpoint yang idealnya tetap reusable

Endpoint berikut idealnya tetap reusable untuk web dan mobile:

- `POST /api/auth/login` untuk email/password,
- `POST /api/auth/register` untuk registrasi,
- `GET /api/auth/me` untuk profil user aktif,
- `POST /api/auth/logout` untuk sign out,
- endpoint domain lain seperti tasks, reminders, calendar, AI.

Syaratnya, kontrak endpoint harus diperluas agar bisa menerima konteks client type secara eksplisit.

### 6.3 Endpoint yang sebaiknya dipisah atau ditambah

Untuk arsitektur yang lebih sehat, backend sebaiknya menambah endpoint berikut:

- `POST /api/auth/refresh` untuk refresh access token,
- `POST /api/auth/revoke` atau `POST /api/auth/logout` yang benar-benar mencabut refresh token/device session,
- `POST /api/auth/google/mobile` untuk mobile provider token exchange atau ID token verification,
- `POST /api/auth/google/web-sync` atau tetap `POST /api/auth/sync` khusus bridge dari NextAuth web.

Rekomendasi utamanya: pisahkan flow Google mobile dari flow sync NextAuth web.

### 6.4 Kenapa `sync` web jangan dijadikan flow utama mobile

Endpoint `POST /api/auth/sync` saat ini cocok untuk web karena fungsinya adalah mengubah session Google milik NextAuth menjadi JWT Express.

Untuk mobile, endpoint itu bukan kontrak ideal karena:

- mobile tidak punya NextAuth session,
- sumber token provider pada mobile berbeda,
- kebutuhan callback, PKCE, dan deep link berbeda,
- security boundary web dan native berbeda.

Jadi flow login Google yang sekarang di web tidak sebaiknya dipakai ulang mentah-mentah untuk mobile.

### 6.5 Bentuk backend auth yang fleksibel

Desain yang direkomendasikan:

- satu modul auth utama,
- beberapa strategi login di belakangnya,
- hasil akhirnya tetap satu format token aplikasi.

Contoh strategi:

- `credentials:web`,
- `credentials:mobile`,
- `google:web-nextauth-sync`,
- `google:mobile-native`,
- `internal:service-secret`.

Dengan pola ini, service auth tetap terpusat tetapi aturan masuknya jelas.

## 7. Session Strategy dan Token Management

### 7.1 Rekomendasi utama

Untuk mobile, strategi yang paling realistis adalah:

- access token short-lived,
- refresh token long-lived,
- refresh token rotation,
- revocation berbasis device session.

### 7.2 Kenapa JWT tunggal 7 hari kurang ideal untuk mobile

Saat ini backend menghasilkan JWT stateless dengan TTL dari environment. Pola ini sederhana, tetapi untuk mobile ada kelemahan:

- jika token bocor, masa berlaku terlalu panjang,
- tidak ada kontrol per-device,
- logout tidak benar-benar mencabut token,
- sulit menangani refresh yang aman.

### 7.3 Rekomendasi TTL

Rekomendasi realistis:

- access token: 15 menit sampai 1 jam,
- refresh token: 7 sampai 30 hari,
- refresh token rotation setiap kali refresh sukses,
- simpan hash refresh token di database.

### 7.4 Session registry per device

Untuk mobile, backend idealnya menyimpan sesi per device, misalnya tabel session/auth device dengan field:

- `id`,
- `userId`,
- `clientType`,
- `deviceId`,
- `deviceName`,
- `platform`,
- `refreshTokenHash`,
- `lastUsedAt`,
- `revokedAt`,
- `ipAddress`,
- `userAgent` atau app signature.

Keuntungan:

- logout bisa benar-benar revoke device tertentu,
- user bisa logout dari semua perangkat,
- audit login lebih baik,
- abuse detection lebih akurat.

### 7.5 Penyimpanan token di mobile

Rekomendasi final:

- access token di secure storage,
- refresh token di secure storage,
- user profile non-sensitif boleh di cache lokal,
- jangan menyimpan token provider Google kecuali benar-benar dibutuhkan untuk fitur provider tertentu.

Jika proyek masih memakai AsyncStorage untuk tahap transisi, dokumentasikan itu sebagai sementara, bukan target production.

## 8. Strategi Development Environment

### 8.1 Karakter development saat ini

Di development, proyek ini memakai kombinasi host lokal dan domain tertentu. Next.js umumnya berjalan di localhost, backend Express di port sendiri, dan mobile dapat berjalan melalui Expo Go/dev client.

Tantangan utama development mobile auth biasanya bukan pada logika login, tetapi pada:

- host yang berbeda-beda,
- redirect URI yang tidak konsisten,
- deep link yang belum terdaftar,
- CAPTCHA domain mismatch,
- Google OAuth callback yang hanya mengenal domain web.

### 8.2 Base URL yang direkomendasikan di development

Pisahkan dengan jelas:

- Web frontend URL: misal `http://localhost:3000`,
- Backend API URL: misal `http://localhost:8000` atau tunnel HTTPS,
- Mobile app scheme: misal `taskplanner://auth/callback`,
- Mobile web fallback URL: bila perlu `http://localhost:3000/auth/callback`.

Untuk mobile device fisik, `localhost` tidak berarti mesin developer. Karena itu:

- gunakan IP LAN lokal, atau
- gunakan tunnel HTTPS stabil.

### 8.3 Auth provider config di development

Development perlu memisahkan konfigurasi provider untuk:

- web redirect URI,
- mobile redirect URI,
- bila perlu dev client package ID yang berbeda dari production.

Jangan mengandalkan satu redirect URI yang mencoba melayani semua channel sekaligus.

### 8.4 Secret handling di development

Secret yang perlu dipisah:

- JWT secret backend,
- Google client secret web,
- Google config mobile,
- Turnstile secret backend,
- env untuk API base URL masing-masing app.

Rahasia tidak boleh ditanam hardcoded di aplikasi mobile. Yang boleh berada di client hanya public config seperti site key, web client ID tertentu, dan deep link scheme yang memang public.

### 8.5 CAPTCHA di development

Untuk development, CAPTCHA sering menjadi penghambat. Karena itu backend perlu mendukung salah satu pola berikut:

- testing site key + testing secret Turnstile,
- bypass CAPTCHA hanya pada `NODE_ENV=development`,
- bypass CAPTCHA hanya untuk `clientType=mobile` di dev,
- bypass berbasis allowlist tester internal.

Rekomendasi: gunakan bypass yang eksplisit dan terdokumentasi, bukan perilaku ambigu.

### 8.6 Masalah umum di development

Masalah yang paling sering muncul:

- mobile tidak bisa mengakses `localhost`,
- callback provider kembali ke browser, bukan ke app,
- Turnstile gagal karena origin/domain tidak cocok,
- WebView menyimpan state lama dan membuat login tampak acak,
- CORS gagal pada flow browser-based login atau embedded web flow,
- token tersimpan di storage yang salah dan tidak sinkron.

## 9. Strategi Production Environment

### 9.1 Prinsip production

Production harus memisahkan concern berikut:

- domain web,
- domain API,
- mobile deep link/app link,
- provider callback untuk web,
- provider callback untuk mobile.

### 9.2 Base URL production yang direkomendasikan

Contoh pembagian yang sehat:

- web app: `https://taskplanner.dastrevas.com`,
- API backend: `https://api-taskplanner.dastrevas.com`,
- mobile deep link: `taskplanner://auth/callback`,
- universal link/app link opsional: `https://taskplanner.dastrevas.com/mobile-auth/callback`.

### 9.3 HTTPS requirement

Untuk production:

- semua endpoint auth harus HTTPS,
- callback OAuth production harus HTTPS,
- refresh token tidak boleh dikirim lewat koneksi non-HTTPS,
- web cookie auth harus `Secure` bila dipakai.

Untuk mobile native API call, CORS bukan isu utama, tetapi HTTPS tetap wajib karena ancaman utamanya bukan browser restriction melainkan network interception.

### 9.4 Secret management di production

Production wajib memisahkan dan mengamankan:

- `JWT_SECRET`,
- refresh token signing/encryption secret bila dipisah,
- Google client secret web,
- backend Turnstile secret,
- internal service secret.

Simpan secret di secret manager atau environment yang terkelola. Jangan menaruh secret di repo atau build artifact client.

### 9.5 Provider dan callback strategy di production

Web Google login:

- callback tetap diarahkan ke flow web/NextAuth atau backend web callback yang konsisten.

Mobile Google login:

- callback diarahkan ke app scheme atau universal link mobile,
- backend menerima token provider yang sudah diperoleh mobile, lalu menerbitkan token aplikasi.

### 9.6 Masalah umum production

Risiko umum di production:

- callback URI tidak sinkron antara Google Console dan aplikasi,
- domain API dan domain web tertukar,
- cookie web tidak terkirim karena domain/SameSite salah,
- refresh token tidak bisa diputar karena clock skew atau race condition,
- mobile app lama memakai kontrak auth versi lama.

## 10. Strategi CAPTCHA untuk Mobile

### 10.1 Kondisi saat ini

Saat ini login/register web memakai Cloudflare Turnstile, dan backend validation schema juga mewajibkan `captchaToken` untuk credentials flow.

Implikasinya:

- web cocok dengan desain ini,
- mobile native menjadi tidak ideal karena harus ikut flow widget web atau mengirim pseudo token.

### 10.2 Apakah CAPTCHA layak di mobile native?

Bisa, tetapi tidak selalu layak jika implementasinya sekadar menanam widget web biasa.

Keterbatasan CAPTCHA pada mobile native:

- UX lebih buruk,
- integrasi widget sering tidak stabil,
- challenge visual tidak selalu cocok di in-app context,
- sulit konsisten di background/resume state,
- rawan jadi ketergantungan WebView lagi.

### 10.3 Rekomendasi utama

Untuk proyek ini, backend sebaiknya mendukung CAPTCHA yang optional atau conditional berdasarkan client type dan risk level.

Rekomendasi kebijakan:

- `web` credentials login/register: CAPTCHA aktif secara default,
- `mobile` credentials login/register: CAPTCHA tidak wajib pada baseline low-risk flow,
- CAPTCHA diwajibkan jika ada sinyal risiko tinggi.

### 10.4 Desain aman untuk CAPTCHA conditional

CAPTCHA wajib jika salah satu kondisi ini terjadi:

- terlalu banyak percobaan login gagal dari IP atau device tertentu,
- pendaftaran massal terdeteksi,
- anomali device fingerprint,
- pola credential stuffing terdeteksi,
- IP atau ASN masuk daftar berisiko.

CAPTCHA opsional atau dilewati jika:

- mobile app resmi mengirim `clientType=mobile`,
- request berasal dari app version valid,
- device belum menunjukkan pola abuse,
- rate limit masih normal.

### 10.5 Cara backend memverifikasi

Backend sebaiknya:

- hanya memverifikasi CAPTCHA jika challenge memang diwajibkan,
- menandai respons error dengan kode khusus, misalnya `CAPTCHA_REQUIRED`,
- memberi metadata agar client tahu kapan harus menampilkan challenge tambahan.

Contoh flow:

1. mobile kirim login tanpa CAPTCHA,
2. backend mendeteksi risiko rendah -> login diproses biasa,
3. atau backend mendeteksi risiko tinggi -> balas `CAPTCHA_REQUIRED`,
4. mobile menampilkan fallback challenge yang didukung,
5. mobile mengirim ulang request dengan `captchaToken`.

### 10.6 Alternatif bila CAPTCHA web tidak cocok untuk mobile

Alternatif yang lebih realistis:

- rate limiting ketat,
- device reputation,
- IP reputation,
- login failure throttling,
- proof-of-possession ringan per app session,
- challenge berbasis OTP/email verification untuk kondisi tertentu.

Rekomendasi utama untuk proyek ini: jangan memaksa Turnstile web menjadi dependensi wajib login mobile native.

## 11. Strategi Google Login untuk Mobile

### 11.1 Perbedaan konsep web vs mobile

Google login di web saat ini berorientasi pada browser session:

- user klik tombol Google di halaman Next.js,
- NextAuth mengelola redirect OAuth,
- session NextAuth terbentuk,
- frontend meminta JWT backend melalui endpoint sync.

Pada mobile installed app, flow yang benar berbeda:

- user memulai login dari aplikasi native,
- sistem membuka native Google sign-in atau system browser,
- mobile menerima callback melalui app scheme/deep link,
- backend memverifikasi identity provider result,
- backend menerbitkan token aplikasi.

### 11.2 Apakah flow Google web yang sekarang bisa langsung dipakai di mobile?

Tidak sebaiknya.

Alasan:

- flow web bergantung pada NextAuth session dan browser redirect,
- mobile memerlukan callback ke app, bukan ke halaman web biasa,
- token source yang diterima mobile berbeda,
- security model PKCE/native sign-in berbeda dengan web session bridge.

Flow web saat ini bisa dipakai hanya sebagai fallback sementara, bukan arsitektur final mobile.

### 11.3 Flow yang direkomendasikan untuk mobile

Dua opsi utama:

#### Opsi A - Native Google Sign-In + backend token verification

Alur:

1. mobile memakai SDK/native Google Sign-In,
2. mobile mendapatkan ID token dan/atau authorization result,
3. mobile mengirim token provider ke backend,
4. backend memverifikasi token ke Google,
5. backend menemukan atau membuat user internal,
6. backend menerbitkan access token + refresh token aplikasi.

Kelebihan:

- UX mobile terbaik,
- tidak bergantung pada WebView,
- callback lebih natural,
- separation of concern lebih bersih.

Kekurangan:

- integrasi mobile lebih banyak,
- perlu konfigurasi platform Android/iOS dengan benar.

#### Opsi B - OAuth Authorization Code + PKCE via system browser

Alur:

1. mobile memulai auth request dengan PKCE,
2. user login di system browser,
3. callback kembali ke app scheme,
4. code verifier dipakai untuk token exchange,
5. backend atau client menyelesaikan verifikasi sesuai desain,
6. backend menerbitkan token aplikasi.

Kelebihan:

- sangat sesuai standar OAuth untuk public client,
- lebih aman daripada WebView-based OAuth.

Kekurangan:

- implementasi lebih kompleks,
- perlu pengelolaan deep link dan PKCE state dengan teliti.

### 11.4 Rekomendasi utama untuk proyek ini

Rekomendasi utama: gunakan native Google Sign-In atau OAuth PKCE untuk mobile, lalu backend Express melakukan verification dan token issuance.

Jangan menjadikan `GET /api/auth/google` + callback web sebagai mekanisme utama mobile.

### 11.5 Pemetaan user provider ke user internal

Backend sebaiknya menjadikan email provider yang telah diverifikasi sebagai kunci pencarian awal user, lalu menyimpan relasi account provider pada database.

Prinsip yang direkomendasikan:

- satu user internal bisa punya banyak auth method,
- provider identity disimpan terpisah dari access token aplikasi,
- bila email yang sama sudah ada pada user credentials, Google login harus di-link ke user yang sama secara aman,
- bila akun baru, backend boleh membuat user baru dengan status yang jelas.

### 11.6 Hubungan dengan fitur Google Calendar

Karena backend saat ini juga menyimpan token akun Google untuk calendar, mobile Google login harus dirancang hati-hati.

Pisahkan dua concern berikut:

- login aplikasi,
- izin Google Calendar.

User bisa saja login Google untuk identitas, tetapi belum tentu perlu memberi scope calendar sejak awal. Jika scope terlalu besar di tahap login, friction meningkat.

Rekomendasi:

- login dasar gunakan scope identitas minimum,
- minta scope calendar saat user benar-benar menghubungkan fitur kalender.

## 12. Penjelasan CORS dalam Konteks Mobile

### 12.1 Konsep dasar

CORS adalah pembatasan browser terhadap request lintas origin. Ini terutama relevan untuk aplikasi web yang berjalan di browser.

### 12.2 Apakah CORS berlaku pada mobile native?

Untuk request HTTP langsung dari aplikasi React Native/native layer ke backend, CORS umumnya bukan isu utama seperti di browser.

Artinya:

- mobile native yang memanggil API dengan fetch/axios tidak dibatasi model CORS browser biasa,
- backend tetap harus aman, tetapi tidak perlu mengandalkan CORS sebagai kontrol utama untuk native app.

### 12.3 Kapan CORS tetap relevan untuk mobile?

CORS tetap relevan jika mobile memakai:

- WebView,
- embedded browser,
- system browser flow yang kembali ke halaman web,
- auth flow yang memuat challenge web seperti Turnstile,
- halaman callback yang berjalan di domain web.

Karena proyek saat ini memakai WebView auth pada mobile, maka CORS masih relevan pada implementasi sekarang.

### 12.4 Implikasi untuk backend proyek ini

Backend tetap perlu CORS untuk:

- Next.js web app,
- halaman auth web,
- browser callback flow,
- pengembangan lokal multi-origin.

Tetapi ketika mobile berpindah ke auth native murni:

- CORS tidak lagi menjadi concern utama pada direct API call mobile,
- fokus keamanan bergeser ke token security, rate limiting, transport security, dan provider verification.

### 12.5 Rekomendasi konfigurasi

Rekomendasi:

- pertahankan allowlist origin untuk web,
- jangan mengandalkan origin `exp://` sebagai kontrol keamanan utama,
- anggap request native sebagai authenticated by token, bukan by origin,
- pisahkan logika keamanan native dari konfigurasi CORS.

## 13. Security Considerations untuk Login Mobile

### 13.1 Penyimpanan token

Rekomendasi utama:

- gunakan secure storage untuk access token dan refresh token,
- hindari menyimpan refresh token di AsyncStorage untuk production,
- jangan pernah menaruh token di URL query pada flow final kecuali untuk jembatan sementara yang sangat terkontrol.

### 13.2 Refresh token rotation

Setiap refresh sukses sebaiknya:

- menerbitkan refresh token baru,
- membatalkan refresh token lama,
- memperbarui metadata session device.

Ini mengurangi dampak kebocoran refresh token.

### 13.3 Revocation

Backend sebaiknya mendukung:

- logout current device,
- logout all devices,
- revoke session saat password diganti,
- revoke session saat anomali keamanan terdeteksi.

### 13.4 Device binding

Device binding opsional tetapi berguna jika aplikasi membutuhkan kontrol lebih kuat.

Implementasi minimal:

- `deviceId`,
- `platform`,
- `appVersion`,
- `lastSeenAt`.

Jangan menganggap device binding sebagai pengganti auth yang benar, tetapi gunakan untuk audit dan risk scoring.

### 13.5 Proteksi brute force dan abuse

Wajib ada:

- rate limiting per IP,
- rate limiting per email atau account target,
- cooldown untuk login gagal berulang,
- logging percobaan login gagal,
- challenge bertahap bila pola abuse terdeteksi.

### 13.6 Audit logging

Peristiwa yang perlu dicatat:

- login sukses,
- login gagal,
- refresh token dipakai,
- refresh token ditolak,
- revoke/logout,
- provider login/linking,
- kegagalan verifikasi provider.

### 13.7 Fallback strategy jika auth provider gagal

Jika Google provider gagal:

- user tetap bisa login dengan email/password bila akun terhubung,
- tampilkan error yang spesifik, bukan generic,
- jangan membuat user stuck dalam setengah session,
- sediakan retry yang aman.

### 13.8 Risiko token via WebView bridge

Flow mobile sekarang memiliki risiko berikut:

- token berpindah melalui localStorage web,
- token dibaca lewat injected JavaScript,
- callback dan storage bergantung pada perilaku halaman web,
- perubahan kecil di halaman sign in Next.js bisa memutus login mobile.

Karena itu WebView bridge sebaiknya dianggap solusi transisi.

## 14. Opsi Arsitektur yang Mungkin

### 14.1 Opsi 1 - Pertahankan WebView login sebagai utama

Karakteristik:

- mobile membuka halaman login Next.js,
- token diambil dari localStorage web,
- Google login mengikuti web flow.

Kelebihan:

- implementasi cepat,
- reuse UI web maksimal,
- sedikit perubahan backend jangka pendek.

Kekurangan:

- coupling tinggi ke Next.js,
- UX native kurang baik,
- rentan break karena perubahan halaman web,
- security dan session management kurang ideal,
- CAPTCHA dan Google login tetap problematik untuk mobile.

### 14.2 Opsi 2 - Credentials native, Google masih web bridge

Karakteristik:

- email/password mobile native langsung ke backend,
- Google login mobile sementara masih browser/web bridge,
- backend mulai menambah refresh token.

Kelebihan:

- migrasi bertahap,
- memperbaiki login utama lebih dulu,
- risiko implementasi lebih rendah.

Kekurangan:

- arsitektur campuran tetap ada,
- Google login mobile belum bersih.

### 14.3 Opsi 3 - Full native mobile auth

Karakteristik:

- credentials native,
- Google native/PKCE,
- refresh token flow,
- deep link callback,
- backend client-aware.

Kelebihan:

- paling sehat secara arsitektur,
- UX terbaik,
- security lebih kuat,
- mudah diskalakan untuk client lain.

Kekurangan:

- effort implementasi lebih besar,
- perlu perubahan backend dan mobile bersama-sama.

### 14.4 Rekomendasi utama

Rekomendasi untuk proyek ini adalah Opsi 2 sebagai langkah transisi cepat, lalu bergerak ke Opsi 3 sebagai target final.

Alasannya:

- backend sudah siap menjadi issuer JWT utama,
- mobile sudah punya store auth dan service API sendiri,
- perubahan paling mendesak adalah menghapus ketergantungan login credentials terhadap WebView,
- Google login bisa dimigrasikan setelah kontrak backend mobile auth matang.

## 15. Rekomendasi Implementasi Konkret untuk Proyek Ini

### 15.1 Tahap 1 - Rapikan kontrak auth backend

Backend Express perlu diperbarui dengan perubahan berikut:

- tambahkan `clientType` opsional pada login/register,
- ubah validasi agar `captchaToken` tidak selalu mandatory untuk semua client,
- tambahkan endpoint `POST /api/auth/refresh`,
- tambahkan session/device table untuk refresh token,
- ubah `logout` agar bisa revoke refresh token/session.

### 15.2 Tahap 2 - Pisahkan login mobile credentials dari WebView

Mobile perlu menambahkan layar login native yang memanggil backend langsung untuk:

- email/password,
- error handling,
- simpan access token dan refresh token,
- hydrate session dari secure storage,
- auto refresh saat access token expired.

WebView bisa dipertahankan hanya sebagai fallback sementara untuk Google jika dibutuhkan.

### 15.3 Tahap 3 - Pisahkan flow Google web dan mobile

Backend perlu menyediakan endpoint khusus mobile, misalnya:

- `POST /api/auth/google/mobile`.

Endpoint ini menerima:

- ID token atau authorization result dari Google mobile flow,
- metadata client/device,
- lalu memetakan ke user internal dan menerbitkan token aplikasi.

Sementara `POST /api/auth/sync` tetap dipertahankan hanya untuk web NextAuth.

### 15.4 Tahap 4 - Tingkatkan keamanan token

Implementasi yang perlu ditambahkan:

- refresh token rotation,
- revoke session per device,
- audit log login,
- rate limiting login/register/refresh,
- forced re-auth untuk anomali tertentu.

### 15.5 Tahap 5 - Rapikan environment config

Pisahkan env config per app dengan jelas:

- mobile: API base URL, deep link scheme, public provider config,
- Next.js: web URL, NextAuth URL, public API URL, Turnstile site key,
- backend: API host, frontend URL, JWT secret, refresh token secret, provider secrets, CAPTCHA secret.

### 15.6 Tahap 6 - Ubah posisi CAPTCHA

Backend perlu mengubah CAPTCHA dari mandatory static rule menjadi adaptive rule.

Implementasi minimal yang realistis:

- web tetap wajib CAPTCHA,
- mobile credentials tidak wajib CAPTCHA pada kondisi normal,
- backend dapat mengembalikan `CAPTCHA_REQUIRED` untuk request berisiko.

## 16. Kesimpulan

Login mobile pada proyek ini saat ini sudah berfungsi, tetapi masih bergantung kuat pada flow web Next.js melalui WebView. Pendekatan tersebut cukup untuk transisi, tetapi belum ideal untuk arsitektur mobile production-grade.

Arah arsitektur yang paling tepat adalah menjadikan backend Express sebagai auth authority lintas client dengan strategi yang berbeda untuk web dan mobile, tetapi dengan hasil akhir token aplikasi yang konsisten. Web tetap boleh memakai NextAuth untuk Google login, sedangkan mobile sebaiknya memakai flow native sendiri dan menerima token aplikasi langsung dari backend.

Rekomendasi utama untuk proyek ini adalah:

- pertahankan backend Express sebagai issuer token utama,
- pindahkan login email/password mobile ke flow native langsung ke backend,
- tambahkan refresh token + revocation + device session,
- pisahkan Google login mobile dari flow sync NextAuth web,
- ubah CAPTCHA menjadi conditional/risk-based,
- gunakan secure storage dan HTTPS penuh pada production.

Dengan langkah tersebut, dokumentasi, arsitektur, dan implementasi login mobile akan jauh lebih sinkron dengan kebutuhan aplikasi native sekaligus tetap kompatibel dengan ekosistem Next.js dan backend Express yang sudah ada.