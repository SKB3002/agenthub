import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Skill · Systematic debugging",
  description: "A repeatable method, not a list of tips. The skill hub:debugger always loads.",
};

export default function Page() {
  return (
    <div>
      <h1>Skill · Systematic debugging</h1>
      <p className="text-lg text-muted-foreground">
        A method. Six phases, in order, every time. The skill keeps <code>hub:debugger</code> from
        guessing — and keeps <em>you</em> from accepting a patch that only hides the symptom.
      </p>

      <h2>When it activates</h2>
      <p>
        Automatically on every <code>/hub:debug</code> dispatch, and when the main model decides a
        task is a bug (error keywords, stack traces, &ldquo;not working,&rdquo; &ldquo;fails on
        CI&rdquo;).
      </p>

      <h2>The six phases</h2>
      <ol className="list-decimal space-y-3 pl-5">
        <li>
          <strong>Reproduce.</strong> If the bug can&apos;t be reproduced, stop and ask for a
          repro. Don&apos;t move to isolate on a theory.
        </li>
        <li>
          <strong>Isolate.</strong> Bisect — time (when did it start?), surface (which endpoint /
          component?), input (which data triggers it?). One axis at a time.
        </li>
        <li>
          <strong>Minimise.</strong> Cut the repro to the smallest form that still fails.
          Throw-away code is fine here; it clarifies the cause.
        </li>
        <li>
          <strong>Root cause.</strong> State it as one sentence: <em>&ldquo;The bug is X because
          Y.&rdquo;</em> If you can&apos;t, you&apos;re still isolating.
        </li>
        <li>
          <strong>Fix.</strong> Targeted change. Nothing else. No &ldquo;while I&apos;m in
          here&rdquo; cleanup.
        </li>
        <li>
          <strong>Regression test.</strong> A test that fails before the fix and passes after. If
          there isn&apos;t one, the fix is incomplete.
        </li>
      </ol>

      <h2>What it refuses</h2>
      <ul>
        <li>Fixes without repro. The agent will ask for one instead of guessing.</li>
        <li>Refactors outside the blast radius. A one-line bug doesn&apos;t need a 40-line file rewrite.</li>
        <li>Patches that mask the symptom. &ldquo;Catch the error and log it&rdquo; is not a fix unless the error is expected.</li>
      </ul>

      <h2>Example: what the skill produces</h2>
      <CodeBlock
        lang="text"
        code={`Symptom:     POST /api/orders returns 500 every ~20 requests.

1. Reproduce: load test, 100 RPS for 60s. Got 47 failures out of 6000.
2. Isolate:   all failures share user_id ending in 00–09. Rest never fail.
3. Minimise: isolated to a UUID v4 collision check that was using substring
             comparison instead of full equality.
4. Root:     the bug is stale-cache reads returning "" (empty string) which
             substring-matches any short ID prefix.
5. Fix:      change check to strict equality; treat "" as cache miss.
6. Test:     added test that writes "" to cache and asserts cache-miss path.`}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Always include the phase in your review.</strong> If the agent jumped from 1 → 4, make it back up.</li>
        <li><strong>Accept only with a test.</strong> No test, no merge. This is the most-broken rule.</li>
        <li><strong>Save the repro.</strong> If it was hard to reproduce, keep the repro — it becomes the regression test.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/agent-debugger">hub:debugger</Link> — the agent that always loads this skill.</li>
        <li><Link href="/docs/guide/debug">/hub:debug</Link> — the command that dispatches it.</li>
        <li><Link href="/docs/guide/skill-clean-code">Clean code</Link> — paired on every fix.</li>
      </ul>
    </div>
  );
}
