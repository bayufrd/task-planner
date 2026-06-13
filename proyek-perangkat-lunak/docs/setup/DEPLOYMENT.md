# 🚀 Deployment Guide

**Domain**: taskplanner.dastrevas.com  
**Environment**: Production  
**Version**: 0.1.0

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Server Setup](#server-setup)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- Node.js 18+ LTS
- npm 9+ or yarn 3+
- MySQL 5.7+
- Git
- Domain: taskplanner.dastrevas.com
- SSL Certificate (Let's Encrypt recommended)

### Server
- Ubuntu 22.04 LTS (recommended)
- 2GB RAM minimum
- 20GB disk space minimum
- Port 80 (HTTP) and 443 (HTTPS)

---

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/smart-task-planner.git
cd smart-task-planner
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create `.env.production`:

```env
# Database (Production)
DATABASE_URL="mysql://username:password@db-host:3306/taskplanner_prod"

# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://taskplanner.dastrevas.com

# Authentication
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://taskplanner.dastrevas.com

# Google OAuth
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret

# API
NEXT_PUBLIC_API_URL=https://taskplanner.dastrevas.com/api
```

### 4. Build Application

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
Route (app)   Size     First Load JS
─ ○ /                52 kB         XXX kB
...
```

### 5. Test Production Build Locally

```bash
npm run start
# Opens on http://localhost:3000
```

---

## Server Setup

### 1. SSH to Server

```bash
ssh user@your-server-ip
```

### 2. Install System Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL (if not already installed)
sudo apt install -y mysql-server

# Install Nginx (as reverse proxy)
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 3. Create Application Directory

```bash
# Create app directory
sudo mkdir -p /var/www/taskplanner
sudo chown -R $USER:$USER /var/www/taskplanner

# Create logs directory
mkdir -p /var/www/taskplanner/logs
```

### 4. Setup MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE taskplanner_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskplanner'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON taskplanner_prod.* TO 'taskplanner'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Setup Nginx Reverse Proxy

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/taskplanner
```

Add configuration:

```nginx
upstream taskplanner {
    server 127.0.0.1:3000;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name taskplanner.dastrevas.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name taskplanner.dastrevas.com;

    # SSL certificates (will be setup by Certbot)
    ssl_certificate /etc/letsencrypt/live/taskplanner.dastrevas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taskplanner.dastrevas.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy to Node.js
    location / {
        proxy_pass http://taskplanner;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API timeout (longer for database operations)
    location /api/ {
        proxy_pass http://taskplanner;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Longer timeout for API
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/taskplanner /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 6. Setup SSL Certificate

```bash
# Get SSL certificate with Certbot
sudo certbot certonly --nginx -d taskplanner.dastrevas.com

# Auto-renew configuration
sudo certbot renew --dry-run
```

---

## Deployment Steps

### 1. Clone & Setup on Server

```bash
cd /var/www/taskplanner

# Clone repository
git clone https://github.com/your-repo/smart-task-planner.git .

# Install dependencies
npm install --production

# Create .env.production file
nano .env.production
# Paste production environment variables
```

### 2. Run Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate -- --skip-generate
```

### 3. Build Application

```bash
npm run build
```

### 4. Setup PM2 Process Manager

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'taskplanner',
      script: 'npm',
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
    },
  ],
};
```

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 5. Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs taskplanner

# Check if accessible
curl https://taskplanner.dastrevas.com
```

---

## Post-Deployment

### 1. Monitoring & Logs

Monitor application:

```bash
# Watch logs
pm2 logs taskplanner

# Monitor in real-time
pm2 monit
```

### 2. Backup Strategy

```bash
# Setup daily database backup
0 2 * * * mysqldump -u taskplanner -p taskplanner_prod > /var/backups/taskplanner_$(date +%Y%m%d).sql

# Setup application backup
0 3 * * 0 tar -czf /var/backups/taskplanner_$(date +%Y%m%d).tar.gz /var/www/taskplanner
```

### 3. Security Hardening

```bash
# Setup firewall
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3306/tcp  # MySQL (if on local machine)

# Secure MySQL
sudo mysql_secure_installation
```

### 4. Performance Optimization

Enable gzip compression in Nginx:

```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
            application/x-javascript application/xml+rss 
            application/json application/javascript;
gzip_min_length 1000;
```

### 5. Monitoring Services

Setup monitoring:

```bash
# Install and start Uptime monitoring
# Option 1: Use PM2 Plus (monitoring)
pm2 plus

# Option 2: Use external service (Uptime Robot, StatusPage.io)
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs taskplanner

# Check Node process
lsof -i :3000

# Restart application
pm2 restart taskplanner
```

### Database Connection Error

```bash
# Test MySQL connection
mysql -u taskplanner -p taskplanner_prod

# Check DATABASE_URL in .env.production
cat .env.production | grep DATABASE_URL

# Run migrations again
npm run prisma:migrate -- --skip-generate
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot status

# Renew certificate manually
sudo certbot renew --force-renewal

# Check Nginx SSL config
sudo nginx -T
```

### High Memory Usage

```bash
# Monitor memory usage
pm2 monit

# Increase max_memory_restart in ecosystem.config.js
# Restart PM2
pm2 restart ecosystem.config.js
```

### Permission Denied

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/taskplanner

# Fix permissions
sudo chmod -R 755 /var/www/taskplanner
sudo chmod -R 775 /var/www/taskplanner/logs
```

---

## Maintenance Commands

```bash
# Update dependencies
npm update

# Rebuild application
npm run build

# Restart application
pm2 restart taskplanner

# View application logs
pm2 logs taskplanner

# Backup database
mysqldump -u taskplanner -p taskplanner_prod > backup.sql

# Restore database
mysql -u taskplanner -p taskplanner_prod < backup.sql
```

---

## Rollback Procedure

If deployment fails:

```bash
# Stop current version
pm2 stop taskplanner

# Checkout previous version
git checkout HEAD~1

# Rebuild
npm install --production
npm run build

# Restart
pm2 start taskplanner
```

---

## Support & Documentation

- **Application Docs**: See [Documentation](./docs/README.md)
- **Development Docs**: See [Phase 0 Development](./docs/phase0/DEVELOPMENT.md)
- **Issue Tracker**: GitHub Issues
- **Email Support**: bayu.farid36@gmail.com.com

---

**Status**: ✅ Ready for Production  
**Last Updated**: April 7, 2026  
**Version**: 0.1.0
