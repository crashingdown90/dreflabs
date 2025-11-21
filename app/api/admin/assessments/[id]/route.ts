import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getAssessmentById, updateAssessmentStatus, markAssessmentAsRead, deleteAssessment } from '@/lib/assessments-db'
import { logger } from '@/lib/logger'

// GET /api/admin/assessments/[id] - Get assessment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const auth = await verifyAuth(authHeader, request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const assessment = getAssessmentById(id)
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Mark as read
    markAssessmentAsRead(id)

    return NextResponse.json(assessment)
  } catch (error) {
    logger.error('Error fetching assessment', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/assessments/[id] - Update assessment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const auth = await verifyAuth(authHeader, request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status, notes } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const validStatuses = ['new', 'contacted', 'in-progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const success = updateAssessmentStatus(id, status, notes)
    if (!success) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const updatedAssessment = getAssessmentById(id)
    return NextResponse.json(updatedAssessment)
  } catch (error) {
    logger.error('Error updating assessment', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/assessments/[id] - Delete assessment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const auth = await verifyAuth(authHeader, request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const success = deleteAssessment(id)
    if (!success) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Assessment deleted' })
  } catch (error) {
    logger.error('Error deleting assessment', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
