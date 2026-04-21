import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Skill · Clean code",
  description: "The quality floor every agent loads — what it enforces and what it explicitly tolerates.",
};

export default function Page() {
  return (
    <div>
      <h1>Skill · Clean code</h1>
      <p className="text-lg text-muted-foreground">
        Loaded by almost every agent. The quality floor for everything AgentHub writes — not a
        style guide, a set of opinionated choices about what &ldquo;done&rdquo; means.
      </p>

      <h2>When it activates</h2>
      <p>
        Automatically, on every dispatch to <code>backend-specialist</code>,{" "}
        <code>frontend-specialist</code>, <code>debugger</code>, <code>test-engineer</code>,{" "}
        <code>database-architect</code>, and several others. You rarely invoke it yourself.
      </p>

      <h2>What it teaches (the short list)</h2>
      <ul>
        <li><strong>No premature abstraction.</strong> Three similar lines is fine. Don&apos;t extract a helper for two.</li>
        <li><strong>No defensive code for impossible inputs.</strong> Trust internal boundaries; validate at system boundaries only.</li>
        <li><strong>Comments explain <em>why</em>, not <em>what</em>.</strong> Good names replace most comments.</li>
        <li><strong>No backwards-compat shims</strong> unless the data on the other side is out of your control.</li>
        <li><strong>No half-finished implementations.</strong> Complete the feature or revert it.</li>
        <li><strong>No cleanup you weren&apos;t asked for.</strong> A bug fix is a bug fix. Not a refactor.</li>
      </ul>

      <h2>Example: what clean-code refuses</h2>
      <p>
        A prompt saying <em>&ldquo;add a comment explaining this loop&rdquo;</em> will produce:
      </p>
      <CodeBlock
        lang="ts"
        code={`// No comment added — the loop's name (chunkByMonth) already describes it.
// Adding "loops through months and chunks entries" restates the code.`}
      />
      <p>
        The agent will write a comment only if the &ldquo;why&rdquo; is non-obvious (hidden
        invariant, workaround for a known bug, surprising behaviour).
      </p>

      <h2>Example: what clean-code produces</h2>
      <p>Asked to fix a pagination bug:</p>
      <CodeBlock
        lang="diff"
        code={`- const pageSize = 50;
- const results = await db.users.findAll();
- return results.slice(0, pageSize);
+ const results = await db.users.findAll({ limit: 50 });
+ return results;`}
      />
      <p>
        No added comment, no renamed vars, no extracted helper, no type annotations added &ldquo;for
        consistency.&rdquo; The bug is fixed. Nothing else changes.
      </p>

      <h2>Where it lives</h2>
      <p>
        <code>skills/clean-code/SKILL.md</code> is ~1k tokens of rules. Every agent that loads it
        reads those rules at dispatch time — they&apos;re not baked into the model, they&apos;re
        on-demand context.
      </p>

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Don&apos;t fight it.</strong> If an agent refuses to add a comment you asked for, it&apos;s not being lazy — it&apos;s applying this skill. Rephrase to explain the <em>why</em>.</li>
        <li><strong>Project overrides go in <code>.hub/instincts.yaml</code>.</strong> That&apos;s how you encode team-specific rules that should beat this skill.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/skill-systematic-debugging">Systematic debugging</Link> — pairs with clean-code for the debugger.</li>
        <li><Link href="/docs/guide/skill-approval-gate">Approval gate</Link> — the other skill every command loads.</li>
        <li><Link href="/docs/skills">All skills</Link></li>
      </ul>
    </div>
  );
}
