## 🚦 PHASES MENUJU CORE MVP (ROADMAP MIGRASI)

**Catatan Penting:**
- Kolom `priority` pada tabel Task dapat digunakan untuk mewakili tingkat prioritas maupun tingkat kesulitan (difficulty), sehingga tidak perlu menambah kolom baru.
- Nilai `priorityScore` tidak wajib disimpan di database, cukup dihitung secara dinamis di backend saat mengambil/generate plan.
- `skipCount` juga tidak perlu disimpan, bisa dihitung secara dinamis, misal dengan menghitung jumlah task dengan status `DONE` atau logika lain sesuai kebutuhan.

---

## 🚦 PHASES MENUJU CORE MVP (ROADMAP MIGRASI)

Berikut tahapan detail untuk memodifikasi aplikasi menuju core MVP (decision engine):

### Phase 1: Penyesuaian Database & Model
- [x] Pastikan kolom `priority` sudah ada pada tabel Task dan digunakan untuk prioritas/difficulty
- [x] Tidak perlu menambah kolom baru jika sudah sesuai
- [x] Update model `Task.java` agar field priority digunakan sesuai kebutuhan core MVP
- [x] Update repository & service agar logic perhitungan priorityScore dan skipCount dilakukan secara dinamis (tidak perlu field baru)

### Phase 1.5: Auth - Manual Register (Implemented)
_Status: completed_
- [x] Add endpoint for manual registration (create User + Account with provider='local')
- [x] Hash passwords using BCrypt before storing in `User.password`
- [x] Create `Account` entry with `provider='local'` and `providerAccountId = email`
- [x] Add `AuthRepository`, `AuthController`, `Account` model and `RegisterRequest` DTO

Purpose:
- Support manual account registration in addition to existing OAuth provider entries (Google). Manual registration creates both a `User` record and an `Account` record so the system treats local credentials similarly to provider-based accounts.

Endpoint (example):

- POST /api/auth/register

Request JSON:

```json
{
  "email": "alice@example.com",
  "name": "Alice",
  "password": "s3cretpass"
}
```

Curl example:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice","password":"s3cretpass"}'
```

Responses:
- 200 OK — body: "registered" (success)
- 409 Conflict — email already registered

Notes & behavior:
- Passwords are hashed with BCrypt before stored in `User.password`.
- An `Account` row with `provider='local'` is created and links to the `User.id` via `userId`.
- This flow does NOT issue a session or JWT. Register only creates database records. Implement login/token issuance in a subsequent phase if needed.
- No new DB columns were added; use `Account.provider` to differentiate local vs provider-based accounts.

### Phase 2: Implementasi Decision Engine (Core Logic)
- [ ] Buat file baru `service/PlannerService.java` untuk decision engine
- [ ] Implementasi fungsi `calculatePriority(Task task)`
  - [ ] Hitung skor prioritas secara dinamis berdasarkan deadline, priority, dan skipCount (tanpa simpan ke DB)
- [ ] Implementasi fungsi `generateTodayPlan(userId)`
  - [ ] Ambil 3–5 task teratas berdasarkan skor prioritas
- [ ] Buat unit test untuk fungsi prioritas (opsional)

### Phase 3: Integrasi API & Adaptasi
- [ ] Tambahkan endpoint baru di `TaskController.java`:
  - [ ] `GET /api/planner/today` (generate today plan)
  - [ ] `POST /api/tasks/{id}/complete` (mark task done)
  - [ ] `POST /api/tasks/{id}/skip` (skip task, update status)
- [ ] Integrasikan logic prioritas ke proses create/update task
- [ ] Update endpoint existing agar `priorityScore` selalu dihitung otomatis saat response
- [ ] Adaptasi `skipCount` dengan menghitung jumlah task status `DONE` atau sesuai kebutuhan
- [ ] Pastikan response API sesuai kebutuhan frontend

### Phase 4: Testing & Validasi Core
- [ ] Uji endpoint baru dengan curl/Postman:
  - [ ] Test generate today plan (limit 3–5 task, urut prioritas)
  - [ ] Test complete/skip task dan perubahan skor
- [ ] Validasi sorting, limit, dan adaptasi berjalan sesuai flow MVP
- [ ] Lakukan regression test pada endpoint lama (CRUD tetap berjalan)

### Phase 5: Dokumentasi & Finalisasi
- [ ] Update README.md dengan flow baru (decision engine)
- [ ] Tambahkan dokumentasi endpoint baru dan contoh response JSON
- [ ] Tambahkan penjelasan logika prioritas dan flow utama di dokumentasi
- [ ] Bersihkan kode, hapus logic/fitur yang tidak dipakai jika sudah yakin

---
# Task Planner API - Java Spring Boot Backend

## 🚀 CORE PURPOSE & VISION
...existing code...
**Catatan:**
- Fitur CRUD, pagination, dsb tetap ada, namun bukan prioritas utama.
- Pengembangan selanjutnya dapat menambah AI, dashboard, dsb, setelah core berjalan normal.

---

## 🛠️ STACK & TEKNOLOGI

Task Planner API dibangun dengan teknologi berikut:

- **Java 17** — Bahasa utama backend
- **Spring Boot 3.2.0** — Framework REST API
- **JDBC (mysql-connector-j)** — Driver koneksi ke MySQL
- **JdbcTemplate** — Abstraksi query SQL manual (tanpa ORM)
- **HikariCP** — Connection pool (default Spring Boot)
- **Maven** — Build & dependency management
- **PM2** — Process manager untuk deployment Linux (opsional)

Stack ini dipilih untuk memenuhi syarat tugas (Java/C# dengan driver JDBC/ODP.NET) dan memudahkan pengembangan aplikasi yang scalable dan maintainable.
---


# Task Planner API - Java Spring Boot Backend

## 🚀 CORE PURPOSE & VISION

> “We don’t help users manage tasks.  
> We decide what they should do next.”

**Core MVP:**
- Sistem yang otomatis menentukan prioritas dan rencana tugas harian user, bukan sekadar CRUD task.
- Fokus pada decision engine: generate today plan, adaptasi perilaku user, dan penentuan prioritas berbasis data.

**Flow utama:**
1. User input task
2. System calculate priority
3. Generate Today Plan
4. User complete / skip
5. System adapt (basic)

**Catatan:**
- Fitur CRUD, pagination, dsb tetap ada, namun bukan prioritas utama.
- Pengembangan selanjutnya dapat menambah AI, dashboard, dsb, setelah core berjalan normal.


**Status**: Core MVP Migration (Decision Engine)  
**Version**: 2.0.0 (MVP Refocus)  
**Date**: April 17, 2026

## 📋 Overview
## ⚡ SKIP TASK: KOMBINASI MANUAL & AUTO

Fitur skip pada task dapat diimplementasikan dengan dua cara sekaligus untuk pengalaman terbaik:

### 1. Manual Skip (Button)
- User dapat menekan tombol "Skip" pada UI.
- Endpoint: `POST /api/tasks/{id}/skip`
- Status task diubah menjadi "SKIPPED" atau sesuai kebutuhan.

### 2. Auto Skip (Otomatis)
- Sistem melakukan pengecekan berkala (misal setiap jam).
- Jika task belum selesai (status bukan DONE) dan sudah lewat 1 jam dari deadline, maka status otomatis diubah menjadi "SKIPPED".
- Bisa menggunakan scheduled job/cron di backend.

### 3. Kombinasi (Direkomendasikan)
- Sediakan kedua mekanisme di atas.
- Status skip bisa dibedakan (misal: SKIPPED_MANUAL, SKIPPED_AUTO) atau cukup satu status.
- Di frontend, tampilkan info jika task di-skip otomatis.

**Keunggulan:**
- User tetap punya kontrol manual, namun sistem juga adaptif jika user lupa/terlambat.
- Lebih fleksibel dan user-friendly.

**Implementasi:**
- Endpoint manual skip tetap tersedia.
- Auto-skip dijalankan di backend secara periodik.
- Logika skip dapat disesuaikan dengan kebutuhan aplikasi.

---
**Stack** (tidak berubah):
- Java 17, Spring Boot 3.2.0, JDBC (mysql-connector-j), JdbcTemplate, HikariCP, Maven, PM2

---


## 📁 PROJECT STRUCTURE (Tetap)


Struktur project tetap, namun beberapa file akan diubah/ditambah untuk mendukung core MVP (lihat phase migrasi di bawah).

---


## 🔧 SETUP GUIDE (Tidak berubah)

### Prerequisites
- **Java 17+**: Download from [oracle.com](https://www.oracle.com/java/technologies/downloads/) atau gunakan OpenJDK
- **Maven 3.8+**: [Download](https://maven.apache.org/download.cgi)
- **MySQL 5.7+**: Database server running
- **Node.js + PM2**: Untuk deployment (optional, development bisa pakai `mvn spring-boot:run`)

### 1. Clone Repository
```bash
cd "Pemrograman Basis Data"
# Project sudah ada di folder ini
```

### 2. Database Setup
Database sudah terbuat dari Prisma di Proyek Perangkat Lunak. Pastikan MySQL running:

```bash
# Test connection
mysql -h 192.168.1.2 -u root -p0202 -D taskplanner
```

### 3. Build Project
```bash
# Download dependencies
mvn clean install

# Or: Maven akan auto-download dependencies di step berikutnya
```

### 4. Run Development Server

**Option A: Using Maven (Recommended untuk development)**
```bash
mvn spring-boot:run
```

Server akan start di `http://localhost:8080`

**Option B: Build JAR dan run**
```bash
mvn clean package -DskipTests
java -jar target/taskplanner-api-1.0.0.jar
```

### 5. Test API

```bash
# Check health
curl http://localhost:8080/api/health

# Get all tasks
curl http://localhost:8080/api/tasks

# Create task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","deadline":"2026-04-20T23:59:59","priority":"HIGH"}'
```

---


## 📋 API ENDPOINTS (Core MVP)

### Core Endpoints (Baru)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/planner/today` | Generate today's plan (decision engine) |
| POST | `/api/tasks/{id}/complete` | Mark task done |
| POST | `/api/tasks/{id}/skip` | Skip task |

### Existing Endpoints (Tetap, tapi bukan prioritas)

### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks (paginated) |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/priority/:level` | Get tasks by priority |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health |

---


## 🗄️ DATABASE SCHEMA (Update untuk Core MVP)

Tambahkan kolom berikut pada tabel Task:

```sql
ALTER TABLE Task ADD COLUMN difficulty VARCHAR(10);
ALTER TABLE Task ADD COLUMN skipCount INT DEFAULT 0;
ALTER TABLE Task ADD COLUMN priorityScore INT DEFAULT 0;
```

Kolom dan tabel lain tetap sama seperti sebelumnya.

### Users Table
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

### Accounts Table (auth providers)
This table stores authentication provider entries and also supports local credentials. For manual registration set `provider='local'` and `providerAccountId` to the user's email or username. For Google OAuth entries, set `provider='google'` and `providerAccountId` to the provider's id.

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

How to distinguish manual register vs Google sign-in:
- Manual register: create a `User` row and create an `Account` row with `provider = 'local'` and `providerAccountId = email` (or username). Store hashed password in `User.password`.
- Google sign-in: create `User` row (if new) and `Account` with `provider = 'google'` and `providerAccountId = <google id>` and store tokens in `access_token`, `refresh_token` as needed.

You do NOT need an extra column to distinguish methods — use the `provider` column already present in `Account`.

### Tasks Table
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

---

## 🔐 DATABASE CONNECTION (JDBC)

Koneksi ke MySQL menggunakan **JDBC Driver** (`mysql-connector-j`) yang dikonfigurasi di `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://192.168.1.2:3307/taskplanner
    username: root
    password: 0202
    driver-class-name: com.mysql.cj.jdbc.Driver   # ← JDBC Driver class
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
```

**Cara kerja JDBC di project ini:**

```
application.yml (driver-class-name)
         ↓
  mysql-connector-j (JDBC Driver)
         ↓
    HikariCP (Connection Pool)
         ↓
   JdbcTemplate (Spring JDBC)
         ↓
  TaskRepository.java (manual SQL)
         ↓
     MySQL Database
```

**Contoh penggunaan JdbcTemplate di `TaskRepository.java`**:
```java
// SELECT
String query = "SELECT * FROM Task WHERE userId = ? AND status = ? ORDER BY deadline ASC LIMIT ? OFFSET ?";
List<Task> tasks = jdbcTemplate.query(query,
    new Object[]{userId, status, limit, offset},
    taskRowMapper);

// INSERT
String insert = "INSERT INTO Task (id, userId, title, deadline, priority, status) VALUES (?, ?, ?, ?, ?, ?)";
jdbcTemplate.update(insert, task.getId(), task.getUserId(), task.getTitle(),
    task.getDeadline(), task.getPriority(), task.getStatus());

// UPDATE
String update = "UPDATE Task SET title = ?, status = ?, updatedAt = NOW() WHERE id = ?";
jdbcTemplate.update(update, task.getTitle(), task.getStatus(), id);

// DELETE
String delete = "DELETE FROM Task WHERE id = ?";
jdbcTemplate.update(delete, id);
```

---


## 🏗️ ARCHITECTURE LAYERS (Update)

### Tambahan Baru:
- `service/PlannerService.java` (decision engine/prioritas)
- Endpoint baru di `controller/TaskController.java`

### Layer Existing (Tetap, tapi bukan prioritas):

### 1. Controller Layer (`controller/TaskController.java`)
- Handles HTTP requests/responses
- Request validation
- Route mapping
- Error handling

**Routes**:
```java
@GetMapping              // GET /tasks
@PostMapping             // POST /tasks
@GetMapping("/{id}")     // GET /tasks/:id
@PutMapping("/{id}")     // PUT /tasks/:id
@DeleteMapping("/{id}")  // DELETE /tasks/:id
@GetMapping("/priority/{level}")  // GET /tasks/priority/:level
```

### 2. Service Layer (`service/TaskService.java`)
- Business logic
- Validation
- Business rules
- Transaction management

**Methods**:
```java
getTasks()                    // Get all tasks (filtered, paginated)
getTaskById()                 // Get single task
createTask()                  // Create new task
updateTask()                  // Update task
deleteTask()                  // Delete task
getTasksByPriority()          // Get priority-sorted tasks
```

### 3. Repository Layer (`repository/TaskRepository.java`)
- **Manual SQL Queries** (no ORM/JPA)
- Direct JDBC execution via JdbcTemplate
- Database operations
- Row mapping

**Methods**:
```java
findByUserId()                // Query tasks by user
countByUserId()               // Count tasks
findById()                    // Get single task
create()                      // Insert task
update()                      // Update task
delete()                      // Delete task
findByPriority()              // Query by priority
```

### 4. Model Layer (`model/`)
- Task model
- User model
- Entity definitions

### 5. DTO Layer (`dto/`)
- API request/response objects
- ApiResponse wrapper
- PaginatedResponse wrapper

---


## 🧪 TESTING (Tetap)

### Unit Testing (Optional - dapat ditambahkan nanti)

```bash
mvn test
```

### Manual Testing dengan cURL

**1. Get all tasks**
```bash
curl -X GET "http://localhost:8080/api/tasks?page=1&limit=10" \
  -H "Content-Type: application/json"
```

**2. Create task**
```bash
curl -X POST "http://localhost:8080/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete migration",
    "description": "Finish Java backend setup",
    "deadline": "2026-04-20T23:59:59",
    "priority": "HIGH",
    "status": "TODO",
    "estimatedDuration": 480
  }'
```

**3. Get task by ID**
```bash
curl -X GET "http://localhost:8080/api/tasks/task-id-here"
```

**4. Update task**
```bash
curl -X PUT "http://localhost:8080/api/tasks/task-id-here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "priority": "MEDIUM"
  }'
```

**5. Delete task**
```bash
curl -X DELETE "http://localhost:8080/api/tasks/task-id-here"
```

**6. Get HIGH priority tasks**
```bash
curl -X GET "http://localhost:8080/api/tasks/priority/HIGH?page=1&limit=10"
```

---


## 🚀 DEPLOYMENT (Tetap)

### Development
```bash
# Option 1: Maven
mvn spring-boot:run

# Option 2: JAR
java -jar target/taskplanner-api-1.0.0.jar
```

### Production (Linux with PM2)

**1. Build JAR**
```bash
mvn clean package -DskipTests
```

**2. Transfer to server**
```bash
scp target/taskplanner-api-1.0.0.jar user@server:/var/www/taskplanner-api/
```

**3. Install Java di server**
```bash
sudo apt update
sudo apt install openjdk-17-jre-headless
```

**4. Create PM2 ecosystem file** (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'taskplanner-api',
    script: '/usr/bin/java',
    args: '-jar /var/www/taskplanner-api/taskplanner-api-1.0.0.jar',
    cwd: '/var/www/taskplanner-api',
    instances: 1,
    exec_mode: 'fork',
    env: {
      PORT: 8080,
      SPRING_DATASOURCE_URL: 'jdbc:mysql://192.168.1.2:3307/taskplanner',
      SPRING_DATASOURCE_USERNAME: 'root',
      SPRING_DATASOURCE_PASSWORD: '0202'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
```

**5. Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
pm2 logs taskplanner-api
```

**6. Check status**
```bash
pm2 status
pm2 logs
pm2 monit
```

---


## 📝 LOGGING (Tetap)

Logs tersimpan di: `./logs/`

**Log levels** (application.yml):
```yaml
logging:
  level:
    root: INFO                    # Default level
    com.taskplanner: DEBUG        # App-specific debug
```

---


## 🔗 DEPENDENCIES (pom.xml) (Tetap)

| Dependency | Keterangan |
|------------|------------|
| `spring-boot-starter-web` | REST API framework |
| `spring-boot-starter-jdbc` | JdbcTemplate — JDBC abstraction layer |
| `mysql-connector-j` | **JDBC Driver** untuk MySQL (pengganti `mysql-connector-java` di Spring Boot 3.x) |
| `HikariCP` | Connection Pool — sudah include di `spring-boot-starter-jdbc` |
| `lombok` | Mengurangi boilerplate getter/setter |
| `spring-boot-starter-validation` | Validasi input |

### Catatan JDBC Driver
Tugas meminta **JDBC Driver** — driver yang digunakan adalah `mysql-connector-j` dari Oracle/MySQL. Driver ini adalah implementasi JDBC 4.2+ untuk MySQL.

```xml
<!-- pom.xml - JDBC Driver untuk MySQL -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Spring JDBC - JdbcTemplate wrapper di atas JDBC -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

---


## 📖 DOCUMENTATION (Update)

- Lihat [Purposlv2.md](Purposlv2.md) untuk core MVP dan roadmap.

- **Code Structure**: This README
- **Database Schema**: See "DATABASE SCHEMA" section above

---


## 🐛 TROUBLESHOOTING (Tetap)

### 1. Connection to database failed
```
Check:
- MySQL server running: mysql -h 192.168.1.2 -u root -p0202
- Firewall rules allow port 3307
- application.yml has correct credentials
```

### 2. Port 8080 already in use
```bash
# Change port in application.yml
server:
  port: 8081
```

### 3. Maven build fails
```bash
# Clear cache
mvn clean
# Re-download dependencies
mvn install
```

### 4. JAR not executable
```bash
# Make sure Java 17+ installed
java -version

# Check if JAR was built correctly
jar tf target/taskplanner-api-1.0.0.jar
```

---



---

**Created**: 2026-04-09  
**Last Updated**: 2026-04-09  
**Maintainer**: Task Planner Team
