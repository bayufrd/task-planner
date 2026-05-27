# Task Planner API - Java Spring Boot Backend

Backend REST API untuk Task Planner berbasis Java Spring Boot dan JDBC.

Dokumentasi ini sudah disesuaikan dengan endpoint yang **benar-benar tersedia saat ini** berdasarkan implementasi controller dan referensi roadmap di [`ROADMAP_API_ENDPOINT.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/docs/ROADMAP_API_ENDPOINT.md).

---

## 📌 Ringkasan

### Endpoint yang sudah tersedia

#### Health
- `GET /api/health`

#### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

#### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/stats`
- `GET /api/tasks/stats/daily`
- `GET /api/tasks/stats/weekly`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`
- `POST /api/tasks/{id}/priority`
- `POST /api/tasks/{id}/skip`
- `POST /api/tasks/{id}/complete`
- `GET /api/tasks/priority/{level}`

#### Planner
- `GET /api/planner/today`

#### Reminders
- `POST /api/reminders`
- `GET /api/reminders`
- `GET /api/reminders/due`
- `GET /api/reminders/{id}`
- `PATCH /api/reminders/{id}`
- `DELETE /api/reminders/{id}`

#### AI
- `POST /api/ai/parse-task`
- `POST /api/ai/overview-analysis`

### Endpoint yang belum tersedia
- `POST /api/auth/sync`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- route internal `/internal/wa`

---

## 🚀 Core Purpose

> We don’t just store tasks. We provide a backend foundation untuk pengelolaan task, auth, reminder, analitik, dan AI utility dasar.

Fokus backend Java saat ini:
- auth manual berbasis JWT
- CRUD task + statistik
- skip task
- kalkulasi priority task
- reminder API dasar
- AI helper endpoint dasar

Catatan penting implementasi saat ini:
- endpoint task dan planner kini memakai Bearer token JWT untuk resolve `userId` dari user login
- module reminder masih memakai penyimpanan in-memory, belum persistence database
- endpoint AI masih heuristic/basic, belum terhubung ke provider AI eksternal

---

## 🛠️ Stack

- Java 17
- Spring Boot 3.2.0
- Spring Web
- Spring JDBC / [`JdbcTemplate`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:81)
- MySQL JDBC Driver (`mysql-connector-j`)
- Maven
- BCrypt untuk password hashing
- JWT untuk access token

---

## 📁 Struktur Penting

- [`README.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/README.md)
- [`docs/ROADMAP_API_ENDPOINT.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/docs/ROADMAP_API_ENDPOINT.md)
- [`src/main/java/com/taskplanner/controller/AuthController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java)
- [`src/main/java/com/taskplanner/controller/TaskController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java)
- [`src/main/java/com/taskplanner/controller/ReminderController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java)
- [`src/main/java/com/taskplanner/controller/AiController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AiController.java)
- [`src/main/resources/application.yml`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/resources/application.yml)
- [`pom.xml`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/pom.xml)

---

## ⚙️ Setup

### Prasyarat
- Java 17+
- Maven 3.8+
- MySQL

### Install dependency dan build
```bash
mvn clean install
```

### Jalankan server development
```bash
mvn spring-boot:run
```

Server default berjalan di:
```text
http://localhost:8080
```

### Build JAR
```bash
mvn clean package -DskipTests
```

### Jalankan JAR
```bash
java -jar target/taskplanner-api-1.0.0.jar
```

---

## 🔐 Environment Auth JWT

Sesuaikan environment berikut:
- `SPRING_JWT_SECRET`
- `SPRING_JWT_EXP_MS`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Lihat contoh di [` .env.example`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/.env.example).

---

## 🧱 Format Response Umum

Sebagian besar endpoint memakai wrapper [`ApiResponse<T>`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/ApiResponse.java:6):

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2026-05-27T03:00:00"
}
```

Endpoint list task memakai [`PaginatedResponse<T>`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/PaginatedResponse.java:8):

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-05-27T03:00:00"
}
```

Catatan:
- beberapa error response belum konsisten 100% karena ada endpoint yang masih mengembalikan string plain text, terutama pada login gagal
- contoh payload di bawah mengikuti perilaku source code saat ini

---

## 🗄️ Model Data Task

Field task yang saat ini dipakai di model [`Task`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/model/Task.java:9):

```json
{
  "id": "task-uuid",
  "userId": "user-123",
  "title": "Selesaikan laporan basis data",
  "description": "Revisi final bab 4 dan bab 5",
  "deadline": "2026-05-30T21:00:00",
  "priority": "HIGH",
  "status": "TODO",
  "estimatedDuration": 120,
  "reminderSent": false,
  "reminderTime": 60,
  "googleCalendarEventId": null,
  "googleCalendarId": null,
  "createdAt": "2026-05-27T02:55:00",
  "updatedAt": "2026-05-27T02:55:00",
  "completedAt": null
}
```

Nilai umum:
- `priority`: `HIGH`, `MEDIUM`, `LOW`
- `status`: umumnya `TODO`, `IN_PROGRESS`, `DONE`, `SKIPPED`

---

## 📚 Dokumentasi Endpoint Lengkap

## 1. Health

### `GET /api/health`
Cek status service.

#### cURL
```bash
curl http://localhost:8080/api/health
```

#### Contoh response `200 OK`
```json
{
  "status": "OK",
  "message": "Task Planner API is running"
}
```

---

## 2. Auth

Base route auth didefinisikan di [`AuthController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:27).

### `POST /api/auth/register`
Register user lokal baru dan langsung menghasilkan token.

Referensi implementasi: [`register()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:40)

#### Request body
```json
{
  "email": "alice@example.com",
  "name": "Alice",
  "password": "s3cretpass"
}
```

#### cURL
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice",
    "password": "s3cretpass"
  }'
```

#### Contoh response `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "0d7f7b63-7dba-4ef5-8f5f-3f7d6bd1b111",
      "name": "Alice",
      "email": "alice@example.com",
      "theme": "light",
      "image": null,
      "createdAt": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "f56b3b94-0cbf-4c55-a7c7-2f2f0d8f9921",
    "tokenType": "Bearer",
    "expiresIn": 3600
  },
  "timestamp": "2026-05-27T03:00:00"
}
```

#### Contoh response `409 Conflict`
```json
{
  "success": false,
  "message": "Email already registered",
  "data": null,
  "timestamp": "2026-05-27T03:00:00"
}
```

#### Contoh response `500 Internal Server Error`
```json
{
  "success": false,
  "message": "db_error: <detail error>",
  "data": null,
  "timestamp": "2026-05-27T03:00:00"
}
```

### `POST /api/auth/login`
Login user lokal dengan email dan password.

Referensi implementasi: [`login()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:98)

#### Request body
```json
{
  "email": "alice@example.com",
  "password": "s3cretpass"
}
```

#### cURL
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "s3cretpass"
  }'
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "0d7f7b63-7dba-4ef5-8f5f-3f7d6bd1b111",
      "name": "Alice",
      "email": "alice@example.com",
      "theme": "light",
      "image": null,
      "createdAt": "2026-05-27T02:55:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "b54d60b4-32dd-4d3f-8f4d-a3202b6f8ac2",
    "tokenType": "Bearer",
    "expiresIn": 3600
  },
  "timestamp": "2026-05-27T03:05:00"
}
```

#### Contoh response `401 Unauthorized`
```text
invalid_credentials
```

#### Contoh response `500 Internal Server Error`
```text
error: <detail error>
```

### `GET /api/auth/me`
Ambil profil user dari access token Bearer.

Referensi implementasi: [`getMe()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:135)

#### Headers
```http
Authorization: Bearer <access_token>
```

#### cURL
```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": null,
  "data": {
    "id": "0d7f7b63-7dba-4ef5-8f5f-3f7d6bd1b111",
    "name": "Alice",
    "email": "alice@example.com",
    "theme": "light",
    "image": null,
    "createdAt": "2026-05-27T02:55:00"
  },
  "timestamp": "2026-05-27T03:06:00"
}
```

#### Contoh response `401 Unauthorized` - token tidak ada
```json
{
  "success": false,
  "message": "No token provided",
  "data": null,
  "timestamp": "2026-05-27T03:06:00"
}
```

#### Contoh response `401 Unauthorized` - token invalid/expired
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "data": null,
  "timestamp": "2026-05-27T03:06:00"
}
```

### `POST /api/auth/logout`
Logout user berdasarkan Bearer token dan membersihkan token pada account.

Referensi implementasi: [`logout()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java:160)

#### Headers
```http
Authorization: Bearer <access_token>
```

#### cURL
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null,
  "timestamp": "2026-05-27T03:07:00"
}
```

#### Contoh response `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "data": null,
  "timestamp": "2026-05-27T03:07:00"
}
```

---

## 3. Tasks

Base route task didefinisikan di [`TaskController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:39).

### Request body create task
Mengikuti DTO [`CreateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/CreateTaskRequest.java:6):

```json
{
  "title": "Selesaikan laporan basis data",
  "description": "Finalisasi bab 1 sampai bab 5",
  "deadline": "2026-05-30T21:00:00",
  "priority": "HIGH",
  "status": "TODO",
  "estimatedDuration": 180
}
```

### Request body update task
Mengikuti DTO [`UpdateTaskRequest`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/dto/UpdateTaskRequest.java:6). Semua field bersifat opsional.

```json
{
  "title": "Revisi laporan basis data",
  "description": "Tambahkan pembahasan ERD",
  "deadline": "2026-05-31T20:00:00",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  "estimatedDuration": 150
}
```

### `GET /api/tasks`
Ambil daftar task dengan pagination dan filter.

Referensi implementasi: [`getTasks()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:65)

#### Query params
- `page` default `1`
- `limit` default `20`
- `search` optional
- `status` optional
- `priority` optional
- `sort` default `deadline`
- `order` default `asc`

#### cURL
```bash
curl "http://localhost:8080/api/tasks?page=1&limit=10&status=TODO&priority=HIGH&sort=deadline&order=asc"
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "task-001",
      "userId": "user-123",
      "title": "Selesaikan laporan basis data",
      "description": "Finalisasi bab 1 sampai bab 5",
      "deadline": "2026-05-30T21:00:00",
      "priority": "HIGH",
      "status": "TODO",
      "estimatedDuration": 180,
      "reminderSent": false,
      "reminderTime": 60,
      "googleCalendarEventId": null,
      "googleCalendarId": null,
      "createdAt": "2026-05-27T02:55:00",
      "updatedAt": "2026-05-27T02:55:00",
      "completedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2026-05-27T03:10:00"
}
```

### `POST /api/tasks`
Buat task baru.

Referensi implementasi: [`createTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:105)

#### cURL
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Selesaikan laporan basis data",
    "description": "Finalisasi bab 1 sampai bab 5",
    "deadline": "2026-05-30T21:00:00",
    "priority": "HIGH",
    "status": "TODO",
    "estimatedDuration": 180
  }'
```

#### Contoh response `201 Created`
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task-001",
    "userId": "user-123",
    "title": "Selesaikan laporan basis data",
    "description": "Finalisasi bab 1 sampai bab 5",
    "deadline": "2026-05-30T21:00:00",
    "priority": "HIGH",
    "status": "TODO",
    "estimatedDuration": 180,
    "reminderSent": false,
    "reminderTime": 60,
    "googleCalendarEventId": null,
    "googleCalendarId": null,
    "createdAt": "2026-05-27T03:11:00",
    "updatedAt": "2026-05-27T03:11:00",
    "completedAt": null
  },
  "timestamp": "2026-05-27T03:11:00"
}
```

#### Contoh response `400 Bad Request`
```json
{
  "success": false,
  "message": "Task title is required",
  "data": null,
  "timestamp": "2026-05-27T03:11:00"
}
```

#### Contoh response `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Failed to create task",
  "data": null,
  "timestamp": "2026-05-27T03:11:00"
}
```

### `GET /api/tasks/stats`
Ambil ringkasan statistik task.

Referensi implementasi: [`getTaskStats()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:131)

#### cURL
```bash
curl http://localhost:8080/api/tasks/stats
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task stats retrieved successfully",
  "data": {
    "total": 24,
    "todo": 10,
    "inProgress": 7,
    "done": 5,
    "skipped": 2
  },
  "timestamp": "2026-05-27T03:12:00"
}
```

### `GET /api/tasks/stats/daily`
Ambil statistik task per hari.

Referensi implementasi: [`getDailyStats()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:139)

#### Query params
- `days` default `30`

#### cURL
```bash
curl "http://localhost:8080/api/tasks/stats/daily?days=7"
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Daily task stats retrieved successfully",
  "data": [
    {
      "date": "2026-05-21",
      "created": 2,
      "completed": 1
    },
    {
      "date": "2026-05-22",
      "created": 3,
      "completed": 2
    }
  ],
  "timestamp": "2026-05-27T03:13:00"
}
```

### `GET /api/tasks/stats/weekly`
Ambil statistik task per minggu.

Referensi implementasi: [`getWeeklyStats()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:148)

#### Query params
- `weeks` default `12`

#### cURL
```bash
curl "http://localhost:8080/api/tasks/stats/weekly?weeks=4"
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Weekly task stats retrieved successfully",
  "data": [
    {
      "week": "2026-W20",
      "created": 8,
      "completed": 4
    },
    {
      "week": "2026-W21",
      "created": 6,
      "completed": 5
    }
  ],
  "timestamp": "2026-05-27T03:14:00"
}
```

### `GET /api/tasks/{id}`
Ambil detail task by id.

Referensi implementasi: [`getTaskById()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:168)

#### cURL
```bash
curl http://localhost:8080/api/tasks/task-001
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "task-001",
    "userId": "user-123",
    "title": "Selesaikan laporan basis data",
    "description": "Finalisasi bab 1 sampai bab 5",
    "deadline": "2026-05-30T21:00:00",
    "priority": "HIGH",
    "status": "TODO",
    "estimatedDuration": 180,
    "reminderSent": false,
    "reminderTime": 60,
    "googleCalendarEventId": null,
    "googleCalendarId": null,
    "createdAt": "2026-05-27T03:11:00",
    "updatedAt": "2026-05-27T03:11:00",
    "completedAt": null
  },
  "timestamp": "2026-05-27T03:15:00"
}
```

#### Contoh response `404 Not Found`
```json
{
  "success": false,
  "message": "Task not found",
  "data": null,
  "timestamp": "2026-05-27T03:15:00"
}
```

### `PUT /api/tasks/{id}`
Update task secara penuh/semi-penuh menggunakan body update task.

Referensi implementasi: [`updateTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:202)

#### cURL
```bash
curl -X PUT http://localhost:8080/api/tasks/task-001 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Revisi laporan basis data",
    "description": "Tambahkan pembahasan ERD",
    "deadline": "2026-05-31T20:00:00",
    "priority": "MEDIUM",
    "status": "IN_PROGRESS",
    "estimatedDuration": 150
  }'
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task-001",
    "userId": "user-123",
    "title": "Revisi laporan basis data",
    "description": "Tambahkan pembahasan ERD",
    "deadline": "2026-05-31T20:00:00",
    "priority": "MEDIUM",
    "status": "IN_PROGRESS",
    "estimatedDuration": 150,
    "reminderSent": false,
    "reminderTime": 60,
    "googleCalendarEventId": null,
    "googleCalendarId": null,
    "createdAt": "2026-05-27T03:11:00",
    "updatedAt": "2026-05-27T03:16:00",
    "completedAt": null
  },
  "timestamp": "2026-05-27T03:16:00"
}
```

#### Contoh response `404 Not Found`
```json
{
  "success": false,
  "message": "Task not found",
  "data": null,
  "timestamp": "2026-05-27T03:16:00"
}
```

### `PATCH /api/tasks/{id}`
Partial update task. Saat ini diarahkan ke logic yang sama dengan [`updateTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:202) melalui [`patchTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:222).

#### cURL
```bash
curl -X PATCH http://localhost:8080/api/tasks/task-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DONE",
    "estimatedDuration": 200
  }'
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task-001",
    "userId": "user-123",
    "title": "Revisi laporan basis data",
    "description": "Tambahkan pembahasan ERD",
    "deadline": "2026-05-31T20:00:00",
    "priority": "MEDIUM",
    "status": "DONE",
    "estimatedDuration": 200,
    "reminderSent": false,
    "reminderTime": 60,
    "googleCalendarEventId": null,
    "googleCalendarId": null,
    "createdAt": "2026-05-27T03:11:00",
    "updatedAt": "2026-05-27T03:17:00",
    "completedAt": "2026-05-27T03:17:00"
  },
  "timestamp": "2026-05-27T03:17:00"
}
```

### `PATCH /api/tasks/{id}/status`
Update status task saja.

Referensi implementasi: [`updateTaskStatus()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:230)

#### Request body
```json
{
  "status": "DONE"
}
```

#### cURL
```bash
curl -X PATCH http://localhost:8080/api/tasks/task-001/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DONE"
  }'
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "id": "task-001",
    "userId": "user-123",
    "title": "Revisi laporan basis data",
    "description": "Tambahkan pembahasan ERD",
    "deadline": "2026-05-31T20:00:00",
    "priority": "MEDIUM",
    "status": "DONE",
    "estimatedDuration": 150,
    "reminderSent": false,
    "reminderTime": 60,
    "googleCalendarEventId": null,
    "googleCalendarId": null,
    "createdAt": "2026-05-27T03:11:00",
    "updatedAt": "2026-05-27T03:18:00",
    "completedAt": "2026-05-27T03:18:00"
  },
  "timestamp": "2026-05-27T03:18:00"
}
```

#### Contoh response `400 Bad Request`
```json
{
  "success": false,
  "message": "Task status is required",
  "data": null,
  "timestamp": "2026-05-27T03:18:00"
}
```

### `DELETE /api/tasks/{id}`
Hapus task by id.

Referensi implementasi: [`deleteTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:266)

#### cURL
```bash
curl -X DELETE http://localhost:8080/api/tasks/task-001
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null,
  "timestamp": "2026-05-27T03:19:00"
}
```

#### Contoh response `404 Not Found`
```json
{
  "success": false,
  "message": "Task not found",
  "data": null,
  "timestamp": "2026-05-27T03:19:00"
}
```

### `POST /api/tasks/{id}/priority`
Hitung priority score task.

Referensi implementasi: [`calculatePriority()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:283)

#### cURL
```bash
curl -X POST http://localhost:8080/api/tasks/task-001/priority
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task priority calculated successfully",
  "data": {
    "taskId": "task-001",
    "priority": "HIGH",
    "priorityScore": 92,
    "deadlineFactor": 40,
    "priorityFactor": 40,
    "skipPenalty": 8,
    "estimatedDurationFactor": 4
  },
  "timestamp": "2026-05-27T03:20:00"
}
```

#### Contoh response `404 Not Found`
```json
{
  "success": false,
  "message": "Task not found",
  "data": null,
  "timestamp": "2026-05-27T03:20:00"
}
```

### `POST /api/tasks/{id}/skip`
Ubah task menjadi skipped.

Referensi implementasi: [`skipTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:301)

#### cURL
```bash
curl -X POST http://localhost:8080/api/tasks/task-001/skip
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task skipped successfully",
  "data": {
    "id": "task-001",
    "userId": "user-123",
    "title": "Selesaikan laporan basis data",
    "description": "Finalisasi bab 1 sampai bab 5",
    "deadline": "2026-05-30T21:00:00",
    "priority": "HIGH",
    "status": "SKIPPED",
    "estimatedDuration": 180,
    "reminderSent": false,
    "reminderTime": 60,
    "googleCalendarEventId": null,
    "googleCalendarId": null,
    "createdAt": "2026-05-27T03:11:00",
    "updatedAt": "2026-05-27T03:21:00",
    "completedAt": null
  },
  "timestamp": "2026-05-27T03:21:00"
}
```

### `GET /api/tasks/priority/{level}`
Ambil list task berdasarkan level priority.

Referensi implementasi: [`getTasksByPriority()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java:333)

#### Path param
- `level`: `HIGH`, `MEDIUM`, `LOW`

#### Query params
- `page` default `1`
- `limit` default `20`

#### cURL
```bash
curl "http://localhost:8080/api/tasks/priority/HIGH?page=1&limit=10"
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "task-001",
      "userId": "user-123",
      "title": "Selesaikan laporan basis data",
      "description": "Finalisasi bab 1 sampai bab 5",
      "deadline": "2026-05-30T21:00:00",
      "priority": "HIGH",
      "status": "TODO",
      "estimatedDuration": 180,
      "reminderSent": false,
      "reminderTime": 60,
      "googleCalendarEventId": null,
      "googleCalendarId": null,
      "createdAt": "2026-05-27T03:11:00",
      "updatedAt": "2026-05-27T03:11:00",
      "completedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2026-05-27T03:22:00"
}
```

#### Contoh response `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Failed to fetch tasks",
  "data": null,
  "pagination": null,
  "timestamp": "2026-05-27T03:22:00"
}
```

---

## 4. Reminders

Base route reminder didefinisikan di [`ReminderController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:17).

Catatan implementasi:
- reminder disimpan di memory [`reminders`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:21)
- data akan hilang saat aplikasi restart

### Bentuk data reminder
```json
{
  "id": "rem-001",
  "taskId": "task-001",
  "message": "Task reminder",
  "remindAt": "2026-05-30T20:00:00",
  "status": "PENDING",
  "createdAt": "2026-05-27T03:25:00",
  "updatedAt": "2026-05-27T03:26:00"
}
```

### `POST /api/reminders`
Buat reminder baru.

Referensi implementasi: [`createReminder()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:23)

#### Request body
```json
{
  "taskId": "task-001",
  "message": "Jangan lupa review laporan",
  "remindAt": "2026-05-30T20:00:00",
  "status": "PENDING"
}
```

#### cURL
```bash
curl -X POST http://localhost:8080/api/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task-001",
    "message": "Jangan lupa review laporan",
    "remindAt": "2026-05-30T20:00:00",
    "status": "PENDING"
  }'
```

#### Contoh response `201 Created`
```json
{
  "success": true,
  "message": "Reminder created successfully",
  "data": {
    "id": "rem-001",
    "taskId": "task-001",
    "message": "Jangan lupa review laporan",
    "remindAt": "2026-05-30T20:00:00",
    "status": "PENDING",
    "createdAt": "2026-05-27T03:25:00"
  },
  "timestamp": "2026-05-27T03:25:00"
}
```

### `GET /api/reminders`
Ambil semua reminder.

Referensi implementasi: [`getReminders()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:38)

#### cURL
```bash
curl http://localhost:8080/api/reminders
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Reminders retrieved successfully",
  "data": [
    {
      "id": "rem-001",
      "taskId": "task-001",
      "message": "Jangan lupa review laporan",
      "remindAt": "2026-05-30T20:00:00",
      "status": "PENDING",
      "createdAt": "2026-05-27T03:25:00"
    }
  ],
  "timestamp": "2026-05-27T03:25:30"
}
```

### `GET /api/reminders/due`
Ambil reminder yang sudah jatuh tempo.

Referensi implementasi: [`getDueReminders()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:43)

#### cURL
```bash
curl http://localhost:8080/api/reminders/due
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Due reminders retrieved successfully",
  "data": [
    {
      "id": "rem-001",
      "taskId": "task-001",
      "message": "Jangan lupa review laporan",
      "remindAt": "2026-05-27T02:00:00",
      "status": "PENDING",
      "createdAt": "2026-05-27T01:00:00"
    }
  ],
  "timestamp": "2026-05-27T03:26:00"
}
```

### `GET /api/reminders/{id}`
Ambil detail reminder.

Referensi implementasi: [`getReminderById()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:62)

#### cURL
```bash
curl http://localhost:8080/api/reminders/rem-001
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Reminder retrieved successfully",
  "data": {
    "id": "rem-001",
    "taskId": "task-001",
    "message": "Jangan lupa review laporan",
    "remindAt": "2026-05-30T20:00:00",
    "status": "PENDING",
    "createdAt": "2026-05-27T03:25:00"
  },
  "timestamp": "2026-05-27T03:26:30"
}
```

#### Contoh response `404 Not Found`
```json
{
  "success": false,
  "message": "Reminder not found",
  "data": null,
  "timestamp": "2026-05-27T03:26:30"
}
```

### `PATCH /api/reminders/{id}`
Update reminder.

Referensi implementasi: [`updateReminder()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:72)

#### Request body
```json
{
  "message": "Reminder diundur 30 menit",
  "remindAt": "2026-05-30T20:30:00",
  "status": "SENT"
}
```

#### cURL
```bash
curl -X PATCH http://localhost:8080/api/reminders/rem-001 \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Reminder diundur 30 menit",
    "remindAt": "2026-05-30T20:30:00",
    "status": "SENT"
  }'
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Reminder updated successfully",
  "data": {
    "id": "rem-001",
    "taskId": "task-001",
    "message": "Reminder diundur 30 menit",
    "remindAt": "2026-05-30T20:30:00",
    "status": "SENT",
    "createdAt": "2026-05-27T03:25:00",
    "updatedAt": "2026-05-27T03:27:00"
  },
  "timestamp": "2026-05-27T03:27:00"
}
```

### `DELETE /api/reminders/{id}`
Hapus reminder.

Referensi implementasi: [`deleteReminder()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java:85)

#### cURL
```bash
curl -X DELETE http://localhost:8080/api/reminders/rem-001
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Reminder deleted successfully",
  "data": null,
  "timestamp": "2026-05-27T03:27:30"
}
```

#### Contoh response `404 Not Found`
```json
{
  "success": false,
  "message": "Reminder not found",
  "data": null,
  "timestamp": "2026-05-27T03:27:30"
}
```

---

## 5. AI Endpoints

Base route AI didefinisikan di [`AiController`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AiController.java:14).

### `POST /api/ai/parse-task`
Parse teks bebas menjadi draft task.

Referensi implementasi: [`parseTask()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AiController.java:21)

#### Request body
```json
{
  "text": "Besok pagi segera selesaikan revisi laporan basis data"
}
```

#### cURL
```bash
curl -X POST http://localhost:8080/api/ai/parse-task \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Besok pagi segera selesaikan revisi laporan basis data"
  }'
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Task parsed successfully",
  "data": {
    "title": "Besok pagi segera selesaikan revisi laporan basis data",
    "description": "Besok pagi segera selesaikan revisi laporan basis data",
    "priority": "HIGH",
    "status": "TODO",
    "estimatedDuration": 60,
    "deadline": "2026-05-28T03:30:00"
  },
  "timestamp": "2026-05-27T03:30:00"
}
```

Catatan heuristic priority saat ini dari [`inferPriority()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AiController.java:55):
- mengandung `urgent`, `penting`, `segera` → `HIGH`
- mengandung `nanti`, `low` → `LOW`
- selain itu → `MEDIUM`

### `POST /api/ai/overview-analysis`
Hasilkan analisis ringkas kondisi task user.

Referensi implementasi: [`overviewAnalysis()`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AiController.java:34)

#### Request body
```json
{
  "userId": "user-123"
}
```

`request body` boleh kosong. Jika kosong, controller memakai `user-123` sebagai default.

#### cURL
```bash
curl -X POST http://localhost:8080/api/ai/overview-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123"
  }'
```

#### Contoh response `200 OK`
```json
{
  "success": true,
  "message": "Overview analysis generated successfully",
  "data": {
    "userId": "user-123",
    "summary": "User has 10 active tasks, 5 completed tasks, and 2 skipped tasks.",
    "metrics": {
      "todo": 10,
      "done": 5,
      "skipped": 2
    },
    "recommendation": "Focus on high priority tasks and reduce overdue backlog first."
  },
  "timestamp": "2026-05-27T03:31:00"
}
```

---

## 🗄️ Database Schema Ringkas

### Tabel `User`
```sql
CREATE TABLE User (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  password VARCHAR(255),
  image VARCHAR(500),
  theme VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel `Account`
```sql
CREATE TABLE Account (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50),
  type VARCHAR(50),
  provider VARCHAR(100),
  providerAccountId VARCHAR(255),
  refresh_token TEXT,
  access_token TEXT,
  expires_at INT,
  token_type VARCHAR(100),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES User(id)
);
```

### Tabel `Task`
```sql
CREATE TABLE Task (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  deadline DATETIME NOT NULL,
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  status VARCHAR(20) DEFAULT 'TODO',
  estimatedDuration INT,
  reminderTime INT DEFAULT 60,
  reminderSent BOOLEAN DEFAULT FALSE,
  googleCalendarEventId VARCHAR(255),
  googleCalendarId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_deadline (deadline)
);
```

Catatan:
- dokumentasi lama yang menyebut kolom `difficulty`, `skipCount`, dan `priorityScore` sebagai kolom wajib DB **tidak dipakai sebagai acuan utama README ini**, karena roadmap terbaru menekankan bahwa sebagian nilai dapat dihitung dinamis
- untuk status akurat endpoint dan gap implementasi, acuan utama tetap [`ROADMAP_API_ENDPOINT.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/docs/ROADMAP_API_ENDPOINT.md)

---

## 🧪 Quick Test cURL

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice","password":"s3cretpass"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"s3cretpass"}'
```

### Create task
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"Demo","deadline":"2026-05-30T21:00:00","priority":"HIGH","status":"TODO","estimatedDuration":90}'
```

### Create reminder
```bash
curl -X POST http://localhost:8080/api/reminders \
  -H "Content-Type: application/json" \
  -d '{"taskId":"task-001","message":"Task reminder","remindAt":"2026-05-30T20:00:00","status":"PENDING"}'
```

### Parse AI task
```bash
curl -X POST http://localhost:8080/api/ai/parse-task \
  -H "Content-Type: application/json" \
  -d '{"text":"Segera kerjakan revisi laporan"}'
```

---

## 📍 Gap Implementasi Saat Ini

Mengacu ke [`ROADMAP_API_ENDPOINT.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/docs/ROADMAP_API_ENDPOINT.md):

### Belum ada
- `POST /api/auth/sync`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- internal WhatsApp route

### Sudah tersedia sesuai checklist roadmap
- `GET /api/planner/today`
- `POST /api/tasks/{id}/complete`
- endpoint task privat sudah resolve `userId` dari Bearer JWT, bukan hardcoded lagi

### Sudah ada tetapi belum matang
- reminder masih in-memory
- AI masih heuristic
- ada perbedaan method update dengan backend Express, karena Java mendukung `PUT` dan `PATCH`
- beberapa fitur auth lanjutan pada roadmap seperti sync session dan Google OAuth masih belum ada

---

## 🧭 Referensi Utama

- [`README.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/README.md)
- [`ROADMAP_API_ENDPOINT.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/docs/ROADMAP_API_ENDPOINT.md)
- [`API_ENDPOINTS.md`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/docs/API_ENDPOINTS.md)
- [`AuthController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AuthController.java)
- [`TaskController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/TaskController.java)
- [`ReminderController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/ReminderController.java)
- [`AiController.java`](Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/src/main/java/com/taskplanner/controller/AiController.java)

---

## 📝 Status Dokumentasi

- README telah diperbarui agar sesuai endpoint Java backend yang tersedia saat ini
- contoh request dan response payload telah dilengkapi untuk auth, task, reminder, dan AI
- gap implementasi yang belum tersedia sudah ditandai jelas

**Last Updated**: 2026-05-27
