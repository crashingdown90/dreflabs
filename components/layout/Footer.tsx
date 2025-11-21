import Link from 'next/link'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import RobotWolfLogo from '@/components/ui/RobotWolfLogo'
import NewsletterForm from '@/components/forms/NewsletterForm'

const footerLinks = {
  Navigation: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
  ],
  Categories: [
    { href: '/blog?category=big-data', label: 'Big Data' },
    { href: '/blog?category=ai', label: 'Artificial Intelligence' },
    { href: '/blog?category=cyber-security', label: 'Cyber Security' },
    { href: '/blog?category=e-government', label: 'E-Government' },
  ],
  Connect: [
    { href: '/contact', label: 'Contact' },
    { href: '#newsletter', label: 'Newsletter' },
  ],
}

const socialLinks = [
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'mailto:contact@dreflabs.com', icon: Mail, label: 'Email' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-dark-border bg-dark-secondary/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <RobotWolfLogo />
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Transforming Data into Insights, Building Digital Government Solutions.
              17+ years of expertise in Big Data, AI, and E-Government.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white active:scale-90 transition-all duration-200 p-2"
                    aria-label={link.label}
                  >
                    <Icon size={24} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white active:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-12 border-t border-dark-border" id="newsletter">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              Subscribe to Newsletter
            </h3>
            <p className="text-gray-400">
              Get the latest insights on Big Data, AI, Cyber Security, and E-Government delivered to your inbox
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="inline" />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Dref Labs. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white active:text-accent-cyan transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white active:text-accent-cyan transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
