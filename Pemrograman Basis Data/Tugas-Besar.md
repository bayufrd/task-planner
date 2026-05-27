Berikut hasil **image to text** dan sudah saya rapikan menjadi format **Markdown dokumentasi**:

````markdown
# Implementasi Aplikasi CRUD Berbasis Oracle dengan Validasi, Transaksi, dan Dokumentasi

## 1. Judul Tugas

**Implementasi Aplikasi CRUD Berbasis Oracle dengan Validasi, Transaksi, dan Dokumentasi**

---

## 2. Deskripsi Tugas

Mahasiswa diminta mengembangkan aplikasi sederhana yang terhubung ke **Oracle Database** dengan **Java (JDBC)** atau tool integrasi lain yang didukung, misalnya **C# / ODP.NET**.

Fitur yang harus ada:

### 2.1 Koneksi Database
Aplikasi harus dapat melakukan koneksi ke Oracle Database.

Contoh koneksi:
- Java menggunakan JDBC
- C# menggunakan ODP.NET

### 2.2 Antarmuka CRUD
Aplikasi memiliki antarmuka CRUD, baik berbasis:

- Console
- GUI sederhana

CRUD digunakan untuk mengelola data:

- Mahasiswa
- Mata Kuliah

### 2.3 Validasi Input
Aplikasi wajib menerapkan validasi input.

Contoh validasi:

- NIM harus unik
- Nilai harus berada pada rentang 0 sampai 100
- Data wajib tidak boleh kosong

### 2.4 Manajemen Transaksi
Operasi database seperti `INSERT` dan `UPDATE` harus bersifat atomic.

Artinya, jika proses berhasil maka dilakukan:

```sql
COMMIT;
````

Jika proses gagal maka dilakukan:

```sql
ROLLBACK;
```

### 2.5 Error Handling

Aplikasi harus memiliki penanganan error untuk kondisi seperti:

* Kegagalan koneksi database
* Query SQL salah
* Data tidak valid
* Transaksi gagal

### 2.6 Keamanan Dasar

Aplikasi harus menerapkan keamanan dasar dalam pemrograman basis data.

Hal yang wajib dilakukan:

1. Menggunakan **bind variables** atau **prepared statements** untuk mencegah SQL Injection.
2. Membuat user Oracle khusus dengan hak akses terbatas.
3. Tidak menggunakan user bawaan seperti `SYS` atau `SYSTEM`.

### 2.7 Pengujian Performa Query

Aplikasi harus melakukan pengujian performa query.

Yang dilaporkan:

* Query kompleks yang diuji
* Waktu eksekusi query
* Hasil evaluasi performa

### 2.8 Dokumentasi Teknis

Dokumentasi teknis harus memuat:

1. ERD dan skema tabel DDL
2. Flowchart proses CRUD
3. Deskripsi validasi dan transaksi
4. Evaluasi keamanan dan masalah yang ditemukan

### 2.9 Presentasi Demo

Mahasiswa wajib melakukan presentasi demo aplikasi dengan durasi:

**10–15 menit**

---

## 3. Langkah Pengerjaan Tugas

Langkah pengerjaan tugas adalah sebagai berikut:

1. Mengembangkan aplikasi CRUD dengan koneksi ke Oracle Database.
2. Menerapkan validasi, transaksi, dan error handling.
3. Menerapkan konsep keamanan dasar dalam pemrograman basis data.
4. Menyusun dokumentasi teknis dan melakukan presentasi proyek.

---

## 4. Bentuk dan Format Luaran Tugas

Luaran tugas yang harus dikumpulkan:

1. File program Java atau C#.
2. Driver JDBC atau ODP.NET.
3. Script database Oracle dengan format `.sql`.
4. Dokumentasi teknis sebanyak 10–15 halaman dalam format PDF.
5. Video demo presentasi dengan durasi maksimal 15 menit.

---

## 5. Ringkasan Kebutuhan Sistem

| No | Kebutuhan          | Keterangan                              |
| -- | ------------------ | --------------------------------------- |
| 1  | Database           | Oracle Database                         |
| 2  | Bahasa Pemrograman | Java atau C#                            |
| 3  | Koneksi            | JDBC atau ODP.NET                       |
| 4  | Fitur Utama        | CRUD Mahasiswa dan Mata Kuliah          |
| 5  | Validasi           | NIM unik, nilai 0–100, data wajib       |
| 6  | Transaksi          | COMMIT dan ROLLBACK                     |
| 7  | Keamanan           | Prepared Statement dan user terbatas    |
| 8  | Dokumentasi        | ERD, DDL, Flowchart, Validasi, Evaluasi |
| 9  | Presentasi         | Demo 10–15 menit                        |

---

## 6. Rekomendasi Struktur Folder Project

Contoh struktur folder:

```text
oracle-crud-app/
│
├── src/
│   ├── Main.java
│   ├── DatabaseConnection.java
│   ├── MahasiswaDAO.java
│   ├── MataKuliahDAO.java
│   └── ValidationHelper.java
│
├── database/
│   ├── schema.sql
│   ├── insert_sample_data.sql
│   └── query_performance.sql
│
├── docs/
│   ├── dokumentasi-teknis.pdf
│   ├── erd.png
│   └── flowchart.png
│
├── lib/
│   └── ojdbc.jar
│
└── README.md
```

---

## 7. Checklist Pengerjaan

| No | Item                                      | Status |
| -- | ----------------------------------------- | ------ |
| 1  | Membuat database Oracle                   | Belum  |
| 2  | Membuat user Oracle khusus                | Belum  |
| 3  | Membuat tabel Mahasiswa                   | Belum  |
| 4  | Membuat tabel Mata Kuliah                 | Belum  |
| 5  | Membuat koneksi aplikasi ke database      | Belum  |
| 6  | Membuat fitur Create                      | Belum  |
| 7  | Membuat fitur Read                        | Belum  |
| 8  | Membuat fitur Update                      | Belum  |
| 9  | Membuat fitur Delete                      | Belum  |
| 10 | Menambahkan validasi input                | Belum  |
| 11 | Menambahkan transaksi COMMIT dan ROLLBACK | Belum  |
| 12 | Menambahkan error handling                | Belum  |
| 13 | Menggunakan prepared statement            | Belum  |
| 14 | Menguji performa query                    | Belum  |
| 15 | Membuat dokumentasi teknis                | Belum  |
| 16 | Membuat video demo                        | Belum  |

---

## 8. Kesimpulan

Tugas ini bertujuan untuk melatih mahasiswa dalam membuat aplikasi CRUD sederhana yang terhubung dengan Oracle Database. Selain fitur CRUD, mahasiswa juga wajib memahami validasi input, transaksi database, error handling, keamanan dasar, pengujian performa query, dan penyusunan dokumentasi teknis.

````

Ini bisa langsung kamu copy ke file:

```text
README.md
````

atau dijadikan dasar isi dokumentasi PDF 10–15 halaman.
