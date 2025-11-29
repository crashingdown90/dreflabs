'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { Upload, Trash2, Copy, ExternalLink, Search, Grid, List, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_url: string
  file_size: number
  mime_type: string
  created_at: string
  width?: number
  height?: number
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch media files from API
  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/media', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.files) {
          setFiles(data.data.files)
        }
      }
    } catch (error) {
      console.error('Error fetching media files:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)

    try {
      // Upload files one by one
      for (const file of Array.from(selectedFiles)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Upload failed')
        }
      }

      // Refresh file list
      await fetchFiles()
      alert(`${selectedFiles.length} file(s) uploaded successfully!`)
    } catch (error) {
      console.error('Error uploading files:', error)
      alert(error instanceof Error ? error.message : 'Error uploading files. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    setDeleting(id)

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Delete failed')
      }

      // Remove from local state
      setFiles(files.filter(f => f.id !== id))
      alert('File deleted successfully!')
    } catch (error) {
      console.error('Error deleting file:', error)
      alert(error instanceof Error ? error.message : 'Error deleting file. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const copyToClipboard = (url: string) => {
    const fullUrl = window.location.origin + url
    navigator.clipboard.writeText(fullUrl)
    alert('URL copied to clipboard!')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file =>
    file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="text-white animate-spin" size={48} />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Media Library</h2>
          <p className="text-gray-400">Upload and manage your images and files</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 size={20} className="mr-2 animate-spin" />
            ) : (
              <Upload size={20} className="mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Files</p>
          <p className="text-white text-3xl font-bold">{files.length}</p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Images</p>
          <p className="text-white text-3xl font-bold">
            {files.filter(f => f.mime_type.startsWith('image/')).length}
          </p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Size</p>
          <p className="text-white text-3xl font-bold">
            {formatFileSize(files.reduce((acc, f) => acc + f.file_size, 0))}
          </p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-white text-3xl font-bold">
            {files.filter(f => {
              const uploadDate = new Date(f.created_at)
              const now = new Date()
              return uploadDate.getMonth() === now.getMonth() && uploadDate.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-dark-bg border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-16 bg-dark-secondary/50 border border-dark-border rounded-xl">
          <ImageIcon className="mx-auto mb-4 text-gray-500" size={64} />
          <p className="text-gray-400 mb-4">
            {searchQuery ? 'No files found matching your search' : 'No files uploaded yet'}
          </p>
          {!searchQuery && (
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload size={20} className="mr-2" />
              Upload Your First File
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-dark-secondary/50 border border-dark-border rounded-xl overflow-hidden hover:border-white/30 transition-all duration-200 group"
            >
              {/* Image Preview */}
              <div className="aspect-square bg-dark-bg overflow-hidden relative">
                {file.mime_type.startsWith('image/') ? (
                  <Image
                    src={file.file_url}
                    alt={file.original_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-gray-500" size={48} />
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(file.file_url)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Copy URL"
                  >
                    <Copy size={20} />
                  </button>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleting === file.id}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === file.id ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate mb-1" title={file.original_name}>
                  {file.original_name}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatFileSize(file.file_size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-dark-secondary/50 border border-dark-border rounded-xl p-4 hover:border-white/30 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0 relative">
                  {file.mime_type.startsWith('image/') ? (
                    <Image
                      src={file.file_url}
                      alt={file.original_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-gray-500" size={24} />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.original_name}</p>
                  <p className="text-gray-400 text-sm">
                    {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(file.file_url)}
                  >
                    <Copy size={16} className="mr-2" />
                    Copy URL
                  </Button>
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink size={16} />
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    disabled={deleting === file.id}
                    className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                  >
                    {deleting === file.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
