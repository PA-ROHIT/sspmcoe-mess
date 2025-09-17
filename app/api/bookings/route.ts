import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createBookingSchema } from '@/lib/validation'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(bookings)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const json = await req.json()
  const parsed = createBookingSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const created = await prisma.booking.create({
    data: {
      userId: (session?.user?.id as string) || (json.userId as string),
      messId: parsed.data.messId,
      menuItemId: parsed.data.menuItemId,
      date: new Date(parsed.data.date),
      timeSlot: parsed.data.timeSlot,
      portionSize: parsed.data.portionSize,
      status: 'booked'
    }
  })
  await recordAudit((session?.user?.id as string) ?? (json.userId as string) ?? null, 'CREATE', 'Booking', { after: created })
  return NextResponse.json(created, { status: 201 })
}


