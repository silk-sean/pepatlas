#!/bin/bash
# One-time droplet bootstrap. Run as root on a fresh Ubuntu 24.04 droplet.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/silk-sean/pepatlas/main/deploy/init.sh | bash
#
# Or manually:
#   ssh root@pepatlas.com bash < deploy/init.sh
set -euo pipefail

echo "=== PepAtlas droplet bootstrap ==="

# Update and install basics
apt-get update
apt-get install -y ca-certificates curl gnupg ufw git cron

# Install Docker
if ! command -v docker &>/dev/null; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | tee /etc/apt/sources.list.d/docker.list >/dev/null
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

# Firewall: allow SSH + HTTP + HTTPS
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Clone repo
if [ ! -d /opt/pepatlas ]; then
  git clone https://github.com/silk-sean/pepatlas.git /opt/pepatlas
fi

cd /opt/pepatlas

# Generate a secure AUTH_SECRET if .env doesn't exist
if [ ! -f .env ]; then
  AUTH_SECRET=$(openssl rand -base64 32)
  POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-20)
  cat > .env <<EOF
POSTGRES_USER=pepatlas
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=pepatlas
AUTH_SECRET=$AUTH_SECRET
AUTH_URL=https://pepatlas.com
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
EOF
  chmod 600 .env
  echo ".env created with random secrets"
fi

# Create backup directory
mkdir -p /opt/pepatlas/backups

echo ""
echo "=== Droplet ready ==="
echo "Next: run deploy/first-deploy.sh to start services and issue SSL cert"
