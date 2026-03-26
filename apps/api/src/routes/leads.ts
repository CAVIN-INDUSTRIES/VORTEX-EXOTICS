import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { createLeadSchema, updateLeadSchema } from "@vex/shared";
import * as leadsController from "../controllers/leadsController.js";

export const leadsRouter: Router = Router();

leadsRouter.get("/", requireAuth, leadsController.list);
leadsRouter.post("/", optionalAuth, validateBody(createLeadSchema), leadsController.create);
leadsRouter.get("/:id", requireAuth, leadsController.getById);
leadsRouter.patch("/:id", requireAuth, validateBody(updateLeadSchema), leadsController.update);
leadsRouter.put("/:id", requireAuth, validateBody(updateLeadSchema), leadsController.update);
leadsRouter.delete("/:id", requireAuth, leadsController.remove);
