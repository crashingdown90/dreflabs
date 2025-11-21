/**
 * Site Configuration
 * Centralized configuration for site-wide settings
 * Uses environment variables with sensible defaults
 */

export interface SiteConfig {
  // General Information
  siteName: string
  siteTagline: string
  siteDescription: string
  siteUrl: string

  // Contact Information
  email: string
  phone: string
  location: string

  // Social Media
  twitter: string
  linkedin: string
  github: string
  instagram: string

  // SEO
  metaTitle: string
  metaDescription: string
  metaKeywords: string

  // Analytics
  googleAnalyticsId?: string
  facebookPixelId?: string
}

/**
 * Get site configuration from environment variables
 * @returns Site configuration object
 */
export function getSiteConfig(): SiteConfig {
  return {
    // General Information
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Drefan Madiawan',
    siteTagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'AI & Big Data Specialist | Political Strategist',
    siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Expert in Artificial Intelligence, Big Data Analytics, and Political Campaign Strategy',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://drefanmadiawan.com',

    // Contact Information
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@drefanmadiawan.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
    location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || 'Jakarta, Indonesia',

    // Social Media
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/drefanmadiawan',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/drefanmadiawan',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/drefanmadiawan',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/drefanmadiawan',

    // SEO
    metaTitle: process.env.NEXT_PUBLIC_META_TITLE || 'Drefan Madiawan - AI & Big Data Specialist',
    metaDescription: process.env.NEXT_PUBLIC_META_DESCRIPTION || 'Expert in Artificial Intelligence, Big Data Analytics, Cyber Security, and Political Campaign Strategy',
    metaKeywords: process.env.NEXT_PUBLIC_META_KEYWORDS || 'AI, Big Data, Machine Learning, Political Strategy, Data Analytics',

    // Analytics
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  }
}

/**
 * Client-safe site config (only public values)
 * Use this in client components
 */
export const siteConfig = getSiteConfig()
