'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import RobotWolfLogo from '@/components/ui/RobotWolfLogo'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if the click is outside dropdown containers
      if (!target.closest('[data-dropdown-container]')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <RobotWolfLogo />
          </Link>

          {/* Desktop Navigation - Organized by Categories */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Home */}
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Home
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              About
            </Link>

            {/* Portfolio Dropdown */}
            <div
              className="relative"
              data-dropdown-container="portfolio"
              onMouseEnter={() => setOpenDropdown('portfolio')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'portfolio' ? null : 'portfolio')
                }}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1"
                aria-expanded={openDropdown === 'portfolio'}
                aria-haspopup="true"
              >
                Portfolio
                <ChevronDown size={16} className={cn("transition-transform", openDropdown === 'portfolio' && "rotate-180")} />
              </button>
              {openDropdown === 'portfolio' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-dark-secondary border border-dark-border rounded-lg shadow-xl py-2 z-50">
                  <Link
                    href="/projects"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-bg transition-colors"
                  >
                    Tech Projects
                  </Link>
                  <Link
                    href="/web-portfolio"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-bg transition-colors"
                  >
                    Web Development
                  </Link>
                  <Link
                    href="/opensource"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-bg transition-colors"
                  >
                    Open Source
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              data-dropdown-container="services"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'services' ? null : 'services')
                }}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1"
                aria-expanded={openDropdown === 'services'}
                aria-haspopup="true"
              >
                Services
                <ChevronDown size={16} className={cn("transition-transform", openDropdown === 'services' && "rotate-180")} />
              </button>
              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-dark-secondary border border-dark-border rounded-lg shadow-xl py-2 z-50">
                  <Link
                    href="/services"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-bg transition-colors"
                  >
                    All Services
                  </Link>
                  <Link
                    href="/political-consulting"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-bg transition-colors"
                  >
                    Political Consulting
                  </Link>
                </div>
              )}
            </div>

            {/* Blog */}
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Blog
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-3 active:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation - Organized by Categories */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-border">
            <div className="flex flex-col space-y-1">
              {/* Main Links */}
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-dark-secondary"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-dark-secondary"
              >
                About
              </Link>

              {/* Portfolio Section */}
              <div className="pt-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Portfolio
                </div>
                <Link
                  href="/projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  Tech Projects
                </Link>
                <Link
                  href="/web-portfolio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  Web Development
                </Link>
                <Link
                  href="/opensource"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  Open Source
                </Link>
              </div>

              {/* Services Section */}
              <div className="pt-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Services
                </div>
                <Link
                  href="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  All Services
                </Link>
                <Link
                  href="/political-consulting"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  Political Consulting
                </Link>
              </div>

              {/* Content & Contact */}
              <div className="pt-2">
                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-dark-secondary block"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-dark-secondary block"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
