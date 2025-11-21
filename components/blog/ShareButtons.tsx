'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export default function ShareButtons({ url, title, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-400 font-medium">Share:</span>
      
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-lg bg-dark-tertiary border border-dark-border hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 text-gray-400 hover:text-[#1DA1F2] transition-all duration-200 active:scale-95"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </button>

      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 rounded-lg bg-dark-tertiary border border-dark-border hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 text-gray-400 hover:text-[#0A66C2] transition-all duration-200 active:scale-95"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </button>

      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-lg bg-dark-tertiary border border-dark-border hover:border-[#1877F2] hover:bg-[#1877F2]/10 text-gray-400 hover:text-[#1877F2] transition-all duration-200 active:scale-95"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </button>

      <button
        onClick={handleCopyLink}
        className="p-2 rounded-lg bg-dark-tertiary border border-dark-border hover:border-white hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 active:scale-95"
        aria-label="Copy link"
      >
        {copied ? <Check size={18} className="text-green-400" /> : <Link2 size={18} />}
      </button>
    </div>
  )
}
