import Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import bcrypt from 'bcryptjs'

const dbPath = join(process.cwd(), 'data', 'dreflabs.db')
const dataDir = join(process.cwd(), 'data')

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables
console.log('Creating database tables...')

// Comments table
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved INTEGER DEFAULT 0
  )
`)

// Subscribers table
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    active INTEGER DEFAULT 1
  )
`)

// Contacts table
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service_interest TEXT,
    message TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0
  )
`)

// Page views table for analytics
db.exec(`
  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Admin users table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Admin sessions table (for refresh tokens)
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
  )
`)

// Admin activity logs table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
  )
`)

// Rate limiting table
db.exec(`
  CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    first_attempt_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_attempt_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    blocked_until DATETIME
  )
`)

// Blog posts table
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    tags TEXT,
    read_time INTEGER DEFAULT 5,
    status TEXT DEFAULT 'draft',
    author_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME,
    FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE CASCADE
  )
`)

// Projects table
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    technologies TEXT,
    image TEXT,
    link TEXT,
    github TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Media files table
db.exec(`
  CREATE TABLE IF NOT EXISTS media_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE CASCADE
  )
`)

// Site settings table
db.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'string',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Create indexes for better query performance
console.log('Creating indexes...')

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_slug);
  CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
  CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
  CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(viewed_at);
  CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(refresh_token);
  CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin ON admin_sessions(admin_id);
  CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);
  CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
  CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
  CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
  CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
  CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
`)

console.log('Database initialized successfully!')
console.log(`Database location: ${dbPath}`)

// Insert some sample data for testing (optional)
const sampleEmail = 'test@example.com'
const existingSubscriber = db.prepare('SELECT email FROM subscribers WHERE email = ?').get(sampleEmail)

if (!existingSubscriber) {
  console.log('Adding sample data...')

  // Sample subscriber
  db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(sampleEmail)

  console.log('Sample data added!')
}

// Create initial admin user if none exists
const existingAdmin = db.prepare('SELECT id FROM admin_users LIMIT 1').get()

if (!existingAdmin) {
  console.log('Creating initial admin user...')

  const initialUsername = process.env.INITIAL_ADMIN_USERNAME || 'admin'
  const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || 'changeme123'
  const initialEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@dreflabs.com'

  const passwordHash = bcrypt.hashSync(initialPassword, 10)

  db.prepare(`
    INSERT INTO admin_users (username, email, password_hash, role)
    VALUES (?, ?, ?, 'superadmin')
  `).run(initialUsername, initialEmail, passwordHash)

  console.log('Initial admin user created!')
  console.log(`Username: ${initialUsername}`)
  console.log(`Password: ${initialPassword}`)
  console.log('IMPORTANT: Please change the password after first login!')
}

// Create initial site settings if none exist
const existingSettings = db.prepare('SELECT id FROM site_settings LIMIT 1').get()

if (!existingSettings) {
  console.log('Creating initial site settings...')

  const defaultSettings = [
    { key: 'site_name', value: 'Drefan Madiawan', type: 'string' },
    { key: 'site_tagline', value: 'AI & Big Data Specialist | Political Strategist', type: 'string' },
    { key: 'site_description', value: 'Expert in Artificial Intelligence, Big Data Analytics, and Political Campaign Strategy', type: 'string' },
    { key: 'site_url', value: 'https://drefanmadiawan.com', type: 'string' },
    { key: 'contact_email', value: 'contact@drefanmadiawan.com', type: 'string' },
    { key: 'contact_phone', value: '+62 xxx xxxx xxxx', type: 'string' },
    { key: 'contact_location', value: 'Jakarta, Indonesia', type: 'string' },
    { key: 'social_twitter', value: 'https://twitter.com/drefanmadiawan', type: 'string' },
    { key: 'social_linkedin', value: 'https://linkedin.com/in/drefanmadiawan', type: 'string' },
    { key: 'social_github', value: 'https://github.com/drefanmadiawan', type: 'string' },
    { key: 'social_instagram', value: 'https://instagram.com/drefanmadiawan', type: 'string' },
    { key: 'seo_meta_title', value: 'Drefan Madiawan - AI & Big Data Specialist', type: 'string' },
    { key: 'seo_meta_description', value: 'Expert in Artificial Intelligence, Big Data Analytics, Cyber Security, and Political Campaign Strategy', type: 'string' },
    { key: 'seo_meta_keywords', value: 'AI, Big Data, Machine Learning, Political Strategy, Data Analytics', type: 'string' },
    { key: 'notifications_email', value: 'true', type: 'boolean' },
    { key: 'notifications_comments', value: 'true', type: 'boolean' },
    { key: 'notifications_newsletter', value: 'true', type: 'boolean' },
  ]

  const stmt = db.prepare(`
    INSERT INTO site_settings (setting_key, setting_value, setting_type)
    VALUES (?, ?, ?)
  `)

  for (const setting of defaultSettings) {
    stmt.run(setting.key, setting.value, setting.type)
  }

  console.log('Initial site settings created!')
}

db.close()
console.log('Database connection closed.')
