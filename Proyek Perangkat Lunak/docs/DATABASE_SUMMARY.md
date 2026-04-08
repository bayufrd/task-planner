# Database Setup Summary

## 📊 Database Created: `taskplanner`

**Connection Details:**
```
Host: 192.168.1.2
Port: 3307
Database: taskplanner
Username: root
Password: 0202
Charset: utf8mb4
```

## 🗄️ Tables Structure

### 1. **User** Table
```sql
Columns:
- id (VARCHAR, Primary Key)
- email (VARCHAR, UNIQUE)
- name (VARCHAR)
- password (VARCHAR)
- googleId (VARCHAR, UNIQUE)
- googleAccessToken (LONGTEXT)
- googleRefreshToken (LONGTEXT)
- theme (VARCHAR, DEFAULT 'light')
- googleCalendarSync (BOOLEAN, DEFAULT false)
- createdAt (DATETIME)
- updatedAt (DATETIME)

Index: email
```

### 2. **Task** Table
```sql
Columns:
- id (VARCHAR, Primary Key)
- userId (VARCHAR, Foreign Key → User.id)
- title (VARCHAR, NOT NULL)
- description (LONGTEXT)
- deadline (DATETIME, NOT NULL)
- priority (VARCHAR, DEFAULT 'MEDIUM')
- estimatedDuration (INT, in minutes)
- status (VARCHAR, DEFAULT 'TODO')
- reminderTime (INT, DEFAULT 60 minutes)
- reminderSent (BOOLEAN)
- googleCalendarEventId (VARCHAR)
- googleCalendarId (VARCHAR)
- createdAt (DATETIME)
- updatedAt (DATETIME)
- completedAt (DATETIME)

Indexes:
- userId (Foreign Key)
- deadline
- priority
- status
```

### 3. **TaskTag** Table
```sql
Columns:
- id (VARCHAR, Primary Key)
- taskId (VARCHAR, Foreign Key → Task.id)
- tagName (VARCHAR, NOT NULL)
- color (VARCHAR, DEFAULT '#3B82F6')

Constraints:
- UNIQUE (taskId, tagName)
- Index: taskId
```

### 4. **Reminder** Table
```sql
Columns:
- id (VARCHAR, Primary Key)
- userId (VARCHAR, Foreign Key → User.id)
- taskId (VARCHAR, Foreign Key → Task.id, NULLABLE)
- remindAt (DATETIME, NOT NULL)
- sent (BOOLEAN, DEFAULT false)
- sentAt (DATETIME)
- createdAt (DATETIME)

Indexes:
- userId
- taskId
- remindAt
```

### 5. **Calendar** Table
```sql
Columns:
- id (VARCHAR, Primary Key)
- userId (VARCHAR, Foreign Key → User.id)
- googleCalendarId (VARCHAR, UNIQUE)
- googleCalendarName (VARCHAR)
- syncEnabled (BOOLEAN, DEFAULT true)
- lastSyncAt (DATETIME)
- createdAt (DATETIME)
- updatedAt (DATETIME)

Indexes:
- userId
- googleCalendarId
```

## ✅ Environment Variables

File: `.env`
```env
# Database Connection
DB_USERNAME=root
DB_PASSWORD=0202
DB_NAME=taskplanner
DB_HOST=192.168.1.2
DB_PORT=3307
DB_DIALECT=mysql

# Prisma ORM
DATABASE_URL="mysql://root:0202@192.168.1.2:3307/taskplanner"

# Authentication
NEXTAUTH_SECRET=your_secret_here_change_in_production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Setup in Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Setup Commands

### Option 1: Automated Setup (PowerShell)
```powershell
cd d:\project-repo\bot-schedular
.\docs\setup-database.ps1
```

### Option 2: Manual MySQL Setup
```bash
# 1. Connect to MySQL
mysql -u root -p0202 -h 192.168.1.2 -P 3307

# 2. Execute SQL script
source docs/DATABASE_INIT.sql

# 3. Verify
USE taskplanner;
SHOW TABLES;
```

### Option 3: Prisma Migration
```bash
# After database is created, run Prisma:
npm run prisma:generate
npm run prisma:migrate
```

## 📁 Related Files

| File | Purpose |
|------|---------|
| `docs/DATABASE_INIT.sql` | SQL script for database creation |
| `docs/SETUP_DATABASE.md` | Complete setup guide |
| `docs/setup-database.ps1` | PowerShell automation script |
| `prisma/schema.prisma` | Prisma ORM schema definition |
| `.env` | Environment variables with credentials |

## 🔄 Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create/run migrations
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:prod

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Push schema changes (testing only)
npm run db:push

# Seed database with sample data
npm run db:seed
```

## 📊 Relationships

```
User (1) ──→ (Many) Task
            │
            ├──→ (Many) TaskTag
            ├──→ (Many) Reminder
            └──→ (Many) Calendar

Task (1) ──→ (Many) Reminder
Task (1) ──→ (Many) TaskTag
```

## ✨ Features

✅ **InnoDB Engine** - ACID compliance, reliable transactions
✅ **UTF8MB4 Charset** - Support for emojis & international characters
✅ **Foreign Keys** - Data integrity with CASCADE delete
✅ **Indexes** - Query optimization on frequently queried columns
✅ **Type Safety** - Prisma generates TypeScript types
✅ **Migrations** - Version control for database schema

## 🎯 Ready for Phase 1

Database is now ready for:
- User authentication (NextAuth + Google OAuth)
- Task CRUD operations with database persistence
- Calendar synchronization
- Reminder scheduling
- Real-time data management

---

**Created**: April 7, 2026
**Database**: taskplanner
**Status**: ✅ Ready for development
