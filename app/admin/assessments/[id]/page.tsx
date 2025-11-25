'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, Building2, DollarSign, Clock, ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Assessment {
  id: number
  name: string
  email: string
  phone: string
  company: string | null
  project_type: string
  budget: string
  timeline: string
  description: string
  status: string
  notes: string | null
  submitted_at: string
  read: number
  followed_up_at: string | null
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'yellow' },
  { value: 'in-progress', label: 'In Progress', color: 'purple' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
]

export default function AssessmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const fetchAssessment = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/assessments/${id}`)
      if (!response.ok) throw new Error('Failed to fetch assessment')

      const data = await response.json()
      setAssessment(data)
      setStatus(data.status)
      setNotes(data.notes || '')
    } catch (_err) {
      setError('Failed to load assessment')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAssessment()
  }, [fetchAssessment])

  const handleUpdate = async () => {
    setUpdating(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/assessments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      })

      if (!response.ok) throw new Error('Failed to update assessment')

      const updated = await response.json()
      setAssessment(updated)
      alert('Assessment updated successfully!')
    } catch (_err) {
      setError('Failed to update assessment')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/assessments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete assessment')

      router.push('/admin/assessments')
    } catch (_err) {
      setError('Failed to delete assessment')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    )
  }

  if (error && !assessment) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="p-0 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Link href="/admin/assessments">
              <Button>Back to Assessments</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessment) return null

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/assessments"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Assessments
            </Link>
            <h1 className="text-3xl font-heading font-bold text-white">
              Assessment #{assessment.id}
            </h1>
            <p className="text-gray-400">
              Submitted on {new Date(assessment.submitted_at).toLocaleString()}
            </p>
          </div>

          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
          >
            {deleting ? (
              <><Loader2 className="animate-spin" size={18} /> Deleting...</>
            ) : (
              <><Trash2 size={18} /> Delete</>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Client Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  👤 Client Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Full Name</div>
                    <div className="text-white font-medium">{assessment.name}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Mail size={14} /> Email
                      </div>
                      <a
                        href={`mailto:${assessment.email}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {assessment.email}
                      </a>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Phone size={14} /> Phone
                      </div>
                      <a
                        href={`tel:${assessment.phone}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {assessment.phone}
                      </a>
                    </div>
                  </div>

                  {assessment.company && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Building2 size={14} /> Company/Organization
                      </div>
                      <div className="text-white font-medium">{assessment.company}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  📋 Project Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Project Type</div>
                      <div className="text-white font-medium capitalize">
                        {assessment.project_type.replace(/-/g, ' ')}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <DollarSign size={14} /> Budget
                      </div>
                      <div className="text-white font-medium">{assessment.budget}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                        <Clock size={14} /> Timeline
                      </div>
                      <div className="text-white font-medium">{assessment.timeline}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Project Description</div>
                    <div className="bg-dark-tertiary p-4 rounded-lg text-gray-300 whitespace-pre-wrap">
                      {assessment.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Status & Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <h2 className="text-xl font-bold text-white mb-6">Status & Notes</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Internal Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                      placeholder="Add internal notes about this assessment..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="w-full"
                  >
                    {updating ? (
                      <><Loader2 className="animate-spin" size={18} /> Updating...</>
                    ) : (
                      <><Save size={18} /> Save Changes</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {assessment.followed_up_at && (
              <Card className="p-6 bg-green-500/10 border-green-500/30">
                <CardContent className="p-0">
                  <div className="text-sm text-green-400 mb-1">Followed Up</div>
                  <div className="text-white">
                    {new Date(assessment.followed_up_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
