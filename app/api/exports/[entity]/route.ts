import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toCSV(rows: any[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const r of rows) lines.push(headers.map(h => JSON.stringify(r[h] ?? '')).join(','))
  return lines.join('\n')
}

export async function GET(_: Request, { params }: { params: { entity: string } }) {
  const e = params.entity
  let rows: any[] = []
  if (e === 'bookings') rows = await prisma.booking.findMany()
  else if (e === 'attendance') rows = await prisma.attendance.findMany()
  else if (e === 'waste') rows = await prisma.wasteLog.findMany()
  else if (e === 'inventory') rows = await prisma.inventoryItem.findMany()
  else return NextResponse.json({ error: 'Unknown entity' }, { status: 400 })
  const csv = toCSV(rows)
  return new NextResponse(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename=${e}.csv` } })
}


