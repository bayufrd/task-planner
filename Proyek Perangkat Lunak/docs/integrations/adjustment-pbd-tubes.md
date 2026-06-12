# Penyesuaian Backend Express untuk Requirement PBD Tugas Besar

## 1. Tujuan Dokumen

Dokumen ini membahas 4 area penyesuaian yang paling penting agar backend [`Proyek Perangkat Lunak/backend`](../../backend) lebih dekat dengan requirement pada [`Pemrograman Basis Data/Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:69), khususnya untuk bagian:

1. prepared statement / bind variable,
2. user database terbatas,
3. pengujian performa query,
4. penguatan dokumentasi teknis.

Dokumen ini sengaja dibuat praktis dan operasional, agar bisa langsung dipakai sebagai panduan perbaikan dokumentasi maupun implementasi.

## 2. Ringkasan Masalah yang Sedang Dibahas

## 2.1 Roadmap / Checklist Pengerjaan

| No | Topik | Target | Status Saat Ini | Bukti / Catatan |
|---|---|---|---|---|
| 1 | Prepared statement / bind variable | Gunakan Opsi B dan arahkan query raw ke bentuk yang lebih aman | Sudah dikerjakan | Refactor di [`TaskService`](../../backend/src/modules/tasks/task.service.ts:9) sudah mengganti query `Unsafe` yang bisa dipindahkan ke ORM, termasuk [`createTask()`](../../backend/src/modules/tasks/task.service.ts:10), [`autoSkipOverdueTasks()`](../../backend/src/modules/tasks/task.service.ts:333), [`processWhatsappDeadlineReminders()`](../../backend/src/modules/tasks/task.service.ts:413), [`markWhatsappReminderSent()`](../../backend/src/modules/tasks/task.service.ts:525), dan [`markSkippedNotificationSent()`](../../backend/src/modules/tasks/task.service.ts:537) |
| 2 | User DB terbatas | Ganti koneksi aplikasi dari `root` ke user `taskplanner` | Sudah dikerjakan | Langkah Docker-aware ada di [`## 4.3`](./adjustment-pbd-tubes.md:185), hasil uji koneksi ada di [`## 4.9`](./adjustment-pbd-tubes.md:321), dan `.env` backend sudah diupdate ke user aplikasi |
| 3 | Pengujian performa query | Siapkan benchmark formal minimal 3 query | `EXPLAIN` sudah dikerjakan, benchmark penuh masih sebagian | Uji `EXPLAIN` untuk query overdue candidate sudah berhasil dijalankan 3 kali dan hasilnya dicatat di [`## 5.3`](./adjustment-pbd-tubes.md:391), tetapi benchmark durasi dan 2 query tambahan belum ditambahkan |
| 4 | Dokumentasi teknis | Tambah dokumen DDL, flowchart, validasi, transaksi, dan evaluasi keamanan | Belum dikerjakan penuh | Daftar kebutuhan dokumentasi ada di [`## 6.2`](./adjustment-pbd-tubes.md:456) dan [`## 6.3`](./adjustment-pbd-tubes.md:519) |
| 5 | Verifikasi koneksi MySQL backend | Pastikan kredensial `taskplanner` dapat terkoneksi ke database backend | Sudah diuji | Kredensial di [`backend/.env`](../../backend/.env:2) berhasil login dan membaca metadata database; detail hasil ada di [`## 4.9`](./adjustment-pbd-tubes.md:313) |

Dari analisis sebelumnya di [`migration-java-to-express.md`](./migration-java-to-express.md), ada 4 poin yang perlu dirapikan:

- prepared statement masih dinilai **sebagian**,
- user DB terbatas belum terdokumentasi,
- pengujian performa query belum formal,
- dokumentasi teknis sudah banyak tetapi belum fokus terhadap requirement tugas besar.

Dokumen tugas besar sendiri secara eksplisit menyinggung:

- prepared statement / bind variable di [`Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:75),
- user Oracle khusus di [`Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:76),
- pengujian performa query di [`Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:79),
- dokumentasi teknis di [`Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:89).

## 3. Poin 1 — Prepared Statement / Bind Variable

## 3.1 Kondisi Saat Ini

Pada backend Express sekarang, mayoritas query data menggunakan Prisma ORM, misalnya:

- create task di [`prisma.task.create()`](../../backend/src/modules/tasks/task.service.ts:13)
- read task di [`prisma.task.findMany()`](../../backend/src/modules/tasks/task.service.ts:61)
- detail task di [`prisma.task.findUnique()`](../../backend/src/modules/tasks/task.service.ts:75)
- update task di [`prisma.task.update()`](../../backend/src/modules/tasks/task.service.ts:117)

Di sisi lain, sebelumnya memang ada raw SQL `Unsafe` pada beberapa tempat, tetapi untuk modul task sekarang bagian yang bisa dipindahkan ke ORM sudah direfactor ke query Prisma biasa.

## 3.2 Apakah Status "Sebagian" Masih Tepat?

Untuk penilaian akademik yang lebih adil, status awal "sebagian" sebenarnya perlu diperjelas.

Lebih tepatnya:

- **untuk ORM query biasa: sudah aman secara konsep prepared/bind parameter**,
- **untuk raw SQL: masih perlu perapihan agar bisa diklaim lebih kuat**.

Kenapa?

- Prisma ORM secara default mengirim query terparameterisasi,
- jadi untuk operasi seperti [`findMany()`](../../backend/src/modules/tasks/task.service.ts:61) dan [`update()`](../../backend/src/modules/tasks/task.service.ts:117), konsep bind parameter sudah terpenuhi,
- tetapi penggunaan method bernama `Unsafe` membuat pembuktian akademik menjadi kurang kuat meskipun masih memakai placeholder `?`.

## 3.3 Status yang Disarankan

Agar lebih tepat, tabel penilaian bisa diubah dari:

- `Prepared statement / bind variable = Sebagian`

menjadi:

- `Prepared statement / bind variable = Ada, tetapi perlu diperkuat pada query raw`

Alasan akademiknya:

1. Prisma ORM sudah memenuhi konsep parameterized query.
2. Placeholder `?` pada raw SQL juga menunjukkan arah bind variable.
3. Refactor pada [`TaskService`](../../backend/src/modules/tasks/task.service.ts:9) sudah menghapus penggunaan method `Unsafe` yang sebelumnya paling mudah dipersoalkan pada penilaian akademik.

## 3.4 Agar Menjadi "Full" — Gunakan Opsi B

Untuk penyesuaian tugas besar ini, pendekatan yang dipilih adalah **Opsi B**, yaitu merapikan raw SQL menjadi bentuk yang lebih aman dan lebih mudah dipertanggungjawabkan secara akademik.

Target konkretnya:

1. ganti query candidate overdue ke operasi ORM bila masih bisa menjaga logika yang sama,
2. ganti query candidate reminder ke operasi ORM bila masih bisa menjaga logika yang sama,
3. ganti update flag reminder/notifikasi ke [`prisma.task.update()`](../../backend/src/modules/tasks/task.service.ts:29)-style operation,
4. pastikan seluruh input user tidak pernah di-concatenate langsung ke SQL string,
5. dokumentasikan hasil refactor sebagai bukti prepared statement / bind variable sudah kuat.

Langkah implementasi yang disarankan:

### Langkah 1 — Identifikasi semua query `Unsafe`

Daftar query yang menjadi target revisi pada implementasi ini:

- reset flag reminder setelah create task di [`createTask()`](../../backend/src/modules/tasks/task.service.ts:10)
- pengambilan candidate overdue di [`autoSkipOverdueTasks()`](../../backend/src/modules/tasks/task.service.ts:333)
- pengambilan candidate reminder di [`processWhatsappDeadlineReminders()`](../../backend/src/modules/tasks/task.service.ts:413)
- update flag reminder di [`markWhatsappReminderSent()`](../../backend/src/modules/tasks/task.service.ts:525)
- update flag notifikasi skip di [`markSkippedNotificationSent()`](../../backend/src/modules/tasks/task.service.ts:537)

### Langkah 2 — Prioritaskan query yang bisa dipindahkan ke Prisma ORM

Contoh paling mudah:

- reset flag reminder setelah create task sekarang sudah diganti ke [`prisma.task.update()`](../../backend/src/modules/tasks/task.service.ts:29),
- update flag reminder dan notifikasi skip sekarang juga sudah diarahkan ke [`prisma.task.update()`](../../backend/src/modules/tasks/task.service.ts:525).

### Langkah 3 — Untuk query kompleks, tetap raw tetapi jangan `Unsafe`

Untuk query candidate seperti:

- overdue candidate di [`autoSkipOverdueTasks()`](../../backend/src/modules/tasks/task.service.ts:333)
- reminder candidate di [`processWhatsappDeadlineReminders()`](../../backend/src/modules/tasks/task.service.ts:413)

implementasi sekarang sudah dipindahkan ke [`prisma.task.findMany()`](../../backend/src/modules/tasks/task.service.ts:338) dan [`prisma.task.findMany()`](../../backend/src/modules/tasks/task.service.ts:419) dengan `select` relation ke user, sehingga:

- tidak ada string SQL manual pada dua alur itu,
- filter deadline/status tetap dipertahankan,
- akses ke data user pendukung dilakukan melalui relation Prisma.

### Langkah 4 — Tulis bukti akademik di dokumentasi

Setelah refactor ini, penjelasan dokumentasi dapat diubah menjadi:

- ORM Prisma sudah menggunakan parameterized query,
- query task yang sebelumnya memakai method `Unsafe` sudah dipindahkan ke ORM pada area yang paling penting,
- sehingga poin prepared statement / bind variable dapat dinilai **sudah ada dan kuat**.

## 3.5 Status Baru yang Disarankan setelah Opsi B Dikerjakan

Karena langkah Opsi B pada modul task sudah diterapkan, maka status tabel bisa dinaikkan menjadi:

- `Prepared statement / bind variable = Ada / kuat`

Alasan akademiknya:

1. query ORM Prisma sudah parameterized,
2. query task yang sebelumnya memakai `Unsafe` sudah dipindahkan ke ORM,
3. tidak ada input user yang di-concatenate langsung ke SQL string pada alur task yang direfactor,
4. konsep prepared statement / bind variable terpenuhi secara modern walaupun bukan JDBC literal.

## 3.6 Kesimpulan Poin 1

Kesimpulan final untuk poin ini:

- **Prepared statement / bind variable pada backend Express sudah diperkuat menjadi status penuh pada modul task setelah Opsi B diimplementasikan.**
- **Target utamanya bukan mengganti Prisma, tetapi menghapus atau meminimalkan penggunaan method `Unsafe` dan memastikan semua query tetap terparameterisasi.**

## 4. Poin 2 — Membuat User MySQL Khusus selain root

## 4.1 Kenapa Ini Penting

Pada requirement tugas besar, user database terbatas diwajibkan di [`Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:76).

Walaupun dokumen tugas menulis Oracle user, untuk kondisi backend sekarang yang masih memakai MySQL, konsep yang sama tetap berlaku:

- jangan gunakan `root` untuk aplikasi sehari-hari,
- buat user khusus untuk aplikasi,
- beri privilege secukupnya pada database aplikasi saja.

## 4.2 Apakah Posisi Sekarang Masih root?

Di dokumentasi backend lama ada contoh koneksi MySQL seperti [`DATABASE_URL="mysql://root:0202@192.168.1.2:3307/taskplanner"`](../../backend/README.md:236).

Ini menunjukkan contoh sebelumnya memang masih memakai `root`.

Untuk tugas besar dan praktik yang lebih baik, sebaiknya diganti ke user khusus, misalnya:

- username: `taskplanner`
- password: `Taskplanner123!`

## 4.3 Langkah Membuat User MySQL Baru pada Environment Aktual

Pada environment aktual Anda, perintah `mysql -u root -p` di host gagal karena **client MySQL tidak terpasang di OS host**, sementara server MySQL justru berjalan di container Docker `mysql8` dengan port mapping `3307->3306` seperti terlihat pada output `docker ps` yang Anda kirim.

Artinya, cara yang benar untuk kasus Anda adalah **masuk ke container MySQL**, bukan memanggil client `mysql` dari host Ubuntu.

### Langkah A — Masuk ke shell container MySQL

```bash
docker exec -it mysql8 bash
```

### Langkah B — Login ke MySQL dari dalam container

Jika password root container memang `0202`, jalankan:

```bash
mysql -u root -p0202
```

Jika tidak berhasil, gunakan bentuk interaktif berikut:

```bash
mysql -u root -p
```

lalu ketik password root saat diminta.

### Langkah C — Buat database jika belum ada

```sql
CREATE DATABASE IF NOT EXISTS taskplanner;
```

### Langkah D — Buat user aplikasi

Karena backend kemungkinan akan mengakses MySQL lewat port host `3307`, lebih aman gunakan host `%` untuk user aplikasi:

```sql
CREATE USER 'taskplanner'@'%' IDENTIFIED BY 'Taskplanner123!';
```

Jika ternyata backend berjalan di host yang sama dan Anda ingin lebih ketat, Anda bisa menyesuaikan host nanti. Untuk tahap awal Docker, `%` biasanya paling praktis.

### Langkah E — Berikan privilege hanya ke database aplikasi

```sql
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP
ON taskplanner.*
TO 'taskplanner'@'%';
```

Jika Anda membutuhkan migration yang membuat atau mengubah struktur tabel lewat Prisma, privilege di atas biasanya cukup untuk fase development. Jika nanti ada kebutuhan tambahan, grant bisa disesuaikan lagi.

### Langkah F — Apply privilege

```sql
FLUSH PRIVILEGES;
```

### Langkah G — Verifikasi user

```sql
SELECT user, host FROM mysql.user WHERE user = 'taskplanner';
```

```sql
SHOW GRANTS FOR 'taskplanner'@'%';
```

### Langkah H — Keluar dari MySQL dan container

```sql
EXIT;
```

```bash
exit
```

## 4.4 Alternatif Jika Ingin dari Host Ubuntu

Kalau Anda tetap ingin menjalankan client dari host Ubuntu, Anda harus install client terlebih dahulu, misalnya:

```bash
apt update && apt install -y mysql-client-core-8.0
```

Setelah itu baru bisa login ke server MySQL container melalui port host `3307`:

```bash
mysql -h 127.0.0.1 -P 3307 -u root -p
```

Namun untuk kondisi Anda sekarang, cara **paling aman dan langsung jalan** adalah melalui:

```bash
docker exec -it mysql8 bash
```

## 4.5 Verifikasi User Aplikasi dari Host

Setelah user dibuat, Anda bisa uji login dari host jika client tersedia:

```bash
mysql -h 127.0.0.1 -P 3307 -u taskplanner -p
```

Lalu masukkan password:

```text
Taskplanner123!
```

Jika berhasil masuk dan bisa `USE taskplanner;`, maka user aplikasi sudah siap dipakai.

## 4.6 Ganti Connection String Backend

Setelah user dibuat, connection string backend perlu diganti dari pola `root` menjadi user aplikasi.

Karena MySQL Anda dipublish dari container ke host melalui port `3307`, gunakan contoh [`DATABASE_URL`](../../backend/src/config/env.ts:7) berikut sebagai default:

```env
DATABASE_URL="mysql://taskplanner:Taskplanner123!@127.0.0.1:3307/taskplanner"
```

Port `3306` hanya dipakai di dalam container. Jika backend nanti dijalankan dari container lain pada network Docker yang sama, barulah host/port koneksinya bisa disesuaikan lagi.

## 4.7 Catatan Penting

- MySQL **bukan** Oracle.
- Tapi konsep user terbatas tetap sama.
- Untuk tugas besar formal, kalau nanti benar-benar pindah ke Oracle, maka user terbatas harus dibuat di Oracle juga.
- Untuk kondisi backend sekarang, langkah MySQL user ini sudah sangat baik untuk memperkuat poin keamanan dasar dan praktik deployment.
- Pada environment Anda, **jangan pakai contoh `mysql -u root -p` di host** jika client belum terpasang; gunakan `docker exec` ke container MySQL terlebih dahulu.

## 4.9 Status Uji Koneksi MySQL Backend

Checklist uji yang relevan untuk backend saat ini:

- [x] file env backend sudah memakai user `taskplanner` pada [`backend/.env`](../../backend/.env:2)
- [x] `.env` backend sudah diupdate dari koneksi `root` ke user aplikasi sesuai implementasi terbaru
- [x] kredensial `taskplanner` / `Taskplanner123!` berhasil login ke MySQL pada host `192.168.1.2:3307`
- [x] database aktif terbaca sebagai `taskplanner`
- [x] user aktif terbaca sebagai `taskplanner@%`
- [x] metadata schema dapat diakses dan terdeteksi `10` tabel pada database `taskplanner`
- [ ] proses start backend via [`startServer()`](../../backend/src/server.ts:8) belum bisa diuji langsung dari terminal ini karena command runtime `node` tidak tersedia di environment tool

Hasil uji koneksi langsung:

```text
MYSQL_CONNECT_OK
DATABASE=taskplanner USER=taskplanner@% HOSTNAME=33b8c92eb013
TABLE_COUNT=10
```

Implikasi untuk Prisma:

- user `taskplanner` sudah cukup untuk koneksi runtime backend,
- user ini **berpotensi** cukup untuk migration karena sudah memiliki `CREATE`, `ALTER`, `INDEX`, dan `DROP`,
- tetapi [`prisma migrate dev`](../../backend/package.json:10) kadang juga membutuhkan privilege tambahan tergantung mekanisme shadow database dan perubahan schema,
- jadi untuk development migration penuh, verifikasi akhir tetap perlu dilakukan saat runtime `node`/Prisma CLI tersedia.

Catatan ini sengaja dipisah agar dokumentasi bisa membedakan antara **perubahan dokumentasi**, **konfigurasi env**, dan **hasil verifikasi koneksi nyata**.

## 4.8 Kesimpulan Poin 2

Agar poin keamanan database lebih kuat:

- hentikan penggunaan `root` untuk aplikasi,
- buat user khusus `taskplanner`,
- batasi privilege ke database `taskplanner` saja,
- dokumentasikan langkah ini secara resmi.

## 5. Poin 3 — Pengujian Performa Query agar "Sudah Ada"

## 5.1 Kondisi Saat Ini

Backend sudah memiliki beberapa query yang layak diuji performanya, misalnya:

- statistik task di [`getTaskStats()`](../../backend/src/modules/tasks/task.service.ts:187)
- statistik harian di [`getDailyTaskStats()`](../../backend/src/modules/tasks/task.service.ts:197)
- statistik mingguan di [`getWeeklyTaskStats()`](../../backend/src/modules/tasks/task.service.ts:261)
- query candidate auto-skip di [`autoSkipOverdueTasks()`](../../backend/src/modules/tasks/task.service.ts:328)
- query candidate reminder WhatsApp di [`processWhatsappDeadlineReminders()`](../../backend/src/modules/tasks/task.service.ts:404)

Kondisi saat ini:

- uji `EXPLAIN` untuk satu query overdue candidate **sudah dilakukan**,
- hasilnya konsisten pada 3 kali percobaan,
- tetapi belum ada catatan waktu eksekusi berbasis benchmark berulang,
- dan belum ada evaluasi formal untuk minimal 3 query.

## 5.2 Query Mana yang Sebaiknya Diuji

Untuk requirement tugas besar, minimal pilih 3 query yang cukup representatif:

1. query statistik harian / mingguan,
2. query reminder candidate,
3. query auto-skip overdue candidate.

Alasan:

- ada agregasi waktu,
- ada filter status,
- ada relasi user/task,
- lebih menarik untuk dibahas daripada CRUD sederhana.

## 5.3 Cara Uji yang Disarankan

### Opsi A — Uji langsung di MySQL dengan `EXPLAIN`

Query overdue candidate dari [`autoSkipOverdueTasks()`](../../backend/src/modules/tasks/task.service.ts:333) sudah diuji manual dengan `EXPLAIN` sebanyak 3 kali, dan hasilnya konsisten menghasilkan ringkasan berikut:

```text
| table | type   | key             | rows | Extra       |
| t     | ref    | Task_status_idx | 2    | Using where |
| u     | eq_ref | PRIMARY         | 1    | NULL        |
```

Interpretasi awal:

- tabel `Task` sudah memakai index `Task_status_idx`,
- join ke tabel `User` memakai `PRIMARY`,
- estimasi row kecil (`2` untuk `Task`, `1` untuk `User`),
- filter tambahan tetap dieksekusi lewat `Using where`.

Perintah SQL manual yang dipakai:

```sql
EXPLAIN
SELECT
  t.id,
  t.title,
  t.deadline,
  t.estimatedDuration,
  t.priority,
  t.skippedNotificationSent,
  u.name AS userName,
  u.whatsappNumber AS whatsappNumber
FROM Task t
LEFT JOIN User u ON u.id = t.userId
WHERE t.status = 'PENDING'
  AND t.deletedAt IS NULL
  AND t.deadline <= '2026-06-12 23:59:59';
```

Agar pengujian ini bisa diulang lebih rapi dari sisi Node.js, ditambahkan script [`mysql-explain-task-query.js`](../tools/mysql-explain-task-query.js) yang membaca `DATABASE_URL` atau env `MYSQL_*` lalu menjalankan `EXPLAIN` untuk query yang sama.

### Opsi B — Ukur durasi eksekusi query

Jalankan query benchmark beberapa kali lalu catat durasinya.

Kalau di MySQL CLI bisa gunakan profiling pendekatan manual atau waktu dari client. Bisa juga buat script Node.js kecil untuk mengukur total waktu query.

Contoh format laporan:

| Query | Dataset | Run 1 | Run 2 | Run 3 | Rata-rata |
|---|---:|---:|---:|---:|---:|
| Stats daily | 1.000 task | 12 ms | 11 ms | 13 ms | 12 ms |
| Reminder candidate | 1.000 task | 18 ms | 17 ms | 19 ms | 18 ms |
| Auto skip candidate | 1.000 task | 15 ms | 16 ms | 15 ms | 15.3 ms |

### Opsi C — Bahas index yang sudah ada

Backend sudah punya index pada model [`Task`](../../backend/prisma/schema.prisma:80):

- [`@@index([userId])`](../../backend/prisma/schema.prisma:113)
- [`@@index([deadline])`](../../backend/prisma/schema.prisma:114)
- [`@@index([priority])`](../../backend/prisma/schema.prisma:115)
- [`@@index([status])`](../../backend/prisma/schema.prisma:116)
- [`@@index([deletedAt])`](../../backend/prisma/schema.prisma:117)

Ini sangat penting untuk dibawa ke laporan performa, karena query reminder dan overdue memang banyak bergantung pada `status`, `deadline`, dan `deletedAt`.

## 5.4 Agar Statusnya Bisa Diubah Menjadi "Sudah Ada"

Sebagian syarat sudah mulai terpenuhi karena:

1. satu query penting sudah diuji dengan `EXPLAIN` sebanyak 3 kali,
2. hasil index dan join sudah tercatat,
3. script bantu Node.js sudah disiapkan di [`docs/tools/mysql-explain-task-query.js`](../tools/mysql-explain-task-query.js).

Agar statusnya benar-benar kuat sebagai benchmark performa formal, lanjutkan dengan:

4. uji minimal 2 query penting tambahan,
5. catat waktu eksekusi untuk beberapa run,
6. buat tabel hasil benchmark,
7. tulis evaluasi singkat.

Contoh evaluasi singkat:

- query reminder cukup efisien karena memanfaatkan filter `status`, `deadline`, dan `deletedAt`,
- index pada kolom deadline membantu pencarian rentang waktu,
- query join ke tabel `User` masih wajar pada dataset menengah,
- bottleneck potensial muncul bila jumlah task dan reminder bertambah besar.

## 5.5 Kesimpulan Poin 3

Poin pengujian performa query sekarang **sudah dikerjakan untuk bagian `EXPLAIN` awal** dan **masuk tahap sebagian untuk benchmark penuh**, karena satu query penting sudah diuji 3 kali dengan `EXPLAIN` dan bukti awal index usage sudah tersedia. Yang masih kurang adalah:

- benchmark formal untuk minimal 3 query,
- tabel hasil durasi eksekusi,
- dokumentasi analisis performa yang lebih lengkap.

## 6. Poin 4 — Dokumentasi Teknis Harus Ditingkatkan seperti Apa?

## 6.1 Kondisi Saat Ini

Dokumentasi sudah cukup banyak, misalnya:

- analisis backend di [`APP-express.md`](../APP-express.md)
- analisis requirement migrasi di [`migration-java-to-express.md`](./migration-java-to-express.md)
- laporan utama di [`Laporan_MK_Project_Based_Learning_Smart_Task_Planner.md`](../reports/Laporan_MK_Project_Based_Learning_Smart_Task_Planner.md)
- ringkasan project di [`INDEX.md`](../project/INDEX.md)
- deployment dan setup di folder [`setup`](../setup)

Jadi masalahnya bukan "tidak ada dokumentasi", tetapi:

- belum dipaketkan spesifik mengikuti checklist tugas besar,
- belum menonjolkan DDL, flowchart, transaksi, prepared statement, benchmark, dan user DB terbatas dalam satu rangkaian dokumentasi.

## 6.2 Apa yang Harus Ditingkatkan

Agar dokumentasi teknis makin kuat untuk konteks tugas besar, minimal perlu ada 5 bagian berikut:

### A. DDL database formal

Walaupun schema sudah ada di [`schema.prisma`](../../backend/prisma/schema.prisma:14), tetap lebih baik ada dokumen SQL/DDL turunan.

Isi minimal:

- `CREATE TABLE User`
- `CREATE TABLE Task`
- `CREATE TABLE Reminder`
- `CREATE TABLE Calendar`
- index utama
- foreign key utama

### B. Flowchart/alur CRUD

Tugas besar meminta flowchart di [`Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:94).

Untuk backend Express, cukup buat flow untuk:

1. create task,
2. update task,
3. delete task,
4. get task list.

Minimal bisa berbentuk flow teks dulu, misalnya:

- request masuk
- auth dicek
- validasi body
- service jalan
- Prisma query ke DB
- response sukses / error

### C. Dokumentasi validasi

Sudah ada validasi Zod, tapi perlu dirangkum per fitur:

- auth validation
- task validation
- reminder validation
- calendar validation

### D. Dokumentasi transaksi

Karena transaksi atomik masih gap, dokumentasi harus jujur menyebut:

- area yang single-step dan relatif aman,
- area multi-step yang perlu `prisma.$transaction(...)`,
- rencana peningkatannya.

### E. Evaluasi keamanan dan query

Perlu satu subbagian yang menjelaskan:

- Prisma ORM sudah parameterized,
- area raw query yang masih memakai `Unsafe`,
- penggunaan JWT dan ownership check,
- rekomendasi penguatan user DB terbatas.

## 6.3 Dokumen Apa yang Perlu Ditambah atau Diupdate

Rekomendasi paling praktis:

1. update [`migration-java-to-express.md`](./migration-java-to-express.md) bila perlu status prepared statement diperjelas,
2. tambah dokumen DDL SQL,
3. tambah dokumen benchmark query,
4. tambah dokumen flow CRUD / transaction note,
5. update laporan utama agar empat poin ini masuk resmi.

## 6.4 Kesimpulan Poin 4

Dokumentasi teknis saat ini **sudah kuat sebagai dokumentasi proyek**, tetapi **belum optimal sebagai dokumen kepatuhan tugas besar Pemrograman Basis Data**.

Artinya yang perlu dilakukan bukan mulai dari nol, tetapi:

- mengumpulkan dokumen yang sudah ada,
- menambah bagian yang belum ada,
- menulis ulang beberapa bagian agar langsung menjawab checklist tugas besar.

## 7. Rangkuman Tindakan yang Disarankan

Berikut prioritas tindakan paling efektif:

### Prioritas 1

- hentikan penggunaan `root` pada koneksi aplikasi,
- buat user MySQL `taskplanner`,
- update `DATABASE_URL` ke user aplikasi.

### Prioritas 2

- ubah penilaian prepared statement menjadi lebih akurat,
- dokumentasikan bahwa Prisma ORM sudah memakai parameterized query,
- kurangi penggunaan method raw `Unsafe` bila memungkinkan.

### Prioritas 3

- lakukan benchmark minimal untuk 3 query penting,
- simpan hasilnya dalam tabel dokumentasi.

### Prioritas 4

- susun dokumen teknis tambahan untuk DDL, flowchart CRUD, validasi, transaksi, dan evaluasi keamanan.

## 8. Kesimpulan Final

Untuk 4 poin yang diminta:

1. **Prepared statement**: tidak tepat jika hanya disebut “sebagian” tanpa penjelasan. Prisma ORM sebenarnya sudah cukup kuat secara konsep parameterized query, tetapi raw SQL `Unsafe` perlu diperjelas atau diperbaiki.
2. **User DB terbatas**: harus segera dibenahi dengan membuat user MySQL khusus selain `root`, misalnya `taskplanner`.
3. **Pengujian performa query**: sangat mungkin dinaikkan statusnya menjadi “ada” dengan benchmark sederhana pada query yang memang sudah ada di backend.
4. **Dokumentasi teknis**: dasarnya sudah banyak, tetapi harus difokuskan ulang agar langsung menjawab requirement tugas besar PBD.

Dengan 4 penyesuaian ini, backend Express akan jauh lebih kuat untuk diposisikan sebagai implementasi yang selaras dengan kebutuhan [`Pemrograman Basis Data/Tugas-Besar.md`](../../../Pemrograman%20Basis%20Data/Tugas-Besar.md:129), walaupun stack teknologinya tetap modern dan bukan Java/JDBC literal.