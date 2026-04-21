import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, Bot, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "Worked examples for AgentHub — one per high-impact command, agent, and skill. Each guide is a walkthrough, not a reference dump.",
};

type Card = { href: string; title: string; desc: string };

const commands: Card[] = [
  { href: "/docs/guide/brainstorm", title: "Brainstorm", desc: "Explore 3+ options before writing any code." },
  { href: "/docs/guide/plan", title: "Plan", desc: "Turn a direction into an actionable plan file." },
  { href: "/docs/guide/create", title: "Create", desc: "Scaffold a new app with 4–5 specialists." },
  { href: "/docs/guide/debug", title: "Debug", desc: "Systematic root-cause investigation and fix." },
  { href: "/docs/guide/orchestrate", title: "Orchestrate", desc: "Multi-agent 2-phase plan → approve → implement pipeline." },
  { href: "/docs/guide/deploy", title: "Deploy", desc: "Pre-flight, staging, production, rollback." },
];

const agents: Card[] = [
  { href: "/docs/guide/agent-frontend-specialist", title: "Frontend specialist", desc: "React, Next.js, Vue, Svelte — components, state, responsive design." },
  { href: "/docs/guide/agent-backend-specialist", title: "Backend specialist", desc: "API routes, services, Node.js, Python/FastAPI, edge." },
  { href: "/docs/guide/agent-debugger", title: "Debugger", desc: "The specialist for hard bugs — methodical, not lucky." },
  { href: "/docs/guide/agent-security-auditor", title: "Security auditor", desc: "OWASP 2025, zero-trust, supply-chain review." },
  { href: "/docs/guide/agent-project-planner", title: "Project planner", desc: "Task breakdown, dependency graphs, PLAN-*.md." },
];

const skills: Card[] = [
  { href: "/docs/guide/skill-clean-code", title: "Clean code", desc: "The quality foundation every agent loads." },
  { href: "/docs/guide/skill-app-builder", title: "App builder", desc: "How scaffolding actually picks a stack." },
  { href: "/docs/guide/skill-approval-gate", title: "Approval gate", desc: "The governance layer behind every MEDIUM/HEAVY command." },
  { href: "/docs/guide/skill-systematic-debugging", title: "Systematic debugging", desc: "A repeatable method, not a list of tips." },
];

export default function GuideIndex() {
  return (
    <div>
      <h1>Guide</h1>
      <p className="text-lg text-muted-foreground">
        15 worked examples across AgentHub&apos;s most impactful commands, agents, and skills. Each
        guide is a walkthrough — what you type, what the gate looks like, what the agent replies,
        and when to pick something else.
      </p>

      <Section icon={<Terminal className="h-5 w-5" />} title="Command walkthroughs" cards={commands} />
      <Section icon={<Bot className="h-5 w-5" />} title="Agent deep-dives" cards={agents} />
      <Section icon={<Layers className="h-5 w-5" />} title="Skill walkthroughs" cards={skills} />
    </div>
  );
}

function Section({
  icon,
  title,
  cards,
}: {
  icon: React.ReactNode;
  title: string;
  cards: Card[];
}) {
  return (
    <section className="not-prose mt-12 first:mt-10">
      <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-brand">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40 hover:bg-accent/30"
          >
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
