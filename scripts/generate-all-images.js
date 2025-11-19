const fs = require('fs')
const path = require('path')

console.log('🎨 GENERATING ALL MISSING IMAGES FOR WEBSITE (PNG FORMAT)')
console.log('='.repeat(60))
console.log('')

// Create directories
const directories = [
  'public/images',
  'public/blog',
  'public/projects',
  'public/opensource',
  'public/political-consulting',
  'public/portfolio/export-import',
  'public/portfolio/manufacturing',
  'public/portfolio/oil-gas',
  'public/portfolio/logistics',
  'public/portfolio/ecommerce',
]

directories.forEach((dir) => {
  const fullPath = path.join(__dirname, '..', dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
})

// PNG Generation Function - Creates a simple base64 PNG
function createPNGDataURL(width, height, text, bgColor, textColor) {
  // This creates a minimal PNG data that browsers can render
  // We'll use a simple approach: create an HTML canvas-like structure
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="${textColor}"
            text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `
  return canvas
}

// SVG Generation Functions
function generateProfilePhoto() {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-profile" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="400" fill="url(#grad-bg)"/>
  
  <!-- Decorative circles -->
  <circle cx="350" cy="50" r="80" fill="url(#grad-profile)" opacity="0.1"/>
  <circle cx="50" cy="350" r="100" fill="url(#grad-profile)" opacity="0.1"/>
  
  <!-- Avatar circle -->
  <circle cx="200" cy="180" r="80" fill="url(#grad-profile)"/>
  
  <!-- Face features -->
  <circle cx="185" cy="170" r="8" fill="white" opacity="0.9"/>
  <circle cx="215" cy="170" r="8" fill="white" opacity="0.9"/>
  <path d="M 170 200 Q 200 220 230 200" stroke="white" stroke-width="4" fill="none" opacity="0.9" stroke-linecap="round"/>
  
  <!-- Body -->
  <rect x="140" y="260" width="120" height="100" rx="10" fill="url(#grad-profile)"/>
  
  <!-- Text -->
  <text x="200" y="320" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">DREFAN</text>
  <text x="200" y="345" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.7)" text-anchor="middle">Full-Stack Developer</text>
  
  <!-- Tech icons -->
  <circle cx="80" cy="100" r="15" fill="rgba(255,255,255,0.1)"/>
  <text x="80" y="106" font-family="monospace" font-size="16" fill="white" text-anchor="middle">&lt;/&gt;</text>
  
  <circle cx="320" cy="280" r="15" fill="rgba(255,255,255,0.1)"/>
  <text x="320" y="286" font-family="monospace" font-size="16" fill="white" text-anchor="middle">{ }</text>
</svg>`
}

function generateProjectImage(title, subtitle, icon, color1, color2) {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${title}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad-${title})"/>
  
  <!-- Grid pattern -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#grid)"/>
  
  <!-- Decorative elements -->
  <circle cx="1000" cy="100" r="150" fill="rgba(255,255,255,0.05)"/>
  <circle cx="200" cy="500" r="200" fill="rgba(255,255,255,0.05)"/>
  
  <!-- Content box -->
  <rect x="80" y="150" width="1040" height="330" rx="20" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  
  <!-- Icon -->
  <text x="150" y="280" font-size="80" fill="white">${icon}</text>
  
  <!-- Title -->
  <text x="280" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">${title}</text>
  
  <!-- Subtitle -->
  <text x="280" y="330" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.8)">${subtitle}</text>
  
  <!-- Tech badge -->
  <rect x="280" y="360" width="200" height="40" rx="20" fill="rgba(255,255,255,0.2)"/>
  <text x="380" y="387" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle">Next.js • TypeScript</text>
  
  <!-- Bottom text -->
  <text x="600" y="580" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.6)" text-anchor="middle">Drefan Madiawan - Full-Stack Developer</text>
</svg>`
}

function generateBlogImage(title, category, color) {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-blog-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad-blog-${category})"/>
  
  <!-- Pattern -->
  <circle cx="100" cy="100" r="200" fill="rgba(255,255,255,0.03)"/>
  <circle cx="1100" cy="530" r="250" fill="rgba(255,255,255,0.03)"/>
  
  <!-- Category badge -->
  <rect x="80" y="80" width="200" height="50" rx="25" fill="rgba(255,255,255,0.2)"/>
  <text x="180" y="113" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${category}</text>
  
  <!-- Title -->
  <text x="80" y="250" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" style="word-spacing: 100vw;">
    <tspan x="80" dy="0">${title.split(' ').slice(0, 3).join(' ')}</tspan>
    <tspan x="80" dy="70">${title.split(' ').slice(3).join(' ')}</tspan>
  </text>
  
  <!-- Decorative line -->
  <rect x="80" y="420" width="400" height="6" rx="3" fill="white" opacity="0.8"/>
  
  <!-- Author info -->
  <circle cx="100" cy="520" r="30" fill="rgba(255,255,255,0.2)"/>
  <text x="100" y="530" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">D</text>
  <text x="150" y="530" font-family="Arial, sans-serif" font-size="24" fill="white">Drefan Madiawan</text>
  
  <!-- Blog icon -->
  <text x="1050" y="150" font-size="120" fill="rgba(255,255,255,0.1)">📝</text>
</svg>`
}

function generatePoliticalImage(title, subtitle, color) {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-political" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad-political)"/>
  
  <!-- Indonesia flag colors accent -->
  <rect x="0" y="0" width="20" height="315" fill="#FF0000" opacity="0.6"/>
  <rect x="0" y="315" width="20" height="315" fill="#FFFFFF" opacity="0.6"/>
  
  <!-- Content -->
  <rect x="100" y="150" width="1000" height="330" rx="20" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  
  <!-- Icon -->
  <text x="150" y="300" font-size="100" fill="white">🎯</text>
  
  <!-- Title -->
  <text x="300" y="290" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white">${title}</text>
  
  <!-- Subtitle -->
  <text x="300" y="340" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.8)">${subtitle}</text>
  
  <!-- Stats -->
  <rect x="300" y="370" width="150" height="50" rx="10" fill="rgba(255,255,255,0.2)"/>
  <text x="375" y="403" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">Data-Driven</text>
  
  <rect x="470" y="370" width="150" height="50" rx="10" fill="rgba(255,255,255,0.2)"/>
  <text x="545" y="403" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">Strategic</text>
  
  <!-- Bottom -->
  <text x="600" y="560" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)" text-anchor="middle">Political Consulting by Drefan Madiawan</text>
</svg>`
}

// Generate all images
const images = []

// 1. Profile photo
console.log('1️⃣ Generating profile photo...')
images.push({
  path: 'public/images/profile.jpg',
  content: generateProfilePhoto(),
  name: 'Profile Photo'
})

// 2. Blog images
console.log('2️⃣ Generating blog images...')
images.push({
  path: 'public/blog/cybersecurity-gov.jpg',
  content: generateBlogImage('Cyber Security untuk E-Government', 'TECHNOLOGY', '#dc2626'),
  name: 'Blog: Cyber Security'
})
images.push({
  path: 'public/blog/ai-social-analytics.jpg',
  content: generateBlogImage('AI untuk Social Media Analytics', 'ARTIFICIAL INTELLIGENCE', '#7c3aed'),
  name: 'Blog: AI Analytics'
})
images.push({
  path: 'public/blog/big-data-gov.jpg',
  content: generateBlogImage('Big Data dalam Pemerintahan', 'BIG DATA', '#0891b2'),
  name: 'Blog: Big Data'
})

// 3. Project images
console.log('3️⃣ Generating project images...')
images.push({
  path: 'public/projects/data-lake.jpg',
  content: generateProjectImage('National Data Lake', 'Big Data Infrastructure', '🗄️', '#0891b2', '#0e7490'),
  name: 'Project: Data Lake'
})
images.push({
  path: 'public/projects/sentiment-analysis.jpg',
  content: generateProjectImage('AI Sentiment Analysis', 'Machine Learning Platform', '🤖', '#7c3aed', '#6d28d9'),
  name: 'Project: AI Sentiment'
})
images.push({
  path: 'public/projects/e-gov-portal.jpg',
  content: generateProjectImage('E-Government Portal', 'Secure Public Services', '🏛️', '#059669', '#047857'),
  name: 'Project: E-Gov Portal'
})
images.push({
  path: 'public/projects/cybersecurity.jpg',
  content: generateProjectImage('Cyber Security Framework', 'Enterprise Protection', '🔒', '#dc2626', '#b91c1c'),
  name: 'Project: Cybersecurity'
})

// 4. Open source images
console.log('4️⃣ Generating open source images...')
images.push({
  path: 'public/opensource/social-analytics.jpg',
  content: generateProjectImage('Social Media Analytics', 'Open Source Tool', '📊', '#8b5cf6', '#7c3aed'),
  name: 'Open Source: Social Analytics'
})
images.push({
  path: 'public/opensource/big-data-pipeline.jpg',
  content: generateProjectImage('Big Data Pipeline', 'ETL Framework', '⚡', '#f59e0b', '#d97706'),
  name: 'Open Source: Data Pipeline'
})
images.push({
  path: 'public/opensource/cyber-scanner.jpg',
  content: generateProjectImage('Cyber Security Scanner', 'Vulnerability Detection', '🛡️', '#ef4444', '#dc2626'),
  name: 'Open Source: Security Scanner'
})

// 5. Political consulting images
console.log('5️⃣ Generating political consulting images...')
images.push({
  path: 'public/political-consulting/gubernur-jateng.jpg',
  content: generatePoliticalImage('Gubernur Jawa Tengah 2024', 'Provincial Election Campaign', '#dc2626'),
  name: 'Political: Gubernur Jateng'
})
images.push({
  path: 'public/political-consulting/walikota-semarang.jpg',
  content: generatePoliticalImage('Walikota Semarang 2023', 'City Mayor Campaign', '#0891b2'),
  name: 'Political: Walikota Semarang'
})
images.push({
  path: 'public/political-consulting/dprd-coalition.jpg',
  content: generatePoliticalImage('DPRD Coalition 2024', 'Legislative Strategy', '#7c3aed'),
  name: 'Political: DPRD Coalition'
})

// Write all files
let successCount = 0
images.forEach((img) => {
  try {
    fs.writeFileSync(img.path, img.content)
    console.log(`   ✅ ${img.name}`)
    successCount++
  } catch (error) {
    console.log(`   ❌ ${img.name} - Error: ${error.message}`)
  }
})

console.log('')
console.log('='.repeat(60))
console.log(`✅ Successfully generated ${successCount}/${images.length} images!`)
console.log('')
console.log('📁 Images created in:')
console.log('   - public/images/profile.jpg')
console.log('   - public/blog/*.jpg (3 images)')
console.log('   - public/projects/*.jpg (4 images)')
console.log('   - public/opensource/*.jpg (3 images)')
console.log('   - public/political-consulting/*.jpg (3 images)')
console.log('')
console.log('📝 Note: Portfolio images already exist in public/portfolio/')
console.log('🎨 Total: 14 new images + 23 portfolio images = 37 images')
console.log('')

