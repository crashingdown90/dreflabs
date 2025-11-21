import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-white mx-auto mb-4" size={48} />
        <p className="text-gray-400 text-lg">Loading admin dashboard...</p>
      </div>
    </div>
  )
}
