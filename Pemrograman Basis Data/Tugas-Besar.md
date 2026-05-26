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