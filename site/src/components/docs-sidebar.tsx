"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };
type Section = { title: string; items: Item[] };

const sections: Section[] = [
  {
    title: "Getting started",
    items: [
      { href: "/docs/install", label: "Install" },
      { href: "/docs/quickstart", label: "Quickstart" },
      { href: "/docs/workflows", label: "Workflows" },
    ],
  },
  {
    title: "Guide · Commands",
    items: [
      { href: "/docs/guide/brainstorm", label: "Brainstorm" },
      { href: "/docs/guide/plan", label: "Plan" },
      { href: "/docs/guide/create", label: "Create" },
      { href: "/docs/guide/debug", label: "Debug" },
      { href: "/docs/guide/orchestrate", label: "Orchestrate" },
      { href: "/docs/guide/deploy", label: "Deploy" },
    ],
  },
  {
    title: "Guide · Agents",
    items: [
      { href: "/docs/guide/agent-frontend-specialist", label: "Frontend specialist" },
      { href: "/docs/guide/agent-backend-specialist", label: "Backend specialist" },
      { href: "/docs/guide/agent-debugger", label: "Debugger" },
      { href: "/docs/guide/agent-security-auditor", label: "Security auditor" },
      { href: "/docs/guide/agent-project-planner", label: "Project planner" },
    ],
  },
  {
    title: "Guide · Skills",
    items: [
      { href: "/docs/guide/skill-clean-code", label: "Clean code" },
      { href: "/docs/guide/skill-app-builder", label: "App builder" },
      { href: "/docs/guide/skill-approval-gate", label: "Approval gate" },
      { href: "/docs/guide/skill-systematic-debugging", label: "Systematic debugging" },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "/docs/commands", label: "Commands (37)" },
      { href: "/docs/agents", label: "Agents (20)" },
      { href: "/docs/skills", label: "Skills (42)" },
      { href: "/docs/tiers", label: "Tiers & approval gates" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { href: "/docs/hooks", label: "Hooks" },
      { href: "/docs/mcp-servers", label: "MCP servers" },
      { href: "/docs/ledger", label: "Usage ledger" },
    ],
  },
  {
    title: "Project",
    items: [
      { href: "/docs/contributing", label: "Contributing" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6 text-sm">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 text-foreground/70 transition-colors",
                      active
                        ? "bg-accent text-foreground font-medium"
                        : "hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
