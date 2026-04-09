# Task Planner API - Java Spring Boot Backend

**Status**: Development  
**Version**: 1.0.0  
**Date**: April 9, 2026

## 📋 Overview

Task Planner API adalah backend REST API untuk aplikasi manajemen tugas. Dibangun menggunakan **Java Spring Boot** dengan koneksi database menggunakan **JDBC Driver (mysql-connector-j)** — sesuai syarat tugas yang meminta Java/C# dengan driver JDBC/ODP.NET.

Seluruh operasi database menggunakan **manual SQL query** via `JdbcTemplate` (Spring JDBC), tanpa ORM seperti JPA/Hibernate.

**Stack**:
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.0
- **Database Driver**: `mysql-connector-j` (JDBC Driver untuk MySQL)
- **JDBC Wrapper**: `JdbcTemplate` (Spring JDBC abstraction)
- **Connection Pool**: HikariCP (built-in Spring Boot)
- **Build Tool**: Maven
- **Process Manager**: PM2 (deployment Linux)

---

## 📁 PROJECT STRUCTURE

```
TaskPlanner-Java-Backend/
├── src/
│   ├── main/
│   │   ├── java/com/taskplanner/
│   │   │   ├── TaskPlannerApplication.java    (Entry point)
│   │   │   ├── controller/
│   │   │   │   └── TaskController.java        (API endpoints)
│   │   │   ├── service/
│   │   │   │   └── TaskService.java           (Business logic)
│   │   │   ├── repository/
│   │   │   │   └── TaskRepository.java        (Manual SQL queries)
│   │   │   ├── model/
│   │   │   │   ├── User.java                  (User model)
│   │   │   │   └── Task.java                  (Task model)
│   │   │   ├── dto/
│   │   │   │   ├── ApiResponse.java           (Response wrapper)
│   │   │   │   ├── PaginatedResponse.java     (Paginated response)
│   │   │   │   ├── CreateTaskRequest.java     (Request DTO)
│   │   │   │   └── UpdateTaskRequest.java     (Request DTO)
│   │   │   └── config/
│   │   │       └── DatabaseConfig.java        (DB configuration)
│   │   └── resources/
│   │       └── application.yml                (Application config)
│   └── test/
│       └── java/
├── pom.xml                                    (Maven dependencies)
├── API_ROUTES.md                              (API documentation)
└── README.md                                  (This file)
```

---

## 🔧 SETUP GUIDE

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
curl http://localhost:8080/api/v1/tasks

# Create task
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","deadline":"2026-04-20T23:59:59","priority":"HIGH"}'
```

---

## 📋 API ENDPOINTS

Dokumentasi lengkap: **[API_ROUTES.md](./API_ROUTES.md)**

### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | List all tasks (paginated) |
| POST | `/api/v1/tasks` | Create new task |
| GET | `/api/v1/tasks/:id` | Get task by ID |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |
| GET | `/api/v1/tasks/priority/:level` | Get tasks by priority |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health |

---

## 🗄️ DATABASE SCHEMA

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

## 🏗️ ARCHITECTURE LAYERS

### 1. Controller Layer (`controller/TaskController.java`)
- Handles HTTP requests/responses
- Request validation
- Route mapping
- Error handling

**Routes**:
```java
@GetMapping              // GET /v1/tasks
@PostMapping             // POST /v1/tasks
@GetMapping("/{id}")     // GET /v1/tasks/:id
@PutMapping("/{id}")     // PUT /v1/tasks/:id
@DeleteMapping("/{id}")  // DELETE /v1/tasks/:id
@GetMapping("/priority/{level}")  // GET /v1/tasks/priority/:level
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

## 🧪 TESTING

### Unit Testing (Optional - dapat ditambahkan nanti)

```bash
mvn test
```

### Manual Testing dengan cURL

**1. Get all tasks**
```bash
curl -X GET "http://localhost:8080/api/v1/tasks?page=1&limit=10" \
  -H "Content-Type: application/json"
```

**2. Create task**
```bash
curl -X POST "http://localhost:8080/api/v1/tasks" \
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
curl -X GET "http://localhost:8080/api/v1/tasks/task-id-here"
```

**4. Update task**
```bash
curl -X PUT "http://localhost:8080/api/v1/tasks/task-id-here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "priority": "MEDIUM"
  }'
```

**5. Delete task**
```bash
curl -X DELETE "http://localhost:8080/api/v1/tasks/task-id-here"
```

**6. Get HIGH priority tasks**
```bash
curl -X GET "http://localhost:8080/api/v1/tasks/priority/HIGH?page=1&limit=10"
```

---

## 🚀 DEPLOYMENT

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

## 📝 LOGGING

Logs tersimpan di: `./logs/`

**Log levels** (application.yml):
```yaml
logging:
  level:
    root: INFO                    # Default level
    com.taskplanner: DEBUG        # App-specific debug
```

---

## 🔗 DEPENDENCIES (pom.xml)

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

## 📖 DOCUMENTATION

- **API Routes**: [API_ROUTES.md](./API_ROUTES.md)
- **Code Structure**: This README
- **Database Schema**: See "DATABASE SCHEMA" section above

---

## 🐛 TROUBLESHOOTING

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

## 🎯 NEXT STEPS

1. ✅ Setup Java backend
2. ⏳ Setup Vue.js frontend (task-planner-fe-vuejs)
3. ⏳ Integration testing (backend + frontend)
4. ⏳ Authentication/Authorization (JWT)
5. ⏳ Deployment to production

---

**Created**: 2026-04-09  
**Last Updated**: 2026-04-09  
**Maintainer**: Task Planner Team
