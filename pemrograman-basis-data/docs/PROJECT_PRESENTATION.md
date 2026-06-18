# Smart Task Planner — Presentasi Proyek Basis Data

**Disusun untuk:** Tugas Besar Pemrograman Basis Data
**Stack:** Next.js (Frontend) + Express.js (Backend) + MySQL (Database)
**Durasi Presentasi:** 10–15 menit

---

## Slide 1: Cover

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                    SMART TASK PLANNER                                         ║
║                                                                               ║
║         Aplikasi Task Management dengan AI Assistant                          ║
║         Integrasi Google Calendar & WhatsApp                                  ║
║                                                                               ║
║    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         ║
║    │   Next.js      │───▶│   Express.js    │───▶│     MySQL       │         ║
║    │   Frontend      │    │   Backend       │    │   Database      │         ║
║    └─────────────────┘    └─────────────────┘    └─────────────────┘         ║
║                                                                               ║
║    Nama Lengkap | NIM | Universitas                                           ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## Slide 2: Deskripsi Proyek

### 2.1 Apa itu Smart Task Planner?

Smart Task Planner adalah aplikasi manajemen tugas berbasis web yang dirancang untuk membantu pengguna mengelola aktivitas harian dengan fitur:

- **Pembuatan tugas cepat** dengan AI-assisted input
- **Dashboard interaktif** untuk visualisasi tugas harian
- **Analisis produktivitas** dengan skor dan insight AI
- **Integrasi WhatsApp** untuk command task via chat
- **Sinkronisasi Google Calendar** otomatis

### 2.2 Tujuan Pengembangan

| Tujuan | Deskripsi |
|--------|-----------|
| Mobilitas | Akses tugas dari desktop dan mobile |
| Efisiensi | AI parsing untuk input tugas natural language |
| Produktivitas | Gamifikasi dan analisis data pribadi |
| Konektivitas | Integrasi dengan tools yang sudah digunakan |

### 2.3 Target Pengguna

- Profesional muda yang membutuhkan manajemen tugas sederhana
- Mahasiswa yang memerlukan pengingat deadline
- Tim kecil yang membutuhkan koordinasi tugas

---

## Slide 3: Struktur Database / Schema

### 3.1 Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │      Task       │       │    Reminder     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │    ┌──│ id (PK)         │
│ email           │  │    │ userId (FK)     │◀───┘  │ userId (FK)     │
│ name            │  └───▶│ title           │       │ taskId (FK)     │
│ password        │       │ description     │──────▶│ remindAt        │
│ whatsappNumber  │       │ deadline        │       │ sent            │
│ theme           │       │ priority        │       └─────────────────┘
│ createdAt       │       │ status          │
│ updatedAt       │       │ estimatedDuration│       ┌─────────────────┐
└─────────────────┘       │ googleCalendarId│       │    TaskTag      │
        │                 │ createdAt       │       ├─────────────────┤
        │                 │ completedAt     │       │ id (PK)         │
        │                 │ deletedAt       │       │ taskId (FK)     │
        │                 └─────────────────┘       │ tagName         │
        │                        │                 │ color           │
        ▼                        │                 └─────────────────┘
┌─────────────────┐               │
│    Calendar     │               │
├─────────────────┤               │
│ id (PK)         │               │
│ userId (FK)     │               │
│ calendarId      │               │
│ name            │               │
│ description     │               │
│ type            │               │
│ color           │               │
│ isDefault       │               │
│ isSynced        │               │
└─────────────────┘               │
                                  ▼
                    ┌─────────────────────────┐
                    │  OverviewAnalysisCache │
                    ├─────────────────────────┤
                    │ id (PK)                 │
                    │ userId (FK)            │
                    │ score                   │
                    │ insights                │
                    │ advice                  │
                    │ totalTasks              │
                    │ completedTasks          │
                    │ expiresAt               │
                    └─────────────────────────┘

NextAuth Models (Supporting):
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   Account    │  │   Session    │  │ VerificationToken │
├──────────────┤  ├──────────────┤  ├──────────────────┤
│ id           │  │ id           │  │ identifier        │
│ userId (FK)  │──│ userId (FK)  │  │ token             │
│ provider     │  │ sessionToken │  │ expires           │
│ providerAccId│  │ expires      │  └──────────────────┘
└──────────────┘  └──────────────┘
```

### 3.2 Tabel Detail Schema

#### Tabel: User

| Field | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | VARCHAR(25) | PRIMARY KEY, DEFAULT cuid() | ID unik user |
| email | VARCHAR(191) | UNIQUE, NULLABLE | Email untuk login |
| name | VARCHAR(191) | NULLABLE | Nama lengkap |
| password | VARCHAR(191) | NULLABLE | Password ter-hash (bcrypt) |
| whatsappNumber | VARCHAR(50) | UNIQUE, NULLABLE | Nomor WhatsApp tertaut |
| theme | VARCHAR(20) | DEFAULT 'light' | Preferensi tema UI |
| createdAt | DATETIME | DEFAULT NOW() | Timestamp dibuat |
| updatedAt | DATETIME | @updatedAt | Timestamp update |

#### Tabel: Task

| Field | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | VARCHAR(25) | PRIMARY KEY, DEFAULT cuid() | ID unik task |
| userId | VARCHAR(25) | FOREIGN KEY (User.id) | Pemilik task |
| title | VARCHAR(191) | NOT NULL | Judul task |
| description | LONGTEXT | NULLABLE | Deskripsi detail |
| deadline | DATETIME | NOT NULL | Batas waktu |
| priority | VARCHAR(10) | DEFAULT 'MEDIUM' | HIGH/MEDIUM/LOW |
| estimatedDuration | INT | NULLABLE | Estimasi menit |
| status | VARCHAR(20) | DEFAULT 'PENDING' | PENDING/DONE/SKIPPED |
| reminderTime | INT | DEFAULT 60 | Menit sebelum deadline |
| googleCalendarEventId | VARCHAR(191) | NULLABLE | ID event Google |
| completedAt | DATETIME | NULLABLE | Waktu selesai |
| deletedAt | DATETIME | NULLABLE | Soft delete |

#### Tabel: TaskTag

| Field | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | VARCHAR(25) | PRIMARY KEY | ID unik tag |
| taskId | VARCHAR(25) | FOREIGN KEY (Task.id) | Task terkait |
| tagName | VARCHAR(191) | NOT NULL | Nama tag |
| color | VARCHAR(20) | DEFAULT '#3B82F6' | Warna tag |

#### Tabel: Reminder

| Field | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | VARCHAR(25) | PRIMARY KEY | ID unik reminder |
| userId | VARCHAR(25) | FOREIGN KEY (User.id) | User pemilik |
| taskId | VARCHAR(25) | FOREIGN KEY (Task.id), NULLABLE | Task terkait |
| remindAt | DATETIME | NOT NULL | Waktu pengingat |
| sent | BOOLEAN | DEFAULT FALSE | Status terkirim |

#### Tabel: Calendar

| Field | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | VARCHAR(25) | PRIMARY KEY | ID unik kalender |
| userId | VARCHAR(25) | FOREIGN KEY (User.id) | User pemilik |
| calendarId | VARCHAR(191) | NULLABLE | Google Calendar ID |
| name | VARCHAR(191) | NOT NULL | Nama kalender |
| type | VARCHAR(20) | DEFAULT 'personal' | Jenis kalender |
| isDefault | BOOLEAN | DEFAULT FALSE | Kalender default |
| isSynced | BOOLEAN | DEFAULT FALSE | Status sinkronisasi |

#### Tabel: OverviewAnalysisCache

| Field | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | VARCHAR(25) | PRIMARY KEY | ID unik cache |
| userId | VARCHAR(25) | FOREIGN KEY (User.id), UNIQUE | User pemilik |
| score | INT | NOT NULL | Skor produktivitas |
| insights | LONGTEXT | NOT NULL | Array JSON insight |
| advice | LONGTEXT | NOT NULL | Array JSON saran |
| expiresAt | DATETIME | NOT NULL | Kadaluarsa cache |

### 3.3 Indeks Database

```sql
-- User indexes
CREATE INDEX idx_user_email ON User(email);

-- Task indexes
CREATE INDEX idx_task_userId ON Task(userId);
CREATE INDEX idx_task_deadline ON Task(deadline);
CREATE INDEX idx_task_priority ON Task(priority);
CREATE INDEX idx_task_status ON Task(status);
CREATE INDEX idx_task_deletedAt ON Task(deletedAt);

-- Reminder indexes
CREATE INDEX idx_reminder_userId ON Reminder(userId);
CREATE INDEX idx_reminder_taskId ON Reminder(taskId);
CREATE INDEX idx_reminder_remindAt ON Reminder(remindAt);
CREATE INDEX idx_reminder_sent ON Reminder(sent);

-- Calendar indexes
CREATE INDEX idx_calendar_userId ON Calendar(userId);

-- OverviewAnalysisCache indexes
CREATE INDEX idx_cache_userId ON OverviewAnalysisCache(userId);
CREATE INDEX idx_cache_expiresAt ON OverviewAnalysisCache(expiresAt);
```

---

## Slide 4: Operasi CRUD

### 4.1 Create Operations

#### Registrasi User
```
POST /api/auth/register
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
Response:
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "..." },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
Validasi:
- Email harus format valid dan unik
- Password minimal 8 karakter
- Nama tidak boleh kosong
- CAPTCHA token wajib
```

#### Create Task
```
POST /api/tasks
Request:
{
  "title": "Kerjakan Laporan",
  "description": "Laporan Project Based Learning",
  "deadline": "2024-06-20T23:59:00Z",
  "priority": "HIGH",
  "estimatedDuration": 120,
  "reminderTime": 60,
  "tags": ["kuliah", "urgent"]
}
Response:
{
  "success": true,
  "data": { "task": { ... }, "tags": [...] }
}
Validasi:
- Title: required, max 191 karakter
- Deadline: required, harus di masa depan
- Priority: enum (HIGH, MEDIUM, LOW)
- EstimatedDuration: integer positif
```

### 4.2 Read Operations

#### Get All Tasks (dengan filtering)
```
GET /api/tasks?status=PENDING&priority=HIGH&page=1&limit=20
Response:
{
  "success": true,
  "data": {
    "tasks": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
Query Parameters:
- status: PENDING | DONE | SKIPPED
- priority: HIGH | MEDIUM | LOW
- page: number (default: 1)
- limit: number (default: 20)
```

#### Get Task Statistics
```
GET /api/tasks/stats
Response:
{
  "success": true,
  "data": {
    "total": 50,
    "pending": 25,
    "done": 20,
    "skipped": 5,
    "byPriority": {
      "HIGH": 15,
      "MEDIUM": 25,
      "LOW": 10
    }
  }
}
```

#### Get Daily/Weekly Stats
```
GET /api/tasks/stats/daily?days=30
GET /api/tasks/stats/weekly?weeks=12
```

### 4.3 Update Operations

#### Update Task
```
PATCH /api/tasks/:id
Request:
{
  "title": "Judul Baru",
  "priority": "LOW",
  "deadline": "2024-06-25T18:00:00Z"
}
```

#### Update Task Status
```
PATCH /api/tasks/:id/status
Request:
{
  "status": "DONE"
}
Response:
{
  "success": true,
  "data": {
    "task": { ..., "status": "DONE", "completedAt": "..." }
  }
}
```

### 4.4 Delete Operations

#### Soft Delete Task
```
DELETE /api/tasks/:id
Response:
{
  "success": true,
  "message": "Task deleted successfully"
}
Catatan: Menggunakan soft delete (deletedAt timestamp)
```

### 4.5 Error Handling

```typescript
// Standard Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "password", "message": "Password too short" }
    ]
  }
}

// Error Codes
VALIDATION_ERROR    // Input validation failed
UNAUTHORIZED        // Missing or invalid token
FORBIDDEN           // Access denied
NOT_FOUND           // Resource not found
INTERNAL_ERROR      // Server error
TRANSACTION_FAILED  // Database transaction failed
```

### 4.6 Transaction Management

```typescript
// Example: Create Task with Reminder (Atomic Transaction)
async createTaskWithReminder(data, reminderTime) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create task
    const task = await tx.task.create({
      data: {
        userId: data.userId,
        title: data.title,
        deadline: data.deadline,
        priority: data.priority,
        // ...
      }
    });

    // 2. Create reminder
    const reminder = await tx.reminder.create({
      data: {
        userId: data.userId,
        taskId: task.id,
        remindAt: subMinutes(data.deadline, reminderTime)
      }
    });

    // 3. Create tags
    await tx.taskTag.createMany({
      data: data.tags.map(tag => ({
        taskId: task.id,
        tagName: tag
      }))
    });

    return { task, reminder };
  });
  // If any step fails -> automatic ROLLBACK
  // If all success -> automatic COMMIT
}
```

---

## Slide 5: Fitur Unik dan Tambahan

### 5.1 Autentikasi Hybrid

```
┌─────────────────┐     ┌─────────────────┐
│  Google OAuth   │     │ Email/Password  │
│  (NextAuth.js)  │     │   (JWT)         │
└────────┬────────┘     └────────┬────────┘
         │                      │
         ▼                      ▼
    ┌─────────────────────────────┐
    │     Auth Sync Middleware    │
    │  (Bridge to Express JWT)    │
    └──────────────┬──────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  Backend JWT    │
         │  (Same token)  │
         └─────────────────┘
```

**Fitur:**
- Login dengan Google OAuth
- Login dengan email + password
- Sync session otomatis
- Cookie + localStorage token storage

### 5.2 AI Task Parsing

```javascript
// Natural Language -> Structured Task
Input:  "Rapat tim besok jam 9 pagi, durasi 2 jam, prioritas tinggi"
Output: {
  title: "Rapat tim",
  deadline: "2024-06-20T09:00:00+07:00",
  estimatedDuration: 120,
  priority: "HIGH"
}
```

**Kemampuan:**
- Parsing bahasa Indonesia & Inggris
- Interpretasi waktu relatif (besok, lusa, jam 9 pagi)
- Deteksi prioritas dari konteks
- Multi-language support

### 5.3 WhatsApp Integration

```
┌──────────────┐    /internal/wa    ┌─────────────────┐
│   WhatsApp   │◀──────────────────│  WhatsApp       │
│   User       │──────────────────▶│  Inbound Module │
└──────────────┘                   └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  AI Service     │
                                   │  (Plan Resolve) │
                                   └────────┬────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────┐
        ▼                                   ▼                   ▼
┌───────────────┐              ┌───────────────┐     ┌───────────────┐
│ Create Task   │              │  Get Stats    │     │ Send Reply    │
└───────────────┘              └───────────────┘     └───────────────┘
```

**Command yang didukung:**
- `task baru: [deskripsi]` - Buat task
- `task saya` - Lihat task aktif
- `statistik` - Lihat statistik

### 5.4 Google Calendar Sync

```typescript
interface CalendarSync {
  userId: string;
  calendars: {
    id: string;
    name: string;
    type: 'personal' | 'work' | 'study';
    color: string;
    isDefault: boolean;
  }[];
  syncStatus: 'synced' | 'pending' | 'error';
}
```

### 5.5 Gamifikasi Produktivitas

```
┌─────────────────────────────────────────┐
│           Productivity Score            │
│                                         │
│     ┌─────────────────────────┐         │
│     │   🦅 EAGLE SCORE: 850   │         │
│     │   Top 15% of users     │         │
│     └─────────────────────────┘         │
│                                         │
│  Score Tiers:                           │
│  🐌 Snail: 0-200                        │
│  🐇 Rabbit: 201-400                      │
│  🦅 Eagle: 401-600                       │
│  🐉 Dragon: 601-800                      │
│  🌟 Phoenix: 801-1000                    │
└─────────────────────────────────────────┘
```

### 5.6 Command Palette

```
┌────────────────────────────────────────────────┐
│ 🔍 Ketik command...                            │
├────────────────────────────────────────────────┤
│                                                │
│  /add      - Tambah task baru                  │
│  /list     - Lihat semua task                  │
│  /today    - Task hari ini                     │
│  /stats    - Statistik produktivitas            │
│  /ai       - Tanya AI assistant                │
│                                                │
└────────────────────────────────────────────────┘
```

### 5.7 Pagination & Sorting

```typescript
// API Response dengan Pagination
{
  success: true,
  data: {
    tasks: [...],
    pagination: {
      page: 1,
      limit: 20,
      total: 156,
      totalPages: 8,
      hasNext: true,
      hasPrev: false
    }
  }
}

// Sorting Options
GET /api/tasks?sortBy=deadline&order=asc
GET /api/tasks?sortBy=priority&order=desc
GET /api/tasks?sortBy=createdAt&order=desc
```

### 5.8 Auto-Skip Scheduler

```typescript
// Background Job: Auto-skip overdue tasks
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  
  // Find tasks past deadline that are still PENDING
  const overdueTasks = await prisma.task.findMany({
    where: {
      deadline: { lt: now },
      status: 'PENDING',
      deletedAt: null
    }
  });

  // Auto-skip each overdue task
  for (const task of overdueTasks) {
    await prisma.task.update({
      where: { id: task.id },
      data: { 
        status: 'SKIPPED',
        skippedNotificationSent: false  // Trigger notification
      }
    });
  }
});
```

---

## Slide 6: Arsitektur Sistem

### 6.1 Arsitektur Overall

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │   Next.js App   │  │  Vue.js App     │  │  React Native   │          │
│  │  (Web Browser)  │  │ (Alternative)   │  │  (Mobile)       │          │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘          │
└───────────┼──────────────────────┼──────────────────────┼─────────────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY / CORS                                │
│                        (Cloudflare Tunnel)                                 │
└───────────┬──────────────────────────────────────┬────────────────────────┘
            │                                      │
            ▼                                      ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│    EXPRESS.JS BACKEND   │           │    NEXT.JS API ROUTES   │
│    (Main API Server)    │           │    (Legacy / Auth)      │
│    Port: 8000           │           │    Port: 3000           │
│                         │           │                         │
│  ┌───────────────────┐  │           │  ┌───────────────────┐  │
│  │ /api/auth/*       │  │           │  │ /api/auth/*       │  │
│  │ /api/tasks/*      │  │           │  │ /api/nextauth/*    │  │
│  │ /api/ai/*         │  │           │  └───────────────────┘  │
│  │ /api/calendars/*  │  │           │                         │
│  │ /api/reminders/*  │  │           │                         │
│  │ /internal/wa/*     │  │           │                         │
│  └───────────────────┘  │           │                         │
└───────────┬─────────────┘           └────────────┬────────────┘
            │                                      │
            ▼                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                   │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   MySQL     │  │   Redis     │  │  External   │  │ 9Router API │   │
│  │  (Primary)  │  │  (Future)   │  │  Services   │  │   (AI)      │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │                    PRISMA ORM                                      │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  External Integrations:                                                 │
│  - Google OAuth (Auth)                                                  │
│  - Google Calendar (Sync)                                               │
│  - WhatsApp Bot (Internal)                                              │
│  - 9Router / OpenAI-compatible (AI)                                    │
└───────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Arsitektur Frontend Next.js

```
src/
├── app/
│   ├── (public)/              # Landing page, marketing
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Public layout with header
│   │
│   ├── (protected)/           # Authenticated routes
│   │   ├── dashboard/         # Main task dashboard
│   │   ├── overview/          # Productivity analytics
│   │   ├── connectwhatsapp/   # WhatsApp integration
│   │   └── layout.tsx         # Protected layout (shell)
│   │
│   ├── auth/                  # Authentication pages
│   │   ├── signin/
│   │   ├── signup/
│   │   └── callback/
│   │
│   ├── api/auth/[...nextauth] # NextAuth API routes
│   │
│   ├── layout.tsx             # Root layout
│   └── providers.tsx         # Global providers composition
│
├── components/
│   ├── tasks/                 # Task-related components
│   │   ├── TaskCard.tsx
│   │   ├── TaskModal.tsx
│   │   └── TaskPriorityList.tsx
│   │
│   ├── calendar/              # Calendar components
│   │   └── CalendarTimeline.tsx
│   │
│   ├── command/               # Command palette
│   │   └── CommandPalette.tsx
│   │
│   ├── layout/                # Layout components
│   │   └── Header.tsx
│   │
│   └── providers/             # React context providers
│       ├── SnackbarProvider.tsx
│       ├── ThemeProvider.tsx
│       └── AuthSessionProvider.tsx
│
├── lib/
│   ├── api/                   # API client & helpers
│   │   └── client.ts          # apiRequest(), taskApi, aiApi
│   │
│   ├── auth/                  # Authentication utilities
│   │   ├── index.ts           # NextAuth config
│   │   ├── sync.ts            # NextAuth to Express bridge
│   │   └── cookies.ts         # Cookie helpers
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useNotification.ts
│   │   └── useTaskStats.ts
│   │
│   └── utils/                 # Utility functions
│       ├── store.ts           # Zustand store
│       ├── date.ts            # Date formatting
│       └── priority.ts        # Priority helpers
│
└── middleware.ts              # Route protection middleware
```

### 6.3 Arsitektur Backend Express

```
backend/src/
├── server.ts                  # Entry point
├── app.ts                     # Express app composition
│
├── config/
│   ├── env.ts                 # Environment variables
│   ├── cors.ts                # CORS configuration
│   └── swagger.ts             # API documentation
│
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── errors.ts              # Custom error classes
│   ├── response.ts            # Standard response helpers
│   └── captcha/
│       └── turnstile.service.ts
│
├── middleware/
│   ├── auth.ts                 # JWT authentication
│   ├── error-handler.ts        # Global error handler
│   └── validate.ts             # Zod validation middleware
│
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   └── google-oauth.service.ts
│   │
│   ├── tasks/
│   │   ├── task.routes.ts
│   │   ├── task.controller.ts
│   │   ├── task.service.ts
│   │   ├── task.validation.ts
│   │   ├── task.skip.routes.ts
│   │   ├── task.skip.controller.ts
│   │   └── task.auto-skip.scheduler.ts
│   │
│   ├── reminders/
│   │   ├── reminder.routes.ts
│   │   ├── reminder.controller.ts
│   │   ├── reminder.service.ts
│   │   └── reminder.validation.ts
│   │
│   ├── calendar/
│   │   ├── calendar.routes.ts
│   │   ├── calendar.controller.ts
│   │   ├── calendar.service.ts
│   │   ├── calendar.validation.ts
│   │   ├── calendar.refresh.routes.ts
│   │   └── calendar.refresh.controller.ts
│   │
│   ├── ai/
│   │   ├── ai.routes.ts
│   │   ├── ai.controller.ts
│   │   └── ai.service.ts
│   │
│   └── whatsappInbound/
│       └── whatsapp-inbound.routes.ts
│
└── utils/
    └── priority.ts
```

### 6.4 Data Flow Diagram

```
User Action                    Frontend                   Backend                    Database
    │                            │                          │                           │
    │  1. Create Task Form       │                          │                           │
    │──────────────────────────▶│                          │                           │
    │                           │  2. POST /api/tasks      │                           │
    │                           │────────────────────────▶│                           │
    │                           │                          │  3. Validate Input        │
    │                           │                          │──────────────────────────▶│
    │                           │                          │                           │
    │                           │                          │  4. INSERT INTO Task      │
    │                           │                          │──────────────────────────▶│
    │                           │                          │                           │
    │                           │                          │  5. Create Reminder       │
    │                           │                          │──────────────────────────▶│
    │                           │                          │                           │
    │                           │                          │  6. COMMIT (success)      │
    │                           │                          │◀──────────────────────────│
    │                           │  7. { success: true }   │                           │
    │                           │◀────────────────────────│                           │
    │  8. Update UI             │                          │                           │
    │◀──────────────────────────│                          │                           │
    │                           │                          │                           │
    │  (Show success toast)     │                          │                           │
```

### 6.5 Communication Flow

| Flow | Protocol | Port | Description |
|------|----------|------|-------------|
| Frontend → Backend | HTTP/REST | 8000 | Main API calls |
| Backend → MySQL | TCP | 3306 | Database queries |
| Frontend → NextAuth | HTTP | 3000 | Google OAuth |
| Backend → Google API | HTTPS | 443 | Calendar sync |
| Backend → WhatsApp | HTTP | 443 | Bot API |
| Backend → 9Router | HTTPS | 443 | AI requests |

---

## Slide 7: Teknologi yang Digunakan

### 7.1 Frontend Stack

| Teknologi | Versi | Purpose |
|-----------|-------|---------|
| **Next.js** | 14.x | React framework dengan App Router |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Zustand** | 4.x | Lightweight state management |
| **NextAuth.js** | 4.x | Authentication (Google OAuth) |
| **Recharts** | 2.x | Data visualization |
| **Lucide React** | latest | Icon library |
| **Notistack** | 2.x | Toast notifications |
| **date-fns** | 3.x | Date manipulation |

### 7.2 Backend Stack

| Teknologi | Versi | Purpose |
|-----------|-------|---------|
| **Express.js** | 4.x | Web framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Node.js** | 20.x | JavaScript runtime |
| **Prisma** | 5.x | ORM untuk MySQL |
| **MySQL** | 8.x | Relational database |
| **jsonwebtoken** | 9.x | JWT authentication |
| **bcrypt** | 5.x | Password hashing |
| **zod** | 3.x | Schema validation |
| **googleapis** | 130.x | Google OAuth & Calendar |
| **cors** | 2.x | Cross-origin resource sharing |
| **dotenv** | 16.x | Environment variables |

### 7.3 Development Tools

| Tool | Purpose |
|------|---------|
| **tsx** | TypeScript execution untuk development |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Postman** | API testing |
| **Prisma Studio** | Database GUI |
| **MySQL Workbench** | SQL client |
| **Cloudflare Tunnel** | Secure expose local dev |

### 7.4 External Services

| Service | Integration | Purpose |
|---------|-------------|---------|
| **Google OAuth** | googleapis | User authentication |
| **Google Calendar API** | googleapis | Calendar sync |
| **9Router / OpenAI API** | fetch (REST) | AI task parsing |
| **WhatsApp Bot** | HTTP webhook | WhatsApp commands |
| **Cloudflare Turnstile** | CAPTCHA service | Bot protection |

---

## Slide 8: Kesimpulan dan Hasil

### 8.1 Pencapaian Proyek

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT ACHIEVEMENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Full-stack application deployed                              │
│  ✅ Complete CRUD operations with validation                     │
│  ✅ Hybrid authentication (Google + Email)                       │
│  ✅ AI-powered task parsing (Natural Language)                   │
│  ✅ WhatsApp integration for task commands                       │
│  ✅ Google Calendar synchronization                              │
│  ✅ Real-time productivity analytics                             │
│  ✅ Gamification system with productivity scores                 │
│  ✅ Command palette for quick actions                            │
│  ✅ Mobile-responsive design                                     │
│                                                                  │
│  Statistics:                                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Tables: 8          │ Endpoints: 25+                       │ │
│  │ Features: 15+      │ Components: 30+                       │ │
│  │ Tests: passing     │ Documentation: complete               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Pembelajaran

| Kategori | Pembelajaran |
|----------|--------------|
| **Database Design** | Prisma ORM menyederhanakan schema management dan migration |
| **Authentication** | Hybrid auth memerlukan sinkronisasi session yang hati-hati |
| **API Design** | RESTful dengan response wrapper standar membantu debugging |
| **TypeScript** | Type safety mencegah banyak runtime errors |
| **AI Integration** | Prompt engineering penting untuk parsing yang akurat |
| **Error Handling** | Consistent error format membantu frontend handling |

### 8.3 Potential Improvements

```
┌─────────────────────────────────────────────────────────────────┐
│                  FUTURE IMPROVEMENTS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Short-term:                                                     │
│  ───────────                                                     │
│  • Real-time updates dengan WebSocket/SSE                        │
│  • Push notifications untuk mobile                                │
│  • Offline-first dengan Service Worker                           │
│  • Enhanced AI dengan function calling                           │
│                                                                  │
│  Mid-term:                                                       │
│  ──────────                                                      │
│  • Team collaboration features                                   │
│  • Recurring tasks                                               │
│  • File attachments untuk task                                   │
│  • Calendar views (week, month)                                  │
│                                                                  │
│  Long-term:                                                      │
│  ───────────                                                     │
│  • AI scheduling optimization                                    │
│  • Integration dengan Slack/Discord                              │
│  • Mobile native apps (iOS/Android)                              │
│  • Multi-language support                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Security Measures

| Measure | Implementation |
|---------|---------------|
| **SQL Injection Prevention** | Prepared statements via Prisma ORM |
| **Password Security** | bcrypt hashing dengan salt rounds |
| **JWT Security** | Short expiration + refresh token |
| **CORS Protection** | Whitelist specific origins |
| **Input Validation** | Zod schema validation |
| **CAPTCHA** | Cloudflare Turnstile |
| **Rate Limiting** | (Future enhancement) |

### 8.5 Database Performance Optimizations

```sql
-- Query optimization: Use indexes
SELECT * FROM Task 
WHERE userId = ? 
  AND status != 'DONE' 
  AND deletedAt IS NULL
ORDER BY deadline ASC
LIMIT 20;

-- Explain analysis
EXPLAIN SELECT * FROM Task 
WHERE userId = 'user123' 
  AND deadline > NOW();

-- Result: Uses idx_task_userId + idx_task_deadline
```

### 8.6 Terima Kasih

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                      PRESENTASI SELESAI                            ║
║                                                                    ║
║                      Terima Kasih!                                 ║
║                                                                    ║
║   Demo:    http://localhost:3000                                  ║
║   Backend: http://localhost:8000                                   ║
║   Docs:    ./docs/                                                 ║
║                                                                    ║
║   Questions?                                                       ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Lampiran: Quick Reference

### A. API Base URL
```
Frontend: http://localhost:3000
Backend:  http://localhost:8000
API:      http://localhost:8000/api
```

### B. Key Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Backend (.env):**
```
DATABASE_URL=mysql://user:pass@localhost:3306/taskplanner
JWT_SECRET=...
PORT=8000
FRONTEND_URL=http://localhost:3000
NINE_ROUTER_API_KEY=...
```

### C. Common Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint

# Backend
cd backend
npm run dev          # Start with tsx
npm run build        # Compile TypeScript
npx prisma studio     # Open database GUI
npx prisma migrate    # Run migrations

# Database
mysql -u root -p     # Connect to MySQL
```

---

**Dokumen ini disusun berdasarkan:**
- [`APP-nextjs.md`](./APP-nextjs.md) - Dokumentasi Frontend
- [`APP-express.md`](./APP-express.md) - Dokumentasi Backend
- [`schema.prisma`](proyek-perangkat-lunak/backend/prisma/schema.prisma) - Database Schema
