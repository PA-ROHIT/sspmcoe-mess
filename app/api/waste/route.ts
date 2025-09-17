import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { getServerSession } from &apos;next-auth&apos;
import { authOptions, hasRole } from &apos;@/lib/auth&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

export async function GET() {
  const logs = await prisma.wasteLog.findMany({ orderBy: { date: &apos;desc&apos; } })
  return NextResponse.json(logs)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, [&apos;MANAGER&apos;, &apos;ADMIN&apos;])) {
    return NextResponse.json({ error: &apos;Forbidden&apos; }, { status: 403 })
  }
  const json = await req.json()
  const created = await prisma.wasteLog.create({ data: { ...json, date: new Date(json.date) } })
  await recordAudit(session.user.id ?? null, &apos;CREATE&apos;, &apos;WasteLog&apos;, { after: created })
  return NextResponse.json(created, { status: 201 })
}


