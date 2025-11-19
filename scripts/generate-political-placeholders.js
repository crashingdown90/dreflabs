const fs = require('fs')
const path = require('path')

// Create directory if it doesn't exist
const politicalDir = path.join(__dirname, '../public/political')
if (!fs.existsSync(politicalDir)) {
  fs.mkdirSync(politicalDir, { recursive: true })
}

// Placeholder images to generate
const images = [
  // Jawa Tengah Campaign
  { name: 'jateng-cover.jpg', gradient: ['#3B82F6', '#8B5CF6'], icon: '🏛️', label: 'Jateng 2024' },
  { name: 'jateng-thumb.jpg', gradient: ['#3B82F6', '#8B5CF6'], icon: '🏛️', label: 'Jateng' },
  { name: 'jateng-dashboard.jpg', gradient: ['#1E40AF', '#6366F1'], icon: '📊', label: 'Analytics Dashboard' },
  { name: 'jateng-rally.jpg', gradient: ['#DC2626', '#F59E0B'], icon: '👥', label: 'Campaign Rally' },
  { name: 'jateng-team.jpg', gradient: ['#059669', '#10B981'], icon: '🤝', label: 'Team Coordination' },
  { name: 'jateng-analytics.jpg', gradient: ['#7C3AED', '#A78BFA'], icon: '📈', label: 'Data Analytics' },
  
  // Semarang Campaign
  { name: 'semarang-cover.jpg', gradient: ['#059669', '#10B981'], icon: '🏙️', label: 'Semarang 2023' },
  { name: 'semarang-thumb.jpg', gradient: ['#059669', '#10B981'], icon: '🏙️', label: 'Semarang' },
  { name: 'semarang-app.jpg', gradient: ['#0891B2', '#06B6D4'], icon: '📱', label: 'Campaign App' },
  { name: 'semarang-townhall.jpg', gradient: ['#DB2777', '#EC4899'], icon: '🎤', label: 'Town Hall' },
  { name: 'semarang-youth.jpg', gradient: ['#F59E0B', '#FBBF24'], icon: '🎓', label: 'Youth Engagement' },
  
  // DPRD Coalition
  { name: 'dprd-cover.jpg', gradient: ['#DC2626', '#EF4444'], icon: '🗳️', label: 'DPRD 2024' },
  { name: 'dprd-thumb.jpg', gradient: ['#DC2626', '#EF4444'], icon: '🗳️', label: 'DPRD' },
  { name: 'dprd-dashboard.jpg', gradient: ['#7C3AED', '#8B5CF6'], icon: '💻', label: 'Central Dashboard' },
  { name: 'dprd-training.jpg', gradient: ['#0891B2', '#14B8A6'], icon: '📚', label: 'Team Training' },
  { name: 'dprd-coordination.jpg', gradient: ['#EA580C', '#F97316'], icon: '🎯', label: 'Coordination' },
  
  // General
  { name: 'og-image.jpg', gradient: ['#1E40AF', '#7C3AED'], icon: '🏆', label: 'Political Consulting' },
]

// Generate SVG placeholder
function generateSVG(config) {
  const width = 1200
  const height = 630
  const [color1, color2] = config.gradient

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${config.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
    <pattern id="grid-${config.name}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    </pattern>
  </defs>
  
  <!-- Background gradient -->
  <rect width="${width}" height="${height}" fill="url(#grad-${config.name})"/>
  
  <!-- Grid pattern -->
  <rect width="${width}" height="${height}" fill="url(#grid-${config.name})"/>
  
  <!-- Icon -->
  <text x="${width/2}" y="${height/2 - 40}" font-size="120" text-anchor="middle" fill="rgba(255,255,255,0.9)">
    ${config.icon}
  </text>
  
  <!-- Label -->
  <text x="${width/2}" y="${height/2 + 80}" font-size="48" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
    ${config.label}
  </text>
  
  <!-- Watermark -->
  <text x="${width/2}" y="${height - 40}" font-size="20" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Arial, sans-serif">
    Dref Labs Political Consulting
  </text>
</svg>`
}

// Generate all images
console.log('🎨 Generating political consulting placeholder images...\n')

images.forEach((config) => {
  const svg = generateSVG(config)
  const filePath = path.join(politicalDir, config.name)
  fs.writeFileSync(filePath, svg)
  console.log(`✅ Generated: ${config.name}`)
})

console.log(`\n🎉 Successfully generated ${images.length} placeholder images in public/political/`)
console.log('\n📝 Note: Replace these SVG placeholders with real campaign photos when available.')

