import { prisma } from './prisma'

export async function recordAudit(userId: string | null, action: string, entity: string, diff: unknown) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? 'system',
        action,
        entity,
        diff: typeof diff === 'string' ? diff : JSON.stringify(diff)
      }
    })
  } catch (err) {
    // swallow audit errors to not break main flow
    console.error('audit error', err)
  }
}


