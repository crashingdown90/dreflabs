# VPS Deployment Guide

Panduan lengkap untuk deploy multi-website di VPS.

## Server Info

- **IP**: 72.61.208.178
- **SSH**: `ssh root@72.61.208.178`

## Port Assignments

| Website | Domain | Port |
|---------|--------|------|
| DrefLabs | dreflabs.com | 3001 |
| Website 2 | example2.com | 3002 |
| Website 3 | example3.com | 3003 |

## Directory Structure

```
/var/www/
├── dreflabs.com/
│   ├── current/           → symlink ke release aktif
│   ├── releases/
│   │   ├── 20240115_120000/
│   │   └── 20240115_130000/
│   ├── shared/
│   │   ├── .env           → environment variables
│   │   ├── uploads/       → file uploads
│   │   ├── logs/          → application logs
│   │   └── data/          → SQLite database
│   └── ecosystem.config.js
└── website2.com/
    └── ...
```

## Quick Start

### 1. Initial VPS Setup (Run Once)

```bash
# Upload scripts ke VPS
scp -r deployment/scripts root@72.61.208.178:/root/

# SSH ke VPS
ssh root@72.61.208.178

# Jalankan initial setup
cd /root/scripts
chmod +x *.sh
bash 01-vps-initial-setup.sh
```

### 2. Setup Website Baru

```bash
# Syntax: bash 02-setup-website.sh <domain> <github-repo> <port>
bash 02-setup-website.sh dreflabs.com crashingdown90/dreflabs 3001

# Copy nginx config
cp /root/scripts/nginx/dreflabs.com.conf /etc/nginx/sites-available/dreflabs.com
ln -s /etc/nginx/sites-available/dreflabs.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Edit environment variables
nano /var/www/dreflabs.com/shared/.env
```

### 3. Setup SSL

```bash
# Pastikan DNS sudah point ke IP server
bash 05-add-ssl.sh dreflabs.com admin@dreflabs.com
```

### 4. Deploy Update

```bash
# Setelah push ke GitHub
bash 03-deploy.sh dreflabs.com
```

### 5. Rollback

```bash
# Rollback ke release sebelumnya
bash 04-rollback.sh dreflabs.com

# Rollback ke release tertentu
bash 04-rollback.sh dreflabs.com 20240115_120000
```

## Useful Commands

### PM2

```bash
# List all apps
pm2 list

# View logs
pm2 logs dreflabs-com

# Restart app
pm2 restart dreflabs-com

# Stop app
pm2 stop dreflabs-com

# Monitor resources
pm2 monit
```

### Nginx

```bash
# Test config
nginx -t

# Reload
systemctl reload nginx

# View logs
tail -f /var/log/nginx/dreflabs.com.access.log
tail -f /var/log/nginx/dreflabs.com.error.log
```

### System

```bash
# Check disk usage
df -h

# Check memory
free -m

# Check processes
htop
```

## Adding New Website

1. Create nginx config from template:
   ```bash
   cp /root/scripts/nginx/website-template.conf /etc/nginx/sites-available/newsite.com
   nano /etc/nginx/sites-available/newsite.com
   # Replace DOMAIN with newsite.com
   # Replace PORT with 3002 (or next available)
   ```

2. Setup website:
   ```bash
   bash 02-setup-website.sh newsite.com username/repo 3002
   ```

3. Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/newsite.com /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```

4. Add SSL:
   ```bash
   bash 05-add-ssl.sh newsite.com admin@newsite.com
   ```

## Environment Variables

Critical variables to configure in `/var/www/<domain>/shared/.env`:

```env
# WAJIB DIGANTI
JWT_SECRET=<random 64+ chars>
REFRESH_TOKEN_SECRET=<random 64+ chars>
INITIAL_ADMIN_PASSWORD=<strong password>

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Troubleshooting

### App tidak jalan
```bash
pm2 logs dreflabs-com --lines 50
```

### 502 Bad Gateway
```bash
# Check if app is running
pm2 status
# Check if port matches nginx config
cat /var/www/dreflabs.com/shared/.env | grep PORT
```

### Permission denied
```bash
chown -R www-data:www-data /var/www/dreflabs.com
chmod -R 755 /var/www/dreflabs.com
```
