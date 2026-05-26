# Dokumentasi Endpoint API

Dokumen ini merangkum endpoint yang **sudah diimplementasikan** pada aplikasi [`TaskPlannerApplication`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:12) di project [`Pemrograman Basis Data/TaskPlanner-Java-Backend`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend).

## Ringkasan Aplikasi

- Framework: Spring Boot
- Context path API: `/api` berdasarkan konfigurasi [`application.yml`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/resources/application.yml:31)
- Controller utama:
  - [`TaskPlannerApplication`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:12)
  - [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:23)
  - [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:33)

## Base URL

Semua endpoint menggunakan prefix:

```text
/api
```

Contoh local development:

```text
http://localhost:8080/api
```

---

## 1. Health Check

### GET `/api/health`

Sumber implementasi: [`health()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:18)

Digunakan untuk memastikan aplikasi berjalan.

**Response 200**

```text
Task Planner API is running!
```

---

## 2. Authentication

Sumber implementasi controller: [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:23)

### POST `/api/auth/register`

Sumber implementasi: [`register()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:36)

Mendaftarkan user baru menggunakan email dan password.

#### Request Body

Struktur request mengikuti [`RegisterRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/RegisterRequest.java:7)

```json
{
  "email": "alice@example.com",
  "name": "Alice",
  "password": "secret123"
}
```

#### Validasi

- `email`: wajib, format email valid
- `name`: wajib
- `password`: wajib, minimal 6 karakter

#### Response Sukses `200 OK`

```json
{
  "success": true,
  "message": "registered",
  "data": "<userId>"
}
```

#### Response Gagal

- `409 Conflict` jika email sudah terdaftar
- `500 Internal Server Error` jika terjadi error database atau error internal lain

#### Catatan Implementasi

- Password di-hash menggunakan BCrypt di [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:48)
- Endpoint juga membuat record akun lokal dengan provider `local` di [`createAccount()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:60)

### POST `/api/auth/login`

Sumber implementasi: [`login()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:75)

Login user menggunakan email dan password, lalu menghasilkan access token dan refresh token.

#### Request Body

Struktur request mengikuti [`LoginRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/LoginRequest.java:6)

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

#### Validasi

- `email`: wajib, format email valid
- `password`: wajib

#### Response Sukses `200 OK`

Response mengikuti [`LoginResponse`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/LoginResponse.java)

```json
{
  "accessToken": "<jwt-access-token>",
  "refreshToken": "<refresh-token>",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

#### Response Gagal

- `401 Unauthorized` dengan body text `invalid_credentials` jika email tidak ditemukan atau password salah
- `500 Internal Server Error` jika terjadi error internal

#### Catatan Implementasi

- JWT dibuat melalui [`TokenService`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/service/TokenService.java)
- Token kemudian dicoba untuk disimpan ke tabel account melalui [`updateAccountTokens()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:91)

---

## 3. Task Management

Sumber implementasi controller: [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:33)

> Catatan: pada implementasi saat ini, `userId` masih di-hardcode menjadi `user-123` di beberapa endpoint task, misalnya pada [`getTasks()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:71), [`createTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:107), dan [`getTasksByPriority()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:240).

### GET `/api/tasks`

Sumber implementasi: [`getTasks()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:58)

Mengambil daftar task dengan pagination, pencarian, filter, dan sorting.

#### Query Parameters

- `page` default `1`
- `limit` default `20`
- `search` opsional
- `status` opsional
- `priority` opsional
- `sort` default `deadline`
- `order` default `asc`

#### Contoh Request

```text
GET /api/tasks?page=1&limit=10&status=PROGRESS&priority=HIGH&sort=deadline&order=asc
```

#### Response Sukses `200 OK`

Response bertipe [`PaginatedResponse<Task>`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/PaginatedResponse.java)

```json
{
  "success": true,
  "message": "success",
  "data": [
    {
      "id": "task-id",
      "title": "Finish report",
      "description": "Prepare weekly summary",
      "deadline": "2026-04-20T10:00:00",
      "priority": "HIGH",
      "status": "PROGRESS",
      "estimatedDuration": 120
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

### POST `/api/tasks`

Sumber implementasi: [`createTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:98)

Membuat task baru.

#### Request Body

Struktur request mengikuti [`CreateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/CreateTaskRequest.java:6)

```json
{
  "title": "Finish report",
  "description": "Prepare weekly summary",
  "deadline": "2026-04-20T10:00:00",
  "priority": "HIGH",
  "status": "PROGRESS",
  "estimatedDuration": 120
}
```

#### Response Sukses `201 Created`

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task-id",
    "title": "Finish report",
    "description": "Prepare weekly summary",
    "deadline": "2026-04-20T10:00:00",
    "priority": "HIGH",
    "status": "PROGRESS",
    "estimatedDuration": 120
  }
}
```

#### Response Gagal

- `400 Bad Request` jika `title` kosong atau request tidak valid
- `500 Internal Server Error` jika gagal membuat task

### GET `/api/tasks/{id}`

Sumber implementasi: [`getTaskById()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:135)

Mengambil detail task berdasarkan ID.

#### Response Sukses `200 OK`

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "task-id",
    "title": "Finish report",
    "description": "Prepare weekly summary",
    "deadline": "2026-04-20T10:00:00",
    "priority": "HIGH",
    "status": "PROGRESS",
    "estimatedDuration": 120
  }
}
```

#### Response Gagal

- `404 Not Found` jika task tidak ditemukan

### PUT `/api/tasks/{id}`

Sumber implementasi: [`updateTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:169)

Memperbarui data task.

#### Request Body

Struktur request mengikuti [`UpdateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/UpdateTaskRequest.java:6)

Semua field bersifat opsional.

```json
{
  "title": "Finish final report",
  "description": "Prepare weekly summary and slides",
  "deadline": "2026-04-21T15:00:00",
  "priority": "MEDIUM",
  "status": "DONE",
  "estimatedDuration": 150
}
```

#### Response Sukses `200 OK`

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task-id",
    "title": "Finish final report",
    "description": "Prepare weekly summary and slides",
    "deadline": "2026-04-21T15:00:00",
    "priority": "MEDIUM",
    "status": "DONE",
    "estimatedDuration": 150
  }
}
```

#### Response Gagal

- `404 Not Found` jika task tidak ditemukan
- `500 Internal Server Error` jika gagal memperbarui task

### DELETE `/api/tasks/{id}`

Sumber implementasi: [`deleteTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:200)

Menghapus task berdasarkan ID.

#### Response Sukses `200 OK`

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

#### Response Gagal

- `404 Not Found` jika task tidak ditemukan
- `500 Internal Server Error` jika gagal menghapus task

### GET `/api/tasks/priority/{level}`

Sumber implementasi: [`getTasksByPriority()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:232)

Mengambil daftar task berdasarkan level prioritas.

#### Path Parameter

- `level`: `HIGH`, `MEDIUM`, atau `LOW`

#### Query Parameters

- `page` default `1`
- `limit` default `20`

#### Contoh Request

```text
GET /api/tasks/priority/HIGH?page=1&limit=10
```

#### Response Sukses `200 OK`

Response bertipe [`PaginatedResponse<Task>`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/PaginatedResponse.java)

```json
{
  "success": true,
  "message": "success",
  "data": [
    {
      "id": "task-id",
      "title": "Finish report",
      "priority": "HIGH",
      "status": "PROGRESS"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

#### Response Gagal

- `500 Internal Server Error` jika gagal mengambil data task

---

## 4. Endpoint yang Belum Diimplementasikan

Beberapa endpoint masih disebut di [`README.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/README.md) sebagai rencana, namun **belum ada implementasinya** pada controller saat ini, antara lain:

- `GET /api/planner/today`
- `POST /api/tasks/{id}/complete`
- `POST /api/tasks/{id}/skip`

Referensi roadmap: [`README.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/README.md:82)

---

## 5. Daftar Endpoint Implemented

| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/health` | Health check aplikasi |
| POST | `/api/auth/register` | Registrasi user lokal |
| POST | `/api/auth/login` | Login dan generate token |
| GET | `/api/tasks` | Ambil daftar task dengan filter/pagination |
| POST | `/api/tasks` | Buat task baru |
| GET | `/api/tasks/{id}` | Ambil detail task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Hapus task |
| GET | `/api/tasks/priority/{level}` | Ambil task berdasarkan prioritas |

---

## 6. Struktur Request DTO yang Dipakai

- [`RegisterRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/RegisterRequest.java:7)
- [`LoginRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/LoginRequest.java:6)
- [`CreateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/CreateTaskRequest.java:6)
- [`UpdateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/UpdateTaskRequest.java:6)

Dokumentasi ini dibuat berdasarkan implementasi source code saat ini, bukan hanya berdasarkan rencana pada [`README.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/README.md).