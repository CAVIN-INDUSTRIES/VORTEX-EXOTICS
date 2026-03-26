import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createCustomerSchema, updateCustomerSchema } from "@vex/shared";
import * as customersController from "../controllers/customersController.js";

export const customersRouter: Router = Router();

customersRouter.get("/", requireAuth, customersController.list);
customersRouter.post("/", requireAuth, validateBody(createCustomerSchema), customersController.create);
customersRouter.get("/:id", requireAuth, customersController.getById);
customersRouter.put("/:id", requireAuth, validateBody(updateCustomerSchema), customersController.update);
customersRouter.delete("/:id", requireAuth, customersController.remove);
