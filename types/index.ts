export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  date: string
  readTime: number
  category: string
  tags: string[]
  author: Author
}

export interface Author {
  name: string
  title: string
  image: string
  bio: string
}

export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  coverImage: string
  images: string[]
  category: string
  clientType: string
  duration: string
  role: string
  teamSize: number
  year: string
  technologies: Technology[]
  problem: string
  solution: string
  results: ProjectResult[]
  featured: boolean
}

export interface Technology {
  name: string
  icon?: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'analytics' | 'other'
}

export interface ProjectResult {
  metric: string
  value: string
  description: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  deliverables: string[]
  industries: string[]
  pricing: string
}

export interface Expertise {
  id: string
  title: string
  description: string
  icon: string
  skills: string[]
}

export interface Comment {
  id: number
  postSlug: string
  authorName: string
  authorEmail: string
  content: string
  createdAt: string
  approved: boolean
}

export interface Subscriber {
  id: number
  email: string
  subscribedAt: string
  active: boolean
}

export interface Contact {
  id: number
  name: string
  email: string
  company?: string
  serviceInterest?: string
  message: string
  submittedAt: string
  read: boolean
}

export interface PageView {
  id: number
  pagePath: string
  referrer?: string
  userAgent?: string
  viewedAt: string
}

export interface TimelineEvent {
  year: string
  title: string
  description: string
  icon?: string
  color?: string
}

export interface Statistic {
  label: string
  value: string
  suffix?: string
  description?: string
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  serviceInterest?: string
  message: string
}

export interface NewsletterFormData {
  email: string
}

export interface CommentFormData {
  postSlug: string
  authorName: string
  authorEmail: string
  content: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}
