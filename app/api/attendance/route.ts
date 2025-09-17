import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { getServerSession } from &apos;next-auth&apos;
import { authOptions } from &apos;@/lib/auth&apos;
import { createAttendanceSchema } from &apos;@/lib/validation&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

export async function GET() {
  const rows = await prisma.attendance.findMany({ orderBy: { checkInTime: &apos;desc&apos; }, include: { booking: true } })
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: &apos;Unauthorized&apos; }, { status: 401 })
  const json = await req.json()
  const parsed = createAttendanceSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const created = await prisma.attendance.create({ data: parsed.data })
  await recordAudit(session.user.id, &apos;CREATE&apos;, &apos;Attendance&apos;, { after: created })
  return NextResponse.json(created, { status: 201 })
}


