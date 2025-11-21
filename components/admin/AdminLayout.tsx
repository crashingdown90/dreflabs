'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Folder,
  Code2,
  Users,
  MessageSquare,
  Mail,
  BarChart3,
  Settings,
  Image as ImageIcon,
  Menu,
  X,
  LogOut,
  Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'
import RobotWolfLogo from '@/components/ui/RobotWolfLogo'
import Button from '@/components/ui/Button'

interface AdminLayoutProps {
  children: ReactNode
}

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/admin',
    category: 'main'
  },
  { 
    icon: FileText, 
    label: 'Blog Posts', 
    href: '/admin/blog',
    category: 'content'
  },
  { 
    icon: Folder, 
    label: 'Tech Projects', 
    href: '/admin/projects',
    category: 'content'
  },
  { 
    icon: Code2, 
    label: 'Web Portfolio', 
    href: '/admin/web-portfolio',
    category: 'content'
  },
  { 
    icon: Code2, 
    label: 'Open Source', 
    href: '/admin/opensource',
    category: 'content'
  },
  { 
    icon: Briefcase, 
    label: 'Political Consulting', 
    href: '/admin/political-consulting',
    category: 'content'
  },
  { 
    icon: ImageIcon, 
    label: 'Media Library', 
    href: '/admin/media',
    category: 'content'
  },
  { 
    icon: MessageSquare, 
    label: 'Comments', 
    href: '/admin/comments',
    category: 'engagement'
  },
  { 
    icon: Mail, 
    label: 'Messages', 
    href: '/admin/messages',
    category: 'engagement'
  },
  { 
    icon: Users, 
    label: 'Newsletter', 
    href: '/admin/newsletter',
    category: 'engagement'
  },
  { 
    icon: BarChart3, 
    label: 'Analytics', 
    href: '/admin/analytics',
    category: 'insights'
  },
  { 
    icon: Settings, 
    label: 'Site Settings', 
    href: '/admin/settings',
    category: 'system'
  },
]

const categories = [
  { id: 'main', label: 'Main' },
  { id: 'content', label: 'Content Management' },
  { id: 'engagement', label: 'User Engagement' },
  { id: 'insights', label: 'Insights' },
  { id: 'system', label: 'System' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-secondary/80 backdrop-blur-lg border-b border-dark-border">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link href="/admin" className="flex items-center gap-3">
              <RobotWolfLogo size="sm" />
              <div className="hidden md:block">
                <h1 className="text-lg font-heading font-bold text-white">Admin Panel</h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              View Site
            </Link>
            
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              size="sm"
            >
              <LogOut size={16} className="mr-2" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-30 w-64 bg-dark-secondary border-r border-dark-border overflow-y-auto transition-transform duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="p-4 space-y-6">
          {categories.map((category) => {
            const categoryItems = menuItems.filter(item => item.category === category.id)
            
            return (
              <div key={category.id}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  {category.label}
                </h3>
                <div className="space-y-1">
                  {categoryItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                          isActive
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

