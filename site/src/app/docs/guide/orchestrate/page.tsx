import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "Orchestrate walkthrough",
  description: "The 2-phase plan → approve → implement pipeline for multi-domain work.",
};

export default function Page() {
  return (
    <div>
      <h1>Orchestrate</h1>
      <p className="text-lg text-muted-foreground">
        <code>/hub:orchestrate</code> is for changes that cross ≥3 domains and need explicit
        staging. It runs in two phases: planner produces a plan, you approve it, then agents
        execute with clear hand-offs.
      </p>

      <h2>When to use it</h2>
      <ul>
        <li>Multi-domain work (API + frontend + mobile + infra, etc.).</li>
        <li>Risky or irreversible changes that deserve a review step.</li>
        <li>When you want the execution split across agents, not done by one.</li>
      </ul>

      <h2>When NOT to use it</h2>
      <ul>
        <li>Single-agent work. Use <Link href="/docs/guide/create">create</Link> or <Link href="/docs/guide/debug">enhance</Link>.</li>
        <li>No existing plan and no clear scope. Use <Link href="/docs/guide/brainstorm">brainstorm</Link> first.</li>
      </ul>

      <h2>Invocation</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock code="/hub:orchestrate migrate auth from sessions to JWT across API + frontend + mobile" lang="text" /> },
          { id: "codex", label: "Codex", content: <CodeBlock code="@hub orchestrate migrate auth from sessions to JWT across API + frontend + mobile" lang="text" /> },
        ]}
      />

      <h2>The two phases</h2>
      <h3>Phase 1 — plan</h3>
      <p>
        <code>hub:orchestrator</code> explores the repo, produces a plan that names every agent
        and every step with hand-offs, and shows you a <strong>HEAVY</strong> gate including the
        full dependency graph. You approve, tweak, or cancel.
      </p>

      <h3>Phase 2 — implement</h3>
      <p>
        The approved plan executes. Each agent runs in order, passes context to the next, and you
        see a clean transcript block per agent.
      </p>

      <h2>Example session</h2>
      <Dialogue
        title="Sessions → JWT migration"
        lines={[
          { role: "user", text: "/hub:orchestrate migrate auth from sessions to JWT across API + frontend + mobile" },
          {
            role: "agent",
            name: "orchestrator",
            text: (
              <div className="space-y-2">
                <p>Phase 1: plan. Exploring repo…</p>
                <p>Plan ready. 5 agents, 7 steps. Dependency graph attached. Token est: ~185k.</p>
                <ol className="list-decimal pl-5">
                  <li>database-architect — add <code>refresh_tokens</code> table, migration</li>
                  <li>backend-specialist — JWT issue/refresh/revoke endpoints</li>
                  <li>security-auditor — review signing, rotation, logout behaviour</li>
                  <li>frontend-specialist — replace session cookies with token storage + refresh</li>
                  <li>mobile-developer — Keychain/Keystore token storage + refresh in RN</li>
                </ol>
              </div>
            ),
          },
          { role: "gate", text: "HEAVY · 5 agents · ~185k tokens · MoSCoW + graph shown · [y/n/tweak]" },
          { role: "user", text: "y" },
          { role: "agent", name: "database-architect", text: "refresh_tokens table + 0012_jwt_auth migration. Done." },
          { role: "agent", name: "backend-specialist", text: "Issue/refresh/revoke wired. Legacy session endpoints deprecated with 410 + sunset header." },
          { role: "agent", name: "security-auditor", text: "HS256 → RS256 recommended. Rotation every 7d. All good otherwise. Applied." },
          { role: "agent", name: "frontend-specialist", text: "Token storage in httpOnly refresh + in-memory access. Axios interceptor for refresh." },
          { role: "agent", name: "mobile-developer", text: "iOS Keychain + Android Keystore. Refresh on app foreground. Tested on both sims." },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Use orchestrate when the risk is &ldquo;one agent forgot the other domain.&rdquo;</strong> The plan phase makes hand-offs explicit.</li>
        <li><strong>Tweak the plan, not the prompt.</strong> The HEAVY gate accepts <code>tweak</code> — use it to reorder steps or drop an agent.</li>
        <li><strong>Ledger afterwards.</strong> <code>/hub:ledger by-agent</code> reveals which specialist ate the most tokens. Next time, you can warn them to be conservative.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/create">Create</Link> — lighter, single-chain scaffolding for greenfield.</li>
        <li><Link href="/docs/guide/skill-approval-gate">Approval gate</Link> — how the HEAVY frame is built.</li>
        <li><Link href="/docs/guide/agent-security-auditor">Security auditor</Link> — the agent that caught HS256 here.</li>
      </ul>
    </div>
  );
}
