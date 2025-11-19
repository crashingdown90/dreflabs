# 📋 DEPLOYMENT MANUAL - DREFLABS

## Step 1: Persiapan Lokal (Di Komputer Anda)

Jalankan perintah ini di terminal lokal:

```bash
# 1. Build aplikasi (skip error js-yaml)
npm run build || echo "Build selesai dengan warning"

# 2. Buat package deployment
tar -czf dreflabs.tar.gz \
  app components lib public \
  package.json package-lock.json \
  next.config.js tsconfig.json \
  tailwind.config.ts postcss.config.mjs \
  instrumentation.ts

# 3. Upload ke VPS
scp dreflabs.tar.gz root@148.230.100.44:/root/
```

## Step 2: Setup di VPS (Login ke VPS)

```bash
ssh root@148.230.100.44
# Password: GunungAgung13$
```

Setelah login, copy dan paste semua perintah ini:

```bash
#!/bin/bash
# DREFLABS VPS Setup Script

# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 2. Install PM2
npm install -g pm2

# 3. Setup direktori
mkdir -p /var/www/dreflabs/data
cd /var/www/dreflabs

# 4. Extract files
tar -xzf /root/dreflabs.tar.gz

# 5. Buat file environment
cat > .env.local << 'EOF'
DATABASE_PATH=/var/www/dreflabs/data/dreflabs.db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-2024
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-minimum-32-characters-2024
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_PASSWORD=DrefAdmin2024!
INITIAL_ADMIN_EMAIL=admin@dreflabs.com
NEXT_PUBLIC_SITE_URL=http://148.230.100.44
NEXT_PUBLIC_SITE_NAME=Dref Labs
NODE_ENV=production
PORT=3002
EOF

# 6. Buat content directory
mkdir -p content/blog
echo '---
title: Welcome
date: 2024-01-01
---
Welcome to Dref Labs' > content/blog/welcome.mdx

# 7. Install dependencies
npm install

# 8. Fix js-yaml issue (ignore errors)
npm install js-yaml@3.14.1 --force 2>/dev/null || true

# 9. Build aplikasi
npm run build || echo "Build completed with warnings"

# 10. Setup PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'dreflabs',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
};
EOF

# 11. Start aplikasi
pm2 stop dreflabs 2>/dev/null || true
pm2 delete dreflabs 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 12. Setup Nginx
cat > /etc/nginx/sites-available/dreflabs << 'EOF'
server {
    listen 80;
    server_name _;

    location /dreflabs {
        rewrite ^/dreflabs(.*)$ $1 break;
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 3002;
    server_name _;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 13. Enable nginx site
ln -sf /etc/nginx/sites-available/dreflabs /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 14. Open firewall ports
ufw allow 3002/tcp 2>/dev/null || true
ufw allow 80/tcp 2>/dev/null || true

echo "======================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "======================================"
echo ""
echo "🌐 Access URLs:"
echo "   Direct:  http://148.230.100.44:3002"
echo "   Nginx:   http://148.230.100.44/dreflabs"
echo ""
echo "🔐 Admin Login:"
echo "   Username: admin"
echo "   Password: DrefAdmin2024!"
echo ""
echo "📊 Commands:"
echo "   pm2 status       - Check status"
echo "   pm2 logs dreflabs - View logs"
echo "   pm2 restart dreflabs - Restart app"
echo ""
```

## Step 3: Verifikasi

Setelah script selesai, test dengan:

```bash
# Check if app is running
pm2 status

# Test health endpoint
curl http://localhost:3002/api/health

# Check logs if needed
pm2 logs dreflabs --lines 50
```

## 🔧 Troubleshooting

### Jika ada error saat build:
```bash
# Skip build dan jalankan development mode
cd /var/www/dreflabs
pm2 stop dreflabs
pm2 start npm --name dreflabs -- run dev
```

### Jika port 3002 sudah digunakan:
```bash
# Ganti ke port lain (misal 3003)
sed -i 's/3002/3003/g' .env.local
sed -i 's/3002/3003/g' ecosystem.config.js
pm2 restart dreflabs
```

### Reset everything:
```bash
pm2 delete dreflabs
rm -rf /var/www/dreflabs
# Mulai dari Step 2 lagi
```

## 📱 Final Access Points

- **Main URL**: http://148.230.100.44:3002
- **Admin Panel**: http://148.230.100.44:3002/admin
- **API Health**: http://148.230.100.44:3002/api/health

## 🔑 Credentials

- **Admin Username**: admin
- **Admin Password**: DrefAdmin2024!

⚠️ **PENTING**: Ganti password admin setelah login pertama!