import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { verifyAuth } from '@/lib/auth'
import { getAllPosts } from '@/lib/mdx'
import { getSubscriberStats } from '@/lib/newsletter-db'
import { getMediaFileCount } from '@/lib/media-db'

// Import content data
import projectsData from '@/content/data/projects.json'
import webPortfolioData from '@/content/data/web-portfolio.json'
import repositoriesData from '@/content/data/repositories.json'
import politicalConsultingData from '@/content/data/political-consulting.json'

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const payload = await verifyAuth(authHeader, request)

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get blog posts count from MDX files
    const blogPosts = getAllPosts()

    // Get newsletter stats
    let newsletterStats = { total: 0, today: 0, thisWeek: 0, thisMonth: 0 }
    try {
      newsletterStats = getSubscriberStats()
    } catch (error) {
      log.warn('Could not fetch newsletter stats:', error)
    }

    // Get media count
    let mediaCount = 0
    try {
      mediaCount = getMediaFileCount()
    } catch (error) {
      log.warn('Could not fetch media count:', error)
    }

    // Get counts from JSON data files
    const stats = {
      blogPosts: blogPosts.length,
      techProjects: Array.isArray(projectsData) ? projectsData.length : 0,
      webPortfolio: Array.isArray(webPortfolioData) ? webPortfolioData.length : 0,
      openSource: Array.isArray(repositoriesData) ? repositoriesData.length : 0,
      politicalConsulting: Array.isArray(politicalConsultingData)
        ? politicalConsultingData.length
        : (politicalConsultingData as { services?: unknown[] })?.services?.length || 0,
      comments: 0, // Comments are stored per blog post
      messages: 0, // Contact messages - would need contacts table
      newsletter: newsletterStats.total,
      media: mediaCount,
    }

    return NextResponse.json({
      success: true,
      data: {
        stats,
        newsletter: newsletterStats,
      },
    })
  } catch (error) {
    log.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
