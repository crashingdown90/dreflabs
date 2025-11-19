const fs = require('fs')
const path = require('path')

// Create directories
const portfolioDir = path.join(__dirname, '../public/portfolio')
const subdirs = ['export-import', 'manufacturing', 'oil-gas', 'logistics', 'ecommerce']

// Create main portfolio directory
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true })
}

// Create subdirectories
subdirs.forEach((subdir) => {
  const dir = path.join(portfolioDir, subdir)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Generate SVG placeholder function
function generatePlaceholder(width, height, title, subtitle, color) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${color}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad-${color})"/>
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
  
  <!-- Browser Chrome -->
  <rect x="40" y="40" width="${width - 80}" height="40" rx="5" fill="rgba(255,255,255,0.1)"/>
  <circle cx="60" cy="60" r="6" fill="#ff5f56"/>
  <circle cx="80" cy="60" r="6" fill="#ffbd2e"/>
  <circle cx="100" cy="60" r="6" fill="#27c93f"/>
  
  <!-- Content Area -->
  <rect x="40" y="90" width="${width - 80}" height="${height - 130}" rx="5" fill="rgba(255,255,255,0.05)"/>
  
  <!-- Title -->
  <text x="${width / 2}" y="${height / 2 - 20}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
  
  <!-- Subtitle -->
  <text x="${width / 2}" y="${height / 2 + 20}" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)" text-anchor="middle">${subtitle}</text>
  
  <!-- Decorative Elements -->
  <circle cx="${width - 100}" cy="120" r="30" fill="rgba(255,255,255,0.1)"/>
  <circle cx="100" cy="${height - 80}" r="40" fill="rgba(255,255,255,0.08)"/>
  <rect x="${width - 200}" y="${height - 100}" width="150" height="60" rx="5" fill="rgba(255,255,255,0.1)"/>
</svg>`
}

// Portfolio projects placeholders
const placeholders = [
  // Export-Import Platform
  {
    dir: 'export-import',
    files: [
      { name: 'dashboard.jpg', title: 'Dashboard', subtitle: 'Export Import Platform', color: '#3b82f6' },
      { name: 'marketplace.jpg', title: 'Marketplace', subtitle: 'Product Listings', color: '#8b5cf6' },
      { name: 'quotation.jpg', title: 'Quotation', subtitle: 'Quote Management', color: '#06b6d4' },
      { name: 'tracking.jpg', title: 'Tracking', subtitle: 'Shipment Tracking', color: '#10b981' },
      { name: 'documents.jpg', title: 'Documents', subtitle: 'Export Documentation', color: '#f59e0b' },
    ],
  },
  // Manufacturing ERP
  {
    dir: 'manufacturing',
    files: [
      { name: 'dashboard.jpg', title: 'ERP Dashboard', subtitle: 'Manufacturing Overview', color: '#ef4444' },
      { name: 'production.jpg', title: 'Production', subtitle: 'Planning & Scheduling', color: '#f97316' },
      { name: 'inventory.jpg', title: 'Inventory', subtitle: 'Stock Management', color: '#84cc16' },
      { name: 'procurement.jpg', title: 'Procurement', subtitle: 'Vendor Management', color: '#06b6d4' },
      { name: 'analytics.jpg', title: 'Analytics', subtitle: 'Business Intelligence', color: '#8b5cf6' },
    ],
  },
  // Oil & Gas Governance
  {
    dir: 'oil-gas',
    files: [
      { name: 'dashboard.jpg', title: 'Governance', subtitle: 'Corporate Dashboard', color: '#1e40af' },
      { name: 'compliance.jpg', title: 'Compliance', subtitle: 'Regulatory Tracking', color: '#dc2626' },
      { name: 'contracts.jpg', title: 'Contracts', subtitle: 'Contract Management', color: '#059669' },
      { name: 'reporting.jpg', title: 'Reporting', subtitle: 'SKK Migas Reports', color: '#7c3aed' },
      { name: 'audit.jpg', title: 'Audit Trail', subtitle: 'Security & Logging', color: '#ea580c' },
    ],
  },
  // Logistics
  {
    dir: 'logistics',
    files: [
      { name: 'tracking.jpg', title: 'Fleet Tracking', subtitle: 'Real-time GPS', color: '#0891b2' },
      { name: 'routes.jpg', title: 'Route Optimization', subtitle: 'Smart Routing', color: '#16a34a' },
      { name: 'fleet.jpg', title: 'Fleet Management', subtitle: 'Vehicle Dashboard', color: '#dc2626' },
      { name: 'analytics.jpg', title: 'Analytics', subtitle: 'Performance Metrics', color: '#9333ea' },
    ],
  },
  // E-Commerce
  {
    dir: 'ecommerce',
    files: [
      { name: 'homepage.jpg', title: 'Marketplace', subtitle: 'E-Commerce Platform', color: '#ec4899' },
      { name: 'products.jpg', title: 'Products', subtitle: 'Product Catalog', color: '#8b5cf6' },
      { name: 'seller-dashboard.jpg', title: 'Seller Dashboard', subtitle: 'Vendor Portal', color: '#f59e0b' },
      { name: 'checkout.jpg', title: 'Checkout', subtitle: 'Payment Gateway', color: '#10b981' },
    ],
  },
]

// Generate all placeholders
let totalGenerated = 0

placeholders.forEach(({ dir, files }) => {
  files.forEach(({ name, title, subtitle, color }) => {
    const filePath = path.join(portfolioDir, dir, name)
    const svg = generatePlaceholder(1200, 800, title, subtitle, color)
    fs.writeFileSync(filePath, svg)
    totalGenerated++
    console.log(`✓ Generated: portfolio/${dir}/${name}`)
  })
})

console.log(`\n✅ Successfully generated ${totalGenerated} portfolio placeholder images!`)
console.log(`📁 Location: public/portfolio/`)
console.log(`\n📝 Note: Replace these placeholders with real screenshots before production deployment.`)

