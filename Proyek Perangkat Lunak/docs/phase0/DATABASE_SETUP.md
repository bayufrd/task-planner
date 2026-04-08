# 🗂️ Database Setup Instructions

## Current Status

✅ **Prisma Client Generated**  
⏳ **Database Migration Pending**  
⏳ **Tables Not Yet Created**

---

## Next Step: Create Database Tables

Run this command in your terminal:

```bash
npm run prisma:migrate
```

### What This Command Does

1. **Detects changes** in `prisma/schema.prisma`
2. **Prompts for migration name** (e.g., "init" for first run)
3. **Creates migration file** in `prisma/migrations/`
4. **Executes migration** against your MySQL database
5. **Updates prisma.db files** (for dev environment)

### Example Output

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

√ Created migrations folder
√ Planned changes:

  Create table "User"
  Create table "Task"
  Create table "TaskTag"
  Create table "Reminder"
  Create table "Calendar"

√ Generated migration: 20260407130300_init

√ Run `npm run prisma:migrate` to apply this migration
```

---

## What Tables Will Be Created

### 1. `users`
```sql
CREATE TABLE users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  name VARCHAR(191),
  password VARCHAR(191),
  googleId VARCHAR(191) UNIQUE,
  googleAccessToken LONGTEXT,
  googleRefreshToken LONGTEXT,
  theme VARCHAR(191) DEFAULT 'light',
  googleCalendarSync BOOLEAN DEFAULT false,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  INDEX email_idx (email)
);
```

### 2. `tasks`
```sql
CREATE TABLE tasks (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  title VARCHAR(191) NOT NULL,
  description LONGTEXT,
  deadline DATETIME(3) NOT NULL,
  priority VARCHAR(191) DEFAULT 'MEDIUM',
  estimatedDuration INT,
  status VARCHAR(191) DEFAULT 'TODO',
  reminderTime INT DEFAULT 60,
  reminderSent BOOLEAN DEFAULT false,
  googleCalendarEventId VARCHAR(191),
  googleCalendarId VARCHAR(191),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  completedAt DATETIME(3),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX userId_idx (userId),
  INDEX deadline_idx (deadline),
  INDEX priority_idx (priority),
  INDEX status_idx (status)
);
```

### 3. `task_tags`
```sql
CREATE TABLE task_tags (
  id VARCHAR(191) PRIMARY KEY,
  taskId VARCHAR(191) NOT NULL,
  tagName VARCHAR(191) NOT NULL,
  color VARCHAR(191) DEFAULT '#3B82F6',
  UNIQUE KEY taskId_tagName (taskId, tagName),
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  INDEX taskId_idx (taskId)
);
```

### 4. `reminders`
```sql
CREATE TABLE reminders (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  taskId VARCHAR(191),
  remindAt DATETIME(3) NOT NULL,
  sent BOOLEAN DEFAULT false,
  sentAt DATETIME(3),
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  INDEX userId_idx (userId),
  INDEX taskId_idx (taskId),
  INDEX remindAt_idx (remindAt),
  INDEX sent_idx (sent)
);
```

### 5. `calendars`
```sql
CREATE TABLE calendars (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  calendarId VARCHAR(191),
  name VARCHAR(191) NOT NULL,
  description LONGTEXT,
  type VARCHAR(191) DEFAULT 'personal',
  color VARCHAR(191) DEFAULT '#3B82F6',
  isDefault BOOLEAN DEFAULT false,
  isSynced BOOLEAN DEFAULT false,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  UNIQUE KEY userId_calendarId (userId, calendarId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX userId_idx (userId)
);
```

---

## Step-by-Step Migration

### 1. Open Terminal

In VS Code or PowerShell, navigate to project:

```bash
cd d:\project-repo\bot-schedular
```

### 2. Run Migration

```bash
npm run prisma:migrate
```

### 3. Follow Prompts

When prompted for migration name, type:

```
init
```

(Or press Enter to accept default)

### 4. Wait for Completion

The command will:
- Generate migration files
- Connect to MySQL
- Create all tables
- Create indexes
- Complete!

### 5. Verify Success

You should see:

```
✓ Run prisma:migrate dev
✓ Created 5 new tables
✓ Tables created successfully
```

---

## Troubleshooting

### "Access denied for user 'root'"
- Check `.env` file for correct credentials
- Verify MySQL is running on `192.168.1.1:3307`
- Test connection: `npx prisma validate`

### "Connection refused"
- MySQL server is not running
- Start MySQL server on your network
- Check firewall settings

### "Database doesn't exist"
- Run: `mysql -u root -p -h 192.168.1.1 -P 3307`
- Then: `CREATE DATABASE dastrevas;`

### "Tables already exist"
- Migration already ran successfully
- You're ready to use the app!

---

## Verify Tables Were Created

### Option 1: Using MySQL CLI

```bash
mysql -u root -p -h 192.168.1.1 -P 3307 dastrevas

# Then in MySQL:
SHOW TABLES;
DESCRIBE users;
DESCRIBE tasks;
DESCRIBE task_tags;
DESCRIBE reminders;
DESCRIBE calendars;
```

### Option 2: Using Prisma Studio

```bash
npm run prisma:studio
```

This opens http://localhost:5555 with a visual database explorer.

---

## What's Next After Migration?

1. ✅ Database setup complete
2. **Implement API routes** (connect to database)
3. **Update frontend** (use API instead of localStorage)
4. **Test everything** (CRUD operations)
5. **Add authentication** (NextAuth + Google)

---

## Important Notes

- ⚠️ Only run migration ONCE for initial setup
- ⚠️ Migrations are tracked in `prisma/migrations/`
- ⚠️ Don't modify generated migration files
- ℹ️ Each schema change needs new migration
- ℹ️ Migrations are version controlled (check git)

---

## Revert Migration (If Needed)

If something goes wrong:

```bash
# Drop all tables and reset
npm run prisma:migrate reset

# This will:
# - Drop database
# - Recreate database  
# - Run all migrations
# - Clear data
```

⚠️ **WARNING**: This deletes all data! Only use in development.

---

## Quick Command Reference

```bash
# Generate Prisma client (already done)
npm run prisma:generate

# Create & run migration
npm run prisma:migrate

# View/edit database GUI
npm run prisma:studio

# Check database connection
npx prisma validate

# Reset everything (dev only)
npm run prisma:migrate reset

# View migration status
npx prisma migrate status
```

---

## You're Ready!

Once migration completes:

✅ All tables created  
✅ Indexes optimized  
✅ Relationships configured  
✅ Ready for API implementation  

---

**Next Step**: Implement database persistence in API routes

See: `src/app/api/tasks/route.ts`

---

Good luck! 🚀
