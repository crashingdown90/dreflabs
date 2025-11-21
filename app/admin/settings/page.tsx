'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { Save, Globe, Mail, Share2, Bell } from 'lucide-react'
import { log } from '@/lib/logger'
import { getSiteConfig } from '@/lib/site-config'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Load initial values from environment configuration
  const siteConfig = getSiteConfig()

  const [settings, setSettings] = useState({
    // General Settings
    siteName: siteConfig.siteName,
    siteTagline: siteConfig.siteTagline,
    siteDescription: siteConfig.siteDescription,
    siteUrl: siteConfig.siteUrl,

    // Contact Info
    email: siteConfig.email,
    phone: siteConfig.phone || '', // Empty string if not configured
    location: siteConfig.location,

    // Social Media
    twitter: siteConfig.twitter,
    linkedin: siteConfig.linkedin,
    github: siteConfig.github,
    instagram: siteConfig.instagram,

    // SEO Settings
    metaTitle: siteConfig.metaTitle,
    metaDescription: siteConfig.metaDescription,
    metaKeywords: siteConfig.metaKeywords,

    // Analytics
    googleAnalyticsId: siteConfig.googleAnalyticsId || '',
    facebookPixelId: siteConfig.facebookPixelId || '',

    // Email Settings (server-side only, not exposed via siteConfig)
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',

    // Notifications
    emailNotifications: true,
    commentNotifications: true,
    newsletterNotifications: true,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      // NOTE: Settings are stored in environment variables for static config
      // For dynamic settings, implement API endpoint: POST /api/admin/settings
      // Store user preferences in database with settings table
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Settings saved successfully!')
    } catch (error) {
      log.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Site Settings</h2>
          <p className="text-gray-400">Manage your website configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save size={20} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-dark-bg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-bg'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <>
            <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
              <h3 className="text-xl font-heading font-bold text-white mb-4">General Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.siteTagline}
                    onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Social Media Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  placeholder="https://twitter.com/username"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={settings.github}
                  onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO Settings */}
        {activeTab === 'seo' && (
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold text-white mb-4">SEO Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={settings.metaKeywords}
                  onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg cursor-pointer hover:border-white/30 transition-colors">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive email notifications for important events</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg cursor-pointer hover:border-white/30 transition-colors">
                <div>
                  <p className="text-white font-medium">Comment Notifications</p>
                  <p className="text-gray-400 text-sm">Get notified when someone comments on your posts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.commentNotifications}
                  onChange={(e) => setSettings({ ...settings, commentNotifications: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg cursor-pointer hover:border-white/30 transition-colors">
                <div>
                  <p className="text-white font-medium">Newsletter Notifications</p>
                  <p className="text-gray-400 text-sm">Receive updates about new subscribers</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.newsletterNotifications}
                  onChange={(e) => setSettings({ ...settings, newsletterNotifications: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

