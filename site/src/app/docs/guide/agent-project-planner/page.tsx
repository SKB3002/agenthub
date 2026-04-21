import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "hub:project-planner",
  description: "Task breakdown, dependency graphs, docs/PLAN-*.md — how plans get written.",
};

export default function Page() {
  return (
    <div>
      <h1>hub:project-planner</h1>
      <p className="text-lg text-muted-foreground">
        The agent behind <code>/hub:plan</code>. Turns a goal into a dependency-graph-aware plan
        file — with step assignments, task estimates, and scope cuts.
      </p>

      <h2>What it&apos;s good at</h2>
      <ul>
        <li>Splitting a vague goal into ordered tasks with explicit hand-offs.</li>
        <li>Deciding <em>which</em> agent should own each step (without duplicating work).</li>
        <li>Cutting scope — MoSCoW by default, with &ldquo;WON&apos;T&rdquo; stated explicitly.</li>
        <li>Producing <code>docs/PLAN-&lt;slug&gt;.md</code> that survives your next session.</li>
      </ul>

      <h2>What it won&apos;t do</h2>
      <ul>
        <li>Write code. That&apos;s a non-goal — if you&apos;re doing both, use <code>/hub:create</code>.</li>
        <li>Plan multi-domain orchestration. That&apos;s <code>hub:orchestrator</code> — it&apos;s a superset.</li>
        <li>Invent requirements. If your goal is under-specified, it asks (via the socratic-gate skill).</li>
      </ul>

      <h2>Skills it loads</h2>
      <p>
        <code>plan-writing</code>, <code>architecture</code>, <code>socratic-gate</code>,{" "}
        <code>clean-code</code>, <code>documentation-templates</code>.
      </p>

      <h2>When Claude auto-dispatches it</h2>
      <p>
        Triggers: <em>plan, break down, roadmap, task list, dependency graph, milestones,
        PLAN.md, architecture plan</em>.
      </p>

      <h2>Example session</h2>
      <Dialogue
        title="Planning a data-export feature"
        lines={[
          { role: "user", text: "/hub:plan add async CSV export for users, email when ready, retention 7 days" },
          {
            role: "agent",
            name: "project-planner",
            text: (
              <div className="space-y-2">
                <p>Explored repo (Next.js + Prisma + Postgres + Resend). Plan written to <code>docs/PLAN-csv-export.md</code>. Summary:</p>
                <ol className="list-decimal pl-5">
                  <li>DB: <code>export_jobs</code> table — id, user_id, status, url, expires_at. Migration staged.</li>
                  <li>Backend: <code>POST /api/exports</code> returns 202 + job id. Worker route <code>/api/jobs/run</code> generates CSV, stores in R2, updates job, sends email via Resend.</li>
                  <li>Frontend: <code>&lt;ExportButton&gt;</code> on settings page, poll-based status.</li>
                  <li>Infra: daily cron purges jobs older than 7d (Vercel Cron).</li>
                </ol>
                <p>Dependency graph: DB → Backend → Frontend; Infra parallel to Frontend. MoSCoW: MUST happy path + retention; SHOULD retry on email fail; COULD inline small exports (≤1000 rows).</p>
                <p>Next: <code>/hub:enhance --from docs/PLAN-csv-export.md</code>.</p>
              </div>
            ),
          },
        ]}
      />

      <h2>Direct call</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock lang="text" code="/hub:agent-project-planner plan async CSV export with email notification" /> },
          { id: "codex", label: "Codex", content: <CodeBlock lang="text" code="@hub agent-project-planner plan async CSV export with email notification" /> },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Feed it the repo.</strong> No prompt tweak beats letting the planner actually glob your stack first.</li>
        <li><strong>Read the &ldquo;WON&apos;T&rdquo; line.</strong> That&apos;s where plans fail — the planner is telling you what&apos;s <em>not</em> in scope. Agree or tweak.</li>
        <li><strong>Git-track plan files.</strong> They age into great PR descriptions.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/plan">/hub:plan</Link> — the command that dispatches it.</li>
        <li><Link href="/docs/guide/orchestrate">Orchestrate</Link> — for multi-agent plans.</li>
        <li><Link href="/docs/guide/skill-app-builder">App builder</Link> — skill it overlaps with for greenfield.</li>
      </ul>
    </div>
  );
}
