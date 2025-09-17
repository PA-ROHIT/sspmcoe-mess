import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions, hasRole } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, ['MANAGER', 'ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const json = await req.json()
  const created = await prisma.inventoryItem.create({ data: json })
  await recordAudit(session.user.id ?? null, 'CREATE', 'InventoryItem', { after: created })
  return NextResponse.json(created, { status: 201 })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, ['MANAGER', 'ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const json = await req.json() as { id: string, delta?: number, set?: number }
  const item = await prisma.inventoryItem.findUnique({ where: { id: json.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const before = { ...item }
  const quantityOnHand = json.set !== undefined ? json.set : item.quantityOnHand + (json.delta ?? 0)
  const updated = await prisma.inventoryItem.update({ where: { id: json.id }, data: { quantityOnHand } })
  await recordAudit(session.user.id ?? null, 'UPDATE', 'InventoryItem', { before, after: updated })
  return NextResponse.json(updated)
}


