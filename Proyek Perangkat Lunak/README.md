# Smart Task Planner — Production Guide

> **Deployment**: https://taskplanner.dastrevas.com  
> **Stack**: Next.js 14 (frontend) + Express.js (backend API) + MySQL + Prisma  
> **Audience**: DevOps engineers, system administrators, and developers deploying or maintaining this app in production.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [Environment Variables](#3-environment-variables)
4. [Dependencies](#4-dependencies)
5. [Build Process](#5-build-process)
6. [Server Configuration](#6-server-configuration)
7. [Deployment](#7-deployment)
8. [Performance Optimization](#8-performance-optimization)
9. [Security Best Practices](#9-security-best-practices)
10. [Monitoring & Logs](#10-monitoring--logs)
11. [Backup & Recovery](#11-backup--recovery)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────┐
│                         Nginx (443)                              │
│              Reverse proxy + SSL termination                    │
└──────┬──────────────────────────────────────────────────┬────────┘
       │                                                  │
       │ :3000 (Next.js)                                 │ :8000 (Express)
       ▼                                                  ▼
┌──────────────────────┐                      ┌──────────────────────┐
│   Next.js 14 App     │                      │   Express.js Backend  │
│   (Frontend/Site)    │                      │   (API + Auth)        │
│                      │                      │                       │
│  - App Router        │                      │  - RESTAPI            │
│  - NextAuth.js       │ ──── API calls ────  │  - Prisma ORM         │
│  - Zustand (client)  │      (internal)      │  - JWT Auth           │
│  - TailwindCSS       │                      │  - Google OAuth       │
│                      │                      │  - 9Router AI Proxy   │
└──────────────────────┘                      └───────────┬───────────┘
                                                        │
                                                        ▼
                                           ┌──────────────────────────┐
                                           │        MySQL 5.7+        │
                                           │   (taskplanner_prod)     │
                                           └──────────────────────────┘
```

**Runtime Ports** (configurable via env):

| Service        | Default Port | Notes                              |
|---------------|-------------|-------------------------------------|
| Next.js (prod) | `3000`      | Handled by PM2; Nginx forwards `/`  |
| Express (api)  | `8000`      | Internal only; Nginx forwards `/api`|
| MySQL          | `3307`      | Default in dev; production uses `3306`|

---

## 2. Project Structure

```
Proyek Perangkat Lunak/
├── frontend/                          # Future split — currently same level
├── src/                               # Next.js frontend source
│   ├── app/                           # App Router pages
│   │   ├── (protected)/               # Auth-gated routes (dashboard, overview)
│   │   ├── (public)/                  # Public routes
│   │   └── api/auth/[...nextauth]/    # NextAuth handler (still used)
│   ├── components/                    # React components (TaskCard, CommandPalette, etc.)
│   ├── lib/                           # Utilities, API client, store, types
│   ├── middleware.ts                   # Next.js middleware
│   └── providers.tsx                  # Theme, Snackbar, Auth providers
├── backend/                           # Express.js backend (separate TS project)
│   ├── src/
│   │   ├── app.ts                     # Express app (routes, middleware)
│   │   ├── server.ts                  # Entry point (port binding, graceful shutdown)
│   │   ├── config/
│   │   │   ├── env.ts                 # Environment variable loading & validation
│   │   │   └── cors.ts                # CORS allowlist
│   │   ├── lib/
│   │   │   ├── prisma.ts             # Prisma client (singleton pattern)
│   │   │   ├── response.ts           # Standard API response helpers
│   │   │   └── errors.ts            # Custom error classes
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT Bearer token verification
│   │   │   ├── error-handler.ts      # Global error handler
│   │   │   └── validate.ts          # Zod schema validation
│   │   ├── modules/
│   │   │   ├── auth/                 # Auth (register, login, logout, Google OAuth)
│   │   │   ├── tasks/                # Tasks CRUD + status + stats
│   │   │   ├── reminders/            # Reminder CRUD + due list
│   │   │   ├── calendar/             # Calendar sync + refresh
│   │   │   └── ai/                   # 9Router LLM parsing for task commands
│   │   └── utils/
│   │       └── priority.ts           # 4-factor priority scoring
│   ├── prisma/
│   │   └── schema.prisma             # Database schema (User, Task, TaskTag, Reminder, Calendar, OverviewAnalysisCache)
│   └── dist/                         # Compiled JS output (gitignored)
├── prisma/
│   └── schema.prisma                 # Shared Prisma schema (frontend NextAuth adapter)
├── docs/
│   └── DEPLOYMENT.md                 # Detailed deployment walkthrough
├── package.json                      # Frontend scripts (Next.js)
├── next.config.js                    # Next.js configuration (image optimization, webpack, headers)
├── tailwind.config.ts                # TailwindCSS theme
├── tsconfig.json                     # Frontend TypeScript config
└── .env.example                      # Environment variable template
```

**Key separation of concerns:**

- **Frontend (Next.js)**: SSR, UI, client-side state, NextAuth.js Google OAuth handler
- **Backend (Express)**: REST API, Prisma queries, JWT authentication, 9Router AI proxy, soft-delete logic, auto-skip scheduler
- **Database**: MySQL via Prisma ORM — single schema used by both projects (reference `backend/prisma/schema.prisma`)

---

## 3. Environment Variables

### 3.1 Frontend — `Proyek Perangkat Lunak/.env`

| Variable                  | Required | Description                                      |
|---------------------------|----------|--------------------------------------------------|
| `DATABASE_URL`            | ✅       | MySQL connection string (Prisma)                 |
| `NEXTAUTH_SECRET`         | ✅       | Session encryption secret (min 32 chars)        |
| `NEXTAUTH_URL`            | ✅       | Canonical app URL (production: `https://taskplanner.dastrevas.com`) |
| `GOOGLE_CLIENT_ID`        | ✅       | Google OAuth 2.0 client ID                       |
| `GOOGLE_CLIENT_SECRET`    | ✅       | Google OAuth 2.0 client secret                   |
| `NEXT_PUBLIC_API_URL`    | ✅       | Express backend URL (`https://taskplanner.dastrevas.com/api` in prod) |
| `FRONTEND_URL`            | ✅       | Frontend canonical URL (for backend CORS)         |
| `NODE_ENV`                | ✅       | `production` / `development`                     |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ⚠️ | Cloudflare Turnstile site key (bot protection)   |

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3.2 Backend — `Proyek Perangkat Lunak/backend/.env`

| Variable              | Required | Description                                      |
|-----------------------|----------|--------------------------------------------------|
| `DATABASE_URL`        | ✅       | Same MySQL connection string as frontend         |
| `PORT`                | ✅       | Express server port (default: `8000`)             |
| `NODE_ENV`            | ✅       | `production` / `development`                     |
| `JWT_SECRET`          | ✅       | JWT signing secret (min 32 chars)                 |
| `JWT_EXPIRES_IN`      | ⚠️       | Token expiry (default: `7d`)                      |
| `FRONTEND_URL`        | ✅       | Frontend URL (backend CORS allowlist)            |
| `NINE_ROUTER_API`     | ⚠️       | 9Router endpoint for AI task parsing             |
| `NINE_ROUTER_API_KEY` | ⚠️       | 9Router API key (server-side only, never expose) |
| `NINE_ROUTER_MODEL`   | ⚠️       | LLM model for parsing (default: `cx/gpt-5.2`)     |
| `TURNSTILE_SECRET_KEY`| ⚠️       | Cloudflare Turnstile backend verification key     |

**⚠️ Critical: `NINE_ROUTER_API_KEY` must never be prefixed with `NEXT_PUBLIC_` or appear in the frontend `.env`. It is consumed only by the Express backend.**

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 3.3 Production Checklist

- [ ] All secrets regenerated (do not reuse development credentials)
- [ ] `NEXTAUTH_URL` and `FRONTEND_URL` set to `https://taskplanner.dastrevas.com`
- [ ] `NEXT_PUBLIC_API_URL` set to `https://taskplanner.dastrevas.com` (Express receives `/api/*` via Nginx)
- [ ] Database URL points to production MySQL instance
- [ ] Google OAuth authorized origins include production domain
- [ ] `NODE_ENV=production` on both frontend and backend

---

## 4. Dependencies

### 4.1 Frontend Dependencies (`package.json`)

**Core:**
- `next@^14.0.0` — React framework
- `react@^18.2.0` — UI library
- `react-dom@^18.2.0`

**Styling:**
- `tailwindcss@^3.3.0` — Utility-first CSS
- `postcss@^8.4.0` — CSS processing
- `autoprefixer@^10.4.0` — Vendor prefixing

**State & Data:**
- `zustand@^4.4.0` — Client state management with persistence
- `@prisma/client@^5.7.0` — Database ORM (NextAuth adapter)
- `mysql2@^3.22.0` — MySQL driver for Prisma

**Auth:**
- `next-auth@^4.24.0` — Authentication (Google OAuth)
- `@next-auth/prisma-adapter@^1.0.7` — Prisma adapter for NextAuth

**UI Components:**
- `lucide-react@^1.7.0` — Icon library
- `@ark-ui/react@^5.36.2` — Headless UI components
- `@emotion/react@^11.14.0` + `@emotion/styled@^11.14.1` — CSS-in-JS
- `notistack@^3.0.2` — Toast/snackbar notifications
- `recharts@^3.8.1` — Charts for analytics

**Utilities:**
- `axios@^1.6.0` — HTTP client
- `date-fns@^2.30.0` — Date manipulation
- `dotenv@^16.3.0` — Environment variable loading
- `clsx@^2.0.0` — Conditional classnames
- `googleapis@^118.0.0` — Google Calendar API
- `google-auth-library@^9.6.0` — Google OAuth client

**Dev:**
- `typescript@^5.3.0`, `eslint@^8.54.0`, `eslint-config-next@^14.0.0`
- `prisma@^5.7.0` — Database migrations

### 4.2 Backend Dependencies (`backend/package.json`)

**Core:**
- `express@^4.21.1` — Web framework
- `@prisma/client@^5.22.0` — Database ORM

**Authentication:**
- `jsonwebtoken@^9.0.2` — JWT signing/verification
- `bcrypt@^5.1.1` — Password hashing

**Security:**
- `cors@^2.8.5` — Cross-Origin Resource Sharing
- `zod@^3.23.8` — Schema validation

**AI Integration:**
- `googleapis@^171.4.0` — Google Calendar API (Express backend)

**Dev:**
- `typescript@^5.7.2`
- `tsx@^4.19.2` — TypeScript execution (dev mode)
- `prisma@^5.22.0`

### 4.3 Engine Requirements

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

## 5. Build Process

### 5.1 Frontend Build

```bash
# From Proyek Perangkat Lunak/
npm run build
# Runs: next build && npm run prisma:generate
```

**Build output** (`.next/`):
- Static pages pre-rendered at build time
- Server-side rendered pages (SSR) for dynamic routes
- Client-side bundles code-split by route
- Image optimization assets

**Build validation** (should pass before deploy):
```bash
npm run lint       # ESLint checks
npm run type-check # TypeScript compile check
npm run build      # Production build
```

### 5.2 Backend Build

```bash
# From Proyek Perangkat Lunak/backend/
npm run build
# Runs: tsc
# Output: dist/
```

**TypeScript compilation** (`backend/tsconfig.json`):
- Target: `ES2022`
- Module: `commonjs`
- Strict mode enabled
- Declaration files generated
- Output: `backend/dist/`

### 5.3 Database Preparation

```bash
# Generate Prisma client (frontend)
npm run prisma:generate

# Run migrations (both use same schema)
cd backend && npx prisma migrate deploy
```

> **Note**: `backend/prisma/schema.prisma` is the source of truth for the production schema. The root `prisma/schema.prisma` is used by NextAuth adapter.

---

## 6. Server Configuration

### 6.1 PM2 Process Manager

**Frontend (Next.js)** — `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'taskplanner-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/taskplanner',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/www/taskplanner/logs/pm2-error.log',
      out_file: '/var/www/taskplanner/logs/pm2-out.log',
      log_file: '/var/www/taskplanner/logs/pm2-combined.log',
      time: true,
    },
    {
      name: 'taskplanner-backend',
      script: 'dist/server.js',
      cwd: '/var/www/taskplanner/backend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      error_file: '/var/www/taskplanner/logs/backend-error.log',
      out_file: '/var/www/taskplanner/logs/backend-out.log',
    },
  ],
};
```

**Start commands:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Generates init script for auto-restart on reboot
```

### 6.2 Nginx Reverse Proxy

**File**: `/etc/nginx/sites-available/taskplanner`

```nginx
upstream frontend {
    server 127.0.0.1:3000;
}

upstream backend {
    server 127.0.0.1:8000;
}

# HTTP → HTTPS redirect
server {
    listen 80;
    server_name taskplanner.dastrevas.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name taskplanner.dastrevas.com;

    ssl_certificate /etc/letsencrypt/live/taskplanner.dastrevas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taskplanner.dastrevas.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Frontend (Next.js)
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Backend API (Express)
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Static assets (caching)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|mp4|webp)$ {
        proxy_pass http://frontend;
        expires 365d;
        add_header Cache-Control "public, immutable";
        tcp_nodelay on;
    }

    # Deny hidden files
    location ~ /\. {
        deny all;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1000;
}
```

**Enable and test:**
```bash
sudo ln -s /etc/nginx/sites-available/taskplanner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 SSL Certificate (Let's Encrypt)

```bash
sudo certbot certonly --nginx -d taskplanner.dastrevas.com
# Auto-renewal is configured by certbot by default
sudo certbot renew --dry-run
```

### 6.4 CORS Configuration (Backend)

The Express backend CORS allowlist is defined in [`backend/src/config/cors.ts`](Proyek%20Perangkat%20Lunak/backend/src/config/cors.ts):

```typescript
const allowedOrigins = [
  env.FRONTEND_URL,                    // Production frontend
  'http://localhost:3000',             // Dev
  'https://taskplanner.dastrevas.com', // Production
];
```

For production, ensure `FRONTEND_URL` env var matches exactly — subdomain and protocol must match.

---

## 7. Deployment

### 7.1 Prerequisites

- Ubuntu 20.04+ (recommended)
- Node.js 18+ LTS
- MySQL 5.7+
- Nginx
- PM2
- Domain configured (taskplanner.dastrevas.com)
- SSL certificates

### 7.2 Step-by-Step Deployment

**1. Clone the repository:**
```bash
cd /var/www/taskplanner
git clone https://github.com/bayufrd/taskplanner.git .
```

**2. Install frontend dependencies:**
```bash
npm install --production
```

**3. Install backend dependencies:**
```bash
cd backend && npm install --production
```

**4. Configure environment variables:**
```bash
# Frontend
cp .env.example .env
# Edit .env with production values

# Backend
cd ../backend
cp .env.example .env
# Edit backend/.env with production values
```

**5. Generate Prisma client:**
```bash
cd backend
npx prisma generate
```

**6. Run database migrations:**
```bash
npx prisma migrate deploy
```

**7. Build both projects:**
```bash
# Backend
cd backend && npm run build

# Frontend
cd .. && npm run build
```

**8. Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/taskplanner
# Paste Nginx configuration from Section 6.2
sudo ln -s /etc/nginx/sites-available/taskplanner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**9. Setup SSL:**
```bash
sudo certbot certonly --nginx -d taskplanner.dastrevas.com
```

**10. Start services with PM2:**
```bash
cd /var/www/taskplanner
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7.3 Verify Deployment

```bash
# Check PM2 status
pm2 status

# Test frontend
curl -I https://taskplanner.dastrevas.com

# Test backend health
curl https://taskplanner.dastrevas.com/api/tasks/stats

# Check logs
pm2 logs taskplanner-frontend
pm2 logs taskplanner-backend
```

---

## 8. Performance Optimization

### 8.1 Next.js Optimizations

**`next.config.js` settings:**
- `reactStrictMode: true` — React 18 strict mode
- `swcMinify: true` — SWC-based minification
- `staticPageGenerationTimeout: 120` — Extended timeout for static pages
- Image optimization with WebP/AVIF formats
- Remote patterns for Google profile images
- Chunk splitting via `webpack` optimization

**Recommendations:**
- Enable `compression: true` in Next.js config (or rely on Nginx gzip)
- Use `next/image` for all images (automatic optimization)
- Configure proper `Cache-Control` headers via Next.js headers config
- Consider ISR (Incremental Static Regeneration) for public pages

### 8.2 Database Optimizations

**Prisma indexes** (already in schema):
```prisma
// Task
@@index([userId])
@@index([deadline])
@@index([priority])
@@index([status])
@@index([deletedAt])  // Soft delete filter

// Reminder
@@index([userId])
@@index([taskId])
@@index([remindAt])
@@index([sent])

// User
@@index([email])
```

**Query optimizations:**
- All task queries scoped by `userId` (row-level security)
- Soft delete filter `where: { deletedAt: null }` applied consistently
- Pagination recommended for large task lists

### 8.3 Nginx Optimizations

```nginx
# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 1000;

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|mp4)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}

# Proxy timeouts (longer for API)
proxy_connect_timeout 120s;
proxy_send_timeout 120s;
proxy_read_timeout 120s;
```

### 8.4 Performance Targets

| Metric              | Target      |
|--------------------|-------------|
| First Contentful Paint | ~1.2s    |
| Time to Interactive    | ~1.5s    |
| Lighthouse Score        | 90+      |
| API Response (p95)     | <500ms    |

---

## 9. Security Best Practices

### 9.1 Authentication & Authorization

- **JWT tokens** stored in `localStorage` (key: `auth-token`)
- **Bearer token** sent in `Authorization: Bearer <token>` header
- **Backend middleware** validates JWT on every protected route
- **User-scoped queries** — all Prisma queries filter by `userId`
- **NextAuth.js** handles Google OAuth session cookies

### 9.2 Input Validation

- **Zod schemas** validate all API request bodies in Express backend
- **Prisma ORM** prevents SQL injection (parameterized queries)
- **Next.js** provides built-in XSS protection via React rendering
- **Cloudflare Turnstile** provides bot protection on auth forms

### 9.3 Secrets Management

| Secret | Where | Never expose |
|--------|-------|---------------|
| `DATABASE_URL` | Backend `.env` | Never committed |
| `JWT_SECRET` | Backend `.env` | Never committed |
| `NEXTAUTH_SECRET` | Frontend `.env` | Never committed |
| `GOOGLE_CLIENT_SECRET` | Both `.env` | Never committed |
| `NINE_ROUTER_API_KEY` | Backend `.env` only | Never `NEXT_PUBLIC_*` |
| `TURNSTILE_SECRET_KEY` | Backend `.env` | Never `NEXT_PUBLIC_*` |

**Never hardcode secrets.** Always use environment variables.

### 9.4 Network Security

- **HTTPS enforced** via HSTS header (`max-age=31536000`)
- **CORS allowlist** — only configured origins allowed
- **Security headers** set via Nginx:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: no-referrer-when-downgrade`

### 9.5 Soft Delete & Data Integrity

- Tasks are soft-deleted (`deletedAt` timestamp) — never hard-deleted via API
- Auto-skip scheduler marks overdue `PENDING` tasks as `SKIPPED`
- Task status canonical values: `PENDING`, `DONE`, `SKIPPED`
- Default task status on creation: `PENDING`

---

## 10. Monitoring & Logs

### 10.1 PM2 Monitoring

```bash
# Real-time logs
pm2 logs taskplanner-frontend
pm2 logs taskplanner-backend

# Monitor CPU/memory
pm2 monit

# List all processes
pm2 status

# Restart a process
pm2 restart taskplanner-frontend
pm2 restart taskplanner-backend

# Full restart
pm2 restart all
```

### 10.2 Log Files

| File | Description |
|------|-------------|
| `logs/pm2-error.log` | Frontend stderr |
| `logs/pm2-out.log` | Frontend stdout |
| `logs/pm2-combined.log` | Combined frontend logs |
| `logs/backend-error.log` | Backend stderr |
| `logs/backend-out.log` | Backend stdout |

### 10.3 Health Checks

```bash
# Frontend health (Next.js)
curl -s -o /dev/null -w "%{http_code}" https://taskplanner.dastrevas.com

# Backend health (Express)
curl https://taskplanner.dastrevas.com/api/tasks/stats

# Expected: HTTP 200 with JSON response
```

### 10.4 Uptime Monitoring

```bash
# PM2 Plus (cloud monitoring)
pm2 plus

# Or use external services: UptimeRobot, StatusPage.io, Better Uptime
```

---

## 11. Backup & Recovery

### 11.1 Database Backup

```bash
# Daily cron job (run as MySQL user with backup privilege)
mysqldump -u taskplanner -p taskplanner_prod > /var/backups/taskplanner_$(date +%Y%m%d).sql

# Cron example (2 AM daily)
0 2 * * * mysqldump -u taskplanner -p taskplanner_prod > /var/backups/taskplanner_$(date +\%Y\%m\%d).sql
```

### 11.2 Application Backup

```bash
# Weekly application backup (Sunday 3 AM)
0 3 * * 0 tar -czf /var/backups/taskplanner_$(date +\%Y\%m\%d).tar.gz /var/www/taskplanner
```

### 11.3 Restore Procedure

```bash
# Stop services
pm2 stop all

# Restore database
mysql -u taskplanner -p taskplanner_prod < backup.sql

# Restore application (if needed)
cd /var/www/taskplanner
git checkout <commit_hash>
npm install --production
npm run build

# Restart services
pm2 restart all
```

### 11.4 Rollback Procedure

```bash
# Stop current version
pm2 stop all

# Checkout previous stable commit
git checkout HEAD~1

# Rebuild
npm install --production
cd backend && npm install --production && npm run build && cd ..
npm run build

# Restart
pm2 restart all
```

---

## 12. Troubleshooting

### Application Won't Start

```bash
# Check Node process on port 3000 and 8000
lsof -i :3000
lsof -i :8000

# Check PM2 logs
pm2 logs taskplanner-frontend --lines 50
pm2 logs taskplanner-backend --lines 50

# Verify environment variables
cat .env | grep -E "DATABASE_URL|NODE_ENV|PORT"
cat backend/.env | grep -E "DATABASE_URL|JWT_SECRET|PORT"

# Restart
pm2 restart all
```

### Database Connection Error

```bash
# Test MySQL connection
mysql -u root -p -h <db-host> -e "SELECT 1"

# Verify DATABASE_URL format
# Format: mysql://user:password@host:port/database

# Run migrations
cd backend && npx prisma migrate deploy

# Regenerate Prisma client
npx prisma generate
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check Nginx SSL config
sudo nginx -T | grep ssl
```

### High Memory Usage

```bash
# Monitor memory per process
pm2 monit

# Increase memory limit in ecosystem.config.js
max_memory_restart: '1G'

# Restart with new config
pm2 restart ecosystem.config.js
```

### Permission Denied Errors

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/taskplanner

# Fix logs directory
sudo chmod -R 755 /var/www/taskplanner
sudo chmod -R 775 /var/www/taskplanner/logs

# PM2 may need sudo
sudo pm2 restart all
```

### API Returns 401 Unauthorized

- Verify `Authorization: Bearer <token>` header is sent
- Check token is not expired (default: 7 days)
- Check `JWT_SECRET` matches between backend `.env` and token issuer
- Verify user exists in database

### Frontend 500 Error on Protected Routes

- Check `NEXTAUTH_SECRET` is set correctly
- Verify `NEXTAUTH_URL` matches production domain exactly
- Check Google OAuth authorized redirect URIs include production URL

---

## Quick Reference

### Development Commands

```bash
# Frontend
npm run dev              # Start Next.js dev server (:3000)
npm run build            # Production build
npm run start            # Start production Next.js
npm run lint             # ESLint check
npm run type-check       # TypeScript check

# Backend
cd backend
npm run dev              # Start Express dev (:8000, tsx watch)
npm run build            # Compile TypeScript
npm start                # Start production Express
npx prisma migrate dev   # Create migration
npx prisma studio        # Prisma DB GUI
```

### Key Files

| File | Purpose |
|------|---------|
| [`backend/src/server.ts`](Proyek%20Perangkat%20Lunak/backend/src/server.ts) | Express entry point |
| [`backend/src/config/env.ts`](Proyek%20Perangkat%20Lunak/backend/src/config/env.ts) | Environment config |
| [`backend/prisma/schema.prisma`](Proyek%20Perangkat%20Lunak/backend/prisma/schema.prisma) | Database schema |
| [`backend/src/modules/tasks/task.service.ts`](Proyek%20Perangkat%20Lunak/backend/src/modules/tasks/task.service.ts) | Task business logic |
| [`src/lib/api/client.ts`](Proyek%20Perangkat%20Lunak/src/lib/api/client.ts) | Frontend API client |
| [`next.config.js`](Proyek%20Perangkat%20Lunak/next.config.js) | Next.js configuration |

---

*Last Updated: 2026-05-15 | Production domain: https://taskplanner.dastrevas.com*
