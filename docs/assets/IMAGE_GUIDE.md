# Image Setup Guide

This website requires images to be added in specific directories. Below is the complete list of required images.

## Required Images

### Profile & Personal
- `/public/images/Drefan.png` (160x160px or larger, square)
  - Your professional headshot
  - Will be displayed on homepage and blog posts
  - ✅ Already added!

### Blog Cover Images
Create these placeholder images or use your own:
- `/public/blog/big-data-gov.jpg` (1200x630px)
- `/public/blog/ai-social-analytics.jpg` (1200x630px)
- `/public/blog/cybersecurity-gov.jpg` (1200x630px)
- `/public/blog/default-cover.jpg` (1200x630px) - fallback image

### Project Cover Images
- `/public/projects/data-lake.jpg` (1200x630px)
- `/public/projects/sentiment-analysis.jpg` (1200x630px)
- `/public/projects/e-gov-portal.jpg` (1200x630px)
- `/public/projects/cybersecurity.jpg` (1200x630px)

### Social Media / OG Image
- `/public/images/og-image.jpg` (1200x630px)
  - Used for social media sharing

## Quick Setup with Placeholders

If you don't have images ready, you can use placeholder services:

### Option 1: Using placeholder.com

```bash
# Create directories
mkdir -p public/images public/blog public/projects

# Download placeholders (or create solid color images)
# Profile (already added: Drefan.png)
# curl "https://via.placeholder.com/160/0066ff/ffffff?text=Profile" -o public/images/profile.jpg

# Blog covers
curl "https://via.placeholder.com/1200x630/0066ff/ffffff?text=Big+Data" -o public/blog/big-data-gov.jpg
curl "https://via.placeholder.com/1200x630/00f5ff/000000?text=AI+Analytics" -o public/blog/ai-social-analytics.jpg
curl "https://via.placeholder.com/1200x630/0052cc/ffffff?text=Cyber+Security" -o public/blog/cybersecurity-gov.jpg
curl "https://via.placeholder.com/1200x630/666666/ffffff?text=Blog+Post" -o public/blog/default-cover.jpg

# Project covers
curl "https://via.placeholder.com/1200x630/0066ff/ffffff?text=Data+Lake" -o public/projects/data-lake.jpg
curl "https://via.placeholder.com/1200x630/00f5ff/000000?text=Sentiment+Analysis" -o public/projects/sentiment-analysis.jpg
curl "https://via.placeholder.com/1200x630/0052cc/ffffff?text=E-Gov+Portal" -o public/projects/e-gov-portal.jpg
curl "https://via.placeholder.com/1200x630/003399/ffffff?text=Cyber+Security" -o public/projects/cybersecurity.jpg

# OG Image
curl "https://via.placeholder.com/1200x630/0066ff/ffffff?text=Dref+Labs" -o public/images/og-image.jpg
```

### Option 2: Using Unsplash (Free stock photos)

Visit [Unsplash](https://unsplash.com) and search for relevant images:
- "data center" or "servers" for data lake project
- "artificial intelligence" for AI projects
- "security" or "cyber" for security projects
- "government building" for e-government projects
- "professional headshot" for profile photo

Download and place them in the appropriate directories.

### Option 3: Create Solid Color Images

You can use any image editor or online tool to create solid colored rectangles with text.

## Image Optimization Tips

1. **Format**: Use JPG for photos, PNG for graphics with transparency
2. **Size**:
   - Profile: 160x160px to 400x400px
   - Covers: 1200x630px (optimal for social sharing)
3. **Compression**: Use tools like TinyPNG or ImageOptim to reduce file sizes
4. **Alt Text**: Already included in the code for accessibility

## Updating Images

To update an image, simply replace the file in the appropriate directory. The build system will automatically optimize and serve the new image.

## Custom Images

If you want to use different images than the defaults:

1. Update the image paths in:
   - `content/blog/*.mdx` files (coverImage field)
   - `content/data/projects.json` (coverImage and images fields)

2. Place your images in `/public/` directory

3. Reference them with paths like `/your-folder/your-image.jpg`

## Next Steps

After adding images:
1. Run `npm run dev` to test locally
2. Check all pages to ensure images load correctly
3. Run `npm run build` to create production build
4. Deploy to your VPS

For questions about images, check the Next.js Image component documentation: https://nextjs.org/docs/app/api-reference/components/image
