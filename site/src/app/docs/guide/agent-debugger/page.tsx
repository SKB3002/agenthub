import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "hub:debugger",
  description: "The specialist for hard bugs — methodical, not lucky.",
};

export default function Page() {
  return (
    <div>
      <h1>hub:debugger</h1>
      <p className="text-lg text-muted-foreground">
        The hard-bugs specialist. Loads the <code>systematic-debugging</code> skill so it follows a
        method — reproduce, isolate, minimise, root cause, fix, regression test — instead of
        patching symptoms.
      </p>

      <h2>What it&apos;s good at</h2>
      <ul>
        <li>Intermittent bugs, race conditions, flaky tests.</li>
        <li>Performance regressions with unclear cause.</li>
        <li>Subtle logic errors (off-by-one, timezone, float math).</li>
        <li>Reading stack traces from languages you don&apos;t read daily.</li>
      </ul>

      <h2>What it won&apos;t do</h2>
      <ul>
        <li>Guess. If it can&apos;t reproduce, it&apos;ll ask for a repro rather than invent one.</li>
        <li>Skip the test. A fix without a regression test is incomplete by design.</li>
        <li>Refactor unrelated code. Stays in the blast radius of the bug.</li>
      </ul>

      <h2>Skills it loads</h2>
      <p>
        <code>systematic-debugging</code>, <code>clean-code</code>, <code>testing-patterns</code>,{" "}
        <code>code-review-checklist</code>.
      </p>

      <h2>When Claude auto-dispatches it</h2>
      <p>
        Triggers: <em>bug, error, crash, stack trace, intermittent, flaky, regression, &ldquo;not
        working&rdquo;, &ldquo;works locally but not in prod&rdquo;</em>.
      </p>

      <h2>Example session</h2>
      <Dialogue
        title="Flaky test"
        lines={[
          { role: "user", text: "the login.spec.ts test is flaky. Passes locally, fails ~20% on CI. use hub:debugger." },
          {
            role: "agent",
            name: "debugger",
            text: (
              <div className="space-y-2">
                <p><strong>Reproduce</strong>: ran the test in a loop 50× locally — passed every time. Raised CI concurrency to match, repro-ed on run 13.</p>
                <p><strong>Isolate</strong>: CI runs 4 workers in parallel. Test seeds a user with a hardcoded email. Two workers collide → 500 from DB unique-violation → test times out instead of failing loudly.</p>
                <p><strong>Root cause</strong>: shared DB + non-unique seed. Not a product bug — a test-isolation bug.</p>
                <p><strong>Fix</strong>: seed emails use <code>{`\`user-\${crypto.randomUUID()}@test.local\``}</code>. Changed DB error path in the signup route to surface 409 (not 500) on duplicate email — would have made this visible six months ago.</p>
                <p><strong>Regression test</strong>: added a test that runs signup twice in parallel and asserts one 200 + one 409.</p>
              </div>
            ),
          },
        ]}
      />

      <h2>Direct call</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock lang="text" code="/hub:agent-debugger login.spec.ts flakes on CI but not locally" /> },
          { id: "codex", label: "Codex", content: <CodeBlock lang="text" code="@hub agent-debugger login.spec.ts flakes on CI but not locally" /> },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Give it a repro or admit you don&apos;t have one.</strong> Both are fine. Lying about it wastes tokens.</li>
        <li><strong>Share the error in full.</strong> Stack trace + logs for 10 lines before the failure. Trimming hides the root cause.</li>
        <li><strong>Insist on a regression test.</strong> Default prompt: say &ldquo;with a regression test&rdquo; — should-be-default but isn&apos;t always.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/skill-systematic-debugging">Systematic debugging</Link> — the method it follows.</li>
        <li><Link href="/docs/guide/debug">/hub:debug</Link> — the command that dispatches it.</li>
        <li><Link href="/docs/guide/skill-clean-code">Clean code</Link> — applied to every fix.</li>
      </ul>
    </div>
  );
}
