import { prisma } from '@/lib/prisma'

// Simple reconciliation: mark no-shows and compute diff
async function main() {
  const today = new Date()
  today.setHours(0,0,0,0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const bookings = await prisma.booking.findMany({ where: { date: { gte: today, lt: tomorrow } } })
  const attendance = await prisma.attendance.findMany({ where: { checkInTime: { gte: today, lt: tomorrow } } })
  const attendedIds = new Set(attendance.map(a => a.bookingId).filter(Boolean))
  const noShows = bookings.filter(b => !attendedIds.has(b.id))
  console.log(JSON.stringify({ date: today.toISOString().slice(0,10), expectedPrep: bookings.length, actualServed: attendance.length, noShows: noShows.length }))
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(async()=>{ await prisma.$disconnect() })


