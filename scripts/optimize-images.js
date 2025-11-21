const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const imagesDir = path.join(process.cwd(), 'public', 'images')
const outputDir = path.join(imagesDir, 'optimized')

// Create optimized directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function optimizeImage(inputPath, filename) {
  try {
    const baseName = path.parse(filename).name
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    console.log(`\n📸 Optimizing: ${filename}`)
    console.log(`   Original size: ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)}MB`)
    console.log(`   Dimensions: ${metadata.width}x${metadata.height}`)

    // 1. Generate WebP version (high quality)
    const webpPath = path.join(outputDir, `${baseName}.webp`)
    await image
      .clone()
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath)

    const webpSize = fs.statSync(webpPath).size
    console.log(`   ✅ WebP created: ${(webpSize / 1024).toFixed(2)}KB`)

    // 2. Generate optimized PNG/JPEG (for fallback)
    const isTransparent = metadata.hasAlpha
    let fallbackPath

    if (isTransparent) {
      // PNG with transparency
      fallbackPath = path.join(outputDir, `${baseName}.png`)
      await image
        .clone()
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(fallbackPath)
    } else {
      // JPEG without transparency
      fallbackPath = path.join(outputDir, `${baseName}.jpg`)
      await image
        .clone()
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toFile(fallbackPath)
    }

    const fallbackSize = fs.statSync(fallbackPath).size
    console.log(`   ✅ Fallback created: ${(fallbackSize / 1024).toFixed(2)}KB`)

    // 3. Generate blur placeholder (tiny base64 image)
    const blurBuffer = await image
      .clone()
      .resize(20, null, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer()

    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`
    const blurPath = path.join(outputDir, `${baseName}-blur.txt`)
    fs.writeFileSync(blurPath, blurDataURL)
    console.log(`   ✅ Blur placeholder created`)

    // 4. Generate responsive sizes (optional)
    const sizes = [640, 750, 828, 1080, 1200]
    for (const size of sizes) {
      if (size < metadata.width) {
        const responsivePath = path.join(outputDir, `${baseName}-${size}w.webp`)
        await image
          .clone()
          .resize(size, null, { fit: 'inside' })
          .webp({ quality: 85 })
          .toFile(responsivePath)

        const resSize = fs.statSync(responsivePath).size
        console.log(`   ✅ ${size}w: ${(resSize / 1024).toFixed(2)}KB`)
      }
    }

    const originalSize = fs.statSync(inputPath).size
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1)
    console.log(`   💾 Size reduction: ${savings}%`)

  } catch (error) {
    console.error(`❌ Error optimizing ${filename}:`, error.message)
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n')
  console.log(`Input directory: ${imagesDir}`)
  console.log(`Output directory: ${outputDir}\n`)

  // Target specific files or all images
  const targetFiles = [
    'Drefan.png',  // The main culprit!
    // Add more files if needed
  ]

  for (const filename of targetFiles) {
    const inputPath = path.join(imagesDir, filename)

    if (fs.existsSync(inputPath)) {
      await optimizeImage(inputPath, filename)
    } else {
      console.log(`⚠️  File not found: ${filename}`)
    }
  }

  console.log('\n✨ Image optimization complete!')
  console.log(`\n📁 Optimized images saved to: ${outputDir}`)
  console.log('\n💡 Next steps:')
  console.log('   1. Review optimized images in public/images/optimized/')
  console.log('   2. Update image imports to use optimized versions')
  console.log('   3. Use the blur placeholders for better UX')
}

main().catch(console.error)
