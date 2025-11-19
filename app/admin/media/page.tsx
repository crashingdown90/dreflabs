'use client'

import { useState, useRef } from 'react'
import { log } from '@/lib/logger'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { Upload, Trash2, Copy, ExternalLink, Search, Grid, List, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)

    try {
      // TODO: Implement file upload API
      const newFiles: MediaFile[] = Array.from(selectedFiles).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }))

      setFiles([...newFiles, ...files])
      alert(`${selectedFiles.length} file(s) uploaded successfully!`)
    } catch (error) {
      log.error('Error uploading files:', error)
      alert('Error uploading files. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      // TODO: Implement delete API
      setFiles(files.filter(f => f.id !== id))
      alert('File deleted successfully!')
    } catch (error) {
      log.error('Error deleting file:', error)
      alert('Error deleting file. Please try again.')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
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
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload size={20} className="mr-2" />
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
            {files.filter(f => f.type.startsWith('image/')).length}
          </p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Size</p>
          <p className="text-white text-3xl font-bold">
            {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
          </p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-white text-3xl font-bold">
            {files.filter(f => {
              const uploadDate = new Date(f.uploadedAt)
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
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-gray-500" size={48} />
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Copy URL"
                  >
                    <Copy size={20} />
                  </button>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate mb-1" title={file.name}>
                  {file.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatFileSize(file.size)}
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
                <div className="w-16 h-16 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-gray-500" size={24} />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(file.url)}
                  >
                    <Copy size={16} className="mr-2" />
                    Copy URL
                  </Button>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink size={16} />
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                  >
                    <Trash2 size={16} />
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

