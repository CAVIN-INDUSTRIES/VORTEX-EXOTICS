import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { publicAppraisalIpRateLimit } from "../middleware/publicAppraisalRateLimit.js";
import { publicLeadIpRateLimit } from "../middleware/publicLeadRateLimit.js";
import { resolvePublicAppraisalTenant } from "../middleware/publicAppraisalTenant.js";
import { createLeadSchema, publicAppraisalSchema } from "@vex/shared";
import * as publicBrandingController from "../controllers/publicBrandingController.js";
import * as publicAppraisalController from "../controllers/publicAppraisalController.js";
import * as publicLeadsController from "../controllers/publicLeadsController.js";
import { getPlatformEngines } from "../controllers/platformEnginesController.js";

export const publicRouter: Router = Router();

publicRouter.get("/branding", publicBrandingController.getPublicBranding);
publicRouter.get("/platform-engines", getPlatformEngines);
publicRouter.post(
  "/leads",
  publicLeadIpRateLimit,
  resolvePublicAppraisalTenant,
  validateBody(createLeadSchema),
  publicLeadsController.postPublicLead
);

publicRouter.post(
  "/quick-appraisal",
  publicAppraisalIpRateLimit,
  resolvePublicAppraisalTenant,
  validateBody(publicAppraisalSchema),
  publicAppraisalController.postQuickAppraisal
);
publicRouter.get(
  "/quick-appraisal/:id",
  publicAppraisalIpRateLimit,
  resolvePublicAppraisalTenant,
  publicAppraisalController.getQuickAppraisal
);
