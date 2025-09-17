import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { getServerSession } from &apos;next-auth&apos;
import { authOptions, hasRole } from &apos;@/lib/auth&apos;
import { createInvoiceSchema } from &apos;@/lib/validation&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

export async function GET() {
  const invoices = await prisma.invoice.findMany({ orderBy: { periodStart: &apos;desc&apos; } })
  return NextResponse.json(invoices)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, [&apos;MANAGER&apos;, &apos;ADMIN&apos;])) {
    return NextResponse.json({ error: &apos;Forbidden&apos; }, { status: 403 })
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
  await recordAudit(session.user.id ?? null, &apos;CREATE&apos;, &apos;Invoice&apos;, { after: created })
  return NextResponse.json(created, { status: 201 })
}


