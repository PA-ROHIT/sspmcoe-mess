import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { getServerSession } from &apos;next-auth&apos;
import { authOptions } from &apos;@/lib/auth&apos;
import { createBookingSchema } from &apos;@/lib/validation&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

export async function GET() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: &apos;desc&apos; } })
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
      status: &apos;booked&apos;
    }
  })
  await recordAudit((session?.user?.id as string) ?? (json.userId as string) ?? null, &apos;CREATE&apos;, &apos;Booking&apos;, { after: created })
  return NextResponse.json(created, { status: 201 })
}


