import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;
import { getServerSession } from &apos;next-auth&apos;
import { authOptions, hasRole } from &apos;@/lib/auth&apos;
import { createMenuItemSchema } from &apos;@/lib/validation&apos;
import { recordAudit } from &apos;@/lib/audit&apos;

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
      orderBy: { effectiveFrom: &apos;asc&apos; },
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
      return NextResponse.json({ message: &apos;No active menu items found&apos; }, { status: 404 });
    }

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error(&apos;Error fetching menu items:&apos;, error);
    return NextResponse.json(
      { error: &apos;Failed to fetch menu items&apos; },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !hasRole(session.user.role, [&apos;MANAGER&apos;, &apos;ADMIN&apos;])) {
    return NextResponse.json({ error: &apos;Forbidden&apos; }, { status: 403 })
  }
  const json = await req.json()
  const parsed = createMenuItemSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const created = await prisma.menuItem.create({ data: parsed.data })
  await recordAudit(session.user.id ?? null, &apos;CREATE&apos;, &apos;MenuItem&apos;, { after: created })
  return NextResponse.json(created, { status: 201 })
}


