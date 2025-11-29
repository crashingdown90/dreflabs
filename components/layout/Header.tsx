'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { m, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Magnetic from '@/components/animations/Magnetic'
import RobotWolfLogo from '@/components/ui/RobotWolfLogo'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const portfolioRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

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
        setFocusedIndex(-1)
      }

      if (!openDropdown) return

      const currentRef = openDropdown === 'portfolio' ? portfolioRef : servicesRef
      const links = currentRef.current?.querySelectorAll('a')
      if (!links) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex((prev) => (prev < links.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0))
          break
        case 'Enter':
          if (focusedIndex >= 0 && focusedIndex < links.length) {
            event.preventDefault()
            links[focusedIndex].click()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openDropdown, focusedIndex])

  // Focus management for keyboard navigation
  useEffect(() => {
    if (openDropdown && focusedIndex >= 0) {
      const currentRef = openDropdown === 'portfolio' ? portfolioRef : servicesRef
      const links = currentRef.current?.querySelectorAll('a')
      if (links && links[focusedIndex]) {
        (links[focusedIndex] as HTMLElement).focus()
      }
    }
  }, [focusedIndex, openDropdown])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-dark-bg/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
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
            <Magnetic>
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Home
              </Link>
            </Magnetic>

            {/* About */}
            <Magnetic>
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                About
              </Link>
            </Magnetic>

            {/* Portfolio Dropdown */}
            <div
              className="relative"
              data-dropdown-container="portfolio"
              onMouseEnter={() => !isTouchDevice && setOpenDropdown('portfolio')}
              onMouseLeave={() => !isTouchDevice && setOpenDropdown(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'portfolio' ? null : 'portfolio')
                  setFocusedIndex(-1)
                }}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1"
                aria-expanded={openDropdown === 'portfolio'}
                aria-haspopup="true"
                aria-controls="portfolio-menu"
              >
                Portfolio
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    openDropdown === 'portfolio' && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openDropdown === 'portfolio' && (
                  <m.div
                    ref={portfolioRef}
                    id="portfolio-menu"
                    role="menu"
                    aria-orientation="vertical"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-56 glass-strong border border-white/10 rounded-lg shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    <Link
                      href="/projects"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      Tech Projects
                    </Link>
                    <Link
                      href="/web-portfolio"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      Web Development
                    </Link>
                    <Link
                      href="/opensource"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      Open Source
                    </Link>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              data-dropdown-container="services"
              onMouseEnter={() => !isTouchDevice && setOpenDropdown('services')}
              onMouseLeave={() => !isTouchDevice && setOpenDropdown(null)}
            >
              <Magnetic>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenDropdown(openDropdown === 'services' ? null : 'services')
                    setFocusedIndex(-1)
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1"
                  aria-expanded={openDropdown === 'services'}
                  aria-haspopup="true"
                  aria-controls="services-menu"
                >
                  Services
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-200",
                      openDropdown === 'services' && "rotate-180"
                    )}
                  />
                </button>
              </Magnetic>
              <AnimatePresence>
                {openDropdown === 'services' && (
                  <m.div
                    ref={servicesRef}
                    id="services-menu"
                    role="menu"
                    aria-orientation="vertical"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-56 bg-dark-secondary/95 backdrop-blur-xl border border-dark-border/50 rounded-lg shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    <Link
                      href="/services"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      All Services
                    </Link>
                    <div className="border-t border-dark-border/50 my-1"></div>
                    <Link
                      href="/services#web-development"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      Web Development
                    </Link>
                    <Link
                      href="/services#big-data"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      Big Data & AI
                    </Link>
                    <Link
                      href="/services#cyber-security"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      Cyber Security
                    </Link>
                    <Link
                      href="/services#e-government"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      E-Government
                    </Link>
                    <div className="border-t border-dark-border/50 my-1"></div>
                    <Link
                      href="/political-consulting"
                      role="menuitem"
                      onClick={() => {
                        setOpenDropdown(null)
                        setFocusedIndex(-1)
                      }}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-bg/50 transition-all duration-150 focus:outline-none focus:bg-dark-bg/50 focus:text-white"
                    >
                      Political Consulting
                    </Link>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Blog */}
            <Magnetic>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Blog
              </Link>
            </Magnetic>

            {/* Contact */}
            <Magnetic>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Contact
              </Link>
            </Magnetic>
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
                <div className="border-t border-dark-border/30 my-2 mx-4"></div>
                <Link
                  href="/services#web-development"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  Web Development
                </Link>
                <Link
                  href="/services#big-data"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  Big Data & AI
                </Link>
                <Link
                  href="/services#cyber-security"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  Cyber Security
                </Link>
                <Link
                  href="/services#e-government"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-dark-secondary block"
                >
                  E-Government
                </Link>
                <div className="border-t border-dark-border/30 my-2 mx-4"></div>
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
