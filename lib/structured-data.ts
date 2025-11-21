/**
 * Structured data (JSON-LD) utilities for SEO
 * @see https://schema.org/
 */

export interface PersonData {
  name: string
  jobTitle: string
  url: string
  image?: string
  email?: string
  sameAs?: string[]
  description?: string
}

export interface ArticleData {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: PersonData
  url: string
  tags?: string[]
}

export interface OrganizationData {
  name: string
  url: string
  logo?: string
  description?: string
  email?: string
  sameAs?: string[]
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Generate Person schema
 */
export function generatePersonSchema(data: PersonData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    url: data.url,
    ...(data.image && { image: data.image }),
    ...(data.email && { email: data.email }),
    ...(data.description && { description: data.description }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  }
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.email && { email: data.email }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  }
}

/**
 * Generate Article schema (for blog posts)
 */
export function generateArticleSchema(data: ArticleData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dref Labs',
      url: 'https://dreflabs.com',
    },
    url: data.url,
    ...(data.tags && data.tags.length > 0 && { keywords: data.tags.join(', ') }),
  }
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema(url: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
