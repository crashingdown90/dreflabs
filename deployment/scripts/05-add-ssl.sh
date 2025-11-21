#!/bin/bash
#===============================================================================
# Add SSL Certificate Script
# Usage: bash 05-add-ssl.sh <domain> <email>
# Example: bash 05-add-ssl.sh dreflabs.com admin@dreflabs.com
#===============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$#" -lt 2 ]; then
    echo -e "${RED}Usage: $0 <domain> <email>${NC}"
    echo "Example: $0 dreflabs.com admin@dreflabs.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2

echo -e "${YELLOW}Installing SSL certificate for ${DOMAIN}...${NC}"

# Check if nginx config exists
if [ ! -f "/etc/nginx/sites-available/${DOMAIN}" ]; then
    echo -e "${RED}Error: Nginx config not found at /etc/nginx/sites-available/${DOMAIN}${NC}"
    echo "Please setup the website first with 02-setup-website.sh"
    exit 1
fi

# Run Certbot
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --email ${EMAIL} --agree-tos --non-interactive --redirect

echo -e "\n${GREEN}SSL Certificate installed!${NC}"
echo "Your site is now available at: https://${DOMAIN}"

# Test auto-renewal
echo -e "\n${YELLOW}Testing auto-renewal...${NC}"
certbot renew --dry-run

echo -e "\n${GREEN}SSL setup complete!${NC}"
