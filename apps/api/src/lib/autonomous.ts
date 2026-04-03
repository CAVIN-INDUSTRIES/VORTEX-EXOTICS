import type { AutonomousWorkflow } from "@vex/shared";
import { DEALER_AUDIT_SCHEMA_VERSION, newDealerCorrelationId } from "./dealerAudit.js";
import { enqueueAutonomousWorkflow } from "./queue.js";
import { prisma } from "./tenant.js";

export class AutonomousService {
  async queueWorkflow(tenantId: string, actorId: string | undefined, workflow: AutonomousWorkflow) {
    const correlationId = newDealerCorrelationId();
    const envelope = { ...workflow, correlationId, schemaVersion: DEALER_AUDIT_SCHEMA_VERSION };

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId,
        action: "AUTONOMOUS_WORKFLOW_QUEUED",
        entity: "AutonomousWorkflow",
        entityId: workflow.id,
        payload: envelope,
      },
    });
    await prisma.eventLog.create({
      data: {
        tenantId,
        type: "autonomous.workflow_queued",
        payload: envelope,
      },
    });

    const queued = await enqueueAutonomousWorkflow({
      tenantId,
      id: workflow.id,
      workflowType: workflow.workflowType,
      enabled: workflow.enabled,
      maxParallelRuns: workflow.maxParallelRuns,
      tenantDailyCostCapUsd: workflow.tenantDailyCostCapUsd,
      correlationId,
    });

    return { queued, correlationId };
  }
}
