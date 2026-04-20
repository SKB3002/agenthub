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
    title: "Reference",
    items: [
      { href: "/docs/commands", label: "Commands (17)" },
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
