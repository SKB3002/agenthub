import Link from "next/link";
import {
  Rocket,
  Terminal,
  Workflow,
  Bot,
  Layers,
  ShieldCheck,
  GitBranch,
  BookOpenText,
} from "lucide-react";

const cards = [
  {
    href: "/docs/install",
    icon: Rocket,
    title: "Install",
    desc: "Set up AgentHub on Claude Code or OpenAI Codex in under a minute.",
  },
  {
    href: "/docs/quickstart",
    icon: Terminal,
    title: "Quickstart",
    desc: "Your first command, what the approval gate looks like, and how to read it.",
  },
  {
    href: "/docs/workflows",
    icon: Workflow,
    title: "Workflows",
    desc: "The recommended brainstorm → plan → create → test → deploy flow.",
  },
  {
    href: "/docs/commands",
    icon: BookOpenText,
    title: "Commands (17)",
    desc: "Every /hub and @hub command, its tier, its token estimate, and its job.",
  },
  {
    href: "/docs/agents",
    icon: Bot,
    title: "Agents (20)",
    desc: "The 20 specialist subagents grouped by domain — architects, backend, frontend, QA.",
  },
  {
    href: "/docs/skills",
    icon: Layers,
    title: "Skills (42)",
    desc: "On-demand knowledge modules that agents pull in when the work calls for them.",
  },
  {
    href: "/docs/tiers",
    icon: ShieldCheck,
    title: "Tiers & gates",
    desc: "LIGHT, MEDIUM, HEAVY — what runs directly, what asks first, what asks with details.",
  },
  {
    href: "/changelog",
    icon: GitBranch,
    title: "Changelog",
    desc: "Live from GitHub Releases — every shipped change, newest first.",
  },
];

export default function DocsIndex() {
  return (
    <div>
      <h1>Documentation</h1>
      <p className="text-lg text-muted-foreground">
        Everything you need to install, use, and extend AgentHub. Start with{" "}
        <Link href="/docs/install">install</Link>, or jump to the{" "}
        <Link href="/docs/commands">commands reference</Link> if you already have it running.
      </p>

      <div className="not-prose mt-10 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/40 hover:bg-accent/30"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
