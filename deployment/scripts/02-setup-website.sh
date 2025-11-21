#!/bin/bash
#===============================================================================
# Setup New Website Script
# Usage: bash 02-setup-website.sh <domain> <github-repo> <port>
# Example: bash 02-setup-website.sh dreflabs.com crashingdown90/dreflabs 3001
#===============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check arguments
if [ "$#" -lt 3 ]; then
    echo -e "${RED}Usage: $0 <domain> <github-repo> <port>${NC}"
    echo "Example: $0 dreflabs.com crashingdown90/dreflabs 3001"
    echo ""
    echo "Arguments:"
    echo "  domain     - Your domain name (e.g., dreflabs.com)"
    echo "  github-repo - GitHub repo path (e.g., username/repo)"
    echo "  port       - Port for this app (e.g., 3001, 3002, 3003)"
    exit 1
fi

DOMAIN=$1
GITHUB_REPO=$2
PORT=$3
APP_NAME=$(echo $DOMAIN | sed 's/\./-/g')  # dreflabs.com -> dreflabs-com
WEB_ROOT="/var/www/${DOMAIN}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setting up: ${DOMAIN}                ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "GitHub Repo: ${GITHUB_REPO}"
echo "Port: ${PORT}"
echo "App Name: ${APP_NAME}"
echo "Web Root: ${WEB_ROOT}"
echo ""

#---------------------------------------
# 1. Create Directory Structure
#---------------------------------------
echo -e "${YELLOW}[1/5] Creating directory structure...${NC}"

mkdir -p ${WEB_ROOT}/{current,releases,shared/{uploads,logs,data}}

# Set permissions
chown -R www-data:www-data ${WEB_ROOT}
chmod -R 755 ${WEB_ROOT}

echo -e "${GREEN}Created:${NC}"
echo "  ${WEB_ROOT}/current/    - Active deployment (symlink)"
echo "  ${WEB_ROOT}/releases/   - Release versions"
echo "  ${WEB_ROOT}/shared/     - Persistent files"

#---------------------------------------
# 2. Clone Repository
#---------------------------------------
echo -e "\n${YELLOW}[2/5] Cloning repository...${NC}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_DIR="${WEB_ROOT}/releases/${TIMESTAMP}"

git clone --depth 1 https://github.com/${GITHUB_REPO}.git ${RELEASE_DIR}

# Link shared directories
ln -sfn ${WEB_ROOT}/shared/uploads ${RELEASE_DIR}/public/uploads
ln -sfn ${WEB_ROOT}/shared/logs ${RELEASE_DIR}/logs
ln -sfn ${WEB_ROOT}/shared/data ${RELEASE_DIR}/data

#---------------------------------------
# 3. Create Environment File
#---------------------------------------
echo -e "\n${YELLOW}[3/5] Creating environment file...${NC}"

if [ ! -f "${WEB_ROOT}/shared/.env" ]; then
    cat > ${WEB_ROOT}/shared/.env << ENVFILE
# ===========================================
# Production Environment - ${DOMAIN}
# ===========================================

NODE_ENV=production
PORT=${PORT}

# Database
DATABASE_PATH=/var/www/${DOMAIN}/shared/data/dreflabs.db

# Security (WAJIB GANTI!)
JWT_SECRET=$(openssl rand -hex 64)
REFRESH_TOKEN_SECRET=$(openssl rand -hex 64)

# Admin Initial Setup
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_PASSWORD=GANTI_PASSWORD_INI_123!
INITIAL_ADMIN_EMAIL=admin@${DOMAIN}

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
NEXT_PUBLIC_SITE_NAME=DrefLabs
NEXT_PUBLIC_SITE_TAGLINE=Web Development & Digital Solutions
NEXT_PUBLIC_SITE_DESCRIPTION=Professional web development services

# Contact
NEXT_PUBLIC_CONTACT_EMAIL=contact@${DOMAIN}
NEXT_PUBLIC_CONTACT_PHONE=+62 XXX XXXX XXXX
NEXT_PUBLIC_CONTACT_LOCATION=Indonesia

# Email SMTP (Configure this!)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@${DOMAIN}
CONTACT_EMAIL=contact@${DOMAIN}

# Social Media
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourusername
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourusername
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourusername

# Redis (Optional - comment out if not using)
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=
REDIS_DB=0

# Logging
LOG_LEVEL=info
ENVFILE

    echo -e "${GREEN}Created .env file at: ${WEB_ROOT}/shared/.env${NC}"
    echo -e "${RED}IMPORTANT: Edit the .env file and change passwords!${NC}"
else
    echo -e "${YELLOW}.env file already exists, skipping...${NC}"
fi

# Symlink .env to release
ln -sfn ${WEB_ROOT}/shared/.env ${RELEASE_DIR}/.env

#---------------------------------------
# 4. Build Application
#---------------------------------------
echo -e "\n${YELLOW}[4/5] Building application...${NC}"

cd ${RELEASE_DIR}

# Install dependencies
npm ci --only=production
npm install --save-dev typescript @types/node @types/react

# Initialize database
npm run db:init || true

# Build Next.js
npm run build

# Update current symlink
ln -sfn ${RELEASE_DIR} ${WEB_ROOT}/current

#---------------------------------------
# 5. Setup PM2
#---------------------------------------
echo -e "\n${YELLOW}[5/5] Setting up PM2...${NC}"

# Create PM2 ecosystem file
cat > ${WEB_ROOT}/ecosystem.config.js << PMFILE
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    cwd: '${WEB_ROOT}/current',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    },
    error_file: '${WEB_ROOT}/shared/logs/pm2-error.log',
    out_file: '${WEB_ROOT}/shared/logs/pm2-out.log',
    log_file: '${WEB_ROOT}/shared/logs/pm2-combined.log',
    time: true
  }]
};
PMFILE

# Start or restart the app
pm2 describe ${APP_NAME} > /dev/null 2>&1 && pm2 restart ${APP_NAME} || pm2 start ${WEB_ROOT}/ecosystem.config.js

# Save PM2 process list
pm2 save

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Website Setup Complete!              ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Domain: ${DOMAIN}"
echo -e "Port: ${PORT}"
echo -e "Web Root: ${WEB_ROOT}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit .env file: nano ${WEB_ROOT}/shared/.env"
echo "2. Setup Nginx: Copy nginx config and enable site"
echo "3. Point DNS A record to this server IP"
echo "4. Run certbot for SSL: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo ""
echo -e "${GREEN}PM2 Status:${NC}"
pm2 status
