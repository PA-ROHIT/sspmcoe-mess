import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions, hasRole } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  const logs = await prisma.wasteLog.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(logs)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, ['MANAGER', 'ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const json = await req.json()
  const created = await prisma.wasteLog.create({ data: { ...json, date: new Date(json.date) } })
  await recordAudit(session.user.id ?? null, 'CREATE', 'WasteLog', { after: created })
  return NextResponse.json(created, { status: 201 })
}


