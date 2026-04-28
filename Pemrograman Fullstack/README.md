# Pemrograman Fullstack - PestaKami Backend

Dokumentasi tugas individu backend `PestaKami` untuk mata kuliah Pemrograman Fullstack.

## Ringkasan Project

Project ini adalah backend Express.js + MySQL untuk aplikasi personal `PestaKami`.

Fitur utama:

- user register dan login
- user membuat event
- guest upload foto atau video ke event
- owner melihat gallery hasil upload

## Scope Tugas

Module yang dipilih:

- `PestaKami Event Management + Guest Media Upload`

Kebutuhan tugas yang dipenuhi:

- 1 module utama
- beberapa komponen CRUD
- 1 route transaksi kompleks

## Komponen CRUD

### User

Fitur:

- register user
- login user
- lihat profile

Catatan:

- user tidak dibuat CRUD penuh
- dipakai sebagai autentikasi pendukung

### Event

CRUD utama:

- create event
- get all events milik user
- get detail event
- update event
- delete event

Field utama:

- `name`
- `slug`
- `location`
- `coverUrl`
- `eventDate`
- `expiredAt`
- `isActive`

### Media

CRUD pendukung:

- create media metadata
- get media by event
- get media detail
- delete media

Field utama:

- `eventId`
- `type`
- `url`
- `size`
- `guestName`

## Route Transaksi Kompleks

Route utama:

```text
POST /media/confirm
```

Route ini melakukan:

1. validasi event ada
2. validasi event aktif
3. validasi event belum expired
4. ambil owner event
5. cek storage owner masih cukup
6. simpan data media
7. update `users.storage_used`
8. commit jika semua sukses, rollback jika gagal

## Alur Sistem

1. user register atau login
2. user membuat event
3. event memiliki `slug` publik
4. guest membuka halaman public event
5. guest upload file
6. backend validasi aturan upload
7. media tersimpan dan tampil di gallery event

## Endpoint Minimum

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Event

- `POST /events`
- `GET /events`
- `GET /events/:id`
- `PATCH /events/:id`
- `DELETE /events/:id`
- `GET /events/public/:slug`

### Media

- `POST /media/upload-url`
- `POST /media/confirm`
- `GET /events/:id/media`
- `GET /media/:id`
- `DELETE /media/:id`

## ERD Sederhana

### Entitas

#### `users`

- `id` UUID PK
- `name` VARCHAR
- `email` VARCHAR UNIQUE
- `password_hash` VARCHAR
- `storage_used` BIGINT
- `storage_limit` BIGINT
- `created_at` TIMESTAMP

#### `events`

- `id` UUID PK
- `user_id` UUID FK -> users.id
- `name` VARCHAR
- `slug` VARCHAR UNIQUE
- `location` VARCHAR
- `cover_url` TEXT
- `event_date` DATE
- `expired_at` TIMESTAMP
- `is_active` BOOLEAN
- `created_at` TIMESTAMP

#### `media`

- `id` UUID PK
- `event_id` UUID FK -> events.id
- `type` VARCHAR
- `url` TEXT
- `size` BIGINT
- `guest_name` VARCHAR NULL
- `created_at` TIMESTAMP

### Relasi

- 1 user memiliki banyak event
- 1 event memiliki banyak media

### Diagram

```text
+-------------------+
| users             |
+-------------------+
| id (PK)           |
| name              |
| email (UNIQUE)    |
| password_hash     |
| storage_used      |
| storage_limit     |
| created_at        |
+-------------------+
          |
          | 1
          |
          | N
+-------------------+
| events            |
+-------------------+
| id (PK)           |
| user_id (FK)      |
| name              |
| slug (UNIQUE)     |
| location          |
| cover_url         |
| event_date        |
| expired_at        |
| is_active         |
| created_at        |
+-------------------+
          |
          | 1
          |
          | N
+-------------------+
| media             |
+-------------------+
| id (PK)           |
| event_id (FK)     |
| type              |
| url               |
| size              |
| guest_name        |
| created_at        |
+-------------------+
```

## MySQL Setup

Nama database:

```sql
pestakami_db
```

Langkah setup:

1. buka MySQL
2. jalankan file `pestakami-fullstack-backend/database/schema.sql`
3. salin `.env.example` menjadi `.env`
4. isi koneksi MySQL
5. jalankan backend

Contoh `.env`:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=pestakami_db
JWT_SECRET=super-secret-key
```

## Request Response JSON

### `POST /auth/register`

Request:

```json
{
  "name": "Bayu",
  "email": "bayu@mail.com",
  "password": "rahasia123"
}
```

Response:

```json
{
  "message": "Register berhasil",
  "data": {
    "id": "usr_001",
    "name": "Bayu",
    "email": "bayu@mail.com"
  }
}
```

### `POST /auth/login`

Request:

```json
{
  "email": "bayu@mail.com",
  "password": "rahasia123"
}
```

Response:

```json
{
  "message": "Login berhasil",
  "data": {
    "token": "jwt-token-example",
    "user": {
      "id": "usr_001",
      "name": "Bayu",
      "email": "bayu@mail.com"
    }
  }
}
```

### `POST /events`

Request:

```json
{
  "name": "Pernikahan Bayu dan Jeje",
  "slug": "BAYU25",
  "location": "Jakarta",
  "coverUrl": "https://example.com/cover.jpg",
  "eventDate": "2026-07-12",
  "expiredAt": "2026-07-13T00:00:00.000Z"
}
```

Response:

```json
{
  "message": "Event berhasil dibuat",
  "data": {
    "id": "evt_001",
    "name": "Pernikahan Bayu dan Jeje",
    "slug": "BAYU25",
    "location": "Jakarta",
    "coverUrl": "https://example.com/cover.jpg",
    "eventDate": "2026-07-12",
    "expiredAt": "2026-07-13T00:00:00.000Z",
    "isActive": true
  }
}
```

### `GET /events`

Response:

```json
{
  "message": "Daftar event",
  "data": [
    {
      "id": "evt_001",
      "name": "Pernikahan Bayu dan Jeje",
      "slug": "BAYU25",
      "location": "Jakarta",
      "eventDate": "2026-07-12",
      "isActive": true
    }
  ]
}
```

### `GET /events/:id`

Response:

```json
{
  "message": "Detail event",
  "data": {
    "id": "evt_001",
    "name": "Pernikahan Bayu dan Jeje",
    "slug": "BAYU25",
    "location": "Jakarta",
    "coverUrl": "https://example.com/cover.jpg",
    "eventDate": "2026-07-12",
    "expiredAt": "2026-07-13T00:00:00.000Z",
    "isActive": true
  }
}
```

### `PATCH /events/:id`

Request:

```json
{
  "name": "Pernikahan Bayu Jeje Updated",
  "location": "Bandung",
  "isActive": true
}
```

Response:

```json
{
  "message": "Event berhasil diupdate",
  "data": {
    "id": "evt_001",
    "name": "Pernikahan Bayu Jeje Updated",
    "location": "Bandung",
    "isActive": true
  }
}
```

### `DELETE /events/:id`

Response:

```json
{
  "message": "Event berhasil dihapus"
}
```

### `GET /events/public/:slug`

Response:

```json
{
  "message": "Detail public event",
  "data": {
    "id": "evt_001",
    "name": "Pernikahan Bayu dan Jeje",
    "slug": "BAYU25",
    "location": "Jakarta",
    "coverUrl": "https://example.com/cover.jpg",
    "eventDate": "2026-07-12",
    "expiredAt": "2026-07-13T00:00:00.000Z",
    "isActive": true,
    "uploadEnabled": true
  }
}
```

### `POST /media/upload-url`

Request:

```json
{
  "eventId": "evt_001",
  "fileName": "foto-tamu-1.jpg",
  "fileType": "image/jpeg",
  "fileSize": 1048576
}
```

Response:

```json
{
  "message": "Upload URL berhasil dibuat",
  "data": {
    "uploadUrl": "https://storage.example.com/presigned-url",
    "fileUrl": "https://cdn.example.com/events/evt_001/foto-tamu-1.jpg"
  }
}
```

### `POST /media/confirm`

Request:

```json
{
  "eventId": "evt_001",
  "type": "image",
  "url": "https://cdn.example.com/events/evt_001/foto-tamu-1.jpg",
  "size": 1048576,
  "guestName": "Tamu A"
}
```

Response:

```json
{
  "message": "Media berhasil disimpan",
  "data": {
    "id": "med_001",
    "eventId": "evt_001",
    "type": "image",
    "url": "https://cdn.example.com/events/evt_001/foto-tamu-1.jpg",
    "size": 1048576,
    "guestName": "Tamu A",
    "createdAt": "2026-04-28T10:00:00.000Z"
  }
}
```

### `GET /events/:id/media`

Response:

```json
{
  "message": "Daftar media event",
  "data": [
    {
      "id": "med_001",
      "eventId": "evt_001",
      "type": "image",
      "url": "https://cdn.example.com/events/evt_001/foto-tamu-1.jpg",
      "size": 1048576,
      "guestName": "Tamu A",
      "createdAt": "2026-04-28T10:00:00.000Z"
    }
  ]
}
```

### `GET /media/:id`

Response:

```json
{
  "message": "Detail media",
  "data": {
    "id": "med_001",
    "eventId": "evt_001",
    "type": "image",
    "url": "https://cdn.example.com/events/evt_001/foto-tamu-1.jpg",
    "size": 1048576,
    "guestName": "Tamu A",
    "createdAt": "2026-04-28T10:00:00.000Z"
  }
}
```

### `DELETE /media/:id`

Response:

```json
{
  "message": "Media berhasil dihapus"
}
```

## Validasi Penting

- file hanya boleh `image/jpeg`, `image/png`, `video/mp4`
- max size `20MB`
- upload ditolak jika event expired
- upload ditolak jika event nonaktif
- upload ditolak jika storage owner event penuh

## File dan Folder Penting

- `pestakami-fullstack-backend/.env`
- `pestakami-fullstack-backend/.env.example`
- `pestakami-fullstack-backend/database/schema.sql`
- `pestakami-fullstack-backend/src/server.js`
- `PESTAKAMI_POSTMAN_COLLECTION.json`

## Postman Collection

File collection untuk presentasi:

- `PESTAKAMI_POSTMAN_COLLECTION.json`
