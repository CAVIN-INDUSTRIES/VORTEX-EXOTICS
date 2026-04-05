import { Router } from "express";
import { AutonomousDealOrchestrationSchema, Role } from "@vex/shared";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateBody } from "../middleware/validate.js";
import { enqueueDealOrchestration } from "../lib/queue.js";

export const dealsRouter: Router = Router();

dealsRouter.post(
  "/autonomous",
  requireAuth,
  requireRole(Role.STAFF, Role.ADMIN, "GROUP_ADMIN"),
  validateBody(AutonomousDealOrchestrationSchema),
  async (req, res) => {
    const tenantId = req.tenantId!;
    const { appraisalId, correlationId } = req.body;
    const cid = await enqueueDealOrchestration({
      tenantId,
      appraisalId,
      correlationId,
      requestedByUserId: req.user?.userId,
    });
    return res.status(202).json({
      data: { accepted: true, appraisalId, correlationId: cid },
      error: null,
    });
  }
);
