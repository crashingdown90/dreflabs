const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

console.log('🎨 CONVERTING SVG TO PNG')
console.log('='.repeat(60))
console.log('')

// Find all SVG files in public directory
const findSVGFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir)
  
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      findSVGFiles(filePath, fileList)
    } else if (file.endsWith('.svg')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

const convertSVGtoPNG = async (svgPath) => {
  try {
    const pngPath = svgPath.replace('.svg', '.png')
    const svgBuffer = fs.readFileSync(svgPath)
    
    await sharp(svgBuffer)
      .png()
      .toFile(pngPath)
    
    return { success: true, svgPath, pngPath }
  } catch (error) {
    return { success: false, svgPath, error: error.message }
  }
}

const main = async () => {
  const publicDir = path.join(__dirname, '..', 'public')
  const svgFiles = findSVGFiles(publicDir)
  
  console.log(`Found ${svgFiles.length} SVG files to convert`)
  console.log('')
  
  let successCount = 0
  let failCount = 0
  
  for (const svgFile of svgFiles) {
    const relativePath = svgFile.replace(publicDir + '/', '')
    const result = await convertSVGtoPNG(svgFile)
    
    if (result.success) {
      console.log(`✅ ${relativePath} -> ${relativePath.replace('.svg', '.png')}`)
      successCount++
    } else {
      console.log(`❌ ${relativePath} - Error: ${result.error}`)
      failCount++
    }
  }
  
  console.log('')
  console.log('='.repeat(60))
  console.log(`✅ Successfully converted: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${svgFiles.length}`)
  console.log('')
}

main().catch(console.error)

