import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recordAudit } from '@/lib/audit'

export async function POST(req: Request) {
  const { userId, amount } = await req.json()
  const invoice = await prisma.invoice.create({ data: { userId, periodStart: new Date(), periodEnd: new Date(), lineItems: 'sandbox', total: amount, status: 'paid', paidAt: new Date() } })
  const payment = await prisma.payment.create({ data: { userId, invoiceId: invoice.id, amount, method: 'sandbox', status: 'succeeded', txnRef: 'test_txn' } })
  await recordAudit(userId, 'PAYMENT', 'Payment', { invoice, payment })
  return NextResponse.json({ invoice, payment })
}


