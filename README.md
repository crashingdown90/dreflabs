# Dref Labs - Personal Blog Portfolio

Professional blog portfolio for Drefan Mardiawan showcasing expertise in Big Data, AI, Cyber Security, and E-Government solutions.

## 🚀 Features

- ✅ Modern, responsive design with dark theme
- ✅ Animated particle background and smooth transitions
- ✅ MDX-based blog system with syntax highlighting
- ✅ SQLite database for comments, newsletter, and analytics
- ✅ Contact form with email notifications
- ✅ Project showcase with case studies
- ✅ SEO optimized with metadata
- ✅ Production-ready for VPS deployment

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

**Backend & Database:**
- Next.js API Routes
- SQLite (better-sqlite3)
- MDX for content
- Nodemailer for emails

**Deployment:**
- PM2 process manager
- Nginx reverse proxy
- Let's Encrypt SSL

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Git

## 🔧 Installation

1. **Clone the repository**
```bash
cd dreflabs
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- SMTP settings for email functionality
- Contact email address

4. **Initialize the database**
```bash
npm run db:init
```

5. **Add images**

Place your images in the following directories:
- `/public/images/profile.jpg` - Your profile photo
- `/public/blog/` - Blog cover images
- `/public/projects/` - Project screenshots

## 🏃 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Content Management

### Adding Blog Posts

Create MDX files in `content/blog/`:

```mdx
---
title: "Your Post Title"
excerpt: "Brief description"
coverImage: "/blog/cover.jpg"
date: "2024-01-15"
category: "Big Data"
tags: ["Big Data", "Analytics"]
readTime: 8
---

# Your Content Here

Write your blog post content in MDX format.
```

### Adding Projects

Edit `content/data/projects.json` to add new projects.

### Customizing Services

Edit `content/data/services.json` (create this file following the expertise.json structure).

## 🏗️ Building for Production

1. **Build the application**
```bash
npm run build
```

2. **Test the production build locally**
```bash
npm start
```

## 🚀 VPS Deployment

### Option 1: Using PM2 (Recommended)

1. **Upload files to VPS**
```bash
rsync -avz --exclude node_modules --exclude .next ./  user@your-vps:/var/www/dreflabs
```

2. **On the VPS, install dependencies and build**
```bash
cd /var/www/dreflabs
npm install
npm run build
npm run db:init
```

3. **Start with PM2**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Setup Nginx reverse proxy**

Create `/etc/nginx/sites-available/dreflabs`:

```nginx
server {
    listen 80;
    server_name dreflabs.com www.dreflabs.com;

    location / {
        proxy_pass http://localhost:3000;
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
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/dreflabs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dreflabs.com -d www.dreflabs.com
```

### Option 2: Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Build and run**
```bash
docker build -t dreflabs .
docker run -p 3000:3000 --env-file .env.local dreflabs
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **Database**: The SQLite database is gitignored and should be backed up regularly
3. **Email**: Use app-specific passwords, not your actual email password
4. **Updates**: Keep dependencies updated regularly
5. **Backups**: Set up automated backups for database and uploaded images

## 📊 Monitoring

With PM2, you can monitor your application:

```bash
pm2 status        # Check status
pm2 logs          # View logs
pm2 monit         # Real-time monitoring
pm2 restart all   # Restart app
```

## 🐛 Troubleshooting

**Database errors:**
```bash
# Reinitialize database
rm data/dreflabs.db
npm run db:init
```

**Build errors:**
```bash
# Clean build cache
rm -rf .next
npm run build
```

**PM2 issues:**
```bash
pm2 delete all
pm2 start ecosystem.config.js
```

## 📄 License

This project is private and proprietary.

## 👤 Author

**Drefan Mardiawan**
- Website: https://dreflabs.com
- Email: contact@dreflabs.com
- LinkedIn: [Your LinkedIn]

## 🙏 Acknowledgments

- Built with Next.js 14
- Styled with Tailwind CSS
- Deployed with PM2
- Icons by Lucide React
