import nodemailer from 'nodemailer'
import { log } from '@/lib/logger'
import type { Transporter } from 'nodemailer'

/**
 * Escape HTML special characters to prevent XSS in email templates
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char)
}

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

let transporter: Transporter | null = null
let emailConfigured = false
let configurationError: string | null = null

/**
 * Initialize and validate email configuration
 */
function initializeEmailTransporter(): Transporter {
  if (transporter) {
    return transporter
  }

  try {
    // Validate required environment variables
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpHost || !smtpUser || !smtpPass) {
      configurationError = 'Email not configured: Missing SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS)'
      log.warn('⚠️', configurationError)
      emailConfigured = false
      throw new Error(configurationError)
    }

    // Create transporter with SMTP settings
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Connection timeout
      connectionTimeout: 10000,
      // Socket timeout
      socketTimeout: 10000,
    })

    emailConfigured = true
    configurationError = null
    log.info('✅ Email transporter initialized successfully')

    return transporter
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to initialize email transporter'
    configurationError = errMessage
    emailConfigured = false
    log.error('❌ Email configuration error:', error)
    throw error
  }
}

/**
 * Check if email is configured
 */
export function isEmailConfigured(): boolean {
  if (emailConfigured) return true

  try {
    initializeEmailTransporter()
    return emailConfigured
  } catch {
    return false
  }
}

/**
 * Get email configuration status
 */
export function getEmailStatus(): { configured: boolean; error: string | null } {
  return {
    configured: emailConfigured,
    error: configurationError,
  }
}

/**
 * Send email with error handling
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      log.warn('⚠️ Email not configured, skipping email send:', options.subject)
      return false
    }

    const emailTransporter = initializeEmailTransporter()

    // Verify connection before sending (optional, can be slow)
    // await emailTransporter.verify()

    // Send email
    const info = await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    })

    log.info('✅ Email sent successfully:', info.messageId)
    return true
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error)
    log.error('❌ Error sending email:', errMessage)

    // Log specific error types
    const errorCode = (error as { code?: string })?.code
    if (errorCode === 'EAUTH') {
      log.error('Authentication failed. Please check SMTP credentials.')
    } else if (errorCode === 'ECONNECTION') {
      log.error('Connection failed. Please check SMTP host and port.')
    } else if (errorCode === 'ETIMEDOUT') {
      log.error('Connection timed out. Please check network connectivity.')
    }

    return false
  }
}

export async function sendContactNotification(
  name: string,
  email: string,
  message: string,
  company?: string,
  serviceInterest?: string
): Promise<boolean> {
  // Escape all user inputs for HTML safety
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message)
  const safeCompany = company ? escapeHtml(company) : ''
  const safeServiceInterest = serviceInterest ? escapeHtml(serviceInterest) : ''

  const subject = `New Contact Form Submission from ${safeName}`
  const text = `
    New contact form submission:

    Name: ${name}
    Email: ${email}
    ${company ? `Company: ${company}` : ''}
    ${serviceInterest ? `Service Interest: ${serviceInterest}` : ''}

    Message:
    ${message}
  `

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
    ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ''}
    ${safeServiceInterest ? `<p><strong>Service Interest:</strong> ${safeServiceInterest}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${safeMessage.replace(/\n/g, '<br>')}</p>
  `

  return sendEmail({
    to: process.env.CONTACT_EMAIL || 'contact@dreflabs.com',
    subject,
    text,
    html,
  })
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const subject = 'Welcome to Dref Labs Newsletter'
  const text = `
    Thank you for subscribing to Dref Labs newsletter!

    You'll receive updates about the latest articles on:
    - Big Data & Analytics
    - Artificial Intelligence & Machine Learning
    - Cyber Security
    - E-Government & Digital Transformation
    - Data Science & Visualization

    Best regards,
    Drefan Mardiawan
    Dref Labs
  `

  const html = `
    <h2>Welcome to Dref Labs Newsletter!</h2>
    <p>Thank you for subscribing to our newsletter.</p>
    <p>You'll receive updates about the latest articles on:</p>
    <ul>
      <li>Big Data & Analytics</li>
      <li>Artificial Intelligence & Machine Learning</li>
      <li>Cyber Security</li>
      <li>E-Government & Digital Transformation</li>
      <li>Data Science & Visualization</li>
    </ul>
    <p>Best regards,<br>
    Drefan Mardiawan<br>
    <strong>Dref Labs</strong></p>
  `

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  })
}
