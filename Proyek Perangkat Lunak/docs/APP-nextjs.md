# Dokumentasi Frontend Next.js — Smart Task Planner

## 1. Ringkasan

Frontend pada proyek ini adalah aplikasi web berbasis [`Next.js`](../package.json) dan [`TypeScript`](../package.json) yang berada langsung di folder [`Proyek Perangkat Lunak`](../README.md), dengan source utama pada folder [`src`](../src). Aplikasi ini berperan sebagai antarmuka utama pengguna untuk:

- landing page dan onboarding,
- autentikasi email/password dan Google OAuth,
- dashboard task harian,
- overview produktivitas dan analisis AI,
- koneksi ke WhatsApp internal,
- sinkronisasi identitas user dari session NextAuth ke backend Express.

Berbeda dengan dokumentasi backend pada [`APP-express.md`](./APP-express.md), dokumen ini fokus tegas pada lapisan frontend Next.js. Folder [`backend`](../backend) hanya dibahas saat diperlukan untuk menjelaskan integrasi API, kontrak data, dan alur autentikasi lintas aplikasi.

Secara arsitektural, frontend ini memakai:

- App Router Next.js di [`src/app`](../src/app),
- provider composition global di [`src/app/providers.tsx`](../src/app/providers.tsx:1),
- route grouping publik/protected di [`src/app/(public)`](../src/app/(public)) dan [`src/app/(protected)`](../src/app/(protected)),
- middleware autentikasi di [`src/middleware.ts`](../src/middleware.ts:1),
- state client berbasis Zustand di [`src/lib/utils/store.ts`](../src/lib/utils/store.ts:1),
- integrasi auth hybrid antara [`next-auth`](../package.json:17) dan JWT backend Express.

## 2. Identitas dan Tujuan Aplikasi

Dari struktur route dan implementasi komponen, tujuan frontend ini adalah menyediakan pengalaman task planning modern yang menekankan:

- pembuatan task cepat,
- prioritas kerja yang mudah dipahami,
- visualisasi task berdasarkan waktu,
- analisis produktivitas dengan AI,
- login fleksibel via Google maupun email/password,
- pengalaman UI yang kaya visual namun tetap mobile-friendly.

Arah produk ini terlihat dari:

- landing page marketing di [`src/app/(public)/page.tsx`](../src/app/(public)/page.tsx:37),
- dashboard operasional task di [`src/app/(protected)/dashboard/page.tsx`](../src/app/(protected)/dashboard/page.tsx:23),
- overview insight di [`src/app/(protected)/overview/page.tsx`](../src/app/(protected)/overview/page.tsx:37),
- command palette dan AI parsing task di [`src/components/command/CommandPalette.tsx`](../src/components/command/CommandPalette.tsx:1).

## 3. Stack Teknologi Frontend

## 3.1 Runtime dan Framework

Stack utama frontend:

- [`next`](../package.json:16) sebagai framework React,
- [`react`](../package.json:20) dan [`react-dom`](../package.json:21),
- [`typescript`](../package.json:31) sebagai bahasa utama,
- App Router melalui folder [`src/app`](../src/app).

## 3.2 Styling dan UI

Dependency UI utama:

- [`tailwindcss`](../package.json:30) untuk utility-first styling,
- [`lucide-react`](../package.json:15) untuk iconography,
- [`notistack`](../package.json:18) untuk snackbar/notification,
- [`recharts`](../package.json:22) untuk grafik analytics,
- [`@ark-ui/react`](../package.json:10) dan [`@emotion/react`](../package.json:11) / [`@emotion/styled`](../package.json:12) sebagai fondasi UI tambahan.

Strategi styling utama tetap bertumpu pada Tailwind utility classes langsung di komponen.

## 3.3 State, Auth, dan Data

Dependency fungsional utama:

- [`zustand`](../package.json:32) untuk client state task,
- [`next-auth`](../package.json:17) untuk Google OAuth,
- [`@next-auth/prisma-adapter`](../package.json:13) untuk adapter session/account,
- [`@prisma/client`](../package.json:14) karena frontend juga membaca Prisma adapter untuk NextAuth,
- [`date-fns`](../package.json:8) untuk formatting tanggal,
- [`googleapis`](../package.json:9) dan [`google-auth-library`](../package.json:7) untuk integrasi Google.

## 4. Arsitektur Umum Frontend

## 4.1 Entry dan Composition Root

Root layout aplikasi ada di [`src/app/layout.tsx`](../src/app/layout.tsx:10). File ini:

- mendefinisikan metadata aplikasi,
- mengimpor global CSS dari [`src/app/globals.css`](../src/app/globals.css),
- membungkus seluruh tree dengan [`Providers`](../src/app/providers.tsx:10).

Composition provider global di [`src/app/providers.tsx`](../src/app/providers.tsx:10) berurutan sebagai berikut:

- [`SnackbarProvider`](../src/components/providers/SnackbarProvider.tsx:1),
- [`LanguageProvider`](../src/components/providers/LanguageProvider.tsx:1),
- [`ThemeProvider`](../src/components/providers/ThemeProvider.tsx:1),
- [`CommandPaletteProvider`](../src/components/providers/CommandPaletteProvider.tsx:1),
- [`AuthSessionProvider`](../src/components/providers/AuthSessionProvider.tsx:1).

Artinya state lintas halaman untuk notif, bahasa, tema, command palette, dan session auth dikelola di lapisan paling atas aplikasi.

## 4.2 Route Grouping

Frontend memanfaatkan route grouping App Router:

- route publik di [`src/app/(public)`](../src/app/(public)),
- route terlindungi di [`src/app/(protected)`](../src/app/(protected)),
- auth pages di [`src/app/auth`](../src/app/auth),
- API route NextAuth di [`src/app/api/auth/[...nextauth]/route.ts`](../src/app/api/auth/[...nextauth]/route.ts:1).

Pemisahan ini membuat boundary UX cukup jelas antara:

- halaman promosi/onboarding,
- halaman autentikasi,
- halaman aplikasi inti setelah login.

## 4.3 Middleware Auth

Middleware frontend berada di [`src/middleware.ts`](../src/middleware.ts:4). Mekanismenya:

1. membaca cookie `backendAuthToken`,
2. membaca token session NextAuth lewat [`getToken()`](../src/middleware.ts:6),
3. menganggap user authenticated bila salah satu token ada,
4. me-redirect user anonim ke halaman sign-in dengan `callbackUrl`.

Implikasi penting:

- frontend memakai model auth hybrid,
- route protected tidak hanya bergantung pada NextAuth,
- login email/password backend tetap kompatibel karena middleware juga menerima cookie JWT backend.

## 5. Struktur Folder Penting

Struktur yang paling relevan untuk frontend Next.js:

- [`src/app`](../src/app) — route, layout, dan page App Router,
- [`src/components`](../src/components) — komponen UI reusable dan feature component,
- [`src/lib/api`](../src/lib/api) — helper request, response normalization, validation,
- [`src/lib/auth`](../src/lib/auth) — konfigurasi NextAuth, cookies, sync auth,
- [`src/lib/constants`](../src/lib/constants) — konstanta API, route, icon,
- [`src/lib/hooks`](../src/lib/hooks) — custom hooks seperti notifikasi dan statistik task,
- [`src/lib/utils`](../src/lib/utils) — utilitas tanggal, i18n, prioritas, store,
- [`public`](../public) — aset gambar, video, logo, level illustration.

## 6. Pemetaan Route dan Modul

## 6.1 Route Publik

### `/`

Landing page utama ada di [`src/app/(public)/page.tsx`](../src/app/(public)/page.tsx:37).

Fungsi utamanya:

- memperkenalkan value proposition produk,
- menampilkan hero video multibahasa,
- mengarahkan user ke login Google,
- menjadi pintu masuk awal ke dashboard.

Jika session NextAuth sudah aktif, user diarahkan ke dashboard melalui redirect di [`LandingPage`](../src/app/(public)/page.tsx:44).

### Public layout

Layout publik ada di [`src/app/(public)/layout.tsx`](../src/app/(public)/layout.tsx:9). Layout ini menyediakan:

- header sederhana,
- tombol membuka command palette,
- CTA menuju sign in,
- logo dan identitas brand.

Catatan teknis penting: file ini memakai hook client seperti [`useTheme()`](../src/app/(public)/layout.tsx:14) dan [`useCommandPalette()`](../src/app/(public)/layout.tsx:15), sehingga secara arsitektur layout ini seharusnya diperlakukan sebagai client component.

## 6.2 Route Autentikasi

### `/auth/signin`

Implementasi ada di [`src/app/auth/signin/page.tsx`](../src/app/auth/signin/page.tsx:13).

Fitur utama:

- login email/password ke backend Express melalui [`fetch()`](../src/app/auth/signin/page.tsx:102),
- login Google via [`signIn()`](../src/app/auth/signin/page.tsx:42),
- Cloudflare Turnstile widget via [`TurnstileWidget`](../src/components/captcha/TurnstileWidget.tsx:1),
- validasi form sisi client,
- penyimpanan token backend ke cookie dan localStorage.

Alur login email/password:

1. validasi field email dan password di [`validateForm()`](../src/app/auth/signin/page.tsx:65),
2. POST ke `/api/auth/login`,
3. simpan token ke cookie melalui [`setAuthCookie()`](../src/lib/auth/cookies.ts:5),
4. simpan token ke localStorage `auth-token`,
5. simpan user fallback ke localStorage `backendUser`,
6. redirect ke `callbackUrl`.

### `/auth/signup`

Implementasi ada di [`src/app/auth/signup/page.tsx`](../src/app/auth/signup/page.tsx:13).

Fitur utama:

- registrasi user baru ke backend Express melalui [`fetch()`](../src/app/auth/signup/page.tsx:111),
- validasi nama, email, password, confirm password,
- Turnstile CAPTCHA,
- alternatif masuk via Google OAuth.

Alurnya:

1. validasi client-side di [`validateForm()`](../src/app/auth/signup/page.tsx:67),
2. POST ke `/api/auth/register`,
3. bila sukses redirect ke sign in dengan flag `registered=true`.

### `/auth/callback`

Implementasi ada di [`src/app/auth/callback/page.tsx`](../src/app/auth/callback/page.tsx:7).

Halaman ini bertugas:

- membaca query `token`,
- menyimpan token ke localStorage `auth-token`,
- me-redirect user ke dashboard.

Route ini tampak menjadi fallback untuk skenario callback backend/OAuth tertentu di luar alur NextAuth standar.

## 6.3 Route Protected

### `/dashboard`

Implementasi ada di [`src/app/(protected)/dashboard/page.tsx`](../src/app/(protected)/dashboard/page.tsx:23).

Ini adalah layar kerja utama user. Tanggung jawabnya:

- memuat daftar task dari backend,
- memuat statistik task,
- menampilkan timeline kalender,
- menampilkan task terurut berdasarkan prioritas,
- membuka modal pembuatan task baru,
- merespons event `tasks:changed` untuk sinkronisasi ulang data.

Integrasi utamanya:

- store task dari [`useTaskStore()`](../src/lib/utils/store.ts:42),
- API task stats dan list via endpoint di [`API_ROUTES`](../src/lib/constants/api.ts:8),
- modal task melalui [`TaskModal`](../src/components/tasks/TaskModal.tsx:1),
- timeline melalui [`CalendarTimeline`](../src/components/calendar/CalendarTimeline.tsx:1),
- visual task list melalui [`TaskPriorityList`](../src/components/tasks/TaskPriorityList.tsx:1).

Catatan integrasi penting: saat memetakan respons backend, halaman ini menormalisasi status backend `PENDING` menjadi status frontend `TODO` di [`loadTasks()`](../src/app/(protected)/dashboard/page.tsx:96). Ini menunjukkan ada lapisan adaptasi domain antara model backend dan model UI.

### `/overview`

Implementasi ada di [`src/app/(protected)/overview/page.tsx`](../src/app/(protected)/overview/page.tsx:37).

Halaman ini menggabungkan:

- statistik task total,
- daily stats 30 hari,
- weekly stats 12 minggu,
- AI overview analysis,
- chart visual dengan Recharts,
- sistem gamifikasi berbasis skor hewan produktivitas.

Data utamanya diperoleh dari helper:

- [`taskApi.getStats()`](../src/lib/api/client.ts:108),
- [`taskApi.getDailyStats()`](../src/lib/api/client.ts:113),
- [`taskApi.getWeeklyStats()`](../src/lib/api/client.ts:118),
- [`aiApi.analyzeOverview()`](../src/lib/api/client.ts:167).

### `/connectwhatsapp`

Implementasi ada di [`src/app/(protected)/connectwhatsapp/page.tsx`](../src/app/(protected)/connectwhatsapp/page.tsx:1).

Fitur ini berfungsi sebagai dokumentasi/UX flow penghubung akun ke WhatsApp internal. Fokus utamanya bukan public messaging client, melainkan menjelaskan bagaimana user mendaftarkan nomor dan memakai command `task` melalui kanal WhatsApp yang terintegrasi dengan sistem backend internal.

## 6.4 Protected layout

Route group terlindungi memakai layout di [`src/app/(protected)/layout.tsx`](../src/app/(protected)/layout.tsx:25).

Tanggung jawab layout ini besar, yaitu:

- memeriksa session dan token backend,
- menyinkronkan NextAuth session ke Express JWT bila perlu,
- menjaga redirect user anonim,
- merender header utama,
- menyediakan mobile bottom tab bar,
- menyediakan profile dropdown,
- mengelola logout,
- merender command palette global.

Dengan demikian, layout ini bertindak sebagai shell aplikasi untuk seluruh area setelah login.

## 7. Layout dan Komponen Utama

## 7.1 Shell dan Header

Komponen header utama ada di [`src/components/layout/Header.tsx`](../src/components/layout/Header.tsx:1). Header ini dipakai oleh protected layout dan bertanggung jawab atas:

- branding,
- akses command palette,
- toggle profile,
- toggle language,
- visual identitas user aktif.

## 7.2 Command Palette

Komponen command palette berada di [`src/components/command/CommandPalette.tsx`](../src/components/command/CommandPalette.tsx:1).

Perannya sangat sentral karena menjadi jalur cepat untuk:

- slash command seperti `/add`, `/list`, `/today`,
- kemungkinan natural language input,
- trigger workflow cepat tanpa harus navigasi manual.

Provider state-nya ada di [`src/components/providers/CommandPaletteProvider.tsx`](../src/components/providers/CommandPaletteProvider.tsx:1).

## 7.3 Manajemen Task

Komponen-komponen utama task:

- [`TaskPriorityList`](../src/components/tasks/TaskPriorityList.tsx:1) — daftar task yang sudah diurutkan,
- [`TaskCard`](../src/components/tasks/TaskCard.tsx:1) — representasi visual satu task,
- [`TaskModal`](../src/components/tasks/TaskModal.tsx:1) — modal create/edit task,
- [`NewTaskModal`](../src/components/tasks/NewTaskModal.tsx:1) dan [`EditTaskModal`](../src/components/tasks/EditTaskModal.tsx:1) — jejak pendekatan modal task yang lebih spesifik.

Komponen task card juga menampilkan informasi sinkronisasi backend lewat `backendId` seperti pada [`TaskCard`](../src/components/tasks/TaskCard.tsx:165).

## 7.4 Timeline dan Kalender

Visual task berbasis waktu berada di [`src/components/calendar/CalendarTimeline.tsx`](../src/components/calendar/CalendarTimeline.tsx:1).

Fungsinya:

- menampilkan tanggal hari ini,
- menghitung jumlah task aktif per hari,
- membuka daftar task berdasarkan tanggal terpilih,
- membantu user memahami distribusi task terhadap kalender.

## 7.5 Komponen UI Reusable

Komponen reusable lain yang penting:

- [`src/components/ui/CalendarPicker.tsx`](../src/components/ui/CalendarPicker.tsx),
- [`src/components/ui/TimeSlotPicker.tsx`](../src/components/ui/TimeSlotPicker.tsx),
- [`src/components/captcha/TurnstileWidget.tsx`](../src/components/captcha/TurnstileWidget.tsx),
- [`src/components/CollectionSlider.tsx`](../src/components/CollectionSlider.tsx).

## 8. State Management

## 8.1 Zustand Store

State client utama untuk task berada di [`src/lib/utils/store.ts`](../src/lib/utils/store.ts:42). Store ini menggunakan middleware:

- [`devtools`](../src/lib/utils/store.ts:43),
- [`persist`](../src/lib/utils/store.ts:44).

State yang disimpan mencakup:

- `tasks`,
- `filteredTasks`,
- `selectedDate`,
- `searchQuery`,
- `filterPriority`.

Action yang tersedia antara lain:

- [`addTask()`](../src/lib/utils/store.ts:52),
- [`updateTask()`](../src/lib/utils/store.ts:62),
- [`deleteTask()`](../src/lib/utils/store.ts:69),
- [`setTasks()`](../src/lib/utils/store.ts:74),
- getter task per tanggal dan statistik sederhana.

## 8.2 Catatan Model Data Frontend

Tipe `Task` di frontend memakai status:

- `TODO`,
- `IN_PROGRESS`,
- `DONE`,
- `SKIPPED`.

Definisi ini ada di [`Task`](../src/lib/utils/store.ts:4). Sementara backend operasional memakai `PENDING`, `DONE`, `SKIPPED` sebagaimana dijelaskan di [`APP-express.md`](./APP-express.md). Akibatnya frontend memerlukan normalisasi status saat membaca data backend.

Ini adalah salah satu detail arsitektur paling penting dalam integrasi frontend-backend saat ini.

## 9. Mekanisme Fetch Data dan Integrasi Backend

## 9.1 Basis URL API

Hampir seluruh komunikasi ke backend memakai environment [`NEXT_PUBLIC_API_URL`](../.env.example). Fallback default yang dipakai berulang adalah `http://localhost:8000`, terlihat misalnya di:

- [`src/lib/api/client.ts`](../src/lib/api/client.ts:109),
- [`src/lib/auth/sync.ts`](../src/lib/auth/sync.ts:6),
- [`src/app/auth/signin/page.tsx`](../src/app/auth/signin/page.tsx:99),
- [`src/app/auth/signup/page.tsx`](../src/app/auth/signup/page.tsx:111).

## 9.2 API Helper Layer

Helper request generik ada di [`apiRequest()`](../src/lib/api/client.ts:37). Fungsinya:

- membaca token auth dari localStorage atau cookie,
- menyuntikkan header `Authorization: Bearer ...`,
- memaksa `Content-Type: application/json`,
- menormalisasi hasil menjadi bentuk `{ success, data, error }`.

Di atas helper generik itu, tersedia helper domain:

- [`taskApi`](../src/lib/api/client.ts:107),
- [`aiApi`](../src/lib/api/client.ts:158).

## 9.3 Konstanta Endpoint

Mapping endpoint frontend ada di [`src/lib/constants/api.ts`](../src/lib/constants/api.ts:8). Modul ini mengelompokkan route untuk:

- auth,
- tasks,
- reminders,
- calendar,
- AI.

Catatan penting: bagian calendar pada konstanta frontend masih memakai prefix `/api/calendar` di [`API_ROUTES.CALENDAR`](../src/lib/constants/api.ts:39), sedangkan backend aktif memakai `/api/calendars` menurut [`APP-express.md`](./APP-express.md) dan [`swagger.ts`](../backend/src/config/swagger.ts:628). Ini adalah mismatch integrasi yang wajib dicatat oleh developer berikutnya.

## 9.4 Endpoints yang Dipakai atau Relevan

Dari frontend saat ini, endpoint yang paling jelas dipakai atau sangat relevan adalah:

- `POST /api/auth/register`,
- `POST /api/auth/login`,
- `POST /api/auth/sync`,
- `GET /api/tasks`,
- `GET /api/tasks/stats`,
- `GET /api/tasks/stats/daily`,
- `GET /api/tasks/stats/weekly`,
- `PATCH /api/tasks/:id/status`,
- `DELETE /api/tasks/:id`,
- `POST /api/ai/parse-task`,
- `POST /api/ai/overview-analysis`.

Endpoint lain seperti reminders, calendars, dan internal WhatsApp tetap relevan secara sistem walaupun tidak semuanya terlihat dipakai langsung oleh halaman yang sudah diinspeksi.

## 10. Authentication dan Authorization Flow

## 10.1 Model Auth Hybrid

Frontend ini tidak memakai satu sumber autentikasi tunggal. Ada dua jalur yang berjalan berdampingan:

- Google OAuth melalui NextAuth,
- email/password melalui backend Express.

Ini terlihat dari kombinasi:

- [`authOptions`](../src/lib/auth/index.ts:27),
- middleware auth di [`src/middleware.ts`](../src/middleware.ts:4),
- sync bridge di [`syncNextAuthToExpress()`](../src/lib/auth/sync.ts:16),
- cookie helper di [`src/lib/auth/cookies.ts`](../src/lib/auth/cookies.ts:5).

## 10.2 Jalur Google OAuth

Alurnya:

1. user klik Google sign in dari landing/signin/signup,
2. NextAuth menjalankan provider Google di [`GoogleProvider`](../src/lib/auth/index.ts:30),
3. session JWT NextAuth terbentuk,
4. protected layout mendeteksi session aktif namun belum ada token backend,
5. frontend memanggil [`/api/auth/sync`](../src/lib/auth/sync.ts:36),
6. backend mengembalikan JWT Express,
7. token backend disimpan ke localStorage dan cookie.

Keuntungan model ini: fitur frontend yang butuh backend REST tetap memakai JWT backend yang seragam, meskipun login awal berasal dari NextAuth.

## 10.3 Jalur Email/Password

Alurnya:

1. user submit form di [`/auth/signin`](../src/app/auth/signin/page.tsx:90),
2. backend mengembalikan token dan user data,
3. frontend menyimpan token di cookie `backendAuthToken` dan localStorage `auth-token`,
4. middleware mengizinkan akses protected routes,
5. halaman dashboard dan overview memakai token yang sama untuk request API.

## 10.4 Logout

Logout dilakukan di protected layout pada handler tombol logout di [`src/app/(protected)/layout.tsx`](../src/app/(protected)/layout.tsx:270). Aksi yang dilakukan:

- hapus cookie backend,
- hapus localStorage `auth-token`,
- hapus localStorage `backendUser`,
- panggil [`signOut()`](../src/app/(protected)/layout.tsx:276) dari NextAuth.

## 10.5 Authorization

Authorization di frontend bersifat ringan dan berbasis route protection. Enforcement utama tetap terjadi di backend melalui Bearer token. Frontend bertugas:

- mencegah akses route protected tanpa auth,
- mengirim token pada request API,
- menampilkan fallback loading/redirect saat session belum pasti.

## 11. Form Handling, Validasi, dan Error Handling

## 11.1 Form Handling

Form penting di frontend saat ini:

- sign in form di [`src/app/auth/signin/page.tsx`](../src/app/auth/signin/page.tsx:223),
- sign up form di [`src/app/auth/signup/page.tsx`](../src/app/auth/signup/page.tsx:209),
- task create/edit form di [`src/components/tasks/TaskModal.tsx`](../src/components/tasks/TaskModal.tsx:1).

Pola yang dipakai cenderung manual dengan [`useState`](../src/app/auth/signin/page.tsx:16), bukan memakai form library seperti React Hook Form.

## 11.2 Validasi

Validasi yang teramati:

- validasi email regex di [`src/app/auth/signin/page.tsx`](../src/app/auth/signin/page.tsx:68) dan [`src/app/auth/signup/page.tsx`](../src/app/auth/signup/page.tsx:74),
- validasi panjang password minimal di [`src/app/auth/signup/page.tsx`](../src/app/auth/signup/page.tsx:80),
- validasi confirm password di [`src/app/auth/signup/page.tsx`](../src/app/auth/signup/page.tsx:86),
- validasi CAPTCHA token sebelum submit,
- validasi task input tambahan di [`src/lib/api/validation.ts`](../src/lib/api/validation.ts:1).

## 11.3 Error Handling

Pola error handling frontend bersifat pragmatis:

- request dibungkus `try/catch`,
- error backend ditampilkan melalui state `errors.submit`,
- API helper mengembalikan struktur `success/error`,
- sebagian error dicatat ke console,
- notifikasi sukses/gagal task dibantu hook [`useNotification()`](../src/lib/hooks/useNotification.ts:1).

Pada overview page, error state ditampilkan sebagai layar retry di [`OverviewPage`](../src/app/(protected)/overview/page.tsx:160).

## 12. Styling, UX, dan Strategi UI

Strategi UI frontend ini cukup konsisten:

- layout penuh gradient dan glassmorphism ringan,
- penggunaan border semi-transparan,
- dark mode aktif di hampir semua halaman,
- aset hero visual dan video marketing dari folder [`public`](../public),
- icon semantik dari Lucide,
- panel card rounded besar dan CTA kontras.

Contoh implementasi visual kuat terlihat pada:

- landing page di [`src/app/(public)/page.tsx`](../src/app/(public)/page.tsx:117),
- auth pages di [`src/app/auth/signin/page.tsx`](../src/app/auth/signin/page.tsx:148),
- dashboard stats bar di [`src/app/(protected)/dashboard/page.tsx`](../src/app/(protected)/dashboard/page.tsx:201),
- overview AI score panel di [`src/app/(protected)/overview/page.tsx`](../src/app/(protected)/overview/page.tsx:236).

## 13. Hooks, Utilities, dan Reuse Layer

Utility dan hook penting:

- [`useNotification()`](../src/lib/hooks/useNotification.ts:1) — wrapper notifikasi/snackbar,
- [`useTaskStats()`](../src/lib/hooks/useTaskStats.ts:1) — statistik task berbasis store,
- [`src/lib/utils/date.ts`](../src/lib/utils/date.ts) — helper tanggal,
- [`src/lib/utils/i18n.ts`](../src/lib/utils/i18n.ts) — dictionary/translation utilities,
- [`src/lib/utils/task.ts`](../src/lib/utils/task.ts) — helper task,
- [`src/lib/utils/ui.ts`](../src/lib/utils/ui.ts) — helper UI,
- [`src/lib/api/helpers.ts`](../src/lib/api/helpers.ts) dan [`src/lib/api/responses.ts`](../src/lib/api/responses.ts) — utilitas response API.

Lapisan ini penting karena memisahkan logika presentasi dari helper integrasi dan state.

## 14. Environment Variables

Environment frontend yang teridentifikasi dari kode:

- [`NEXT_PUBLIC_API_URL`](../src/lib/api/client.ts:109) — base URL backend Express,
- [`NEXT_PUBLIC_TURNSTILE_SITE_KEY`](../src/app/auth/signin/page.tsx:25) — site key CAPTCHA,
- [`NEXTAUTH_SECRET`](../src/lib/auth/index.ts:119) — secret session NextAuth,
- [`GOOGLE_CLIENT_ID`](../src/lib/auth/index.ts:23),
- [`GOOGLE_CLIENT_SECRET`](../src/lib/auth/index.ts:23).

Implikasi teknis:

- tanpa `NEXT_PUBLIC_API_URL`, frontend fallback ke localhost backend,
- tanpa kredensial Google, NextAuth akan melempar error startup di [`authOptions`](../src/lib/auth/index.ts:23),
- tanpa Turnstile site key, flow submit form menjadi rentan terhadap perilaku disable button yang perlu diuji hati-hati.

## 15. Middleware, Session, dan Sinkronisasi Auth

Sinkronisasi antara auth frontend dan backend merupakan bagian arsitektur yang paling khas pada aplikasi ini.

Komponen yang terlibat:

- [`src/lib/auth/index.ts`](../src/lib/auth/index.ts:27) — konfigurasi NextAuth,
- [`src/lib/auth/sync.ts`](../src/lib/auth/sync.ts:16) — jembatan NextAuth ke JWT backend,
- [`src/lib/auth/cookies.ts`](../src/lib/auth/cookies.ts:5) — helper cookie backend,
- [`src/middleware.ts`](../src/middleware.ts:4) — gate route-level,
- [`src/app/(protected)/layout.tsx`](../src/app/(protected)/layout.tsx:56) — orchestrator sinkronisasi di sisi client.

Ini berarti frontend tidak sekadar menjadi consumer REST pasif; ia juga mengorkestrasi penyatuan dua sistem auth yang berbeda.

## 16. Modul/Folder Mapping per Fitur

## 16.1 Auth dan Session

- route: [`src/app/auth`](../src/app/auth)
- api route: [`src/app/api/auth/[...nextauth]/route.ts`](../src/app/api/auth/[...nextauth]/route.ts:1)
- config: [`src/lib/auth/index.ts`](../src/lib/auth/index.ts:27)
- bridge: [`src/lib/auth/sync.ts`](../src/lib/auth/sync.ts:16)
- cookies: [`src/lib/auth/cookies.ts`](../src/lib/auth/cookies.ts:5)

## 16.2 Task Management

- page: [`src/app/(protected)/dashboard/page.tsx`](../src/app/(protected)/dashboard/page.tsx:23)
- store: [`src/lib/utils/store.ts`](../src/lib/utils/store.ts:42)
- modal: [`src/components/tasks/TaskModal.tsx`](../src/components/tasks/TaskModal.tsx:1)
- list: [`src/components/tasks/TaskPriorityList.tsx`](../src/components/tasks/TaskPriorityList.tsx:1)
- card: [`src/components/tasks/TaskCard.tsx`](../src/components/tasks/TaskCard.tsx:1)

## 16.3 Overview dan Analytics

- page: [`src/app/(protected)/overview/page.tsx`](../src/app/(protected)/overview/page.tsx:37)
- api helper: [`taskApi`](../src/lib/api/client.ts:107)
- ai helper: [`aiApi`](../src/lib/api/client.ts:158)
- chart library: [`recharts`](../package.json:22)

## 16.4 Command dan AI-assisted UX

- provider: [`src/components/providers/CommandPaletteProvider.tsx`](../src/components/providers/CommandPaletteProvider.tsx:1)
- ui: [`src/components/command/CommandPalette.tsx`](../src/components/command/CommandPalette.tsx:1)
- backend endpoint relevan: `/api/ai/parse-task`

## 16.5 Calendar dan Time Awareness

- timeline: [`src/components/calendar/CalendarTimeline.tsx`](../src/components/calendar/CalendarTimeline.tsx:1)
- picker: [`src/components/ui/CalendarPicker.tsx`](../src/components/ui/CalendarPicker.tsx)
- backend endpoint relevan: `/api/calendars`, `/api/calendars/default`, `/api/calendars/sync`

## 16.6 WhatsApp Integration UX

- page: [`src/app/(protected)/connectwhatsapp/page.tsx`](../src/app/(protected)/connectwhatsapp/page.tsx:1)
- dokumentasi backend terkait: [`docs/integrations/api-external/WHATSAPP_INBOUND.md`](./integrations/api-external/WHATSAPP_INBOUND.md)

## 17. Alur User untuk Fitur Utama

## 17.1 User baru mendaftar

1. user membuka landing page [`/`](../src/app/(public)/page.tsx:37),
2. menuju [`/auth/signup`](../src/app/auth/signup/page.tsx:13),
3. isi nama, email, password, CAPTCHA,
4. frontend kirim ke `/api/auth/register`,
5. jika sukses user diarahkan ke sign in.

## 17.2 User login dengan email/password

1. user membuka [`/auth/signin`](../src/app/auth/signin/page.tsx:13),
2. submit kredensial,
3. frontend menerima JWT backend,
4. token disimpan ke cookie + localStorage,
5. user masuk ke shell protected dan dashboard memuat task.

## 17.3 User login dengan Google

1. user klik sign in with Google di landing/signin/signup,
2. NextAuth menyelesaikan flow OAuth,
3. protected layout mendeteksi session Google,
4. frontend memanggil `/api/auth/sync`,
5. backend mengembalikan JWT Express,
6. dashboard dan overview kini dapat memakai API backend yang sama dengan login biasa.

## 17.4 User membuat dan mengelola task

1. user masuk dashboard,
2. membuka [`TaskModal`](../src/components/tasks/TaskModal.tsx:1),
3. mengisi data task,
4. frontend mengirim create/update ke backend,
5. store Zustand diperbarui,
6. event `tasks:changed` memicu refresh list, stats, dan overview.

## 17.5 User melihat insight produktivitas

1. user membuka [`/overview`](../src/app/(protected)/overview/page.tsx:37),
2. frontend mengambil stats harian dan mingguan,
3. frontend meminta AI overview analysis,
4. skor AI divisualisasikan dalam panel produktivitas dan chart.

## 18. Dependency Penting untuk Developer

Dependency yang paling memengaruhi arsitektur frontend:

- [`next`](../package.json:16) — rendering dan routing,
- [`next-auth`](../package.json:17) — auth session,
- [`zustand`](../package.json:32) — state task lokal,
- [`tailwindcss`](../package.json:30) — styling,
- [`recharts`](../package.json:22) — analytics UI,
- [`notistack`](../package.json:18) — feedback UX,
- [`@prisma/client`](../package.json:14) + [`@next-auth/prisma-adapter`](../package.json:13) — penyimpanan account/session NextAuth.

## 19. Build dan Deploy Considerations

Hal yang perlu diperhatikan saat build/deploy frontend:

- build Next.js harus memiliki environment Google OAuth yang valid karena [`authOptions`](../src/lib/auth/index.ts:23) melempar error saat kredensial hilang,
- domain frontend harus sinkron dengan CORS backend sebagaimana dijelaskan di [`APP-express.md`](./APP-express.md),
- `NEXT_PUBLIC_API_URL` harus menunjuk backend Express yang benar,
- cookie `backendAuthToken` menggunakan `SameSite=Lax` di [`src/lib/auth/cookies.ts`](../src/lib/auth/cookies.ts:9), sehingga skenario domain/subdomain perlu diuji,
- mismatch endpoint calendar antara frontend dan backend harus dibereskan sebelum fitur calendar diandalkan penuh.

Script frontend tersedia di [`package.json`](../package.json), termasuk alur dev, build, start, lint, dan type checking.

## 20. Temuan Teknis Penting

Beberapa temuan yang sangat penting untuk developer lanjutan:

- frontend memakai model status task berbeda dari backend, sehingga adaptasi status harus dijaga konsisten,
- auth hybrid NextAuth + JWT backend adalah fondasi aplikasi dan tidak boleh diubah tanpa desain ulang menyeluruh,
- konstanta endpoint calendar di frontend masih berbeda dengan implementasi backend aktif,
- protected layout memegang terlalu banyak tanggung jawab sekaligus dan merupakan titik kritis untuk auth shell,
- penggunaan localStorage `auth-token` adalah dependency implisit di banyak halaman client.

## 21. Kesimpulan

Frontend Next.js pada proyek ini adalah aplikasi App Router yang cukup kaya fitur dan berperan sebagai shell utama pengalaman pengguna Smart Task Planner. Ia tidak hanya menampilkan UI, tetapi juga:

- mengorkestrasi dua sistem autentikasi,
- menormalisasi model data task dari backend,
- mengelola state lokal task dan event sinkronisasi,
- menyediakan jalur AI-assisted interaction,
- menyajikan dashboard produktivitas dan overview analitis.

Sebagai referensi teknis, dokumen ini sebaiknya dibaca bersama:

- [`APP-express.md`](./APP-express.md),
- koleksi Postman frontend/backend di [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json),
- indeks dokumentasi tingkat tinggi di [`README.md`](./README.md).
