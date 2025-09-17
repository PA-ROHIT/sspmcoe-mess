import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const today = new Date(); today.setHours(0,0,0,0)
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7)

  const [bookings, attendance, waste, lowStock] = await Promise.all([
    prisma.booking.count({ where: { date: { gte: weekAgo, lt: today } } }),
    prisma.attendance.count({ where: { checkInTime: { gte: weekAgo, lt: today } } }),
    prisma.wasteLog.findMany({ where: { date: { gte: weekAgo, lt: today } }, orderBy: { date: 'asc' } }),
    prisma.inventoryItem.findMany({
      where: {
        AND: [
          { reorderThreshold: { gt: 0 } },
          { quantityOnHand: { lt: prisma.inventoryItem.fields.reorderThreshold } }
        ]
      }
    })
  ]).catch(async () => {
    // fallback for low stock due to prisma type quirk on sqlite; compute manually
    const all = await prisma.inventoryItem.findMany()
    const lows = all.filter(i => i.reorderThreshold > 0 && i.quantityOnHand < i.reorderThreshold)
    const wasteData = await prisma.wasteLog.findMany({ where: { date: { gte: weekAgo, lt: today } }, orderBy: { date: 'asc' } })
    return [
      await prisma.booking.count({ where: { date: { gte: weekAgo, lt: today } } }),
      await prisma.attendance.count({ where: { checkInTime: { gte: weekAgo, lt: today } } }),
      wasteData,
      lows
    ] as const
  })

  const byDay: Record<string, { waste: number }> = {}
  for (const w of waste) {
    const key = new Date(w.date).toISOString().slice(0,10)
    byDay[key] ??= { waste: 0 }
    byDay[key].waste += w.wastedQty
  }

  const result = {
    period: { start: weekAgo.toISOString(), end: today.toISOString() },
    prepVsServed: { expectedPrep: bookings, actualServed: attendance, discrepancy: bookings - attendance },
    wasteTrends: byDay,
    lowStock: lowStock.map(i => ({ id: i.id, name: i.name, qty: i.quantityOnHand, threshold: i.reorderThreshold }))
  }
  return NextResponse.json(result)
}


