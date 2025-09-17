import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;

function toCSV(rows: any[]): string {
  if (!rows.length) return &apos;&apos;
  const headers = Object.keys(rows[0])
  const lines = [headers.join(&apos;,&apos;)]
  for (const r of rows) lines.push(headers.map(h => JSON.stringify(r[h] ?? &apos;&apos;)).join(&apos;,&apos;))
  return lines.join(&apos;\n&apos;)
}

export async function GET(_: Request, { params }: { params: { entity: string } }) {
  const e = params.entity
  let rows: any[] = []
  if (e === &apos;bookings&apos;) rows = await prisma.booking.findMany()
  else if (e === &apos;attendance&apos;) rows = await prisma.attendance.findMany()
  else if (e === &apos;waste&apos;) rows = await prisma.wasteLog.findMany()
  else if (e === &apos;inventory&apos;) rows = await prisma.inventoryItem.findMany()
  else return NextResponse.json({ error: &apos;Unknown entity&apos; }, { status: 400 })
  const csv = toCSV(rows)
  return new NextResponse(csv, { headers: { &apos;content-type&apos;: &apos;text/csv; charset=utf-8&apos;, &apos;content-disposition&apos;: `attachment; filename=${e}.csv` } })
}


