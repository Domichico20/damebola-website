import { prisma } from "./db";
import { clientIpHash } from "./request";

export async function writeAudit(input: {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const ipHash = await clientIpHash().catch(() => null);
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId || null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata ? JSON.stringify(input.metadata).slice(0, 4000) : null,
        ipHash,
      },
    });
  } catch (error) {
    console.error("audit failed", error);
  }
}
