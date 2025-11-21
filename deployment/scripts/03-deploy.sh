#!/bin/bash
#===============================================================================
# Zero-Downtime Deploy Script
# Usage: bash 03-deploy.sh <domain>
# Example: bash 03-deploy.sh dreflabs.com
#
# Jalankan di VPS setelah push ke GitHub
#===============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check arguments
if [ "$#" -lt 1 ]; then
    echo -e "${RED}Usage: $0 <domain>${NC}"
    echo "Example: $0 dreflabs.com"
    exit 1
fi

DOMAIN=$1
APP_NAME=$(echo $DOMAIN | sed 's/\./-/g')
WEB_ROOT="/var/www/${DOMAIN}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_DIR="${WEB_ROOT}/releases/${TIMESTAMP}"
KEEP_RELEASES=5

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deploying: ${DOMAIN}                 ${NC}"
echo -e "${BLUE}  Release: ${TIMESTAMP}                ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if website exists
if [ ! -d "${WEB_ROOT}" ]; then
    echo -e "${RED}Error: Website ${DOMAIN} not found. Run 02-setup-website.sh first.${NC}"
    exit 1
fi

# Get GitHub repo from existing release
CURRENT_RELEASE=$(readlink -f ${WEB_ROOT}/current)
cd ${CURRENT_RELEASE}
GITHUB_REPO=$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | sed 's/.*github.com[:/]\(.*\)/\1/')

echo -e "\n${YELLOW}[1/6] Pulling latest code from GitHub...${NC}"
git clone --depth 1 https://github.com/${GITHUB_REPO}.git ${RELEASE_DIR}

echo -e "\n${YELLOW}[2/6] Linking shared resources...${NC}"
# Symlink shared directories
ln -sfn ${WEB_ROOT}/shared/.env ${RELEASE_DIR}/.env
ln -sfn ${WEB_ROOT}/shared/uploads ${RELEASE_DIR}/public/uploads
ln -sfn ${WEB_ROOT}/shared/logs ${RELEASE_DIR}/logs
ln -sfn ${WEB_ROOT}/shared/data ${RELEASE_DIR}/data

echo -e "\n${YELLOW}[3/6] Installing dependencies...${NC}"
cd ${RELEASE_DIR}
npm ci --only=production
npm install --save-dev typescript @types/node @types/react

echo -e "\n${YELLOW}[4/6] Running database migrations...${NC}"
npm run db:init || echo "Database already initialized"

echo -e "\n${YELLOW}[5/6] Building application...${NC}"
npm run build

echo -e "\n${YELLOW}[6/6] Switching to new release...${NC}"
# Atomic symlink switch
ln -sfn ${RELEASE_DIR} ${WEB_ROOT}/current

# Restart PM2 app
pm2 restart ${APP_NAME}

# Cleanup old releases (keep last N releases)
echo -e "\n${YELLOW}Cleaning up old releases...${NC}"
cd ${WEB_ROOT}/releases
ls -t | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!                 ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Domain: https://${DOMAIN}"
echo -e "Release: ${TIMESTAMP}"
echo -e "Releases kept: ${KEEP_RELEASES}"
echo ""
echo -e "${GREEN}PM2 Status:${NC}"
pm2 status ${APP_NAME}
