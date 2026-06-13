# Database Setup Guide

## 📊 Database Configuration

**Database Name**: `taskplanner`
**Host**: `192.168.1.2`
**Port**: `3307`
**Username**: `root`
**Password**: `0202`
**Charset**: `utf8mb4`

## 🗄️ Database & Tables

### 5 Main Tables:

1. **User** - User accounts & authentication
   - Stores user credentials, Google OAuth tokens
   - Theme preferences, Calendar sync settings

2. **Task** - Task records
   - Title, description, deadline, priority
   - Status (TODO, IN_PROGRESS, DONE)
   - Google Calendar event tracking

3. **TaskTag** - Task categorization
   - Tag names with colors
   - Links tasks to categories

4. **Reminder** - Task reminders
   - Reminder scheduling
   - Notification tracking

5. **Calendar** - Google Calendar sync data
   - Calendar IDs & sync status
   - Last sync timestamp

## 🔧 Setup Instructions

### Option 1: Using Prisma Migrations (Recommended)

```bash
# 1. Ensure .env is configured with correct credentials
# DATABASE_URL should point to your MySQL server

# 2. Create the database if it doesn't exist
# (Use DATABASE_INIT.sql or create manually)

# 3. Run Prisma migrations
npm run prisma:migrate

# 4. Prisma will:
# - Create all tables automatically
# - Generate TypeScript types
# - Set up indexes & foreign keys
```

### Option 2: Manual SQL Setup

```bash
# 1. Login to MySQL
mysql -u root -p0202 -h 192.168.1.2 -P 3307

# 2. Execute the SQL script
source docs/DATABASE_INIT.sql

# 3. Verify tables were created
USE taskplanner;
SHOW TABLES;

# 4. Generate Prisma client
npm run prisma:generate
```

## 📋 Environment Variables (.env)

```env
# Database Configuration
DB_USERNAME=root
DB_PASSWORD=0202
DB_NAME=taskplanner
DB_HOST=192.168.1.2
DB_PORT=3307
DB_DIALECT=mysql

# Prisma Database URL
DATABASE_URL="mysql://root:0202@192.168.1.2:3307/taskplanner"

# NextAuth (Generate: openssl rand -base64 32)
NEXTAUTH_SECRET=generate_with_openssl_in_production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Setup
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## ✅ Verification

After setup, verify everything works:

```bash
# Check Prisma client generated
ls node_modules/.prisma/client/

# Open Prisma Studio to view data
npm run prisma:studio

# Should open http://localhost:5555
```

## 🔄 Ongoing Commands

```bash
# Create a new database migration (after schema changes)
npm run prisma:migrate

# View database in Prisma Studio
npm run prisma:studio

# Push schema changes (for testing)
npm run db:push

# Seed database with sample data
npm run db:seed
```

## 🚨 Important Notes

- **Backups**: Backup your database regularly before migrations
- **Production**: Change `NEXTAUTH_SECRET` to a secure random string
- **Google OAuth**: Set up in Google Cloud Console before using Calendar features
- **Migrations**: Never delete migration files; use `prisma migrate resolve` if issues occur

## 📞 Troubleshooting

**Error: Connection refused**
```bash
# Check if MySQL is running at 192.168.1.2:3307
mysql -u root -p0202 -h 192.168.1.2 -P 3307 -e "SELECT 1;"
```

**Error: Database doesn't exist**
```bash
# Create database manually
mysql -u root -p0202 -h 192.168.1.2 -P 3307 -e "CREATE DATABASE taskplanner;"
```

**Prisma client not found**
```bash
# Regenerate Prisma client
npm run prisma:generate
```

**Schema mismatch**
```bash
# Reset database (caution: deletes all data)
npx prisma migrate reset
```
