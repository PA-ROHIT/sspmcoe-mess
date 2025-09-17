import { PrismaClient } from &apos;@prisma/client&apos;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: [&apos;error&apos;] })

if (process.env.NODE_ENV !== &apos;production&apos;) globalForPrisma.prisma = prisma


