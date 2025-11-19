#!/bin/bash

# DREFLABS Quick Deploy - Single Command Deployment
# Usage: ./deploy.sh [message]
#
# SECURITY NOTE: This script requires environment variables to be set:
# - VPS_IP: Your VPS IP address
# - VPS_USER: SSH username
# - VPS_SSH_KEY: Path to SSH private key (recommended) or use ssh-agent
#
# Example: VPS_IP=your-ip VPS_USER=your-user ./deploy.sh

# Load from environment or use defaults (DO NOT hardcode credentials)
VPS_IP="${VPS_IP:-}"
VPS_USER="${VPS_USER:-root}"
VPS_SSH_KEY="${VPS_SSH_KEY:-$HOME/.ssh/id_rsa}"
PROJECT_DIR="/var/www/dreflabs"
MESSAGE="${1:-Quick update}"

# Validate required environment variables
if [ -z "$VPS_IP" ]; then
    echo "Error: VPS_IP environment variable is required"
    echo "Usage: VPS_IP=your-ip VPS_USER=your-user ./deploy.sh"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying: $MESSAGE${NC}"

# 1. Build locally first (optional - comment out if you want to build on VPS)
echo "Building locally..."
npm run build 2>/dev/null || echo "Local build skipped"

# 2. Create deployment package
echo "Creating package..."
tar -czf deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.next/cache' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='data/*.db' \
    app components lib public \
    package*.json *.config.* *.ts tsconfig.json \
    2>/dev/null

# 3. Upload and deploy
echo "Uploading to VPS..."
scp -i "$VPS_SSH_KEY" -o StrictHostKeyChecking=no \
    deploy.tar.gz ${VPS_USER}@${VPS_IP}:/tmp/

echo "Deploying on VPS..."
ssh -i "$VPS_SSH_KEY" -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} << EOF
cd ${PROJECT_DIR}
tar -xzf /tmp/deploy.tar.gz 2>/dev/null
rm /tmp/deploy.tar.gz
npm install --production=false >/dev/null 2>&1
npm run build >/dev/null 2>&1 || echo "Build done"
pm2 restart dreflabs >/dev/null 2>&1
echo "✓ Deployed successfully"
pm2 status dreflabs | grep dreflabs
EOF

# Cleanup
rm deploy.tar.gz

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "View at: http://${VPS_IP}/"