const fs = require('fs')
const path = require('path')

// Simple SVG generator
function generateSVG(width, height, text, bgColor = '#0066ff', textColor = '#ffffff') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`
}

// Create directories
const dirs = [
  'public/images',
  'public/blog',
  'public/projects',
]

dirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
})

// Generate images
const images = [
  // Profile - SKIPPED: Real photo already added (Drefan.png)
  // { path: 'public/images/profile.jpg', width: 160, height: 160, text: 'DM', color: '#0066ff' },
  { path: 'public/images/og-image.jpg', width: 1200, height: 630, text: 'Dref Labs', color: '#0066ff' },

  // Blog covers
  { path: 'public/blog/big-data-gov.jpg', width: 1200, height: 630, text: 'Big Data Government', color: '#0066ff' },
  { path: 'public/blog/ai-social-analytics.jpg', width: 1200, height: 630, text: 'AI Social Analytics', color: '#00f5ff' },
  { path: 'public/blog/cybersecurity-gov.jpg', width: 1200, height: 630, text: 'Cyber Security', color: '#0052cc' },
  { path: 'public/blog/default-cover.jpg', width: 1200, height: 630, text: 'Blog Post', color: '#666666' },

  // Project covers
  { path: 'public/projects/data-lake.jpg', width: 1200, height: 630, text: 'Data Lake Project', color: '#0066ff' },
  { path: 'public/projects/sentiment-analysis.jpg', width: 1200, height: 630, text: 'Sentiment Analysis', color: '#00f5ff' },
  { path: 'public/projects/e-gov-portal.jpg', width: 1200, height: 630, text: 'E-Gov Portal', color: '#0052cc' },
  { path: 'public/projects/cybersecurity.jpg', width: 1200, height: 630, text: 'Cyber Security', color: '#003399' },
]

console.log('Generating placeholder images...')

images.forEach((img) => {
  const svg = generateSVG(img.width, img.height, img.text, img.color)
  const fullPath = path.join(process.cwd(), img.path)
  fs.writeFileSync(fullPath, svg)
  console.log(`✓ Created ${img.path}`)
})

console.log('\nPlaceholder images generated successfully!')
console.log('Replace these with real images before deployment.')
console.log('See IMAGE_GUIDE.md for details.')
