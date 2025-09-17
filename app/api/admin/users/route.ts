import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { getServerSession } from &apos;next-auth&apos;
import { authOptions, hasRole } from &apos;@/lib/auth&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: &apos;desc&apos; } })
  return NextResponse.json(users)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, [&apos;ADMIN&apos;])) {
    return NextResponse.json({ error: &apos;Forbidden&apos; }, { status: 403 })
  }
  const { id, role } = await req.json()
  const before = await prisma.user.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: &apos;Not found&apos; }, { status: 404 })
  const updated = await prisma.user.update({ where: { id }, data: { role } })
  await recordAudit(session.user.id ?? null, &apos;UPDATE&apos;, &apos;User&apos;, { before, after: updated })
  return NextResponse.json(updated)
}


