import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Mail, Phone, Building2, Calendar, DollarSign, Clock, Eye } from 'lucide-react'
import { getAllAssessments, getAssessmentStats } from '@/lib/assessments-db'
import Card, { CardContent } from '@/components/ui/Card'

export const metadata = {
  title: 'Web Assessments | Admin Dashboard',
  description: 'Manage web development assessment submissions',
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'in-progress': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default async function AssessmentsAdminPage() {
  // Auth is handled by middleware - just verify cookie exists as extra check
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')

  if (!accessToken) {
    redirect('/admin/login')
  }

  const assessments = getAllAssessments()
  const stats = getAssessmentStats()

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white mb-2">
                Web Development Assessments
              </h1>
              <p className="text-gray-400">
                Manage and track client assessment submissions
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-dark-secondary border border-dark-border rounded-lg text-gray-300 hover:text-white hover:border-white/30 transition-all"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <Card className="p-4 bg-dark-secondary">
            <CardContent className="p-0">
              <div className="text-gray-400 text-sm mb-1">Total</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-0">
              <div className="text-blue-400 text-sm mb-1">New</div>
              <div className="text-2xl font-bold text-blue-400">{stats.new}</div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-0">
              <div className="text-yellow-400 text-sm mb-1">Contacted</div>
              <div className="text-2xl font-bold text-yellow-400">{stats.contacted}</div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-0">
              <div className="text-purple-400 text-sm mb-1">In Progress</div>
              <div className="text-2xl font-bold text-purple-400">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-green-500/10 border-green-500/30">
            <CardContent className="p-0">
              <div className="text-green-400 text-sm mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-red-500/10 border-red-500/30">
            <CardContent className="p-0">
              <div className="text-red-400 text-sm mb-1">Cancelled</div>
              <div className="text-2xl font-bold text-red-400">{stats.cancelled}</div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-dark-secondary">
            <CardContent className="p-0">
              <div className="text-gray-400 text-sm mb-1">Unread</div>
              <div className="text-2xl font-bold text-white">{stats.unread}</div>
            </CardContent>
          </Card>
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          {assessments.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent className="p-0">
                <p className="text-gray-400 mb-2">No assessments yet</p>
                <p className="text-sm text-gray-500">
                  Assessment submissions will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            assessments.map((assessment) => (
              <Card
                key={assessment.id}
                hover
                className={`p-6 ${!assessment.read ? 'border-white/20' : ''}`}
              >
                <CardContent className="p-0">
                  <Link href={`/admin/assessments/${assessment.id}`}>
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">
                                {assessment.name}
                              </h3>
                              {!assessment.read && (
                                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                                  New
                                </span>
                              )}
                              <span
                                className={`text-xs px-3 py-1 rounded-full border ${
                                  statusColors[assessment.status]
                                }`}
                              >
                                {statusLabels[assessment.status]}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {assessment.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={14} />
                                {assessment.phone}
                              </span>
                              {assessment.company && (
                                <span className="flex items-center gap-1">
                                  <Building2 size={14} />
                                  {assessment.company}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-3 line-clamp-2">
                          {assessment.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                          <span className="text-xs px-3 py-1 bg-dark-tertiary text-gray-300 rounded-full">
                            {assessment.project_type}
                          </span>
                          <span className="text-xs px-3 py-1 bg-dark-tertiary text-gray-300 rounded-full flex items-center gap-1">
                            <DollarSign size={12} />
                            {assessment.budget}
                          </span>
                          <span className="text-xs px-3 py-1 bg-dark-tertiary text-gray-300 rounded-full flex items-center gap-1">
                            <Clock size={12} />
                            {assessment.timeline}
                          </span>
                        </div>
                      </div>

                      {/* Right: Metadata */}
                      <div className="lg:text-right flex flex-row lg:flex-col justify-between lg:justify-start gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Submitted</div>
                          <div className="text-sm text-gray-300 flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(assessment.submitted_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(assessment.submitted_at).toLocaleTimeString()}
                          </div>
                        </div>

                        <Link
                          href={`/admin/assessments/${assessment.id}`}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-dark-border hover:border-white/30 rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-2 h-fit"
                        >
                          <Eye size={16} />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
