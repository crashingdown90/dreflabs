# 📚 GitHub Deployment Guide untuk DREFLABS

## 🎯 Opsi Deployment dengan GitHub

### **Option 1: GitHub Actions (Recommended) 🚀**

**Kelebihan:**
- Fully automated
- Deploy on every push
- No manual intervention
- Professional CI/CD

**Setup:**

1. **Initialize Git Local:**
```bash
chmod +x setup-github.sh
./setup-github.sh
```

2. **Create GitHub Repository:**
- Go to https://github.com/new
- Name: `dreflabs`
- Keep private/public (your choice)
- DON'T initialize with README

3. **Push Code to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dreflabs.git
git push -u origin main
```

4. **Add GitHub Secrets:**
- Go to: Settings → Secrets → Actions
- Add these secrets:
  - `VPS_HOST`: 148.230.100.44
  - `VPS_USER`: root
  - `VPS_PASSWORD`: GunungAGAG13##

5. **Setup VPS:**
```bash
# Upload script to VPS
scp setup-vps-git.sh root@148.230.100.44:/root/

# SSH to VPS and run
ssh root@148.230.100.44
chmod +x setup-vps-git.sh
./setup-vps-git.sh
# Enter your GitHub repo URL when prompted
```

**Done!** Now every push to GitHub will auto-deploy to VPS.

---

### **Option 2: Manual Git Pull 🔧**

**Kelebihan:**
- Simple setup
- Full control when to deploy
- No automation complexity

**Setup:**

1. **Push code to GitHub** (same as Option 1, steps 1-3)

2. **Clone on VPS:**
```bash
ssh root@148.230.100.44
cd /var/www
rm -rf dreflabs
git clone https://github.com/YOUR_USERNAME/dreflabs.git
cd dreflabs
npm install
npm run build
pm2 restart dreflabs
```

3. **For future updates:**
```bash
ssh root@148.230.100.44
cd /var/www/dreflabs
git pull
npm install
npm run build
pm2 restart dreflabs
```

---

### **Option 3: SSH Key Authentication (Most Secure) 🔐**

**Setup SSH Key (one time):**

1. **Generate SSH key on local:**
```bash
ssh-keygen -t ed25519 -C "dreflabs-deploy"
# Save as: ~/.ssh/dreflabs_deploy
```

2. **Add to VPS:**
```bash
ssh-copy-id -i ~/.ssh/dreflabs_deploy root@148.230.100.44
```

3. **Create deployment alias:**
```bash
echo "alias deploy-dreflabs='ssh -i ~/.ssh/dreflabs_deploy root@148.230.100.44 deploy-dreflabs'" >> ~/.zshrc
source ~/.zshrc
```

4. **Deploy with one command:**
```bash
deploy-dreflabs
```

---

## 🔄 Deployment Workflow Comparison

| Method | Setup Time | Security | Automation | Best For |
|--------|------------|----------|------------|----------|
| GitHub Actions | 15 min | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Production |
| Manual Git Pull | 5 min | ⭐⭐ | ⭐ | Development |
| SSH Key | 10 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Secure Production |

---

## 💡 Tips

### **For Development:**
1. Use branch protection on GitHub
2. Create `develop` branch for testing
3. Only merge to `main` when ready to deploy

### **For Production:**
1. Use environment secrets
2. Enable 2FA on GitHub
3. Use deployment environments in GitHub Actions

### **Quick Commands:**

```bash
# Check deployment status
ssh root@148.230.100.44 "pm2 status dreflabs"

# View logs
ssh root@148.230.100.44 "pm2 logs dreflabs --lines 50"

# Manual deploy
ssh root@148.230.100.44 "cd /var/www/dreflabs && git pull && npm install && npm run build && pm2 restart dreflabs"
```

---

## 🚨 Troubleshooting

**If deployment fails:**
```bash
# Check PM2 logs
pm2 logs dreflabs --lines 100

# Check git status
cd /var/www/dreflabs
git status

# Reset if needed
git reset --hard origin/main
```

**If build fails:**
```bash
# Run in dev mode temporarily
pm2 stop dreflabs
pm2 start npm --name dreflabs -- run dev
```

---

## ✅ Recommended: Use GitHub Actions

It's the most professional and automated solution. Once set up, you just:

1. Edit code locally
2. `git add . && git commit -m "Update" && git push`
3. ✨ Auto deploys to VPS!

No SSH, no manual commands, fully automated!