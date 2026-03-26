import { Router } from "express";
import * as publicBrandingController from "../controllers/publicBrandingController.js";

export const publicRouter: Router = Router();

publicRouter.get("/branding", publicBrandingController.getPublicBranding);
