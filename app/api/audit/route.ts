import { NextResponse } from &apos;next/server&apos;
import { prisma } from &apos;@/lib/prisma&apos;

export async function GET() {
  const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: &apos;desc&apos; }, take: 200 })
  return NextResponse.json(logs)
}


