import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

export async function POST(req: Request) {
  const { userId, amount } = await req.json()
  const invoice = await prisma.invoice.create({ data: { userId, periodStart: new Date(), periodEnd: new Date(), lineItems: &apos;sandbox&apos;, total: amount, status: &apos;paid&apos;, paidAt: new Date() } })
  const payment = await prisma.payment.create({ data: { userId, invoiceId: invoice.id, amount, method: &apos;sandbox&apos;, status: &apos;succeeded&apos;, txnRef: &apos;test_txn&apos; } })
  await recordAudit(userId, &apos;PAYMENT&apos;, &apos;Payment&apos;, { invoice, payment })
  return NextResponse.json({ invoice, payment })
}


