#!/bin/bash
#===============================================================================
# VPS Initial Setup Script
# Untuk: Multi-website hosting dengan Node.js, Nginx, PM2
# VPS: 72.61.208.178
# Jalankan sebagai root: bash 01-vps-initial-setup.sh
#===============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  VPS Initial Setup - Multi Website    ${NC}"
echo -e "${GREEN}========================================${NC}"

#---------------------------------------
# 1. System Update
#---------------------------------------
echo -e "\n${YELLOW}[1/8] Updating system packages...${NC}"
apt update && apt upgrade -y

#---------------------------------------
# 2. Install Essential Tools
#---------------------------------------
echo -e "\n${YELLOW}[2/8] Installing essential tools...${NC}"
apt install -y \
    curl \
    wget \
    git \
    unzip \
    htop \
    ufw \
    fail2ban \
    build-essential \
    software-properties-common

#---------------------------------------
# 3. Install Node.js 20 LTS
#---------------------------------------
echo -e "\n${YELLOW}[3/8] Installing Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

#---------------------------------------
# 4. Install PM2 Globally
#---------------------------------------
echo -e "\n${YELLOW}[4/8] Installing PM2...${NC}"
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root
systemctl enable pm2-root

#---------------------------------------
# 5. Install Nginx
#---------------------------------------
echo -e "\n${YELLOW}[5/8] Installing Nginx...${NC}"
apt install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

#---------------------------------------
# 6. Install Certbot (SSL)
#---------------------------------------
echo -e "\n${YELLOW}[6/8] Installing Certbot for SSL...${NC}"
apt install -y certbot python3-certbot-nginx

#---------------------------------------
# 7. Setup Firewall (UFW)
#---------------------------------------
echo -e "\n${YELLOW}[7/8] Configuring firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

echo -e "${GREEN}Firewall status:${NC}"
ufw status

#---------------------------------------
# 8. Create Directory Structure
#---------------------------------------
echo -e "\n${YELLOW}[8/8] Creating directory structure...${NC}"

# Main web directory
mkdir -p /var/www

# Create deploy user (optional, more secure)
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    mkdir -p /home/deploy/.ssh
    cp /root/.ssh/authorized_keys /home/deploy/.ssh/ 2>/dev/null || true
    chown -R deploy:deploy /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    chmod 600 /home/deploy/.ssh/authorized_keys 2>/dev/null || true

    # Add deploy to www-data group
    usermod -aG www-data deploy

    # Allow deploy user to restart PM2 and Nginx without password
    echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx, /usr/bin/systemctl reload nginx, /usr/local/bin/pm2 *" >> /etc/sudoers.d/deploy
    chmod 440 /etc/sudoers.d/deploy

    echo -e "${GREEN}Created 'deploy' user for deployments${NC}"
fi

# Set permissions
chown -R www-data:www-data /var/www
chmod -R 755 /var/www

#---------------------------------------
# 9. Configure Nginx defaults
#---------------------------------------
echo -e "\n${YELLOW}Configuring Nginx defaults...${NC}"

# Backup original config
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Optimize Nginx config
cat > /etc/nginx/nginx.conf << 'NGINXCONF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    multi_accept on;
    use epoll;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 50M;

    # MIME Types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Security Headers (applied to all sites)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Virtual Host Configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
NGINXCONF

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t && systemctl reload nginx

#---------------------------------------
# 10. Install Redis (Optional)
#---------------------------------------
echo -e "\n${YELLOW}Installing Redis (optional caching)...${NC}"
apt install -y redis-server

# Configure Redis
sed -i 's/supervised no/supervised systemd/' /etc/redis/redis.conf
systemctl enable redis-server
systemctl start redis-server

#---------------------------------------
# Setup Complete
#---------------------------------------
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  VPS Setup Complete!                  ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Node.js: $(node -v)"
echo -e "npm: $(npm -v)"
echo -e "PM2: $(pm2 -v)"
echo -e "Nginx: $(nginx -v 2>&1)"
echo -e "Redis: $(redis-server -v)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run 02-setup-website.sh untuk setup website baru"
echo "2. Point domain DNS ke IP: 72.61.208.178"
echo "3. Jalankan certbot untuk SSL setelah DNS propagate"
echo ""
echo -e "${GREEN}Deploy user created: deploy${NC}"
echo "SSH: ssh deploy@72.61.208.178"
