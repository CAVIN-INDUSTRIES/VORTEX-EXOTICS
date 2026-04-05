import { Router } from "express";
import { AutonomousDealOrchestrationSchema, Role } from "@vex/shared";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateBody } from "../middleware/validate.js";
import {
  enqueueDealOrchestration,
  QUEUE_UNAVAILABLE_CODE,
  QUEUE_UNAVAILABLE_MESSAGE,
} from "../lib/queue.js";

export const dealsRouter: Router = Router();

dealsRouter.post(
  "/autonomous",
  requireAuth,
  requireRole(Role.STAFF, Role.ADMIN, "GROUP_ADMIN"),
  validateBody(AutonomousDealOrchestrationSchema),
  async (req, res) => {
    const tenantId = req.tenantId!;
    const { appraisalId, correlationId } = req.body;
    const { correlationId: cid, queued } = await enqueueDealOrchestration({
      tenantId,
      appraisalId,
      correlationId,
      requestedByUserId: req.user?.userId,
    });
    if (!queued) {
      return res.status(503).json({
        code: QUEUE_UNAVAILABLE_CODE,
        message: QUEUE_UNAVAILABLE_MESSAGE,
        data: { correlationId: cid, appraisalId },
      });
    }
    return res.status(202).json({
      data: { accepted: true, appraisalId, correlationId: cid },
      error: null,
    });
  }
);
