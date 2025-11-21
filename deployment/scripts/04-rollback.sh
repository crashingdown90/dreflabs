#!/bin/bash
#===============================================================================
# Rollback Script
# Usage: bash 04-rollback.sh <domain> [release]
# Example: bash 04-rollback.sh dreflabs.com
# Example: bash 04-rollback.sh dreflabs.com 20240115_120000
#===============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$#" -lt 1 ]; then
    echo -e "${RED}Usage: $0 <domain> [release]${NC}"
    echo "Example: $0 dreflabs.com"
    echo "Example: $0 dreflabs.com 20240115_120000"
    exit 1
fi

DOMAIN=$1
APP_NAME=$(echo $DOMAIN | sed 's/\./-/g')
WEB_ROOT="/var/www/${DOMAIN}"
RELEASES_DIR="${WEB_ROOT}/releases"

# List available releases
echo -e "${YELLOW}Available releases:${NC}"
ls -lt ${RELEASES_DIR} | head -10

CURRENT=$(readlink -f ${WEB_ROOT}/current | xargs basename)
echo -e "\n${GREEN}Current release: ${CURRENT}${NC}"

if [ "$#" -eq 2 ]; then
    TARGET_RELEASE=$2
else
    # Get previous release
    TARGET_RELEASE=$(ls -t ${RELEASES_DIR} | sed -n '2p')
fi

if [ -z "${TARGET_RELEASE}" ] || [ ! -d "${RELEASES_DIR}/${TARGET_RELEASE}" ]; then
    echo -e "${RED}Error: Release ${TARGET_RELEASE} not found${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Rolling back to: ${TARGET_RELEASE}${NC}"
read -p "Are you sure? (y/N) " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Rollback cancelled"
    exit 0
fi

# Perform rollback
ln -sfn ${RELEASES_DIR}/${TARGET_RELEASE} ${WEB_ROOT}/current
pm2 restart ${APP_NAME}

echo -e "\n${GREEN}Rollback complete!${NC}"
echo "Now running: ${TARGET_RELEASE}"
pm2 status ${APP_NAME}
