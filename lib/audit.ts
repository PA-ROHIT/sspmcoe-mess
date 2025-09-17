import { prisma } from &apos;./prisma&apos;

export async function recordAudit(userId: string | null, action: string, entity: string, diff: unknown) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? &apos;system&apos;,
        action,
        entity,
        diff: typeof diff === &apos;string&apos; ? diff : JSON.stringify(diff)
      }
    })
  } catch (err) {
    // swallow audit errors to not break main flow
    console.error(&apos;audit error&apos;, err)
  }
}


