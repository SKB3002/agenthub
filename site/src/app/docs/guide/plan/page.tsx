import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "Plan walkthrough",
  description: "How /hub:plan turns a direction into docs/PLAN-<slug>.md — with a realistic example.",
};

export default function Page() {
  return (
    <div>
      <h1>Plan</h1>
      <p className="text-lg text-muted-foreground">
        <code>/hub:plan</code> writes <code>docs/PLAN-&lt;slug&gt;.md</code> — a real file you
        can review, diff, and hand to an agent. No code yet. Just a plan.
      </p>

      <h2>When to use it</h2>
      <ul>
        <li>You&apos;ve decided <em>what</em> to build and want to separate planning from implementation.</li>
        <li>You&apos;re about to spend on a HEAVY command — <code>/hub:plan</code> first costs less than a bad <code>/hub:create</code>.</li>
        <li>The change spans multiple agents (API + UI + DB) and you want the steps explicit.</li>
      </ul>

      <h2>When NOT to use it</h2>
      <ul>
        <li>Single-file changes. Skip the plan, go direct.</li>
        <li>You&apos;re still exploring options. Run <Link href="/docs/guide/brainstorm">brainstorm</Link> first.</li>
      </ul>

      <h2>Invocation</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock code="/hub:plan add Stripe checkout + webhook + dashboard to the existing Next.js app" lang="text" /> },
          { id: "codex", label: "Codex", content: <CodeBlock code="@hub plan add Stripe checkout + webhook + dashboard to the existing Next.js app" lang="text" /> },
        ]}
      />

      <h2>Approval gate</h2>
      <CodeBlock
        lang="text"
        code={`MEDIUM: dispatch hub:project-planner with plan-writing + architecture
estimate: ~32k tokens
output: docs/PLAN-stripe-checkout.md

Proceed? [y/n/tweak]`}
      />

      <h2>Example session</h2>
      <Dialogue
        title="Planning a Stripe integration"
        lines={[
          { role: "user", text: "/hub:plan add Stripe checkout + webhook + dashboard to the existing Next.js app" },
          { role: "gate", text: "MEDIUM · hub:project-planner · ~32k tokens · writes docs/PLAN-stripe-checkout.md · [y/n/tweak]" },
          { role: "user", text: "y" },
          {
            role: "agent",
            name: "project-planner",
            text: (
              <div className="space-y-2">
                <p>Explored the repo. Next.js 15 App Router, Prisma, Postgres. Wrote the plan to <code>docs/PLAN-stripe-checkout.md</code>. Highlights:</p>
                <ul className="list-disc pl-5">
                  <li>4 tasks, dependency graph included</li>
                  <li>DB: new <code>subscriptions</code> table, migration staged</li>
                  <li>API: <code>/api/checkout</code> + <code>/api/webhooks/stripe</code> with signature verify</li>
                  <li>UI: <code>/billing</code> route + <code>&lt;PricingCard&gt;</code> component</li>
                  <li>Tests: contract test for webhook, E2E for happy-path checkout</li>
                </ul>
                <p>Next: run <code>/hub:enhance --from docs/PLAN-stripe-checkout.md</code> to execute.</p>
              </div>
            ),
          },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Review the plan before running the HEAVY command.</strong> A 5-minute read saves a 200k-token mistake.</li>
        <li><strong>Plan files are git-tracked.</strong> Commit them with the feature — they make great PR context.</li>
        <li><strong>Tweak via the plan, not the prompt.</strong> Edit the file, re-run <code>enhance --from</code>.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/create">Create</Link> — scaffold greenfield from scratch.</li>
        <li><Link href="/docs/guide/agent-project-planner">Project planner</Link> — the agent behind plan.</li>
        <li><Link href="/docs/guide/skill-approval-gate">Approval gate</Link> — how every MEDIUM dispatch is framed.</li>
      </ul>
    </div>
  );
}
