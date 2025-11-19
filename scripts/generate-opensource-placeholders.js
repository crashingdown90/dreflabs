#!/usr/bin/env node

/**
 * Generate SVG placeholder images for Open Source repositories
 * Run: node scripts/generate-opensource-placeholders.js
 */

const fs = require('fs')
const path = require('path')

const placeholders = [
  {
    filename: 'social-analytics-cover.jpg',
    title: 'AI Social Media Analytics',
    icon: '🤖',
    gradient: 'from-blue-500 to-purple-600',
    colors: { start: '#3B82F6', end: '#9333EA' },
  },
  {
    filename: 'social-analytics-dashboard.jpg',
    title: 'Dashboard',
    icon: '📊',
    gradient: 'from-blue-400 to-cyan-500',
    colors: { start: '#60A5FA', end: '#06B6D4' },
  },
  {
    filename: 'social-analytics-sentiment.jpg',
    title: 'Sentiment Analysis',
    icon: '😊',
    gradient: 'from-green-400 to-blue-500',
    colors: { start: '#4ADE80', end: '#3B82F6' },
  },
  {
    filename: 'social-analytics-network.jpg',
    title: 'Network Graph',
    icon: '🕸️',
    gradient: 'from-purple-400 to-pink-500',
    colors: { start: '#C084FC', end: '#EC4899' },
  },
  {
    filename: 'bigdata-pipeline-cover.jpg',
    title: 'Big Data Pipeline',
    icon: '⚡',
    gradient: 'from-orange-500 to-red-600',
    colors: { start: '#F97316', end: '#DC2626' },
  },
  {
    filename: 'bigdata-pipeline-architecture.jpg',
    title: 'Architecture',
    icon: '🏗️',
    gradient: 'from-yellow-400 to-orange-500',
    colors: { start: '#FACC15', end: '#F97316' },
  },
  {
    filename: 'bigdata-pipeline-monitoring.jpg',
    title: 'Monitoring',
    icon: '📈',
    gradient: 'from-green-500 to-teal-600',
    colors: { start: '#22C55E', end: '#0D9488' },
  },
  {
    filename: 'security-scanner-cover.jpg',
    title: 'Security Scanner',
    icon: '🔒',
    gradient: 'from-red-500 to-pink-600',
    colors: { start: '#EF4444', end: '#DB2777' },
  },
  {
    filename: 'security-scanner-dashboard.jpg',
    title: 'Security Dashboard',
    icon: '🛡️',
    gradient: 'from-indigo-500 to-purple-600',
    colors: { start: '#6366F1', end: '#9333EA' },
  },
  {
    filename: 'security-scanner-report.jpg',
    title: 'Vulnerability Report',
    icon: '📋',
    gradient: 'from-red-400 to-orange-500',
    colors: { start: '#F87171', end: '#F97316' },
  },
]

function generateSVG(config) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${config.colors.start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${config.colors.end};stop-opacity:1" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  
  <!-- Overlay -->
  <rect width="1200" height="630" fill="rgba(0,0,0,0.3)"/>
  
  <!-- Icon -->
  <text x="600" y="280" font-size="120" text-anchor="middle" fill="white" opacity="0.9">
    ${config.icon}
  </text>
  
  <!-- Title -->
  <text x="600" y="380" font-size="48" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
    ${config.title}
  </text>
  
  <!-- Subtitle -->
  <text x="600" y="420" font-size="24" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif">
    Open Source by DrefLabs
  </text>
  
  <!-- Code Symbol -->
  <text x="600" y="500" font-size="32" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="monospace">
    &lt;/&gt;
  </text>
</svg>`
}

// Create output directory
const outputDir = path.join(__dirname, '..', 'public', 'opensource')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Generate all placeholders
console.log('🎨 Generating Open Source placeholder images...\n')

placeholders.forEach((config) => {
  const svg = generateSVG(config)
  const outputPath = path.join(outputDir, config.filename)
  fs.writeFileSync(outputPath, svg)
  console.log(`✅ Generated: ${config.filename}`)
})

console.log(`\n✨ Successfully generated ${placeholders.length} placeholder images!`)
console.log(`📁 Location: public/opensource/\n`)
console.log('💡 Replace these with real screenshots when available.')

