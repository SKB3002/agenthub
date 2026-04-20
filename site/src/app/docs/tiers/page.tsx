import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Tiers & approval gates",
  description:
    "How LIGHT, MEDIUM, and HEAVY tiers work — and why every AgentHub command declares one up front.",
};

export default function TiersPage() {
  return (
    <div>
      <h1>Tiers & approval gates</h1>
      <p className="text-lg text-muted-foreground">
        Every command declares a tier in its frontmatter. Tiers decide whether a command runs
        directly, asks once, or opens a full gate with alternatives.
      </p>

      <h2>The three tiers</h2>
      <div className="not-prose my-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold text-green-600 dark:text-green-500">LIGHT</h3>
            <span className="font-mono text-xs text-muted-foreground">&lt;5k tokens</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Runs directly. No gate. Safe reads, status checks, small utilities.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Examples:</p>
          <ul className="mt-1 font-mono text-xs">
            <li>/hub:status</li>
            <li>/hub:help</li>
            <li>/hub:ledger</li>
            <li>/hub:preview</li>
          </ul>
        </div>

        <div className="rounded-xl border border-brand/40 bg-card p-5 ring-1 ring-brand/20">
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold text-amber-600 dark:text-amber-500">MEDIUM</h3>
            <span className="font-mono text-xs text-muted-foreground">~10k–60k</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            One-line preview + <code>y/n/tweak</code> prompt. Single-agent dispatch.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Examples:</p>
          <ul className="mt-1 font-mono text-xs">
            <li>/hub:debug</li>
            <li>/hub:plan</li>
            <li>/hub:brainstorm</li>
            <li>/hub:test generate</li>
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold text-red-600 dark:text-red-500">HEAVY</h3>
            <span className="font-mono text-xs text-muted-foreground">~40k–250k</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Full gate: planned agents, skills, token estimate, MoSCoW scope, ≥2 alternatives.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Examples:</p>
          <ul className="mt-1 font-mono text-xs">
            <li>/hub:create</li>
            <li>/hub:enhance</li>
            <li>/hub:deploy</li>
            <li>/hub:orchestrate</li>
          </ul>
        </div>
      </div>

      <h2>What the HEAVY gate looks like</h2>
      <p>
        Before any HEAVY command runs, the model shows a block like this and waits for approval:
      </p>
      <CodeBlock
        code={`HEAVY — /hub:create "Next.js SaaS with Stripe"

Planned agents:
  - hub:project-planner      (plan.md, task graph)
  - hub:backend-specialist   (API routes, webhooks)
  - hub:frontend-specialist  (landing, dashboard, pricing)
  - hub:database-architect   (schema for users + subscriptions)
  - hub:devops-engineer      (Vercel + Stripe CLI config)

Skills loaded:
  nextjs-react-expert, tailwind-patterns, api-patterns,
  database-design, deployment-procedures, clean-code

Token estimate:  ~140k   (P50: ~110k, P95: ~190k)
Session budget:  OK (6.2M / 10M)

MoSCoW scope:
  MUST  — landing, checkout, webhook, dashboard skeleton
  SHOULD — pricing tiers, password reset
  COULD — email confirmations, audit log
  WON'T — SSO, team invites (left for /hub:enhance later)

Lighter alternatives:
  A) /hub:enhance   — if you already have a Next.js base
  B) /hub:plan only — ship the plan first, build tomorrow

Proceed? [y/n/tweak]`}
        lang="text"
      />

      <h2>Bypassing gates</h2>
      <p>
        Pass <code>--yes</code> or <code>-y</code> as the first argument after the command. Usage
        still logs to <code>.hub/usage.json</code>.
      </p>
      <CodeBlock code="/hub:create -y &quot;Next.js SaaS with Stripe&quot;" lang="text" />

      <h2>Where tiers come from</h2>
      <p>
        Each command file (<code>commands/&lt;name&gt;.md</code>) declares its tier in the
        frontmatter. The <code>approval-gate</code> skill reads that field, renders the correct
        gate, and appends a row to the usage log. You can hand-override by editing the frontmatter,
        but the declared tier should reflect real observed spend.
      </p>

      <p>
        The <code>/hub:ledger by-tier</code> command shows observed token spend per tier in your
        project. If a command&apos;s observed tier is consistently different from declared, that&apos;s
        a contribution worth sending upstream.
      </p>
    </div>
  );
}
