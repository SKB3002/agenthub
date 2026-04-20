import type { Metadata } from "next";
import { AGENT_GROUPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Agents",
  description:
    "20 specialist subagents — backend, frontend, database, security, DevOps, QA, and more. Each is dispatched by workflows or directly via Agent(subagent_type=\"hub:<name>\").",
};

export default function AgentsPage() {
  return (
    <div>
      <h1>Agents</h1>
      <p className="text-lg text-muted-foreground">
        20 specialist subagents, grouped by domain. Each one has its own briefing, its own toolset,
        and its own set of skills that load automatically when it&apos;s dispatched.
      </p>

      <div className="not-prose my-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
        <p className="font-semibold">Dispatching agents</p>
        <p className="mt-2 text-muted-foreground">
          Most of the time you don&apos;t dispatch agents directly — workflows like{" "}
          <code>/hub:create</code> and <code>/hub:enhance</code> pick the right ones for you. When
          you do need direct control, use{" "}
          <code>Agent(subagent_type=&quot;hub:&lt;name&gt;&quot;)</code> in Claude Code, or name the
          agent explicitly in your Codex prompt.
        </p>
      </div>

      {AGENT_GROUPS.map((group) => (
        <section key={group.title} className="not-prose mt-10 first:mt-0">
          <h2 className="mb-4 mt-0 border-b border-border pb-2 text-xl font-semibold">
            {group.title}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.agents.map((a) => (
              <div
                key={a.name}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/40 hover:bg-accent/30"
              >
                <code className="inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-brand">
                  hub:{a.name}
                </code>
                <p className="mt-2 text-sm text-foreground/80">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
