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

Puji syukur ke hadirat Tuhan Yang Maha Esa karena atas rahmat dan karunia-Nya laporan Mata Kuliah **Proyek Perangkat Lunak** dengan metode berbasis proyek ini dapat disusun dengan baik. Laporan ini membahas proses analisis, perancangan, implementasi, dan evaluasi proyek aplikasi **Smart Task Planner**, yaitu sistem manajemen tugas berbasis web yang dilengkapi dengan penjadwalan prioritas cerdas.

Laporan ini disusun sebagai dokumentasi kegiatan proyek yang dilakukan oleh:

- **Nama**: Bayu Farid Mulyanto
- **NIM**: 411251181
- **Mata Kuliah**: Proyek Perangkat Lunak
- **Nama Proyek**: Smart Task Planner
- **Deployment**: <https://taskplanner.dastrevas.com>

Smart Task Planner dikembangkan untuk membantu mahasiswa, pelajar, freelancer, dan profesional dalam mencatat, mengelola, memprioritaskan, dan menjadwalkan tugas secara lebih efektif. Aplikasi ini menggunakan pendekatan prioritas otomatis berbasis 4 faktor, yaitu urgensi, tingkat kepentingan, reminder, dan estimasi durasi pengerjaan.

Penulis menyadari bahwa laporan ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang membangun sangat diharapkan agar pengembangan aplikasi dan dokumentasi proyek dapat menjadi lebih baik. Semoga laporan ini dapat memberikan gambaran yang jelas mengenai proses pengembangan Smart Task Planner serta menjadi referensi dalam penerapan pembelajaran berbasis proyek pada mata kuliah Proyek Perangkat Lunak.

---

# **BAB I PROFIL MITRA** {#bab-i-profil-mitra}

## 1. PROFIL ORGANISASI / PERUSAHAAN / INSTANSI {#profil-organisasi--perusahaan--instansi}

Pada proyek ini, mitra atau objek studi yang digunakan adalah kebutuhan pengguna umum yang membutuhkan sistem manajemen tugas cerdas. Karena proyek dikembangkan sebagai proyek akademik individu untuk mata kuliah **Proyek Perangkat Lunak**, maka profil mitra disesuaikan sebagai profil pengguna sasaran dan lingkungan akademik proyek.

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
| Mata Kuliah | Proyek Perangkat Lunak |
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
| `src/app` | App Router, halaman publik, protected dashboard, API routes |
| `src/components` | Komponen UI seperti task card, calendar timeline, command palette |
| `src/lib` | Utility, hooks, API helpers, auth, constants, types |
| `prisma/schema.prisma` | Schema database Prisma |
| `docs` | Dokumentasi proyek |
| `README.md` | Dokumentasi utama aplikasi |
| `AGENTS.md` | Panduan lokal arah pengembangan agent |

## 2. PENGEMBANGAN DAN DESAIN {#pengembangan-dan-desain}

### 2.1 Desain Solusi

Smart Task Planner dirancang sebagai aplikasi fullstack berbasis Next.js App Router. Desain sistem dibagi menjadi beberapa layer:

1. **Client Layer**
   - Landing page.
   - Dashboard.
   - Task components.
   - Calendar timeline.
   - Command palette.
   - Theme provider dan auth provider.

2. **State Layer**
   - Zustand store untuk state client.
   - LocalStorage persistence pada MVP.

3. **Domain Utility Layer**
   - Priority algorithm.
   - Validation utility.
   - Date utility.
   - Task utility.
   - Type definitions.

4. **Backend Layer**
   - Next.js API Routes.
   - NextAuth.js.
   - Prisma Client.
   - Google Calendar sync service.

5. **Database Layer**
   - MySQL.
   - Prisma schema.

6. **External Integration**
   - Google OAuth 2.0.
   - Google Calendar API.

### 2.2 Spesifikasi Fungsional

| Kode | Kebutuhan Fungsional | Status |
|------|----------------------|--------|
| FR-001 | Sistem menyediakan landing page | Tersedia |
| FR-002 | Sistem menyediakan login Google OAuth | Phase 1 / struktur tersedia |
| FR-003 | Sistem dapat membuat task | Tersedia |
| FR-004 | Sistem dapat mengubah task | Tersedia |
| FR-005 | Sistem dapat menghapus task | Tersedia |
| FR-006 | Sistem dapat menandai task selesai | Tersedia |
| FR-007 | Sistem menghitung prioritas otomatis | Tersedia |
| FR-008 | Sistem mengurutkan task berdasarkan prioritas | Tersedia |
| FR-009 | Sistem memfilter task berdasarkan tanggal | Tersedia |
| FR-010 | Sistem memfilter task berdasarkan tag | Tersedia |
| FR-011 | Sistem mendukung filter prioritas | Tersedia |
| FR-012 | Sistem menampilkan calendar timeline | Tersedia |
| FR-013 | Sistem menyediakan command palette `Ctrl+K` | Tersedia |
| FR-014 | Sistem memproses input conversational/NLP | Tersedia |
| FR-015 | Sistem menyimpan data melalui LocalStorage | Tersedia |
| FR-016 | Sistem mendukung dark/light mode | Tersedia |
| FR-017 | Sistem menyediakan API CRUD task | Phase 1 |
| FR-018 | Sistem menyimpan data ke MySQL melalui Prisma | Phase 1 |
| FR-019 | Sistem melakukan Google Calendar Sync | Phase 1 |
| FR-020 | Sistem menyediakan reminder dan notifikasi | Direncanakan |

### 2.3 Spesifikasi Non-Fungsional

| Kode | Kebutuhan Non-Fungsional | Target |
|------|---------------------------|--------|
| NFR-001 | Menggunakan TypeScript untuk type safety | Wajib |
| NFR-002 | Input pengguna divalidasi | Wajib |
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

### 2.4 Prototyping

Prototype aplikasi diwujudkan dalam MVP dengan fitur utama:

- Dashboard task.
- Modal task baru.
- Task card.
- Priority list.
- Calendar timeline.
- Header dan theme toggle.
- Command palette.
- Provider untuk auth, theme, language, snackbar, dan command palette.

Komponen utama pada aplikasi:

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `TaskCard.tsx` | `src/components/tasks` | Menampilkan detail task |
| `NewTaskModal.tsx` | `src/components/tasks` | Form pembuatan task |
| `TaskPriorityList.tsx` | `src/components/tasks` | Daftar task berdasarkan prioritas |
| `CalendarTimeline.tsx` | `src/components/calendar` | Visualisasi task dalam timeline |
| `CommandPalette.tsx` | `src/components/command` | Interface command berbasis `Ctrl+K` |
| `Header.tsx` | `src/components/layout` | Header aplikasi |
| `ThemeProvider.tsx` | `src/components/providers` | Pengelolaan tema |
| `AuthSessionProvider.tsx` | `src/components/providers` | Pengelolaan session auth |

## 3. IMPLEMENTASI {#implementasi}

### 3.1 Implementasi Teknologi

| Area | Teknologi |
|------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | TailwindCSS |
| State Management | Zustand |
| Backend | Next.js API Routes |
| Database ORM | Prisma |
| Database | MySQL 5.7+ |
| Authentication | NextAuth.js |
| OAuth | Google OAuth 2.0 |
| Calendar Integration | Google Calendar API |
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

Aplikasi memiliki struktur API pada:

- `src/app/api/tasks/route.ts`
- `src/app/api/tasks/[id]/route.ts`
- `src/app/api/tasks/priority/route.ts`
- `src/app/api/sync/calendar/route.ts`
- `src/app/api/auth/[...nextauth]/route.ts`

Model database inti:

- `users`
- `tasks`
- `task_tags`
- `reminders`
- `calendars`

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

Pengujian dilakukan untuk memastikan fitur utama berjalan sesuai kebutuhan.

| No | Skenario Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|----------------------|--------|
| 1 | Membuka landing page | Halaman publik tampil | Lulus |
| 2 | Membuat task baru | Task tersimpan dan muncul di daftar | Lulus |
| 3 | Mengedit task | Data task berubah | Lulus |
| 4 | Menghapus task | Task hilang dari daftar | Lulus |
| 5 | Menandai task selesai | Status task berubah menjadi selesai | Lulus |
| 6 | Menghitung prioritas | Priority score muncul sesuai bobot | Lulus |
| 7 | Filter task berdasarkan tanggal | Task terfilter sesuai tanggal | Lulus |
| 8 | Filter task berdasarkan tag | Task terfilter sesuai tag | Lulus |
| 9 | Membuka command palette | Command palette terbuka dengan `Ctrl+K` | Lulus |
| 10 | Mengubah tema | Dark/light mode berubah | Lulus |
| 11 | Refresh browser | Data MVP tetap tersimpan di LocalStorage | Lulus |
| 12 | Build production | Aplikasi dapat dibuild | Perlu validasi berkala |
| 13 | Google OAuth | Login Google berjalan | Phase 1 |
| 14 | Google Calendar Sync | Task tersinkron ke Google Calendar | Phase 1 |

Perintah validasi yang direkomendasikan:

```bash
npm run lint
npm run type-check
npm run build
```

## 5. UMPAN BALIK {#umpan-balik}

Umpan balik yang diperoleh berdasarkan analisis kebutuhan pengguna dan evaluasi fitur:

1. Pengguna membutuhkan antarmuka yang sederhana namun informatif.
2. Priority ranking menjadi nilai utama karena membantu menentukan urutan pengerjaan.
3. Calendar timeline membantu pengguna melihat beban tugas.
4. Command palette mempercepat pencatatan task.
5. Integrasi Google Calendar menjadi fitur penting untuk pengembangan berikutnya.
6. Aplikasi perlu menjaga performa agar tetap cepat saat jumlah task bertambah.
7. Sistem perlu memastikan data pengguna aman ketika database dan autentikasi diterapkan.

---

# BAB IV. KESIMPULAN {#bab-iv-kesimpulan}

Smart Task Planner merupakan proyek aplikasi web untuk mata kuliah **Proyek Perangkat Lunak** yang dikembangkan dengan metode berbasis proyek. Aplikasi ini bertujuan membantu pengguna mengelola tugas dengan lebih efektif melalui fitur task management, priority scoring, filtering, calendar timeline, command palette, dan dukungan dark/light mode.

MVP aplikasi telah mencakup fitur utama seperti task CRUD, algoritma prioritas otomatis, filter, timeline, LocalStorage persistence, command palette, dan responsive UI. Pengembangan selanjutnya diarahkan pada integrasi fullstack menggunakan MySQL/Prisma, autentikasi NextAuth.js dengan Google OAuth, reminder, API CRUD, serta sinkronisasi Google Calendar.

Berdasarkan proses analisis, desain, implementasi, dan pengujian, Smart Task Planner telah memenuhi tujuan utama sebagai sistem manajemen tugas cerdas. Dengan deployment pada <https://taskplanner.dastrevas.com>, aplikasi dapat menjadi contoh implementasi modern pengembangan perangkat lunak fullstack berbasis Next.js, React, TypeScript, dan integrasi cloud/API eksternal.

---

# LAMPIRAN {#lampiran}

## 1. Diagram Pemodelan Sistem

### 1.1 Use Case Flow

```text
@startuml
title Smart Task Planner - Use Case Flow

start
:Pengunjung membuka aplikasi;
:Melihat Landing Page;

if (Pengguna login?) then (Ya)
:Login dengan Google;
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
- Delete
- Complete
end note

:Melihat Daftar Prioritas;
:Memfilter Task;
:Melihat Calendar Timeline;

if (Menggunakan Command Palette?) then (Ya)
:Tekan Ctrl+K;
:Input perintah natural language;
:Proses command;
else (Tidak)
:Gunakan UI dashboard;
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
title Smart Task Planner - Context Flow

start
:User Input;
note right
- task
- command
- filter
- login
end note

:Smart Task Planner Process;

if (Authentication Required?) then (Yes)
:Google OAuth Login;
:Create User Session;
else (No)
:Use Current Session or Public Access;
endif

if (Storage Mode?) then (LocalStorage)
:Persist MVP Data to Browser;
else (Database)
:Persist Data to MySQL via Prisma;
endif

if (Calendar Sync?) then (Yes)
:Send Event to Google Calendar API;
:Store Calendar Metadata;
else (No)
:Skip External Sync;
endif

:Display Task List, Priority, Timeline;
stop
@enduml
```

### 1.3 Component Flow

```text
@startuml
title Smart Task Planner - Component Flow

start
:Next.js App Router;
:Load Page;

if (Protected Route?) then (Yes)
:Middleware Check Session;
if (Session Valid?) then (Yes)
:Render Dashboard;
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

:Load Task Components;
:Load Calendar Timeline;
:Load Command Palette;
:Use Zustand Store;
:Use Priority and Validation Utilities;

if (Backend Needed?) then (Yes)
:Call API Routes;
:Use Prisma and MySQL;
else (No)
:Update Local State;
endif

:Render Updated UI;
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
createdAt : datetime
updatedAt : datetime
}

class TASK {
id : string
userId : string
calendarId : string
title : string
description : string
dueDate : datetime
priority : string
priorityScore : float
estimatedDuration : int
completed : boolean
createdAt : datetime
updatedAt : datetime
}

class TASK_TAG {
id : string
taskId : string
name : string
color : string
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
googleEventId : string
lastSyncedAt : datetime
createdAt : datetime
updatedAt : datetime
}

USER "1" --> "many" TASK : owns
USER "1" --> "many" CALENDAR : connects
TASK "1" --> "many" TASK_TAG : has
TASK "1" --> "many" REMINDER : has
CALENDAR "1" --> "many" TASK : syncs

@enduml
```

### 1.5 Activity Task Management

```text
@startuml
title Smart Task Planner - Task Management Activity

start
:Buka Dashboard;
:Pilih Aksi Task;

if (Aksi?) then (Tambah Task)
:Input data task baru;
:Validasi Input;
elseif (Edit Task)
:Pilih task;
:Edit data task;
:Validasi Input;
elseif (Hapus Task)
:Pilih task;
:Hapus task;
:Simpan Data;
:Perbarui Dashboard;
stop
else (Tandai Selesai)
:Pilih task;
:Update status completed;
:Simpan Data;
:Perbarui Dashboard;
stop
endif

if (Input valid?) then (Ya)
:Hitung Priority Score;
:Simpan Data;
:Perbarui Daftar Prioritas dan Timeline;
else (Tidak)
:Tampilkan Error;
endif

stop
@enduml
```

### 1.6 Sequence Create Task

```text
@startuml
title Smart Task Planner - Create Task Sequence

actor User
participant UI
participant Validator
participant Priority
participant Store
database Database

User -> UI : Input task data
UI -> Validator : Validate task
Validator --> UI : Validation result

alt Valid data
UI -> Priority : Calculate priority score
Priority --> UI : Priority score
UI -> Store : Save task

alt MVP LocalStorage
Store --> UI : Saved locally
else Phase 1 Database
Store -> Database : Insert task
Database --> Store : Saved task
Store --> UI : Task response
end

UI --> User : Show updated priority list
else Invalid data
UI --> User : Show error message
end

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
- README: `Proyek Perangkat Lunak/README.md`
- SKPL: `Proyek Perangkat Lunak/docs/Progress_Dokumentasi_SKPL.md`
- Dokumentasi Deployment: `Proyek Perangkat Lunak/docs/DEPLOYMENT.md`
- Dokumentasi Database: `Proyek Perangkat Lunak/docs/phase0/DATABASE_SETUP.md`

## 4. Catatan Lanjutan

Pengembangan berikutnya disarankan fokus pada:

1. Finalisasi integrasi database Prisma/MySQL.
2. Penguatan autentikasi Google OAuth.
3. Pengujian endpoint API CRUD.
4. Pengujian sinkronisasi Google Calendar.
5. Penambahan test untuk priority algorithm.
6. Penambahan dokumentasi API.
7. Strategi migrasi data dari LocalStorage ke database user.