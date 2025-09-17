import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions, hasRole } from '@/lib/auth'
import { createInvoiceSchema } from '@/lib/validation'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  const invoices = await prisma.invoice.findMany({ orderBy: { periodStart: 'desc' } })
  return NextResponse.json(invoices)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, ['MANAGER', 'ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const json = await req.json()
  const parsed = createInvoiceSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const created = await prisma.invoice.create({
    data: {
      userId: parsed.data.userId,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      lineItems: parsed.data.lineItems,
      total: parsed.data.total,
      status: parsed.data.status,
      paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : null
    }
  })
  await recordAudit(session.user.id ?? null, 'CREATE', 'Invoice', { after: created })
  return NextResponse.json(created, { status: 201 })
}


