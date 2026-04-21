import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "Create walkthrough",
  description: "How /hub:create scaffolds a real app — the HEAVY gate, the agent chain, and what you actually end up with.",
};

export default function Page() {
  return (
    <div>
      <h1>Create</h1>
      <p className="text-lg text-muted-foreground">
        <code>/hub:create</code> is the heaviest workflow in AgentHub. It dispatches 4–5 specialists
        in sequence — planner → backend → frontend → database → devops — to scaffold a greenfield
        app.
      </p>

      <h2>When to use it</h2>
      <ul>
        <li>You&apos;re starting a new app from an empty directory.</li>
        <li>You have a clear spec (ideally a <Link href="/docs/guide/plan">plan file</Link>).</li>
        <li>You&apos;ve budgeted the token spend (~80k–200k typical).</li>
      </ul>

      <h2>When NOT to use it</h2>
      <ul>
        <li>You&apos;re adding to an existing app. Use <Link href="/docs/guide/debug">enhance</Link> — it scopes the minimum diff.</li>
        <li>You haven&apos;t decided the stack. Run <Link href="/docs/guide/brainstorm">brainstorm</Link> first.</li>
      </ul>

      <h2>Invocation</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock code="/hub:create Next.js SaaS landing with a waitlist form backed by Postgres" lang="text" /> },
          { id: "codex", label: "Codex", content: <CodeBlock code="@hub create Next.js SaaS landing with a waitlist form backed by Postgres" lang="text" /> },
        ]}
      />

      <h2>What the HEAVY gate looks like</h2>
      <CodeBlock
        lang="text"
        code={`HEAVY — /hub:create "Next.js SaaS landing with waitlist + Postgres"

Planned agents:
  - hub:project-planner       (plan.md, task graph)
  - hub:backend-specialist    (/api/waitlist route)
  - hub:frontend-specialist   (landing, form, confirmation)
  - hub:database-architect    (waitlist table + migration)
  - hub:devops-engineer       (Vercel + Neon config)

Skills loaded:
  nextjs-react-expert, tailwind-patterns, api-patterns,
  database-design, deployment-procedures, clean-code

Token estimate:  ~140k   (P50: ~110k, P95: ~190k)

MoSCoW scope:
  MUST   — landing, form, /api/waitlist, waitlist table, happy path
  SHOULD — email confirmation, rate limit, duplicate guard
  COULD  — Turnstile captcha, admin CSV export
  WON'T  — auth, payments, dashboards (out of scope; use /hub:enhance later)

Lighter alternatives:
  A) /hub:enhance  — if you already have a Next.js base
  B) /hub:plan only — ship the plan first, build tomorrow

Proceed? [y/n/tweak]`}
      />

      <h2>Example session (summary)</h2>
      <Dialogue
        title="Building the waitlist app"
        lines={[
          { role: "user", text: "/hub:create Next.js SaaS landing with a waitlist form backed by Postgres" },
          { role: "gate", text: "HEAVY · 5 agents · ~140k tokens · MoSCoW shown · [y/n/tweak]" },
          { role: "user", text: "y" },
          { role: "agent", name: "project-planner", text: "Wrote docs/PLAN-create.md. 5-step graph, agent assignments explicit. Handing off…" },
          { role: "agent", name: "database-architect", text: "Created prisma/schema.prisma + 0001_init migration. waitlist(email, created_at, source)." },
          { role: "agent", name: "backend-specialist", text: "Added /api/waitlist. Zod input, Prisma insert, duplicate-safe upsert. Contract test included." },
          { role: "agent", name: "frontend-specialist", text: "Landing page, <WaitlistForm>, success state, Tailwind. Reads NEXT_PUBLIC_APP_NAME." },
          { role: "agent", name: "devops-engineer", text: "vercel.json, .env.example with DATABASE_URL + Neon guidance. README updated. All done." },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Read the gate carefully.</strong> The MoSCoW shows what won&apos;t be built. Add those things to a follow-up <code>/hub:enhance</code>, not to this run.</li>
        <li><strong>Pass a plan file</strong> when you have one: <code>/hub:create --from docs/PLAN-xyz.md</code>. Drops estimate by ~30% because the planner skips discovery.</li>
        <li><strong>Watch the ledger afterwards.</strong> <code>/hub:ledger last</code> shows per-agent spend. If one agent ate 70% of the budget, that&apos;s a signal to tune its skills list.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/orchestrate">Orchestrate</Link> — for runs that need ≥3 agents across domains with stricter staging.</li>
        <li><Link href="/docs/guide/skill-app-builder">App builder</Link> — the skill that drives stack selection.</li>
        <li><Link href="/docs/tiers">Tiers & gates</Link> — the mechanics behind HEAVY.</li>
      </ul>
    </div>
  );
}
