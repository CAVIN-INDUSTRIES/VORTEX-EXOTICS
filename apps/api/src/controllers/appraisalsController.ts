import { Request, Response } from "express";
import type { CreateAppraisalInput } from "@vex/shared";
import { prisma } from "../lib/tenant.js";

function estimateValue(info: CreateAppraisalInput): number {
  const baseYear = 2024;
  const ageFactor = Math.max(0, baseYear - info.year);
  const mileageDepreciation = Math.min(0.3, (info.mileage / 150000) * 0.3);
  const base = 25000 + (info.year - 2015) * 2000;
  const value = base * (1 - ageFactor * 0.08) * (1 - mileageDepreciation);
  return Math.round(Math.max(1000, value) * 100) / 100;
}

export async function create(req: Request, res: Response) {
  const body = req.body as CreateAppraisalInput;
  const userId = req.user?.userId ?? null;

  const estimatedValue = estimateValue(body);

  const appraisal = await prisma.appraisal.create({
    data: {
      tenant: { connect: { id: req.tenantId! } },
      ...(userId ? { user: { connect: { id: userId } } } : {}),
      vehicleInfo: body as unknown as object,
      estimatedValue,
      status: "COMPLETED",
    },
  });

  return res.status(201).json({
    id: appraisal.id,
    estimatedValue,
    vehicleInfo: body,
    status: appraisal.status,
    createdAt: appraisal.createdAt,
  });
}

export async function getById(req: Request, res: Response) {
  const { id } = req.params;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Login required to view appraisals" });
  }

  const appraisal = await prisma.appraisal.findFirst({ where: { id } });
  if (!appraisal) return res.status(404).json({ code: "NOT_FOUND", message: "Appraisal not found" });

  const isStaff = user.role === "STAFF" || user.role === "ADMIN";
  if (!isStaff && appraisal.userId && appraisal.userId !== user.userId) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Appraisal not found" });
  }

  return res.json({
    id: appraisal.id,
    estimatedValue: appraisal.estimatedValue != null ? Number(appraisal.estimatedValue) : null,
    vehicleInfo: appraisal.vehicleInfo,
    status: appraisal.status,
    createdAt: appraisal.createdAt,
  });
}
