import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createAssessment } from '@/lib/assessments-db'
import { sendEmail, isEmailConfigured } from '@/lib/email'

interface AssessmentData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  description: string
}

// Project type display names
const projectTypeNames: Record<string, string> = {
  'company-profile': 'Company Profile',
  'e-commerce': 'E-Commerce',
  'web-app': 'Web Application',
  'portfolio': 'Portfolio Website',
  'landing-page': 'Landing Page',
  'blog-cms': 'Blog/CMS',
  'custom': 'Custom Project',
}

export async function POST(request: NextRequest) {
  try {
    const data: AssessmentData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.projectType || !data.budget || !data.timeline || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save to database
    const assessment = createAssessment({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      project_type: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
      description: data.description,
    })

    logger.info('Web Assessment Form Submitted', {
      id: assessment.id,
      name: data.name,
      email: data.email,
      projectType: data.projectType,
    })

    // Send email notifications if email is configured
    if (isEmailConfigured()) {
      // Send notification to admin
      await sendAdminNotification(data, assessment.id)

      // Send auto-reply to customer
      await sendCustomerAutoReply(data)
    } else {
      logger.warn('Email not configured, skipping email notifications')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Assessment form submitted successfully',
        id: assessment.id,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Error processing assessment form', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Send email notification to admin
 */
async function sendAdminNotification(data: AssessmentData, assessmentId: number) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dreflabs.com'
    const projectTypeName = projectTypeNames[data.projectType] || data.projectType

    await sendEmail({
      to: adminEmail,
      subject: `🆕 New Web Development Assessment - ${data.name}`,
      text: `New web development assessment submission from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .field-value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🆕 New Web Development Assessment</h1>
              <p>A new client has submitted a web development assessment form</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Assessment ID:</div>
                <div class="field-value">#${assessmentId}</div>
              </div>

              <div class="field">
                <div class="field-label">Full Name:</div>
                <div class="field-value">${data.name}</div>
              </div>

              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>

              <div class="field">
                <div class="field-label">Phone:</div>
                <div class="field-value"><a href="tel:${data.phone}">${data.phone}</a></div>
              </div>

              ${data.company ? `
              <div class="field">
                <div class="field-label">Company:</div>
                <div class="field-value">${data.company}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="field-label">Project Type:</div>
                <div class="field-value">${projectTypeName}</div>
              </div>

              <div class="field">
                <div class="field-label">Budget:</div>
                <div class="field-value">${data.budget}</div>
              </div>

              <div class="field">
                <div class="field-label">Timeline:</div>
                <div class="field-value">${data.timeline}</div>
              </div>

              <div class="field">
                <div class="field-label">Project Description:</div>
                <div class="field-value">${data.description.replace(/\n/g, '<br>')}</div>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/assessments/${assessmentId}" class="button">
                  View in Admin Dashboard
                </a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Dref Labs</p>
              <p>Please respond to the client within 1-2 business days</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    logger.info('Admin notification email sent', { assessmentId })
  } catch (error) {
    logger.error('Failed to send admin notification email', error)
    // Don't throw error - we don't want to fail the API request if email fails
  }
}

/**
 * Send auto-reply email to customer
 */
async function sendCustomerAutoReply(data: AssessmentData) {
  try {
    const projectTypeName = projectTypeNames[data.projectType] || data.projectType

    await sendEmail({
      to: data.email,
      subject: '✅ Assessment Received - Dref Labs',
      text: `Hi ${data.name}, Thank you for your interest in our web development services. We have received your assessment form and will contact you soon.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .summary { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea; }
            .summary h3 { margin-top: 0; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .highlight { color: #667eea; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Assessment Received!</h1>
              <p>Thank you for choosing Dref Labs</p>
            </div>
            <div class="content">
              <p>Hi <strong>${data.name}</strong>,</p>

              <p>Thank you for your interest in our professional web development services. We have successfully received your assessment form.</p>

              <div class="summary">
                <h3>📋 Your Submission Summary:</h3>
                <p><strong>Project Type:</strong> ${projectTypeName}</p>
                <p><strong>Budget Range:</strong> ${data.budget}</p>
                <p><strong>Timeline:</strong> ${data.timeline}</p>
                ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
              </div>

              <h3>What Happens Next?</h3>
              <ol>
                <li><span class="highlight">Review:</span> Our team will carefully review your requirements</li>
                <li><span class="highlight">Analysis:</span> We'll prepare a detailed proposal and cost estimate</li>
                <li><span class="highlight">Contact:</span> We'll reach out to you within <strong>1-2 business days</strong></li>
                <li><span class="highlight">Discussion:</span> We'll schedule a call to discuss your project in detail</li>
              </ol>

              <p>If you have any urgent questions, feel free to reply to this email or contact us at:</p>
              <ul>
                <li>📧 Email: ${process.env.CONTACT_EMAIL || 'contact@dreflabs.com'}</li>
                <li>📱 Phone: ${process.env.CONTACT_PHONE || '+62 xxx xxxx xxxx'}</li>
              </ul>

              <p>We're excited to work with you on your project!</p>

              <p>Best regards,<br><strong>Dref Labs Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Dref Labs. All rights reserved.</p>
              <p>Professional Web Development Services</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    logger.info('Customer auto-reply email sent', { email: data.email })
  } catch (error) {
    logger.error('Failed to send customer auto-reply email', error)
    // Don't throw error - we don't want to fail the API request if email fails
  }
}

// Optionally, you can add a helper function to send email notifications
/*
async function sendEmailNotification(data: AssessmentData) {
  // Implementation depends on your email service (nodemailer, sendgrid, etc.)
  // Example with nodemailer:
  const transporter = nodemailer.createTransport({
    // your email config
  })

  await transporter.sendMail({
    from: 'noreply@dreflabs.com',
    to: 'admin@dreflabs.com',
    subject: `New Web Development Assessment - ${data.name}`,
    html: `
      <h2>New Web Development Assessment Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
      <p><strong>Project Type:</strong> ${data.projectType}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Timeline:</strong> ${data.timeline}</p>
      <p><strong>Description:</strong></p>
      <p>${data.description}</p>
    `,
  })
}
*/
