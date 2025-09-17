import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions, hasRole } from '@/lib/auth'
import { createMenuItemSchema } from '@/lib/validation'
import { recordAudit } from '@/lib/audit'

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const menuItems = await prisma.menuItem.findMany({
      where: {
        AND: [
          {
            OR: [
              { effectiveTo: null },
              { effectiveTo: { gte: today } }
            ]
          },
          { effectiveFrom: { lte: sevenDaysFromNow } }
        ]
      },
      orderBy: { effectiveFrom: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        effectiveFrom: true,
        effectiveTo: true,
        price: true,
        ingredients: true,
        portionSizes: true,
        dietTags: true,
        category: true
      }
    });

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({ message: 'No active menu items found' }, { status: 404 });
    }

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, ['MANAGER', 'ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const json = await req.json()
  const parsed = createMenuItemSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const created = await prisma.menuItem.create({ data: parsed.data })
  await recordAudit(session.user.id ?? null, 'CREATE', 'MenuItem', { after: created })
  return NextResponse.json(created, { status: 201 })
}


