import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions, hasRole } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(users)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, ['ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id, role } = await req.json()
  const before = await prisma.user.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const updated = await prisma.user.update({ where: { id }, data: { role } })
  await recordAudit(session.user.id ?? null, 'UPDATE', 'User', { before, after: updated })
  return NextResponse.json(updated)
}


