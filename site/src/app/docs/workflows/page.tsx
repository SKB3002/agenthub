import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Workflows",
  description:
    "The recommended brainstorm → plan → create → test → deploy flow, and why each step has the tier it does.",
};

export default function WorkflowsPage() {
  return (
    <div>
      <h1>Workflows</h1>
      <p className="text-lg text-muted-foreground">
        AgentHub is opinionated about the order you run things. The recommended flow trades a few
        minutes of thinking upfront for hours of wasted agent spend later.
      </p>

      <h2>The standard flow</h2>
      <CodeBlock
        code={`1. /hub:brainstorm <idea>        — explore options                     (MEDIUM)
2. /hub:plan <feature>           — turn a direction into a plan file    (MEDIUM)
3. /hub:create <app>             — scaffold a greenfield app            (HEAVY)
   or /hub:enhance <change>      — add/update features in an existing app  (HEAVY)
4. /hub:test generate <module>   — generate tests for the new code      (MEDIUM)
   or /hub:test                  — run existing tests                   (LIGHT)
5. /hub:deploy staging           — pre-flight + deploy                  (HEAVY)
   then /hub:deploy production`}
        lang="text"
      />
      <p>
        The same flow in Codex: swap each <code>/hub:</code> for <code>@hub</code> and drop the
        colon. Every step behaves the same way on both platforms.
      </p>

      <h2>Why this order?</h2>
      <ul>
        <li>
          <strong>Brainstorm first.</strong> No code. Just options. This is the cheapest step and
          often kills half your original idea — good.
        </li>
        <li>
          <strong>Plan before building.</strong> Writing <code>docs/PLAN-&lt;slug&gt;.md</code>{" "}
          takes ~20k tokens, but the HEAVY <code>create</code> that follows can spend 10× more —
          with a plan, that spend is directed.
        </li>
        <li>
          <strong>Create or enhance, never both.</strong> <code>create</code> is for greenfield.{" "}
          <code>enhance</code> loads project context and scopes the smallest diff that satisfies
          the change.
        </li>
        <li>
          <strong>Tests gate deploys.</strong> <code>test generate</code> is MEDIUM because it
          writes code; <code>test</code> without args just runs what exists (LIGHT).
        </li>
        <li>
          <strong>Deploy twice.</strong> Staging first, production second. Rollback is a subcommand:{" "}
          <code>/hub:deploy rollback</code>.
        </li>
      </ul>

      <h2>Shortcut flows</h2>
      <h3>Bug fix sprint</h3>
      <CodeBlock code="/hub:debug <symptom> → /hub:test → done" lang="text" />
      <p>
        No brainstorm, no plan. <code>debug</code> runs systematic-debugging, proposes a fix,
        applies it; <code>test</code> confirms nothing regressed.
      </p>

      <h3>UI audit and redesign</h3>
      <CodeBlock code="/hub:ui-ux-pro-max <target page or component>" lang="text" />
      <p>
        HEAVY. Dispatches <code>hub:frontend-specialist</code> plus 3 design skills
        (web-design-guidelines, frontend-design, tailwind-patterns).
      </p>

      <h3>Multi-domain heavy lift</h3>
      <CodeBlock code="/hub:orchestrate migrate auth from sessions to JWT across API + frontend + mobile" lang="text" />
      <p>
        Two-phase pipeline. Phase 1: <code>hub:orchestrator</code> writes a plan spanning ≥3 agents
        and asks for approval. Phase 2: the approved plan executes with clear hand-offs.
      </p>

      <h2>Related</h2>
      <ul>
        <li>
          <Link href="/docs/tiers">Tiers and approval gates</Link> — the mechanics of LIGHT / MEDIUM / HEAVY.
        </li>
        <li>
          <Link href="/docs/commands">Commands reference</Link> — every command and its full
          signature.
        </li>
        <li>
          <Link href="/docs/ledger">Usage ledger</Link> — how to audit where your tokens went.
        </li>
      </ul>
    </div>
  );
}
