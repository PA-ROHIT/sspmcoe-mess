import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAttendanceSchema } from '@/lib/validation'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  const rows = await prisma.attendance.findMany({ orderBy: { checkInTime: 'desc' }, include: { booking: true } })
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const json = await req.json()
  const parsed = createAttendanceSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const created = await prisma.attendance.create({ data: parsed.data })
  await recordAudit(session.user.id, 'CREATE', 'Attendance', { after: created })
  return NextResponse.json(created, { status: 201 })
}


