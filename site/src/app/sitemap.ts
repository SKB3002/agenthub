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
  "/docs/guide",
  "/docs/guide/brainstorm",
  "/docs/guide/plan",
  "/docs/guide/create",
  "/docs/guide/debug",
  "/docs/guide/orchestrate",
  "/docs/guide/deploy",
  "/docs/guide/agent-frontend-specialist",
  "/docs/guide/agent-backend-specialist",
  "/docs/guide/agent-debugger",
  "/docs/guide/agent-security-auditor",
  "/docs/guide/agent-project-planner",
  "/docs/guide/skill-clean-code",
  "/docs/guide/skill-app-builder",
  "/docs/guide/skill-approval-gate",
  "/docs/guide/skill-systematic-debugging",
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
