import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "Debug walkthrough",
  description: "How /hub:debug finds root causes — not symptoms — with a real off-by-one example.",
};

export default function Page() {
  return (
    <div>
      <h1>Debug</h1>
      <p className="text-lg text-muted-foreground">
        <code>/hub:debug</code> dispatches <code>hub:debugger</code> with the systematic-debugging
        skill. You describe the symptom; it finds the root cause and proposes a fix.
      </p>

      <h2>When to use it</h2>
      <ul>
        <li>A bug, crash, intermittent failure, or weird behaviour you can reproduce or describe clearly.</li>
        <li>You&apos;ve tried the obvious and it didn&apos;t work.</li>
        <li>You want the <em>why</em>, not just a patch.</li>
      </ul>

      <h2>When NOT to use it</h2>
      <ul>
        <li>You want to build a feature. Use <Link href="/docs/guide/plan">plan</Link>.</li>
        <li>The bug is just &ldquo;this line is wrong.&rdquo; Fix it directly — don&apos;t spend tokens on trivial.</li>
      </ul>

      <h2>Invocation</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock code={`/hub:debug GET /days-until/2026-05-15 returns 1 day short`} lang="text" /> },
          { id: "codex", label: "Codex", content: <CodeBlock code={`@hub debug GET /days-until/2026-05-15 returns 1 day short`} lang="text" /> },
        ]}
      />

      <h2>Example session</h2>
      <Dialogue
        title="The off-by-one date bug"
        lines={[
          { role: "user", text: "/hub:debug GET /days-until/2026-05-15 returns 1 day short" },
          { role: "gate", text: "MEDIUM · hub:debugger · systematic-debugging + testing-patterns · ~22k · [y/n/tweak]" },
          { role: "user", text: "y" },
          {
            role: "agent",
            name: "debugger",
            text: (
              <div className="space-y-2">
                <p><strong>Reproduce</strong>: curl confirms it — response says <code>{`{"days": 85}`}</code>, actual calendar distance is 86.</p>
                <p><strong>Isolate</strong>: the math is <code>{`Math.floor((target - now) / 86_400_000)`}</code>. With any target-time earlier in the day than <em>now</em>, you lose a day to the floor.</p>
                <p><strong>Root cause</strong>: not timezone — floating-point division + floor on a sub-day remainder. Affects ~50% of requests.</p>
                <p><strong>Fix</strong>: compare calendar days in UTC:</p>
                <pre className="rounded border border-border bg-muted p-2 text-xs"><code>{`const toUtcDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
const days = Math.round((toUtcDay(target) - toUtcDay(now)) / 86_400_000);`}</code></pre>
                <p>Diff applied. Added contract test covering this case. Passing.</p>
              </div>
            ),
          },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Give a repro in the prompt.</strong> A concrete request/response pair saves the agent an entire isolate step.</li>
        <li><strong>Always ask for a regression test.</strong> Debug that doesn&apos;t leave a test behind is a bug waiting to come back.</li>
        <li><strong>Chain with test:</strong> <code>/hub:debug &lt;symptom&gt;</code> → <code>/hub:test</code> → done. Don&apos;t skip the second step.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/agent-debugger">Debugger</Link> — the agent this dispatches.</li>
        <li><Link href="/docs/guide/skill-systematic-debugging">Systematic debugging</Link> — the method it follows.</li>
        <li><Link href="/docs/guide/skill-clean-code">Clean code</Link> — the quality filter applied to the fix.</li>
      </ul>
    </div>
  );
}
