import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "Brainstorm walkthrough",
  description:
    "How /hub:brainstorm actually works — a live example, the approval gate, and when to skip it.",
};

export default function Page() {
  return (
    <div>
      <h1>Brainstorm</h1>
      <p className="text-lg text-muted-foreground">
        <code>/hub:brainstorm</code> generates 3+ labelled options with trade-offs for any
        direction you&apos;re unsure about — before you commit to writing code.
      </p>

      <h2>When to use it</h2>
      <ul>
        <li>You have a vague idea and don&apos;t know the right shape yet.</li>
        <li>You&apos;re picking a library, pattern, or architecture and want the trade-offs surfaced.</li>
        <li>You want a second opinion that won&apos;t defer to whatever you suggest first.</li>
      </ul>

      <h2>When NOT to use it</h2>
      <ul>
        <li>
          You already know what to build. Skip brainstorm, go straight to{" "}
          <Link href="/docs/guide/plan">plan</Link>.
        </li>
        <li>
          You&apos;re fixing a bug. Use <Link href="/docs/guide/debug">debug</Link> — brainstorm
          will generate 3 theories when you need a root cause.
        </li>
      </ul>

      <h2>Invocation</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock code="/hub:brainstorm llm observability for a chatbot with 1000 concurrent users" lang="text" /> },
          { id: "codex", label: "Codex", content: <CodeBlock code="@hub brainstorm llm observability for a chatbot with 1000 concurrent users" lang="text" /> },
        ]}
      />

      <h2>What the approval gate looks like</h2>
      <p>
        Brainstorm is <strong>MEDIUM</strong>, so you get a one-line preview before dispatch:
      </p>
      <CodeBlock
        lang="text"
        code={`MEDIUM: dispatch hub:product-manager with socratic-gate + plan-writing
estimate: ~18k tokens

Proceed? [y/n/tweak]`}
      />

      <h2>Example session</h2>
      <Dialogue
        title="Picking an observability stack"
        lines={[
          { role: "user", text: <span>/hub:brainstorm llm observability for a chatbot with 1000 concurrent users</span> },
          { role: "gate", text: "MEDIUM · hub:product-manager · ~18k tokens · Proceed? [y/n/tweak]" },
          { role: "user", text: "y" },
          {
            role: "agent",
            name: "product-manager",
            text: (
              <div className="space-y-2">
                <p>
                  Three options with trade-offs:
                </p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    <strong>Managed-first (Langfuse + Grafana Cloud)</strong> — fastest to prod,
                    recurring SaaS cost. Best if your team hasn&apos;t built observability before.
                  </li>
                  <li>
                    <strong>OSS-core (OTel + Jaeger + Prometheus + Loki)</strong> — flexible,
                    cheaper at scale, higher ops burden. Best if you already run an observability stack.
                  </li>
                  <li>
                    <strong>Hybrid (recommended)</strong> — Langfuse for LLM signals, your existing
                    infra stack for system metrics. Balanced speed and control.
                  </li>
                </ol>
                <p>
                  Recommendation: <strong>option 3</strong>. Want me to{" "}
                  <code>/hub:plan</code> the rollout?
                </p>
              </div>
            ),
          },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li>
          <strong>Be specific in the prompt.</strong> &ldquo;Brainstorm state management&rdquo; gets
          generic. &ldquo;Brainstorm state management for a multi-tab editor with undo and 100+
          live collaborators&rdquo; gets tailored.
        </li>
        <li>
          <strong>Always ask for trade-offs by name</strong> (&ldquo;with trade-offs&rdquo;, &ldquo;with
          failure modes&rdquo;, &ldquo;with cost implications&rdquo;). Product-manager will
          structure accordingly.
        </li>
        <li>
          <strong>Don&apos;t run create after brainstorm.</strong> Run <code>/hub:plan</code> first —
          it turns the chosen option into a real file you can review.
        </li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/plan">Plan</Link> — commit the chosen direction to a file.</li>
        <li><Link href="/docs/guide/agent-project-planner">Project planner</Link> — the agent behind plan.</li>
        <li><Link href="/docs/guide/skill-approval-gate">Approval gate</Link> — how the prompt above is generated.</li>
      </ul>
    </div>
  );
}
