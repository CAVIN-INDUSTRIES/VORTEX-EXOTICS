import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { publicAppraisalIpRateLimit } from "../middleware/publicAppraisalRateLimit.js";
import { resolvePublicAppraisalTenant } from "../middleware/publicAppraisalTenant.js";
import { publicAppraisalSchema } from "@vex/shared";
import * as publicBrandingController from "../controllers/publicBrandingController.js";
import * as publicAppraisalController from "../controllers/publicAppraisalController.js";
import { getPlatformEngines } from "../controllers/platformEnginesController.js";

export const publicRouter: Router = Router();

publicRouter.get("/branding", publicBrandingController.getPublicBranding);
publicRouter.get("/platform-engines", getPlatformEngines);

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
