const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

console.log('🎨 GENERATING SIMPLE PNG PLACEHOLDERS')
console.log('='.repeat(60))
console.log('')

// Create simple colored PNG images
const createSimplePNG = async (width, height, color, text, outputPath) => {
  try {
    // Create SVG without emoji
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(width/20)}" 
              font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
      </svg>
    `
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath)
    
    return true
  } catch (error) {
    console.error(`Error creating ${outputPath}:`, error.message)
    return false
  }
}

const images = [
  // Profile
  { path: 'public/images/profile.png', width: 400, height: 400, color: '#667eea', text: 'DREFAN' },
  
  // Blog images
  { path: 'public/blog/cybersecurity-gov.png', width: 1200, height: 630, color: '#dc2626', text: 'Cyber Security' },
  { path: 'public/blog/ai-social-analytics.png', width: 1200, height: 630, color: '#7c3aed', text: 'AI Analytics' },
  { path: 'public/blog/big-data-gov.png', width: 1200, height: 630, color: '#0891b2', text: 'Big Data' },
  
  // Project images
  { path: 'public/projects/data-lake.png', width: 1200, height: 630, color: '#0891b2', text: 'Data Lake' },
  { path: 'public/projects/sentiment-analysis.png', width: 1200, height: 630, color: '#7c3aed', text: 'AI Sentiment' },
  { path: 'public/projects/e-gov-portal.png', width: 1200, height: 630, color: '#059669', text: 'E-Gov Portal' },
  { path: 'public/projects/cybersecurity.png', width: 1200, height: 630, color: '#dc2626', text: 'Cybersecurity' },
  
  // Open source images
  { path: 'public/opensource/social-analytics.png', width: 1200, height: 630, color: '#8b5cf6', text: 'Social Analytics' },
  { path: 'public/opensource/big-data-pipeline.png', width: 1200, height: 630, color: '#f59e0b', text: 'Data Pipeline' },
  { path: 'public/opensource/cyber-scanner.png', width: 1200, height: 630, color: '#ef4444', text: 'Security Scanner' },
  
  // Political consulting images
  { path: 'public/political-consulting/gubernur-jateng.png', width: 1200, height: 630, color: '#dc2626', text: 'Gubernur Jateng 2024' },
  { path: 'public/political-consulting/walikota-semarang.png', width: 1200, height: 630, color: '#0891b2', text: 'Walikota Semarang' },
  { path: 'public/political-consulting/dprd-coalition.png', width: 1200, height: 630, color: '#7c3aed', text: 'DPRD Coalition' },
  
  // Portfolio images - Export Import
  { path: 'public/portfolio/export-import/dashboard.png', width: 1200, height: 800, color: '#0891b2', text: 'Export-Import Dashboard' },
  { path: 'public/portfolio/export-import/marketplace.png', width: 1200, height: 800, color: '#0891b2', text: 'Marketplace' },
  { path: 'public/portfolio/export-import/quotation.png', width: 1200, height: 800, color: '#0891b2', text: 'Quotation System' },
  { path: 'public/portfolio/export-import/tracking.png', width: 1200, height: 800, color: '#0891b2', text: 'Shipment Tracking' },
  { path: 'public/portfolio/export-import/documents.png', width: 1200, height: 800, color: '#0891b2', text: 'Documents' },
  
  // Portfolio images - Manufacturing
  { path: 'public/portfolio/manufacturing/dashboard.png', width: 1200, height: 800, color: '#059669', text: 'ERP Dashboard' },
  { path: 'public/portfolio/manufacturing/production.png', width: 1200, height: 800, color: '#059669', text: 'Production Planning' },
  { path: 'public/portfolio/manufacturing/inventory.png', width: 1200, height: 800, color: '#059669', text: 'Inventory Management' },
  { path: 'public/portfolio/manufacturing/procurement.png', width: 1200, height: 800, color: '#059669', text: 'Procurement' },
  { path: 'public/portfolio/manufacturing/analytics.png', width: 1200, height: 800, color: '#059669', text: 'Analytics' },
  
  // Portfolio images - Oil & Gas
  { path: 'public/portfolio/oil-gas/dashboard.png', width: 1200, height: 800, color: '#dc2626', text: 'Corporate Dashboard' },
  { path: 'public/portfolio/oil-gas/compliance.png', width: 1200, height: 800, color: '#dc2626', text: 'Compliance Tracking' },
  { path: 'public/portfolio/oil-gas/contracts.png', width: 1200, height: 800, color: '#dc2626', text: 'Contract Management' },
  { path: 'public/portfolio/oil-gas/reporting.png', width: 1200, height: 800, color: '#dc2626', text: 'SKK Migas Reporting' },
  { path: 'public/portfolio/oil-gas/audit.png', width: 1200, height: 800, color: '#dc2626', text: 'Audit Trail' },
  
  // Portfolio images - Logistics
  { path: 'public/portfolio/logistics/tracking.png', width: 1200, height: 800, color: '#f59e0b', text: 'GPS Tracking' },
  { path: 'public/portfolio/logistics/routes.png', width: 1200, height: 800, color: '#f59e0b', text: 'Route Optimization' },
  { path: 'public/portfolio/logistics/fleet.png', width: 1200, height: 800, color: '#f59e0b', text: 'Fleet Management' },
  { path: 'public/portfolio/logistics/analytics.png', width: 1200, height: 800, color: '#f59e0b', text: 'Performance Analytics' },
  
  // Portfolio images - E-Commerce
  { path: 'public/portfolio/ecommerce/homepage.png', width: 1200, height: 800, color: '#8b5cf6', text: 'Marketplace Homepage' },
  { path: 'public/portfolio/ecommerce/products.png', width: 1200, height: 800, color: '#8b5cf6', text: 'Product Catalog' },
  { path: 'public/portfolio/ecommerce/seller-dashboard.png', width: 1200, height: 800, color: '#8b5cf6', text: 'Seller Dashboard' },
  { path: 'public/portfolio/ecommerce/checkout.png', width: 1200, height: 800, color: '#8b5cf6', text: 'Checkout & Payment' },
]

const main = async () => {
  let successCount = 0
  let failCount = 0
  
  for (const img of images) {
    const success = await createSimplePNG(img.width, img.height, img.color, img.text, img.path)
    
    if (success) {
      console.log(`✅ ${img.path}`)
      successCount++
    } else {
      console.log(`❌ ${img.path}`)
      failCount++
    }
  }
  
  console.log('')
  console.log('='.repeat(60))
  console.log(`✅ Successfully created: ${successCount}/${images.length} images`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('')
  console.log('📝 Now updating file references from .svg to .png...')
}

main().catch(console.error)

