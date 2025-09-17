import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { getServerSession } from &apos;next-auth&apos;
import { authOptions, hasRole } from &apos;@/lib/auth&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

export async function GET() {
  const items = await prisma.inventoryItem.findMany({ orderBy: { name: &apos;asc&apos; } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, [&apos;MANAGER&apos;, &apos;ADMIN&apos;])) {
    return NextResponse.json({ error: &apos;Forbidden&apos; }, { status: 403 })
  }
  const json = await req.json()
  const created = await prisma.inventoryItem.create({ data: json })
  await recordAudit(session.user.id ?? null, &apos;CREATE&apos;, &apos;InventoryItem&apos;, { after: created })
  return NextResponse.json(created, { status: 201 })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, [&apos;MANAGER&apos;, &apos;ADMIN&apos;])) {
    return NextResponse.json({ error: &apos;Forbidden&apos; }, { status: 403 })
  }
  const json = await req.json() as { id: string, delta?: number, set?: number }
  const item = await prisma.inventoryItem.findUnique({ where: { id: json.id } })
  if (!item) return NextResponse.json({ error: &apos;Not found&apos; }, { status: 404 })
  const before = { ...item }
  const quantityOnHand = json.set !== undefined ? json.set : item.quantityOnHand + (json.delta ?? 0)
  const updated = await prisma.inventoryItem.update({ where: { id: json.id }, data: { quantityOnHand } })
  await recordAudit(session.user.id ?? null, &apos;UPDATE&apos;, &apos;InventoryItem&apos;, { before, after: updated })
  return NextResponse.json(updated)
}


