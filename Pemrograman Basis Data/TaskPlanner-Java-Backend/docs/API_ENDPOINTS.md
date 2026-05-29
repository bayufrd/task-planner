# Dokumentasi Endpoint API

Dokumen ini merangkum endpoint yang **sudah diimplementasikan** pada aplikasi [`TaskPlannerApplication`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:12) di project [`Pemrograman Basis Data/TaskPlanner-Java-Backend`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend).

## Ringkasan Aplikasi

- Framework: Spring Boot
- Context path API: `/api` berdasarkan konfigurasi [`application.yml`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/resources/application.yml:31)
- Controller utama:
  - [`TaskPlannerApplication`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/TaskPlannerApplication.java:12)
  - [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:27)
  - [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:28)
  - [`PlannerController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/PlannerController.java:18)

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

#### Response Sukses `201 Created`

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Alice",
      "email": "alice@example.com",
      "theme": "light",
      "image": null,
      "createdAt": null
    },
    "token": "<jwt-access-token>",
    "refreshToken": "<refresh-token>",
    "tokenType": "Bearer",
    "expiresIn": 3600
  },
  "timestamp": "2026-05-27T03:00:00"
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

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Alice",
      "email": "alice@example.com",
      "theme": "light",
      "image": null,
      "createdAt": "2026-05-27T02:55:00"
    },
    "token": "<jwt-access-token>",
    "refreshToken": "<refresh-token>",
    "tokenType": "Bearer",
    "expiresIn": 3600
  },
  "timestamp": "2026-05-27T03:05:00"
}
```

#### Response Gagal

- `401 Unauthorized` dengan body text `invalid_credentials` jika email tidak ditemukan atau password salah
- `500 Internal Server Error` jika terjadi error internal

#### Catatan Implementasi

- JWT dibuat melalui [`TokenService`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/service/TokenService.java)
- Token kemudian dicoba untuk disimpan ke tabel account melalui [`updateAccountTokens()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/repository/AuthRepository.java:73)

### POST `/api/auth/refresh`

Sumber implementasi: [`refresh()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:160)

Memvalidasi `refreshToken`, lalu menerbitkan ulang access token dan me-rotate refresh token.

#### Request Body

```json
{
  "refreshToken": "<refresh-token>"
}
```

#### Response Sukses `200 OK`

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Alice",
      "email": "alice@example.com",
      "theme": "light",
      "image": null,
      "createdAt": "2026-05-27T02:55:00"
    },
    "token": "<new-jwt-access-token>",
    "refreshToken": "<new-refresh-token>",
    "tokenType": "Bearer",
    "expiresIn": 3600
  },
  "timestamp": "2026-05-29T09:00:00"
}
```

#### Response Gagal

- `401 Unauthorized` jika `refreshToken` kosong, invalid, atau tidak ditemukan

#### Catatan Implementasi

- Lookup refresh token dilakukan melalui [`findUserByRefreshToken()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/repository/AuthRepository.java:79)
- Endpoint ini melakukan token rotation dengan menyimpan pasangan token baru via [`updateAccountTokens()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/repository/AuthRepository.java:73)

---

## 3. Task Management

Sumber implementasi controller: [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:28)

> Catatan: endpoint task sekarang memerlukan header `Authorization: Bearer <accessToken>` dan `userId` di-resolve dari JWT subject, bukan hardcoded lagi.

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

#### Header wajib untuk endpoint task privat

```http
Authorization: Bearer <accessToken>
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

### POST `/api/tasks/{id}/complete`

Sumber implementasi: [`completeTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:217)

Menandai task milik user login sebagai selesai.

#### Header

```http
Authorization: Bearer <accessToken>
```

#### Response Sukses `200 OK`

```json
{
  "success": true,
  "message": "Task completed successfully",
  "data": {
    "id": "task-id",
    "userId": "user-id",
    "title": "Finish final report",
    "status": "DONE",
    "completedAt": "2026-05-27T03:17:00"
  },
  "timestamp": "2026-05-27T03:17:00"
}
```

#### Response Gagal

- `401 Unauthorized` jika token tidak ada / invalid
- `404 Not Found` jika task bukan milik user atau task tidak ditemukan

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

## 4. Planner

Sumber implementasi controller: [`PlannerController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/PlannerController.java:18)

### GET `/api/planner/today`

Sumber implementasi: [`getTodayPlan()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/PlannerController.java:26)

Menghasilkan today plan milik user login berdasarkan JWT dan priority score dinamis.

#### Header

```http
Authorization: Bearer <accessToken>
```

#### Query Parameters

- `limit` default `5`, minimum `1`, maksimum `10`

#### Response Sukses `200 OK`

```json
{
  "success": true,
  "message": "Today plan generated successfully",
  "data": [
    {
      "task": {
        "id": "task-id",
        "userId": "user-id",
        "title": "Finish report",
        "deadline": "2026-05-30T21:00:00",
        "priority": "HIGH",
        "status": "TODO"
      },
      "priorityScore": 8,
      "priority": "HIGH",
      "status": "TODO",
      "deadline": "2026-05-30T21:00:00"
    }
  ],
  "timestamp": "2026-05-27T03:22:00"
}
```

#### Response Gagal

- `401 Unauthorized` jika token tidak ada / invalid
- `500 Internal Server Error` jika gagal generate today plan

---

## 5. Daftar Endpoint Implemented

| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/health` | Health check aplikasi |
| POST | `/api/auth/register` | Registrasi user lokal |
| POST | `/api/auth/login` | Login dan generate token |
| POST | `/api/auth/refresh` | Refresh access token dan rotate refresh token |
| GET | `/api/auth/me` | Ambil profil user dari token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/tasks` | Ambil daftar task dengan filter/pagination |
| POST | `/api/tasks` | Buat task baru |
| GET | `/api/tasks/stats` | Ambil statistik task |
| GET | `/api/tasks/stats/daily` | Ambil statistik task harian |
| GET | `/api/tasks/stats/weekly` | Ambil statistik task mingguan |
| GET | `/api/tasks/{id}` | Ambil detail task |
| PUT | `/api/tasks/{id}` | Update task |
| PATCH | `/api/tasks/{id}` | Partial update task |
| PATCH | `/api/tasks/{id}/status` | Update status task |
| POST | `/api/tasks/{id}/complete` | Tandai task selesai |
| POST | `/api/tasks/{id}/priority` | Hitung score prioritas task |
| POST | `/api/tasks/{id}/skip` | Tandai task skipped |
| DELETE | `/api/tasks/{id}` | Hapus task |
| GET | `/api/tasks/priority/{level}` | Ambil task berdasarkan prioritas |
| GET | `/api/planner/today` | Generate today plan |
| POST | `/api/reminders` | Buat reminder |
| GET | `/api/reminders` | Ambil semua reminder |
| GET | `/api/reminders/due` | Ambil reminder due |
| GET | `/api/reminders/{id}` | Ambil detail reminder |
| PATCH | `/api/reminders/{id}` | Update reminder |
| DELETE | `/api/reminders/{id}` | Hapus reminder |
| POST | `/api/ai/parse-task` | Parse natural language jadi draft task |
| POST | `/api/ai/overview-analysis` | Analisis overview task |

---

## 6. Struktur Request DTO yang Dipakai

- [`RegisterRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/RegisterRequest.java:7)
- [`LoginRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/LoginRequest.java:6)
- [`CreateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/CreateTaskRequest.java:6)
- [`UpdateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/UpdateTaskRequest.java:6)

Dokumentasi ini dibuat berdasarkan implementasi source code saat ini, bukan hanya berdasarkan rencana pada [`README.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/README.md).