# LAPORAN MATA KULIAH PROYEK PERANGKAT LUNAK

# METODE BERBASIS PROYEK

## Smart Task Planner

**AI-powered Universal Task Management System with Intelligent Priority Scheduling**

**Bayu Farid Mulyanto - 411251181**

PRODI TEKNIK INFORMATIKA  
FAKULTAS TEKNIK DAN INFORMATIKA  

Deployment: <https://taskplanner.dastrevas.com>

---

# DAFTAR ISI {#daftar-isi}

[**DAFTAR ISI**](#daftar-isi)

[**KATA PENGANTAR**](#kata-pengantar)

[**BAB I PROFIL MITRA**](#bab-i-profil-mitra)

[1. PROFIL ORGANISASI / PERUSAHAAN / INSTANSI](#profil-organisasi--perusahaan--instansi)

[2. STRUKTUR ORGANISASI / PERUSAHAAN / INSTANSI](#struktur-organisasi--perusahaan--instansi)

[3. LOKASI ORGANISASI / PERUSAHAAN / INSTANSI](#lokasi-organisasi--perusahaan--instansi)

[4. GOOGLE MAP LOKASI ORGANISASI / PERUSAHAAN / INSTANSI](#google-map-lokasi-organisasi--perusahaan--instansi)

[5. PIC MITRA](#pic-mitra)

[**BAB II TAHAPAN ANALISIS MASALAH**](#bab-ii-tahapan-analisis-masalah)

[1. TAHAPAN PENGUMPULAN DATA](#tahapan-pengumpulan-data)

[2. PERMASALAHAN MITRA](#permasalahan-mitra)

[3. SOLUSI YANG DITAWARKAN](#solusi-yang-ditawarkan)

[**BAB III. PELAKSANAAN PROYEK**](#bab-iii-pelaksanaan-proyek)

[1. PERSIAPAN AWAL](#persiapan-awal)

[2. PENGEMBANGAN DAN DESAIN](#pengembangan-dan-desain)

[3. IMPLEMENTASI](#implementasi)

[4. PENGUJIAN](#pengujian)

[5. UMPAN BALIK](#umpan-balik)

[**BAB IV. KESIMPULAN**](#bab-iv-kesimpulan)

[**LAMPIRAN**](#lampiran)

---

# KATA PENGANTAR {#kata-pengantar}

Puji syukur ke hadirat Tuhan Yang Maha Esa karena atas rahmat dan karunia-Nya laporan Mata Kuliah **proyek-perangkat-lunak** dengan metode berbasis proyek ini dapat disusun dengan baik. Laporan ini membahas proses analisis, perancangan, implementasi, dan evaluasi proyek aplikasi **Smart Task Planner**, yaitu sistem manajemen tugas berbasis web yang dilengkapi dengan penjadwalan prioritas cerdas.

Laporan ini disusun sebagai dokumentasi kegiatan proyek yang dilakukan oleh:

- **Nama**: Bayu Farid Mulyanto
- **NIM**: 411251181
- **Mata Kuliah**: proyek-perangkat-lunak
- **Nama Proyek**: Smart Task Planner
- **Deployment**: <https://taskplanner.dastrevas.com>

Smart Task Planner dikembangkan untuk membantu mahasiswa, pelajar, freelancer, dan profesional dalam mencatat, mengelola, memprioritaskan, dan menjadwalkan tugas secara lebih efektif. Aplikasi ini menggunakan pendekatan prioritas otomatis berbasis 4 faktor, yaitu urgensi, tingkat kepentingan, reminder, dan estimasi durasi pengerjaan.

Penulis menyadari bahwa laporan ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang membangun sangat diharapkan agar pengembangan aplikasi dan dokumentasi proyek dapat menjadi lebih baik. Semoga laporan ini dapat memberikan gambaran yang jelas mengenai proses pengembangan Smart Task Planner serta menjadi referensi dalam penerapan pembelajaran berbasis proyek pada mata kuliah proyek-perangkat-lunak.

---

# **BAB I PROFIL MITRA** {#bab-i-profil-mitra}

## 1. PROFIL ORGANISASI / PERUSAHAAN / INSTANSI {#profil-organisasi--perusahaan--instansi}

Pada proyek ini, mitra atau objek studi yang digunakan adalah kebutuhan pengguna umum yang membutuhkan sistem manajemen tugas cerdas. Karena proyek dikembangkan sebagai proyek akademik individu untuk mata kuliah **proyek-perangkat-lunak**, maka profil mitra disesuaikan sebagai profil pengguna sasaran dan lingkungan akademik proyek.

- **Nama Proyek**: Smart Task Planner
- **Jenis Proyek**: Aplikasi web fullstack berbasis task management
- **Kategori Pengguna Sasaran**:
  - Mahasiswa dan pelajar
  - Freelancer
  - Profesional
  - Pengguna umum dengan kebutuhan manajemen tugas harian
- **Visi Proyek**: Menjadi sistem pengelolaan tugas yang membantu pengguna menentukan prioritas pekerjaan secara cerdas dan terstruktur.
- **Misi Proyek**:
  1. Menyediakan fitur pencatatan dan pengelolaan tugas yang mudah digunakan.
  2. Menghadirkan algoritma prioritas otomatis untuk membantu pengguna menentukan urutan pengerjaan tugas.
  3. Menyediakan tampilan kalender/timeline agar pengguna memahami distribusi tugas.
  4. Mendukung workflow modern melalui command palette dan input natural language.
  5. Mengembangkan aplikasi menuju sistem fullstack dengan autentikasi, database, reminder, dan Google Calendar Sync.
- **Layanan atau Produk Utama**:
  - Task management
  - Auto-priority ranking
  - Calendar timeline
  - Command palette
  - Dark/light mode
  - LocalStorage persistence
  - API task management
  - Google OAuth dan Google Calendar integration

## 2. STRUKTUR ORGANISASI / PERUSAHAAN / INSTANSI {#struktur-organisasi--perusahaan--instansi}

Karena proyek ini merupakan proyek akademik individu, struktur organisasi proyek disusun berdasarkan peran pengembangan perangkat lunak.

| Peran | Penanggung Jawab | Tanggung Jawab |
|------|------------------|----------------|
| Project Owner | Bayu Farid Mulyanto | Menentukan ide, ruang lingkup, dan arah pengembangan aplikasi |
| System Analyst | Bayu Farid Mulyanto | Menganalisis kebutuhan pengguna, fitur, dan permasalahan |
| UI/UX Designer | Bayu Farid Mulyanto | Merancang pengalaman pengguna, layout dashboard, tema, dan navigasi |
| Frontend Developer | Bayu Farid Mulyanto | Mengembangkan antarmuka Next.js, React, TailwindCSS |
| Backend Developer | Bayu Farid Mulyanto | Mengembangkan API Routes, autentikasi, Prisma, dan integrasi backend |
| Database Designer | Bayu Farid Mulyanto | Merancang struktur data user, task, tag, reminder, dan calendar |
| Tester | Bayu Farid Mulyanto | Melakukan pengujian fungsional dan validasi fitur |

Diagram struktur proyek:

```text
@startuml
title Struktur Organisasi Proyek Smart Task Planner

start
:Project Owner;
note right
Bayu Farid Mulyanto
Menentukan arah proyek
end note

:System Analyst;
:UI/UX Designer;
:Frontend Developer;
:Backend Developer;
:Database Designer;
:Tester;

:Smart Task Planner siap dikembangkan dan dievaluasi;
stop
@enduml
```

## 3. LOKASI ORGANISASI / PERUSAHAAN / INSTANSI {#lokasi-organisasi--perusahaan--instansi}

Proyek dikembangkan dalam konteks akademik dan pengembangan perangkat lunak berbasis web. Lokasi pelaksanaan bersifat fleksibel karena pengembangan dilakukan secara digital menggunakan perangkat komputer/laptop, repository proyek, dokumentasi, dan deployment server.

- **Lokasi Pengembangan**: Lingkungan akademik dan mandiri.
- **Media Pengembangan**: Local development environment dan deployment production.
- **URL Deployment**: <https://taskplanner.dastrevas.com>
- **Repository**: <https://github.com/bayufrd/taskplanner>

## 4. GOOGLE MAP LOKASI ORGANISASI / PERUSAHAAN / INSTANSI {#google-map-lokasi-organisasi--perusahaan--instansi}

Karena proyek ini merupakan aplikasi web akademik dan tidak terikat pada lokasi fisik mitra tertentu, maka Google Maps lokasi organisasi tidak dicantumkan secara spesifik.

Sebagai pengganti identifikasi lokasi fisik, proyek dapat diakses secara online melalui:

<https://taskplanner.dastrevas.com>

## 5. PIC MITRA {#pic-mitra}

| Keterangan | Informasi |
|-----------|-----------|
| Nama | Bayu Farid Mulyanto |
| NIM | 411251181 |
| Posisi | Pengembang / Mahasiswa |
| Mata Kuliah | proyek-perangkat-lunak |
| Nama Proyek | Smart Task Planner |
| Email Kontak | bayu.farid36@gmail.com |
| Deployment | <https://taskplanner.dastrevas.com> |

---

# **BAB II TAHAPAN ANALISIS MASALAH** {#bab-ii-tahapan-analisis-masalah}

## 1. TAHAPAN PENGUMPULAN DATA {#tahapan-pengumpulan-data}

### 1.1 Observasi

#### Lingkup Observasi

Observasi dilakukan terhadap kebutuhan pengguna yang memiliki banyak tugas dan sering mengalami kesulitan dalam menentukan prioritas pekerjaan. Fokus observasi meliputi:

- Cara pengguna mencatat tugas.
- Cara pengguna menentukan deadline.
- Kesulitan pengguna dalam menentukan tugas mana yang harus dikerjakan lebih dahulu.
- Kebutuhan reminder atau pengingat.
- Kebutuhan visualisasi jadwal dalam bentuk kalender.
- Kebutuhan akses cepat melalui shortcut atau command input.

#### Lokasi Observasi

Observasi dilakukan secara konseptual pada lingkungan pengguna sasaran, yaitu mahasiswa, pelajar, freelancer, dan profesional yang menggunakan aplikasi digital untuk mengatur tugas harian.

#### Waktu Pelaksanaan Observasi

Observasi dilakukan selama tahap awal perencanaan proyek Smart Task Planner dan diperkuat melalui analisis kebutuhan pada dokumentasi proyek.

#### Hasil Observasi

Berdasarkan observasi kebutuhan, ditemukan beberapa pola masalah:

1. Pengguna sering mencatat tugas tetapi tidak memiliki sistem prioritas yang jelas.
2. Tugas dengan deadline dekat sering terlambat dikerjakan karena tidak tersusun berdasarkan urgensi.
3. Aplikasi to-do list sederhana sering hanya menyimpan daftar tugas tanpa memberi rekomendasi pengerjaan.
4. Pengguna membutuhkan filter berdasarkan tanggal, tag, dan prioritas.
5. Pengguna membutuhkan tampilan kalender/timeline untuk melihat distribusi tugas.
6. Pengguna modern membutuhkan interaksi cepat, misalnya melalui command palette.
7. Integrasi kalender eksternal seperti Google Calendar penting untuk sinkronisasi jadwal.

### 1.2 Wawancara

Wawancara disusun secara simulatif berdasarkan persona pengguna sasaran aplikasi.

#### Narasumber Wawancara

| No | Narasumber | Peran |
|----|------------|-------|
| 1 | Mahasiswa | Pengguna yang memiliki banyak tugas kuliah dan deadline |
| 2 | Freelancer | Pengguna yang mengelola pekerjaan klien dan jadwal mandiri |
| 3 | Profesional | Pengguna yang membutuhkan pengingat dan integrasi kalender |

#### Q&A Wawancara

| Question | Answer (Narasumber) |
| :---- | :---- |
| Apa masalah utama saat mengelola tugas? | Sulit menentukan tugas mana yang paling penting dan harus dikerjakan lebih dahulu. |
| Apakah deadline memengaruhi prioritas? | Ya, tugas dengan deadline dekat harus lebih terlihat. |
| Apakah daftar tugas saja sudah cukup? | Belum, karena daftar tugas perlu diurutkan berdasarkan urgensi dan kepentingan. |
| Apakah kalender membantu? | Ya, kalender membantu melihat beban tugas per hari atau minggu. |
| Apakah integrasi Google Calendar dibutuhkan? | Dibutuhkan agar tugas dapat tersinkron dengan jadwal harian. |
| Apakah shortcut/command input berguna? | Berguna, karena mempercepat pencatatan task tanpa banyak klik. |

#### Hasil Wawancara

Dari wawancara simulatif, dapat disimpulkan bahwa pengguna membutuhkan sistem manajemen tugas yang:

- Cepat untuk mencatat tugas.
- Memiliki prioritas otomatis.
- Dapat memfilter tugas berdasarkan kategori.
- Memiliki tampilan timeline.
- Mendukung sinkronisasi kalender.
- Menyimpan data secara persisten.
- Responsif dan nyaman digunakan pada berbagai perangkat.

## 2. PERMASALAHAN MITRA {#permasalahan-mitra}

Permasalahan utama yang diangkat dalam proyek ini adalah kurangnya sistem pengelolaan tugas yang tidak hanya mencatat daftar pekerjaan, tetapi juga membantu pengguna menentukan prioritas pengerjaan secara cerdas.

Masalah yang ditemukan:

1. **Tidak adanya prioritas otomatis**  
   Banyak aplikasi to-do list hanya menampilkan daftar tugas tanpa memberi urutan berdasarkan urgensi, kepentingan, reminder, dan durasi.

2. **Deadline tidak divisualisasikan dengan baik**  
   Pengguna sulit memahami beban tugas pada tanggal tertentu jika tidak ada tampilan calendar timeline.

3. **Pencatatan tugas kurang cepat**  
   Pengguna perlu banyak klik untuk menambah, mengedit, atau menyelesaikan tugas.

4. **Data perlu tersimpan secara aman dan persisten**  
   Pada MVP digunakan LocalStorage, sedangkan pengembangan berikutnya membutuhkan database MySQL dan autentikasi.

5. **Belum terintegrasi penuh dengan kalender eksternal**  
   Pengguna membutuhkan sinkronisasi dengan Google Calendar agar task masuk ke jadwal harian.

6. **Kebutuhan akses lintas perangkat**  
   Sistem harus responsif dan dapat digunakan pada desktop, tablet, maupun mobile.

## 3. SOLUSI YANG DITAWARKAN {#solusi-yang-ditawarkan}

Solusi yang ditawarkan adalah pengembangan aplikasi **Smart Task Planner**, yaitu sistem task management berbasis web dengan fitur utama:

1. **Task CRUD**
   - Membuat task.
   - Mengubah task.
   - Menghapus task.
   - Menandai task selesai.

2. **Auto-Priority Ranking**
   - Sistem menghitung skor prioritas task menggunakan 4 faktor:
     - Urgency/deadline proximity: 40%
     - Priority/importance: 35%
     - Reminder signal: 15%
     - Estimated duration: 10%

3. **Calendar Timeline**
   - Menampilkan distribusi task berdasarkan tanggal.

4. **Filtering**
   - Filter task berdasarkan tanggal, tag, dan level prioritas.

5. **Command Palette**
   - Pengguna dapat menekan `Ctrl+K` untuk membuka command interface.
   - Mendukung input bergaya natural language.

6. **Dark/Light Mode**
   - Mendukung tema gelap dan terang.

7. **LocalStorage dan Database**
   - MVP menggunakan LocalStorage.
   - Phase 1 diarahkan menggunakan MySQL dan Prisma.

8. **Authentication**
   - Menggunakan NextAuth.js dan Google OAuth.

9. **Google Calendar Sync**
   - Sinkronisasi task ke Google Calendar.

10. **Deployment Production**
    - Aplikasi dideploy pada domain:
      <https://taskplanner.dastrevas.com>

---

# **BAB III. PELAKSANAAN PROYEK** {#bab-iii-pelaksanaan-proyek}

## 1. PERSIAPAN AWAL {#persiapan-awal}

### 1.1 Pengorganisasian Tim

| No | Nama - NIM | Tugas |
| :---- | :---- | :---- |
| 1 | Bayu Farid Mulyanto - 411251181 | Analisis kebutuhan, desain sistem, frontend, backend, database, deployment, dokumentasi, dan pengujian |

### 1.2 Penyusunan Rencana Proyek

| Fase | Kegiatan Utama | Target/Milestone |
|------|----------------|------------------|
| Perencanaan | Menentukan ide, fitur utama, dan ruang lingkup | Konsep Smart Task Planner terbentuk |
| Analisis | Mengidentifikasi masalah pengguna dan kebutuhan sistem | Dokumen kebutuhan awal |
| Desain | Merancang UI, arsitektur, model data, dan algoritma prioritas | Desain sistem dan diagram |
| Implementasi MVP | Membuat task CRUD, priority algorithm, filtering, timeline, command palette | MVP berjalan |
| Implementasi Fullstack | Menyiapkan API, Prisma, MySQL, NextAuth, Google Calendar Sync | Phase 1 berjalan |
| Pengujian | Uji fitur, build, lint, dan validasi fungsi | Sistem siap deployment |
| Deployment | Deploy ke production domain | `taskplanner.dastrevas.com` aktif |
| Dokumentasi | Menyusun README, SKPL, dan laporan PBL | Laporan proyek selesai |

### 1.3 Pengadaan Sumber Daya

#### Perangkat Keras

- Laptop/komputer pengembangan.
- Koneksi internet.
- Server/VPS untuk deployment production.

#### Perangkat Lunak

- Node.js 18+
- npm 9+
- Next.js 14
- React 18
- TypeScript 5
- TailwindCSS
- Zustand
- Prisma
- MySQL 5.7+
- NextAuth.js
- Google OAuth 2.0
- Google Calendar API
- PM2
- Nginx
- Let's Encrypt SSL
- Git/GitHub

#### Struktur Direktori Utama Aplikasi

| Folder/File | Fungsi |
|------------|--------|
| `src/app` | App Router Next.js untuk halaman publik, autentikasi, dashboard, overview, dan koneksi WhatsApp |
| `src/app/api/auth/[...nextauth]` | Handler NextAuth.js untuk session OAuth Google di sisi Next.js |
| `src/components` | Komponen UI seperti task card, calendar timeline, command palette, provider, dan form |
| `src/lib` | Utility, hooks, API client, auth helper, constants, dan type definitions |
| `backend/src/app.ts` | Registrasi seluruh route Express backend |
| `backend/src/modules/auth` | Modul autentikasi JWT, register/login, profil user, dan Google OAuth backend |
| `backend/src/modules/tasks` | Modul task CRUD, status task, stats, auto-skip, dan reminder processing |
| `backend/src/modules/reminders` | Modul reminder dan due reminder retrieval |
| `backend/src/modules/calendar` | Modul integrasi Google Calendar, calendar CRUD, dan refresh sync |
| `backend/src/modules/ai` | Modul AI/LLM parsing task command dan overview analysis |
| `backend/src/modules/whatsappInbound` | Modul internal inbound WhatsApp command dan linking nomor WhatsApp |
| `backend/prisma/schema.prisma` | Schema database utama backend Express |
| `prisma/schema.prisma` | Schema Prisma yang masih digunakan pada sisi NextAuth/frontend |
| `docs` | Dokumentasi proyek, deployment, database, laporan, dan lampiran teknis |
| `README.md` | Dokumentasi utama aplikasi dan production guide |
| `backend/README.md` | Dokumentasi endpoint, struktur backend, dan status migrasi Express |

## 2. PENGEMBANGAN DAN DESAIN {#pengembangan-dan-desain}

### 2.1 Desain Solusi

Smart Task Planner saat ini dirancang sebagai aplikasi **hybrid fullstack** yang memisahkan frontend dan backend, tidak lagi hanya bertumpu pada Next.js saja. Desain sistem dibagi menjadi beberapa layer:

1. **Presentation / Client Layer**
   - Landing page publik.
   - Sign in dan sign up page.
   - Dashboard task management.
   - Overview analytics page.
   - Connect WhatsApp page.
   - Calendar timeline.
   - Command palette.
   - Theme, language, snackbar, dan auth session provider.

2. **Frontend Application Layer**
   - Next.js 14 App Router sebagai shell aplikasi web.
   - React component tree untuk interaksi pengguna.
   - API client pada `src/lib/api/client.ts` untuk komunikasi ke Express backend.
   - Zustand untuk state client tertentu dan local persistence.
   - NextAuth.js untuk session management di sisi frontend.

3. **Backend API Layer**
   - Express.js sebagai REST API utama.
   - Route health check, auth, tasks, reminders, calendars, AI, dan internal WhatsApp.
   - Middleware CORS, auth JWT, validation, dan error handler.
   - Scheduler backend untuk auto-skip dan pengiriman reminder WhatsApp.

4. **Domain & Business Logic Layer**
   - Priority algorithm 4 faktor.
   - Status management `PENDING`, `DONE`, `SKIPPED`.
   - Soft delete task.
   - Reminder processing.
   - AI task parsing.
   - AI overview analysis cache.
   - WhatsApp intent resolution dan task command execution.

5. **Data Layer**
   - MySQL sebagai database relasional utama.
   - Prisma ORM untuk query dan schema management.
   - LocalStorage masih dipertahankan untuk sebagian flow MVP pada sisi client.

6. **External Integration Layer**
   - Google OAuth 2.0.
   - Google Calendar API.
   - 9Router sebagai AI gateway / OpenAI-compatible LLM proxy.
   - WhatsApp bot/gateway internal.
   - Cloudflare Turnstile untuk bot protection pada autentikasi.

### 2.1.1 Arsitektur Sistem Terkini

Arsitektur implementasi terkini dapat diringkas sebagai berikut:

- **Frontend Next.js** menangani SSR/CSR, halaman publik, dashboard, overview, connect WhatsApp, dan sesi pengguna.
- **Express backend** menangani API utama aplikasi, termasuk autentikasi JWT, CRUD task, reminder, calendar sync, AI parsing, overview analysis, dan inbound WhatsApp.
- **NextAuth.js** masih dipakai pada sisi Next.js untuk integrasi OAuth/session frontend.
- **Prisma + MySQL** menjadi lapisan persistence utama.
- **9Router** digunakan untuk memproses natural language menjadi task terstruktur serta analisis overview pengguna.
- **WhatsApp internal gateway** menjadi channel alternatif untuk pengelolaan task melalui chat.

### 2.1.2 Mapping Frontend ke Backend

| Layer | Implementasi | Peran |
|------|--------------|-------|
| Frontend Page | `src/app/(public)/page.tsx` | Landing page publik |
| Frontend Auth | `src/app/auth/signin/page.tsx`, `src/app/auth/signup/page.tsx` | UI login dan registrasi |
| Frontend Dashboard | `src/app/(protected)/dashboard/page.tsx` | Pengelolaan task harian |
| Frontend Overview | `src/app/(protected)/overview/page.tsx` | Statistik, AI analysis, dan gamification |
| Frontend WhatsApp | `src/app/(protected)/connectwhatsapp/page.tsx` | Linking akun ke WhatsApp |
| Frontend Command | `src/components/command/CommandPalette.tsx` | Input natural language / AI task command |
| Frontend API Client | `src/lib/api/client.ts` | Jembatan request dari UI ke backend |
| Backend Router | `backend/src/app.ts` | Registrasi seluruh route Express |
| Backend Auth | `backend/src/modules/auth` | Register, login, me, logout, Google OAuth backend |
| Backend Tasks | `backend/src/modules/tasks` | CRUD task, status, stats, skip, priority |
| Backend Reminder | `backend/src/modules/reminders` | Reminder CRUD dan due reminders |
| Backend Calendar | `backend/src/modules/calendar` | Calendar CRUD, sync, refresh |
| Backend AI | `backend/src/modules/ai` | Parse task command, overview analysis, cache |
| Backend WhatsApp | `backend/src/modules/whatsappInbound` | Inbound WhatsApp command dan linking nomor |
| Database | `backend/prisma/schema.prisma` | Definisi model dan relasi data |

### 2.2 Spesifikasi Fungsional

| Kode | Kebutuhan Fungsional | Status |
|------|----------------------|--------|
| FR-001 | Sistem menyediakan landing page | Tersedia |
| FR-002 | Sistem menyediakan login dan signup pengguna | Tersedia |
| FR-003 | Sistem menyediakan login Google OAuth | Tersedia / hybrid |
| FR-004 | Sistem dapat membuat task | Tersedia |
| FR-005 | Sistem dapat mengubah task | Tersedia |
| FR-006 | Sistem dapat menghapus task secara soft delete | Tersedia |
| FR-007 | Sistem dapat menandai task selesai | Tersedia |
| FR-008 | Sistem mengubah task overdue menjadi `SKIPPED` secara otomatis | Tersedia |
| FR-009 | Sistem menghitung prioritas otomatis | Tersedia |
| FR-010 | Sistem mengurutkan task berdasarkan prioritas | Tersedia |
| FR-011 | Sistem memfilter task berdasarkan tanggal | Tersedia |
| FR-012 | Sistem memfilter task berdasarkan tag | Tersedia |
| FR-013 | Sistem mendukung filter prioritas dan status | Tersedia |
| FR-014 | Sistem menampilkan calendar timeline | Tersedia |
| FR-015 | Sistem menyediakan command palette `Ctrl+K` | Tersedia |
| FR-016 | Sistem memproses input conversational/NLP lokal dan AI | Tersedia |
| FR-017 | Sistem menyediakan AI parse task command melalui backend | Tersedia |
| FR-018 | Sistem menyediakan AI overview analysis | Tersedia |
| FR-019 | Sistem menyimpan data melalui LocalStorage | Tersedia |
| FR-020 | Sistem menyimpan data ke MySQL melalui Prisma | Tersedia / ongoing refinement |
| FR-021 | Sistem menyediakan API CRUD task berbasis Express | Tersedia |
| FR-022 | Sistem menyediakan statistik task `pending`, `done`, `skipped` | Tersedia |
| FR-023 | Sistem menyediakan reminder task dan due reminder retrieval | Tersedia baseline |
| FR-024 | Sistem melakukan Google Calendar Sync | Tersedia baseline |
| FR-025 | Sistem menyediakan halaman overview analytics | Tersedia |
| FR-026 | Sistem menyediakan koneksi akun ke WhatsApp | Tersedia |
| FR-027 | Sistem menerima command task melalui WhatsApp chat | Tersedia |
| FR-028 | Sistem mengirim reminder personal melalui WhatsApp | Tersedia |
| FR-029 | Sistem mendukung dark/light mode | Tersedia |
| FR-030 | Sistem menampilkan snackbar/feedback aksi pengguna | Tersedia |

### 2.3 Spesifikasi Non-Fungsional

| Kode | Kebutuhan Non-Fungsional | Target |
|------|---------------------------|--------|
| NFR-001 | Menggunakan TypeScript untuk type safety | Wajib |
| NFR-002 | Input pengguna divalidasi di frontend dan backend | Wajib |
| NFR-003 | Query database menggunakan Prisma untuk mencegah SQL injection | Wajib |
| NFR-004 | Tidak mengekspos secret/token ke client | Wajib |
| NFR-005 | Mendukung HTTPS production | Wajib |
| NFR-006 | UI responsif desktop, tablet, dan mobile | Wajib |
| NFR-007 | Mendukung dark/light mode | Wajib |
| NFR-008 | Mengikuti prinsip aksesibilitas WCAG 2.1 | Target |
| NFR-009 | First load sekitar 1.2 detik | Target |
| NFR-010 | Lighthouse performance score 90+ | Target |
| NFR-011 | Runtime Node.js 18+ dan MySQL 5.7+ | Wajib |
| NFR-012 | Dokumentasi diperbarui saat fitur berubah | Wajib |
| NFR-013 | CORS, JWT auth, dan middleware error handler tersedia di backend | Wajib |
| NFR-014 | Proteksi CAPTCHA menggunakan Cloudflare Turnstile pada flow auth tertentu | Wajib |
| NFR-015 | Endpoint internal WhatsApp diamankan dengan bearer token dan service secret | Wajib |
| NFR-016 | Integrasi AI dilakukan server-side agar API key tidak terekspos | Wajib |
| NFR-017 | Sistem harus scalable untuk pemisahan frontend dan backend service | Target |
| NFR-018 | Observability melalui logging, smoke test, dan dokumentasi deployment | Target |

### 2.4 Prototyping

Prototype aplikasi telah berkembang dari MVP lokal menjadi platform hybrid dengan fitur utama:

- Dashboard task.
- Modal task baru dan edit task.
- Task card dengan status `PENDING`, `DONE`, dan `SKIPPED`.
- Priority list.
- Calendar timeline.
- Header, auth action, dan theme toggle.
- Command palette dengan AI parser dan fallback parser.
- Overview analytics page.
- Connect WhatsApp page.
- Provider untuk auth, theme, language, snackbar, dan command palette.

Komponen utama pada aplikasi:

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `TaskCard.tsx` | `src/components/tasks` | Menampilkan detail task, aksi complete, delete, dan status visual |
| `NewTaskModal.tsx` | `src/components/tasks` | Form pembuatan task baru |
| `EditTaskModal.tsx` | `src/components/tasks` | Form edit task |
| `TaskPriorityList.tsx` | `src/components/tasks` | Daftar task berdasarkan prioritas |
| `CalendarTimeline.tsx` | `src/components/calendar` | Visualisasi task dalam timeline |
| `CommandPalette.tsx` | `src/components/command` | Interface command berbasis `Ctrl+K`, AI parser, dan fallback parser |
| `Header.tsx` | `src/components/layout` | Header aplikasi |
| `SnackbarProvider.tsx` | `src/components/providers` | Notifikasi toast/snackbar |
| `ThemeProvider.tsx` | `src/components/providers` | Pengelolaan tema |
| `AuthSessionProvider.tsx` | `src/components/providers` | Pengelolaan session auth |
| `src/app/(protected)/overview/page.tsx` | `src/app/(protected)/overview` | Ringkasan produktivitas, charts, dan AI analysis |
| `src/app/(protected)/connectwhatsapp/page.tsx` | `src/app/(protected)/connectwhatsapp` | Halaman linking akun ke WhatsApp |

#### 2.4.1 Wireframe Low-Fidelity

Bagian ini digunakan untuk menampilkan sketsa awal atau wireframe mentah sebelum masuk ke desain visual final. Wireframe low-fidelity berfungsi untuk menunjukkan struktur layout, hirarki informasi, dan alur navigasi utama tanpa fokus pada detail warna atau estetika.

**Letakkan gambar pada bagian ini:**

- Wireframe landing page
- Wireframe sign in / sign up
- Wireframe dashboard
- Wireframe command palette
- Wireframe overview analytics
- Wireframe connect WhatsApp

**Template penempatan gambar:**

- Gambar 2.1 Wireframe awal landing page Smart Task Planner
- Gambar 2.2 Wireframe awal halaman autentikasi pengguna
- Gambar 2.3 Wireframe awal dashboard task management
- Gambar 2.4 Wireframe awal halaman overview analytics
- Gambar 2.5 Wireframe awal halaman connect WhatsApp

**Catatan penulisan:**

Tuliskan penjelasan singkat di bawah setiap gambar mengenai tujuan layout, area konten utama, dan alasan penyusunan komponennya.

**Contoh narasi/alasan yang dapat digunakan dan disesuaikan:**

- **Landing page dibuat dengan struktur hero section, value proposition, dan call-to-action yang jelas** agar pengguna baru dapat langsung memahami fungsi utama Smart Task Planner sebagai aplikasi task management cerdas. Peletakan tombol masuk atau mulai digunakan pada area atas bertujuan mempersingkat langkah pengguna menuju fitur inti aplikasi.
- **Halaman sign in / sign up dibuat sederhana dan terfokus** untuk mengurangi distraksi saat proses autentikasi. Susunan form yang ringkas dipilih agar pengguna dapat masuk ke sistem dengan cepat, baik melalui kredensial maupun integrasi login eksternal.
- **Dashboard dirancang sebagai pusat aktivitas utama pengguna** karena seluruh proses pengelolaan task dilakukan dari halaman ini. Oleh sebab itu, komponen seperti daftar task, prioritas, filter, statistik singkat, dan tombol aksi ditempatkan pada area yang mudah dijangkau.
- **Command palette ditempatkan sebagai akses cepat** karena aplikasi mengusung efisiensi input berbasis natural language. Desain ini dipilih agar pengguna dapat membuat atau mengelola task tanpa harus selalu berpindah ke form manual.
- **Overview analytics dibuat terpisah dari dashboard utama** agar informasi statistik, insight AI, dan evaluasi produktivitas dapat ditampilkan lebih fokus tanpa mengganggu alur kerja task harian.
- **Halaman connect WhatsApp dirancang sederhana dan instruksional** karena fokus utamanya adalah membantu pengguna menghubungkan akun dengan cepat. Oleh karena itu, elemen seperti QR code, nomor tujuan, format pesan, dan contoh command dibuat dominan dan mudah dipahami.

#### 2.4.2 Wireframe Detail dan Navigasi

Bagian ini digunakan untuk menampilkan wireframe yang lebih rinci beserta alur perpindahan antar halaman atau antar fitur utama. Jika memiliki flow diagram dari user journey, dapat diletakkan pada subbab ini.

**Letakkan gambar pada bagian ini:**

- Detail wireframe landing page
- Detail wireframe dashboard dengan komponen utama
- Detail navigasi protected routes
- Detail alur command palette
- Detail alur task dari create sampai complete / skipped

**Template penempatan gambar:**

- Gambar 2.6 Wireframe detail landing page
- Gambar 2.7 Wireframe detail dashboard dan komponen task
- Gambar 2.8 Wireframe detail overview analytics
- Gambar 2.9 Wireframe detail halaman connect WhatsApp
- Gambar 2.10 Diagram navigasi pengguna dalam sistem

**Catatan penulisan:**

Jelaskan hubungan antar halaman, transisi aksi pengguna, serta bagaimana wireframe mendukung kebutuhan fungsional sistem.

**Contoh narasi/alasan yang dapat digunakan dan disesuaikan:**

- **Wireframe detail landing page disusun bertahap dari hero, fitur utama, hingga ajakan penggunaan** agar alur baca pengguna berjalan natural dari mengenal produk hingga terdorong untuk mencoba aplikasi.
- **Wireframe dashboard dibuat dengan pembagian area navigasi, konten utama, dan aksi cepat** untuk memastikan pengguna dapat mengakses informasi task tanpa kebingungan. Susunan ini juga membantu menjaga efisiensi saat jumlah task mulai banyak.
- **Navigasi protected routes dipisahkan dengan jelas** agar fitur yang membutuhkan autentikasi, seperti dashboard, overview, dan koneksi WhatsApp, hanya dapat diakses oleh pengguna yang telah login.
- **Alur command palette dirancang sesingkat mungkin** karena fitur ini ditujukan sebagai sarana input cepat. Oleh sebab itu, pengguna cukup memanggil overlay, mengetik perintah, lalu sistem memproses task tanpa banyak langkah tambahan.
- **Alur task dari create hingga complete atau skipped divisualisasikan** untuk menunjukkan bahwa sistem tidak hanya menyimpan task, tetapi juga mengelola status task sebagai bagian dari logika bisnis aplikasi.

#### 2.4.3 Desain UI High-Fidelity

Bagian ini digunakan untuk menampilkan hasil desain visual yang sudah lebih matang. Pada tahap ini, elemen warna, tipografi, ikon, tema gelap/terang, dan branding aplikasi sudah mulai terlihat jelas.

**Letakkan gambar pada bagian ini:**

- Mockup landing page final
- Mockup dashboard final
- Mockup modal task
- Mockup overview page
- Mockup connect WhatsApp page
- Mockup dark mode dan light mode

**Template penempatan gambar:**

- Gambar 2.11 Desain UI final landing page
- Gambar 2.12 Desain UI final dashboard Smart Task Planner
- Gambar 2.13 Desain UI modal pembuatan task
- Gambar 2.14 Desain UI halaman overview analytics
- Gambar 2.15 Desain UI halaman connect WhatsApp
- Gambar 2.16 Perbandingan tampilan dark mode dan light mode

**Catatan penulisan:**

Jelaskan perubahan dari wireframe ke UI final, peningkatan visual, dan alasan pemilihan gaya desain yang mendukung kenyamanan pengguna.

**Contoh narasi/alasan yang dapat digunakan dan disesuaikan:**

- **Desain UI final landing page menggunakan hierarki visual yang kuat** agar pesan utama produk langsung terlihat. Penggunaan ilustrasi, video, atau warna kontras bertujuan meningkatkan daya tarik awal sekaligus memperjelas positioning aplikasi.
- **Dashboard final dibuat dengan tampilan bersih dan informatif** supaya pengguna dapat fokus pada task yang harus dikerjakan. Penggunaan card, badge status, dan warna prioritas dipilih untuk mempermudah scanning informasi secara cepat.
- **Modal pembuatan task dirancang ringkas namun lengkap** agar proses input tidak terasa berat. Field disusun berdasarkan prioritas pengisian, mulai dari judul task hingga atribut tambahan seperti deadline, tag, dan durasi.
- **Halaman overview analytics didesain lebih visual** karena tujuannya bukan hanya menampilkan angka, tetapi juga membantu pengguna memahami progres dan pola produktivitasnya melalui chart, insight AI, dan elemen gamification.
- **Halaman connect WhatsApp dibuat lebih instruktif dan ramah pengguna** karena sebagian pengguna mungkin belum terbiasa dengan proses linking akun melalui chat. Oleh sebab itu, langkah registrasi dibuat eksplisit dan mudah diikuti.
- **Penyediaan dark mode dan light mode** bertujuan meningkatkan kenyamanan penggunaan dalam berbagai kondisi pencahayaan serta memberi fleksibilitas preferensi visual kepada pengguna.

#### 2.4.4 Screenshot Implementasi Aplikasi

Bagian ini digunakan untuk menampilkan hasil implementasi nyata dari aplikasi yang sudah berjalan. Berbeda dengan mockup, screenshot implementasi menunjukkan bukti realisasi desain pada sistem yang aktif.

**Letakkan gambar pada bagian ini:**

- Screenshot landing page production
- Screenshot dashboard dengan data task
- Screenshot command palette aktif
- Screenshot overview analytics aktif
- Screenshot connect WhatsApp page aktif
- Screenshot auth page aktif

**Template penempatan gambar:**

- Gambar 2.17 Implementasi landing page Smart Task Planner
- Gambar 2.18 Implementasi dashboard task management
- Gambar 2.19 Implementasi command palette dengan input natural language
- Gambar 2.20 Implementasi overview analytics dan AI insight
- Gambar 2.21 Implementasi halaman connect WhatsApp
- Gambar 2.22 Implementasi halaman autentikasi pengguna

**Catatan penulisan:**

Sertakan keterangan bahwa screenshot diambil dari aplikasi yang sedang berjalan, baik pada local development maupun deployment production.

**Contoh narasi/alasan yang dapat digunakan dan disesuaikan:**

- **Screenshot landing page ditampilkan untuk membuktikan bahwa rancangan antarmuka publik telah terimplementasi** dan dapat digunakan sebagai halaman perkenalan produk kepada pengguna baru.
- **Screenshot dashboard ditampilkan sebagai bukti realisasi fitur utama aplikasi** karena halaman ini menjadi pusat pengelolaan task, prioritas, filter, dan ringkasan aktivitas pengguna.
- **Screenshot command palette aktif ditampilkan untuk menunjukkan keunggulan interaksi berbasis natural language** yang menjadi salah satu pembeda Smart Task Planner dibanding aplikasi to-do list biasa.
- **Screenshot overview analytics ditampilkan untuk menunjukkan bahwa aplikasi telah berkembang dari task manager sederhana menjadi alat evaluasi produktivitas** dengan dukungan visualisasi data dan analisis AI.
- **Screenshot connect WhatsApp ditampilkan untuk membuktikan adanya perluasan channel interaksi pengguna** dari web menjadi chat-based productivity flow.
- **Screenshot halaman autentikasi ditampilkan untuk menunjukkan bahwa sistem telah memiliki flow masuk pengguna yang nyata** dan siap digunakan pada skenario aplikasi fullstack.

#### 2.4.5 Pemetaan Desain ke Implementasi

Bagian ini dipakai untuk menunjukkan keterkaitan antara rancangan awal dengan hasil implementasi akhir.

| Tahap | Artefak | Tujuan |
|------|---------|--------|
| Wireframe Low-Fidelity | Sketsa awal halaman | Menentukan struktur layout dan alur utama |
| Wireframe Detail | Desain struktur lebih rinci | Menentukan posisi komponen dan navigasi |
| UI High-Fidelity | Mockup visual final | Menentukan tampilan visual, branding, dan konsistensi UI |
| Screenshot Implementasi | Bukti hasil aplikasi berjalan | Menunjukkan realisasi desain pada sistem nyata |

#### 2.4.6 Catatan Penempatan Gambar Lampiran

Jika jumlah gambar terlalu banyak, maka gambar inti cukup ditampilkan pada bab ini, sedangkan versi lengkap seluruh wireframe, mockup, dan screenshot dapat dipindahkan ke bagian lampiran.

**Struktur lampiran yang disarankan:**

- Lampiran A. Wireframe low-fidelity
- Lampiran B. Wireframe detail dan alur navigasi
- Lampiran C. Mockup UI high-fidelity
- Lampiran D. Screenshot implementasi aplikasi

## 3. IMPLEMENTASI {#implementasi}

### 3.1 Implementasi Teknologi

| Area | Teknologi |
|------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | TailwindCSS |
| State Management | Zustand |
| Frontend Auth Session | NextAuth.js |
| Backend API | Express.js + TypeScript |
| Backend Validation | Zod + middleware validation |
| Backend Security | JWT, CORS, error handler, Cloudflare Turnstile |
| Database ORM | Prisma |
| Database | MySQL 5.7+ |
| OAuth | Google OAuth 2.0 |
| AI Integration | 9Router AI gateway |
| Chat Integration | WhatsApp internal gateway/bot |
| Calendar Integration | Google Calendar API |
| Notification Channel | WhatsApp personal reminder |
| Deployment | Linux, PM2, Nginx, Let's Encrypt |

### 3.2 Implementasi Priority Algorithm

Fitur utama Smart Task Planner adalah algoritma prioritas otomatis. Perhitungan dilakukan dengan 4 faktor:

| Faktor | Bobot |
|-------|-------|
| Urgency/deadline proximity | 40% |
| Priority/importance | 35% |
| Reminder signal | 15% |
| Estimated duration | 10% |

Alur kerja algoritma:

```text
@startuml
title Smart Task Planner - Priority Algorithm Flow

start
:Input Task Data;
note right
- title
- due date
- priority
- reminder
- estimated duration
end note

:Analyze Deadline Urgency;
:Analyze Priority Level;
:Analyze Reminder Signal;
:Analyze Estimated Duration;

:Calculate Priority Score;
note right
Formula:
Urgency 40%
Priority 35%
Reminder 15%
Duration 10%
end note

if (High Score?) then (Yes)
:Mark as High Priority;
else (No)
:Mark as Normal Priority;
endif

:Sort Task List;
:Display Priority Ranking;
stop
@enduml
```

### 3.3 Implementasi API dan Database

Implementasi aplikasi saat ini menggunakan arsitektur API hybrid:

1. **Next.js API / Auth Layer**
   - `src/app/api/auth/[...nextauth]/route.ts`
   - Digunakan untuk session handling NextAuth.js di frontend.

2. **Express API Layer**
   - `GET /health`
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/auth/me`
   - `POST /api/tasks`
   - `GET /api/tasks`
   - `GET /api/tasks/stats`
   - `PATCH /api/tasks/:id`
   - `PATCH /api/tasks/:id/status`
   - `POST /api/tasks/:id/skip`
   - `POST /api/reminders`
   - `GET /api/reminders`
   - `POST /api/calendars`
   - `GET /api/calendars`
   - `POST /api/calendar/:id/refresh` secara konsep implementasi refresh route backend
   - `POST /api/ai/parse-task`
   - `POST /api/ai/overview-analysis`
   - `POST /internal/wa/inbound`

3. **Task Status Rules**
   - Status default task baru adalah `PENDING`.
   - Saat selesai, task berubah menjadi `DONE`.
   - Task terlewat dapat berubah menjadi `SKIPPED`.
   - Penghapusan task menggunakan pendekatan soft delete pada backend.

4. **Reminder & Scheduler**
   - Backend memiliki proses reminder dan auto-skip scheduler.
   - Reminder personal dapat dikirim melalui WhatsApp.

5. **Model database inti**
   - `users`
   - `tasks`
   - `task_tags`
   - `reminders`
   - `calendars`
   - `overview_analysis_cache`

6. **Relasi Frontend ke Backend**
   - Frontend melakukan request menggunakan API client terpusat.
   - Express backend menjadi sumber data utama untuk task, reminder, kalender, AI, dan WhatsApp integration.
   - NextAuth tetap melengkapi session flow untuk autentikasi pada sisi web.

### 3.3.1 Implementasi AI dan 9Router

Integrasi AI merupakan pengembangan penting pada Smart Task Planner. Backend memanfaatkan 9Router sebagai gateway LLM server-side agar API key tidak diekspos ke browser.

Fungsi AI yang sudah diimplementasikan:

- Parsing natural language command menjadi struktur task.
- Analisis overview produktivitas pengguna.
- AI-first resolver untuk command operasional WhatsApp.
- Fallback ke parser lokal bila layanan AI tidak tersedia.

Contoh penggunaan AI:

- Command palette pada frontend menerima input natural language.
- Frontend mengirim request ke endpoint `POST /api/ai/parse-task`.
- Backend meneruskan prompt ke 9Router.
- Hasil JSON divalidasi dan dikirim kembali ke frontend.
- Frontend membuat task melalui endpoint task API.

Selain parse task, overview page juga memakai endpoint analisis AI untuk menghasilkan insight produktivitas dan rekomendasi personal.

### 3.3.2 Implementasi WhatsApp Chat dan Reminder

Fitur WhatsApp menambah channel interaksi baru di luar web interface. Pengguna dapat menghubungkan akun ke nomor WhatsApp gateway melalui halaman connect WhatsApp.

Kemampuan utama integrasi WhatsApp:

- Linking nomor WhatsApp ke akun user.
- Menerima command registrasi format `user_id daftar`.
- Menerima command `task ...` untuk create/edit/delete/complete/list/overview.
- Mengirimkan balasan WhatsApp otomatis.
- Mengirim reminder personal untuk task yang mendekati deadline.

Endpoint internal yang dipakai adalah `POST /internal/wa/inbound` dengan header keamanan internal berupa bearer token dan service secret.

### 3.3.3 Implementasi Overview Analytics dan Gamification

Halaman overview merupakan pengembangan lanjutan dari dashboard biasa. Fitur ini berisi:

- Statistik task `pending`, `done`, dan `skipped`.
- Grafik harian dan mingguan.
- AI summary dan rekomendasi produktivitas.
- Gamification berbasis animal level dari skor aktivitas pengguna.
- Refresh analysis untuk mendapatkan insight terbaru.

Dengan fitur ini, Smart Task Planner tidak hanya menjadi task manager, tetapi juga alat refleksi produktivitas personal.

### 3.3.4 Implementasi Keamanan Sistem

Lapisan keamanan yang telah diterapkan meliputi:

- Validasi input frontend dan backend.
- Prisma ORM untuk mengurangi risiko SQL injection.
- JWT auth pada Express backend.
- Session auth pada NextAuth.js.
- Cloudflare Turnstile untuk proteksi bot pada flow auth tertentu.
- Internal token + service secret pada endpoint WhatsApp inbound.
- Penyimpanan API key AI hanya di backend environment variable.
- CORS configuration untuk membatasi origin frontend.

### 3.4 Implementasi Deployment

Aplikasi dideploy pada:

<https://taskplanner.dastrevas.com>

Deployment stack:

- Server Linux Ubuntu 20.04+
- PM2 process manager
- Nginx reverse proxy
- Let's Encrypt SSL
- MySQL 5.7+
- Node.js 18+

## 4. PENGUJIAN {#pengujian}

Pengujian dilakukan untuk memastikan fitur utama web, backend API, AI, dan WhatsApp integration berjalan sesuai kebutuhan.

| No | Skenario Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|----------------------|--------|
| 1 | Membuka landing page | Halaman publik tampil | Lulus |
| 2 | Login dan signup user | User dapat masuk ke sistem | Lulus |
| 3 | Membuat task baru | Task tersimpan dan muncul di daftar | Lulus |
| 4 | Mengedit task | Data task berubah | Lulus |
| 5 | Menghapus task | Task ter-soft-delete dan tidak muncul di active list | Lulus |
| 6 | Menandai task selesai | Status task berubah menjadi `DONE` | Lulus |
| 7 | Auto skip task overdue | Status task berubah menjadi `SKIPPED` sesuai tolerance | Lulus |
| 8 | Menghitung prioritas | Priority score muncul sesuai bobot | Lulus |
| 9 | Filter task berdasarkan tanggal | Task terfilter sesuai tanggal | Lulus |
| 10 | Filter task berdasarkan tag | Task terfilter sesuai tag | Lulus |
| 11 | Membuka command palette | Command palette terbuka dengan `Ctrl+K` | Lulus |
| 12 | AI parse task command | Input natural language diparsing menjadi payload task | Lulus |
| 13 | AI overview analysis | Sistem menampilkan insight produktivitas | Lulus |
| 14 | Mengubah tema | Dark/light mode berubah | Lulus |
| 15 | Refresh browser | Data lokal dan state penting tetap sinkron | Lulus |
| 16 | Endpoint `GET /health` | Backend mengembalikan status `ok` | Lulus |
| 17 | Endpoint auth Express | Register, login, dan `me` berjalan | Lulus |
| 18 | Endpoint task Express | CRUD, stats, status, dan skip berjalan | Lulus |
| 19 | Endpoint reminder | Reminder dapat dibuat dan diambil | Implementasi baseline |
| 20 | Endpoint calendar | Calendar sync route tersedia | Implementasi baseline |
| 21 | Connect WhatsApp page | User melihat QR/link dan format registrasi | Lulus |
| 22 | Inbound WhatsApp registration | Nomor WhatsApp berhasil dikaitkan ke akun | Lulus |
| 23 | WhatsApp task command | Command `task ...` diproses backend | Lulus |
| 24 | WhatsApp personal reminder | Reminder deadline dapat dikirim | Lulus |
| 25 | Build production | Aplikasi dapat dibuild | Perlu validasi berkala |

Perintah validasi yang direkomendasikan:

```bash
npm run lint
npm run type-check
npm run build
npm run smoke:nextjs
```

Untuk backend Express, validasi tambahan yang relevan meliputi:

```bash
cd backend && npm run build
cd ../scripts && node smoke-test-backend.js
```

## 5. UMPAN BALIK {#umpan-balik}

Umpan balik yang diperoleh berdasarkan analisis kebutuhan pengguna dan evaluasi fitur:

1. Pengguna membutuhkan antarmuka yang sederhana namun informatif.
2. Priority ranking menjadi nilai utama karena membantu menentukan urutan pengerjaan.
3. Calendar timeline membantu pengguna melihat beban tugas.
4. Command palette mempercepat pencatatan task.
5. Integrasi AI membantu pengguna menulis task dengan lebih natural.
6. Halaman overview memberi nilai tambah karena pengguna bisa melihat statistik dan insight produktivitas.
7. Integrasi WhatsApp sangat membantu untuk akses cepat tanpa harus selalu membuka web.
8. Integrasi Google Calendar tetap menjadi fitur penting untuk sinkronisasi lintas platform.
9. Aplikasi perlu menjaga performa agar tetap cepat saat jumlah task bertambah.
10. Sistem perlu memastikan data pengguna aman ketika database, autentikasi, AI, dan integrasi chat diterapkan.

## 6. KESIAPAN APLIKASI MENUJU SKALA STARTUP / UNICORN

Untuk menilai kesiapan aplikasi sebagai produk digital serius atau bahkan menuju skala startup/unicorn, tidak cukup hanya melihat fitur teknis. Diperlukan kombinasi aspek produk, bisnis, teknologi, keamanan, dan operasional.

### 6.1 Elemen yang Dibutuhkan untuk Aplikasi Skala Unicorn

1. **Problem-solution fit**
   - Produk harus menyelesaikan masalah nyata pengguna secara jelas.
2. **Product-market fit**
   - Harus ada bukti bahwa segmen pengguna membutuhkan solusi ini secara berulang.
3. **Scalable architecture**
   - Pemisahan frontend dan backend seperti arsitektur hybrid saat ini merupakan langkah awal yang baik.
4. **Reliable data layer**
   - Database, backup, observability, dan disaster recovery perlu matang.
5. **Security and compliance**
   - Auth, secret management, bot protection, access control, dan audit trail penting.
6. **AI differentiation**
   - Fitur AI harus memberi keunggulan kompetitif yang sulit ditiru sekadar todo app biasa.
7. **Omnichannel experience**
   - Integrasi web, WhatsApp, kalender, dan notifikasi meningkatkan engagement.
8. **Monetization strategy**
   - Perlu model bisnis seperti freemium, premium analytics, team workspace, atau enterprise plan.
9. **Operational readiness**
   - Monitoring, incident response, CI/CD, testing, dan release workflow perlu disiapkan.
10. **Growth metrics**
   - Perlu definisi KPI seperti retention, DAU/MAU, task completion rate, activation rate, dan conversion rate.

### 6.2 Elemen Laporan yang Sebaiknya Ada

Agar laporan proyek lebih matang dan mendekati standar produk nyata, dokumen sebaiknya juga memuat:

- Latar belakang bisnis dan value proposition.
- Persona pengguna utama.
- User journey inti.
- Competitive analysis sederhana.
- Risk analysis dan mitigasi.
- Roadmap pengembangan per fase.
- KPI keberhasilan sistem.
- Rencana monetisasi.
- Strategi skalabilitas arsitektur.
- Strategi keamanan dan compliance.
- Strategi monitoring, backup, dan recovery.

### 6.3 Posisi Smart Task Planner Saat Ini

Berdasarkan implementasi yang ada, Smart Task Planner sudah memiliki fondasi yang cukup kuat untuk berkembang karena telah mencakup:

- task management inti,
- arsitektur hybrid frontend–backend,
- autentikasi,
- database persistence,
- analytics overview,
- AI task parsing,
- WhatsApp task channel,
- reminder workflow,
- integrasi kalender,
- deployment production.

Namun agar benar-benar siap menuju skala produk besar, aplikasi masih perlu penguatan pada:

- automated testing yang lebih luas,
- monitoring dan observability production,
- CI/CD pipeline,
- hardening security dan audit log,
- team collaboration/workspace,
- monetization dan business validation,
- analytical dashboard tingkat produk.

---

# BAB IV. KESIMPULAN {#bab-iv-kesimpulan}

Smart Task Planner merupakan proyek aplikasi web untuk mata kuliah **proyek-perangkat-lunak** yang dikembangkan dengan metode berbasis proyek. Aplikasi ini bertujuan membantu pengguna mengelola tugas dengan lebih efektif melalui fitur task management, priority scoring, filtering, calendar timeline, command palette, analytics overview, AI parsing, integrasi WhatsApp, dan dukungan dark/light mode.

Berbeda dari versi MVP awal yang masih dominan local-first, implementasi saat ini telah berkembang menjadi sistem **hybrid fullstack** dengan frontend Next.js dan backend Express terpisah. Pada sisi frontend, aplikasi menyediakan halaman publik, autentikasi, dashboard, overview, dan koneksi WhatsApp. Pada sisi backend, sistem telah memiliki route auth, task CRUD, reminder, calendar sync, AI endpoint, dan internal WhatsApp inbound. Persistence utama menggunakan MySQL dan Prisma, sementara sebagian flow kompatibilitas MVP tetap mempertahankan local storage tertentu pada client.

Pengembangan AI menjadi salah satu pembeda utama karena sistem telah mampu memproses natural language command melalui 9Router, memberi analisis overview produktivitas, dan membantu command resolution pada channel WhatsApp. Penambahan integrasi WhatsApp juga memperluas kanal penggunaan aplikasi dari sekadar web dashboard menjadi omnichannel productivity assistant.

Berdasarkan proses analisis, desain, implementasi, dan pengujian, Smart Task Planner telah melampaui bentuk task manager sederhana dan berkembang menjadi platform produktivitas cerdas berbasis web, API, AI, dan chat. Dengan deployment pada <https://taskplanner.dastrevas.com>, aplikasi ini dapat menjadi contoh implementasi modern pengembangan perangkat lunak fullstack berbasis Next.js, Express.js, React, TypeScript, Prisma, MySQL, integrasi AI, dan layanan cloud/API eksternal.

---

# LAMPIRAN {#lampiran}

## 1. Diagram Pemodelan Sistem

### 1.1 Use Case Flow

```text
@startuml
title Smart Task Planner - Use Case Flow (Updated Hybrid System)

start
:Pengunjung membuka aplikasi;
:Melihat Landing Page;

if (Pengguna login?) then (Ya)
:Login via Google OAuth / credentials;
:Masuk Dashboard;
else (Tidak)
:Tetap di halaman publik;
stop
endif

:Kelola Task;
note right
- Create
- Read
- Update
- Soft Delete
- Complete (DONE)
- Auto Skip (SKIPPED)
end note

:Melihat Daftar Prioritas;
:Memfilter Task;
:Melihat Calendar Timeline;
:Melihat Overview Analytics;

if (Menggunakan Command Palette?) then (Ya)
:Tekan Ctrl+K;
:Input perintah natural language;
:Backend AI parse command;
else (Tidak)
:Gunakan UI dashboard;
endif

if (Menghubungkan WhatsApp?) then (Ya)
:Buka halaman Connect WhatsApp;
:Kirim format user_id daftar;
:WhatsApp linked ke akun;
endif

if (Menggunakan WhatsApp Command?) then (Ya)
:Kirim command task ...;
:Backend proses AI/intent;
:Balasan WhatsApp dikirim;
endif

if (Sync Google Calendar?) then (Ya)
:Sinkronisasi task ke Google Calendar;
else (Tidak)
:Lanjut tanpa sync;
endif

:Tampilkan hasil ke pengguna;
stop
@enduml
```

### 1.2 Context Flow

```text
@startuml
title Smart Task Planner - Context Flow (Updated Hybrid System)

start
:User Input;
note right
- web task form
- command palette
- auth request
- WhatsApp command
- overview request
end note

:Next.js Frontend;
:Express Backend API;

if (Authentication Required?) then (Yes)
:NextAuth session or JWT verification;
:Create authenticated context;
else (No)
:Public access for landing page only;
endif

if (Request Type?) then (Web UI)
:Frontend calls Express API client;
elseif (WhatsApp)
:Internal WA gateway posts inbound payload;
elseif (AI Overview)
:Backend AI analyzes user productivity;
endif

if (Persistence Target?) then (Browser)
:Use LocalStorage for MVP-compatible client state;
else (Database)
:Persist to MySQL via Prisma;
endif

if (AI Needed?) then (Yes)
:Send prompt to 9Router;
:Validate JSON response;
endif

if (Calendar Sync?) then (Yes)
:Send event to Google Calendar API;
:Store calendar metadata;
endif

if (Reminder Needed?) then (Yes)
:Schedule reminder / WhatsApp notification;
endif

:Display task list, stats, priority, timeline, and overview;
stop
@enduml
```

### 1.3 Component Flow

```text
@startuml
title Smart Task Planner - Component Flow (Frontend to Backend)

start
:Next.js App Router;
:Load Page;

if (Protected Route?) then (Yes)
:Check session / token;
if (Valid?) then (Yes)
:Render Dashboard / Overview / Connect WhatsApp;
else (No)
:Redirect to Sign In;
stop
endif
else (No)
:Render Public Page;
endif

:Load Providers;
note right
- AuthSessionProvider
- ThemeProvider
- LanguageProvider
- SnackbarProvider
- CommandPaletteProvider
end note

:Load UI Components;
:Load Task Components;
:Load Calendar Timeline;
:Load Command Palette;
:Use Zustand Store and hooks;
:Use API client;

if (Need Backend Data?) then (Yes)
:Call Express API;
:Backend validates request;
:Business logic executed;
:Prisma accesses MySQL;
endif

if (Need AI?) then (Yes)
:Backend sends prompt to 9Router;
:Response normalized;
endif

if (Need WhatsApp?) then (Yes)
:Connect page shows registration flow;
:Inbound WA command handled by backend;
endif

:Render updated UI and snackbar feedback;
stop
@enduml
```

### 1.4 Entity Relationship Model

```text
@startuml
title Smart Task Planner - Entity Relationship Model

class USER {
id : string
name : string
email : string
image : string
passwordHash : string?
whatsappNumber : string?
whatsappChatId : string?
createdAt : datetime
updatedAt : datetime
}

class TASK {
id : string
userId : string
calendarId : string?
title : string
description : string?
deadline : datetime?
priority : string
priorityScore : float
estimatedDuration : int?
status : enum(PENDING,DONE,SKIPPED)
deletedAt : datetime?
skippedAt : datetime?
createdAt : datetime
updatedAt : datetime
}

class TASK_TAG {
id : string
taskId : string
name : string
color : string?
createdAt : datetime
}

class REMINDER {
id : string
taskId : string
remindAt : datetime
sent : boolean
channel : string
createdAt : datetime
}

class CALENDAR {
id : string
userId : string
googleCalendarId : string
googleEventId : string?
lastSyncedAt : datetime?
createdAt : datetime
updatedAt : datetime
}

class OVERVIEW_ANALYSIS_CACHE {
id : string
userId : string
content : text
createdAt : datetime
updatedAt : datetime
}

USER "1" --> "many" TASK : owns
USER "1" --> "many" CALENDAR : connects
USER "1" --> "1" OVERVIEW_ANALYSIS_CACHE : caches
TASK "1" --> "many" TASK_TAG : has
TASK "1" --> "many" REMINDER : has
CALENDAR "1" --> "many" TASK : syncs

@enduml
```

### 1.5 Activity Task Management

```text
@startuml
title Smart Task Planner - Task Management Activity (Updated)

start
:Buka Dashboard / Command Palette / WhatsApp;
:Pilih Aksi Task;

if (Aksi?) then (Tambah Task)
:Input data task baru;
:Validasi input;
:Optional AI parse command;
elseif (Edit Task)
:Pilih task;
:Edit data task;
:Validasi input;
elseif (Hapus Task)
:Pilih task;
:Soft delete task;
:Simpan data;
:Perbarui dashboard;
stop
elseif (Selesai)
:Pilih task;
:Update status menjadi DONE;
:Simpan data;
:Perbarui dashboard;
stop
else (Lewat Deadline)
:Cek tolerance window;
:Auto update status menjadi SKIPPED;
:Simpan data;
:Kirim notifikasi bila perlu;
stop
endif

if (Input valid?) then (Ya)
:Hitung priority score;
:Simpan ke database / local state;
:Invalidate cache overview AI;
:Perbarui daftar prioritas, timeline, dan stats;
else (Tidak)
:Tampilkan error;
endif

stop
@enduml
```

### 1.6 Sequence Create Task

```text
@startuml
title Smart Task Planner - Create Task Sequence (Hybrid + AI)

actor User
participant FrontendUI
participant CommandPalette
participant ExpressAPI
participant AIService
database MySQL

User -> FrontendUI : Input task data / natural command

alt Manual form
FrontendUI -> ExpressAPI : POST /api/tasks
else Command palette AI
FrontendUI -> CommandPalette : Submit natural language
CommandPalette -> ExpressAPI : POST /api/ai/parse-task
ExpressAPI -> AIService : Forward prompt to 9Router
AIService --> ExpressAPI : Structured JSON task
ExpressAPI --> CommandPalette : Parsed task payload
CommandPalette -> ExpressAPI : POST /api/tasks
end

ExpressAPI -> ExpressAPI : Validate request
ExpressAPI -> ExpressAPI : Calculate priority score
ExpressAPI -> MySQL : Insert task via Prisma
MySQL --> ExpressAPI : Saved task
ExpressAPI --> FrontendUI : Success response
FrontendUI --> User : Show updated task list / snackbar

@enduml
```

## 2. Dokumentasi Deployment

- URL Production: <https://taskplanner.dastrevas.com>
- Web Server: Nginx reverse proxy
- Process Manager: PM2
- SSL: Let's Encrypt
- Runtime: Node.js 18+
- Database: MySQL 5.7+

## 3. Link Repository dan Dokumentasi

- Repository: <https://github.com/bayufrd/taskplanner>
- README: `proyek-perangkat-lunak/README.md`
- SKPL: `proyek-perangkat-lunak/docs/Progress_Dokumentasi_SKPL.md`
- Dokumentasi Deployment: `proyek-perangkat-lunak/docs/DEPLOYMENT.md`
- Dokumentasi Database: `proyek-perangkat-lunak/docs/phase0/DATABASE_SETUP.md`

## 4. Catatan Lanjutan

Pengembangan berikutnya disarankan fokus pada:

1. Finalisasi stabilisasi seluruh endpoint reminder dan calendar.
2. Penguatan autentikasi hybrid NextAuth + JWT agar flow makin konsisten.
3. Pengujian otomatis untuk endpoint API, AI parsing, dan WhatsApp inbound.
4. Pengujian sinkronisasi Google Calendar end-to-end.
5. Penambahan test untuk priority algorithm dan command parser.
6. Penambahan dokumentasi API dan diagram arsitektur deployment.
7. Strategi migrasi data dari LocalStorage ke database user.
8. Monitoring, observability, dan alerting production.
9. CI/CD pipeline untuk frontend dan backend.
10. Audit keamanan, log aktivitas, dan backup recovery.
11. Fitur kolaborasi tim, workspace, dan monetisasi produk.
12. Pengembangan analytics dashboard tingkat bisnis dan eksperimen growth.