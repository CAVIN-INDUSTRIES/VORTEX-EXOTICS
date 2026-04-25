import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

const routes = [
  "/",
  "/inventory",
  "/appraisal",
  "/contact",
  "/configure",
  "/build",
  "/pricing",
  "/onboard",
  "/pilot",
  "/login",
  "/register",
  "/investor",
  "/investor-deck",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return routes.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
