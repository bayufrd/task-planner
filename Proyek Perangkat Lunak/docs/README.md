# Documentation Guide

## 1. Tujuan Folder Docs

Folder [`docs`](./README.md) adalah pusat dokumentasi teknis dan operasional untuk proyek Smart Task Planner. Struktur dokumen di dalamnya disusun agar pembaca bisa bergerak dari level paling umum menuju level implementasi yang lebih spesifik, tanpa harus langsung membaca source code.

Secara garis besar, isi folder ini mencakup:

- dokumentasi arsitektur aplikasi,
- panduan setup dan deployment,
- catatan integrasi sistem,
- dokumen desain UI/UX,
- planning dan status project,
- laporan formal proyek,
- koleksi request API untuk pengujian dan integrasi.

README ini berfungsi sebagai payung utama yang menjelaskan hubungan antar dokumen, arah baca yang disarankan, serta pengelompokan dokumen berdasarkan domain.

## 2. Arah Baca yang Disarankan

Urutan baca paling disarankan untuk developer baru:

1. mulai dari [`README.md`](./README.md),
2. lanjut ke dokumentasi backend di [`APP-express.md`](./APP-express.md),
3. lanjut ke dokumentasi frontend di [`APP-nextjs.md`](./APP-nextjs.md),
4. gunakan koleksi Postman di [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json) untuk menguji kontrak API,
5. masuk ke dokumen setup, integrasi, atau modul spesifik sesuai kebutuhan.

Urutan ini membantu pembaca memahami:

- arsitektur sistem secara umum,
- peran backend Express,
- peran frontend Next.js,
- kontrak integrasi API yang menghubungkan keduanya.

## 3. Hubungan Dokumen Inti

### 3.1 Dokumen aplikasi backend

Dokumen [`APP-express.md`](./APP-express.md) adalah referensi teknis utama untuk backend Express. Fokusnya mencakup:

- arsitektur backend,
- struktur modul,
- routing dan endpoint,
- environment backend,
- database dan Prisma,
- scheduler, AI, reminder, calendar, dan WhatsApp internal.

Dokumen ini menjadi sumber utama untuk memahami service layer dan kontrak API sisi server.

### 3.2 Dokumen aplikasi frontend

Dokumen [`APP-nextjs.md`](./APP-nextjs.md) adalah referensi teknis utama untuk aplikasi Next.js. Fokusnya mencakup:

- arsitektur App Router,
- route publik dan protected,
- layout dan komponen inti,
- auth hybrid NextAuth + JWT backend,
- state management Zustand,
- fetch data ke backend,
- form handling, styling, hooks, reusable components,
- alur user untuk fitur utama.

Dokumen ini menjadi sumber utama untuk memahami bagaimana aplikasi frontend dikonstruksi dan bagaimana ia mengonsumsi backend.

### 3.3 Koleksi Postman integrasi frontend

File [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json) adalah koleksi Postman untuk konsumsi API yang relevan terhadap frontend Next.js. Koleksi ini diturunkan dari spesifikasi swagger backend di [`backend/src/config/swagger.ts`](../backend/src/config/swagger.ts:1), lalu dipetakan ulang berdasarkan konteks pemakaian di frontend.

Isi koleksi dikelompokkan per modul, seperti:

- auth,
- tasks,
- AI,
- reminders,
- calendars,
- WhatsApp internal,
- system health.

Koleksi ini melengkapi dua dokumen aplikasi di atas:

- [`APP-express.md`](./APP-express.md) menjelaskan endpoint dari sisi backend,
- [`APP-nextjs.md`](./APP-nextjs.md) menjelaskan pemakaian endpoint dari sisi frontend,
- [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json) menyediakan alat uji praktis untuk menjalankan request-request tersebut.

## 4. Peta Dokumentasi per Kelompok

## 4.1 Arsitektur dan aplikasi

Dokumen yang menjelaskan struktur dan implementasi aplikasi utama:

- [`APP-express.md`](./APP-express.md) — referensi teknis backend Express,
- [`APP-nextjs.md`](./APP-nextjs.md) — referensi teknis frontend Next.js,
- [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json) — koleksi request API untuk integrasi frontend/backend.

Tag konseptual:

- `architecture`
- `backend`
- `frontend`
- `api-contract`
- `integration`

## 4.2 Setup dan deployment

Dokumen yang membantu menyiapkan environment dan deployment:

- [`setup/QUICKSTART.md`](./setup/QUICKSTART.md),
- [`setup/DEPLOYMENT.md`](./setup/DEPLOYMENT.md),
- [`setup/SETUP_DATABASE.md`](./setup/SETUP_DATABASE.md),
- [`setup/DATABASE_SUMMARY.md`](./setup/DATABASE_SUMMARY.md),
- [`setup/commands.sh`](./setup/commands.sh).

Tag konseptual:

- `setup`
- `deployment`
- `database`
- `operations`

## 4.3 Integrasi eksternal dan lintas sistem

Dokumen untuk area integrasi dan penyesuaian sistem:

- [`integrations/GOOGLE_CALENDAR_FIXED.md`](./integrations/GOOGLE_CALENDAR_FIXED.md),
- [`integrations/GOOGLE_CALENDAR_SYNC_FIX.md`](./integrations/GOOGLE_CALENDAR_SYNC_FIX.md),
- [`integrations/migration-java-to-express.md`](./integrations/migration-java-to-express.md),
- [`integrations/adjustment-pbd-tubes.md`](./integrations/adjustment-pbd-tubes.md),
- [`integrations/api-external/WHATSAPP_INBOUND.md`](./integrations/api-external/WHATSAPP_INBOUND.md).

Tag konseptual:

- `calendar`
- `whatsapp`
- `migration`
- `external-api`
- `cross-system`

## 4.4 Desain dan UI/UX

Dokumen yang fokus pada desain produk dan eksplorasi UI:

- [`design/DETAILED_SCREEN_WIREFRAMES.md`](./design/DETAILED_SCREEN_WIREFRAMES.md),
- [`design/WIREFRAME_GAMMA_GUIDE.md`](./design/WIREFRAME_GAMMA_GUIDE.md),
- [`design/STITCH_UI_PROMPT.md`](./design/STITCH_UI_PROMPT.md),
- [`design/UI-image.md`](./design/UI-image.md).

Tag konseptual:

- `design`
- `wireframe`
- `ui`
- `ux`

## 4.5 Planning dan status proyek

Dokumen yang berguna untuk memahami progres dan arah pengembangan:

- [`planning/MVP_BRAINSTORMING.md`](./planning/MVP_BRAINSTORMING.md),
- [`planning/CUSTOMER_JOURNEY_MAPS.md`](./planning/CUSTOMER_JOURNEY_MAPS.md),
- [`project/PROJECT_STATUS.md`](./project/PROJECT_STATUS.md),
- [`project/FINAL_SUMMARY.md`](./project/FINAL_SUMMARY.md),
- [`project/COMPLETION_SUMMARY.md`](./project/COMPLETION_SUMMARY.md),
- [`project/INDEX.md`](./project/INDEX.md).

Tag konseptual:

- `planning`
- `status`
- `summary`
- `roadmap`

## 4.6 Laporan dan artefak formal

Dokumen yang lebih dekat ke kebutuhan akademik atau pelaporan formal:

- [`reports/Laporan_MK_Project_Based_Learning_Smart_Task_Planner.md`](./reports/Laporan_MK_Project_Based_Learning_Smart_Task_Planner.md),
- [`reports/Progress_Dokumentasi_SKPL.md`](./reports/Progress_Dokumentasi_SKPL.md),
- dokumen PDF pada folder [`reports`](./reports).

Tag konseptual:

- `report`
- `academic`
- `formal-document`

## 5. Mapping Hubungan Backend, Frontend, dan Postman

Hubungan tiga dokumen inti dapat dibaca sebagai berikut:

- [`APP-express.md`](./APP-express.md) menjelaskan bagaimana backend dibangun, endpoint apa yang tersedia, dan perilaku service/backend modules.
- [`APP-nextjs.md`](./APP-nextjs.md) menjelaskan route, komponen, state, dan flow frontend yang memanggil endpoint-endpoint tersebut.
- [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json) menyediakan representasi executable dari request-request yang dipakai atau relevan terhadap frontend.

Dengan kata lain:

- backend document = perspektif provider API,
- frontend document = perspektif consumer API,
- Postman collection = perspektif verifikasi dan eksplorasi integrasi.

Ketiganya sengaja diselaraskan pada istilah modul yang sama:

- `Auth`,
- `Tasks`,
- `AI`,
- `Reminders`,
- `Calendars`,
- `WhatsApp`,
- `System`.

## 6. Pengelompokan Modul untuk Pembaca

Bila pembaca ingin langsung masuk ke domain tertentu, gunakan pengelompokan berikut:

- `Auth` → baca [`APP-nextjs.md`](./APP-nextjs.md), [`APP-express.md`](./APP-express.md), lalu uji folder Auth pada [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json).
- `Tasks` → baca bagian dashboard dan task management pada [`APP-nextjs.md`](./APP-nextjs.md), bagian tasks pada [`APP-express.md`](./APP-express.md), lalu jalankan request Tasks pada koleksi Postman.
- `AI` → baca bagian command/overview di [`APP-nextjs.md`](./APP-nextjs.md), bagian AI di [`APP-express.md`](./APP-express.md), lalu uji endpoint AI pada koleksi Postman.
- `Calendars` → baca dokumen integrasi kalender pada folder [`integrations`](./integrations), cocokkan dengan bagian calendar di [`APP-express.md`](./APP-express.md) dan catatan frontend di [`APP-nextjs.md`](./APP-nextjs.md).
- `WhatsApp` → baca [`integrations/api-external/WHATSAPP_INBOUND.md`](./integrations/api-external/WHATSAPP_INBOUND.md), lalu lihat konteks fitur protected pada [`APP-nextjs.md`](./APP-nextjs.md).

## 7. Quick Navigation

### Untuk memahami sistem secara cepat

- [`APP-express.md`](./APP-express.md)
- [`APP-nextjs.md`](./APP-nextjs.md)
- [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json)

### Untuk setup dan operasional

- [`setup/QUICKSTART.md`](./setup/QUICKSTART.md)
- [`setup/DEPLOYMENT.md`](./setup/DEPLOYMENT.md)
- [`setup/SETUP_DATABASE.md`](./setup/SETUP_DATABASE.md)

### Untuk desain produk

- [`design/DETAILED_SCREEN_WIREFRAMES.md`](./design/DETAILED_SCREEN_WIREFRAMES.md)
- [`design/WIREFRAME_GAMMA_GUIDE.md`](./design/WIREFRAME_GAMMA_GUIDE.md)
- [`design/STITCH_UI_PROMPT.md`](./design/STITCH_UI_PROMPT.md)

### Untuk status dan indeks proyek

- [`project/PROJECT_STATUS.md`](./project/PROJECT_STATUS.md)
- [`project/FINAL_SUMMARY.md`](./project/FINAL_SUMMARY.md)
- [`project/INDEX.md`](./project/INDEX.md)

## 8. Kesimpulan

Folder [`docs`](./README.md) sekarang memiliki tiga referensi inti yang saling melengkapi:

- [`APP-express.md`](./APP-express.md) untuk backend,
- [`APP-nextjs.md`](./APP-nextjs.md) untuk frontend,
- [`APP-nextjs.postman_collection.json`](./APP-nextjs.postman_collection.json) untuk uji dan eksplorasi API.

README ini dimaksudkan sebagai gerbang dokumentasi tingkat tinggi agar pembaca dapat memahami gambaran besar terlebih dahulu, lalu mempersempit fokus ke modul, route, atau integrasi yang dibutuhkan.