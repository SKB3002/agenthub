import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

const staticPaths = [
  "",
  "/docs",
  "/docs/install",
  "/docs/quickstart",
  "/docs/workflows",
  "/docs/commands",
  "/docs/agents",
  "/docs/skills",
  "/docs/tiers",
  "/docs/hooks",
  "/docs/mcp-servers",
  "/docs/ledger",
  "/docs/contributing",
  "/changelog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "/changelog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
