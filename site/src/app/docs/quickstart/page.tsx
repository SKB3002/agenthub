import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Run your first AgentHub command and understand the approval gate.",
};

export default function QuickstartPage() {
  return (
    <div>
      <h1>Quickstart</h1>
      <p className="text-lg text-muted-foreground">
        Assuming you&apos;ve <Link href="/docs/install">installed AgentHub</Link>, this page walks
        through your first real command so you know what to expect.
      </p>

      <h2>1. Check it&apos;s loaded</h2>
      <p>Run the capability index — it&apos;s LIGHT, so no gate:</p>
      <CodeBlock code="/hub:help" lang="text" />
      <p>
        On Codex: <code>@hub help</code>. You should see 17 commands, 20 agents, and 42 skills
        listed.
      </p>

      <h2>2. Run something MEDIUM</h2>
      <p>
        Pick a small real task. A bug, a feature idea, anything. Try:
      </p>
      <CodeBlock code="/hub:debug login returns 500 after the reset-password flow" lang="text" />
      <p>
        Because <code>debug</code> is MEDIUM, you&apos;ll see a one-line preview and a prompt —
        something like:
      </p>
      <CodeBlock
        code={`MEDIUM: dispatch hub:debugger with systematic-debugging + testing-patterns
estimate: ~18k tokens

Proceed? [y/n/tweak]`}
        lang="text"
      />
      <p>
        Type <code>y</code> to run, <code>n</code> to cancel, or type <code>tweak</code> followed by
        a short instruction to adjust scope before dispatching.
      </p>

      <h2>3. Run something HEAVY</h2>
      <p>
        The HEAVY tier is where AgentHub really earns its name. Try:
      </p>
      <CodeBlock code="/hub:create minimal Next.js SaaS landing page with Stripe checkout" lang="text" />
      <p>
        The gate now shows <strong>planned agents</strong>, <strong>skills</strong>, a <strong>token
        estimate</strong>, a <strong>MoSCoW scope</strong>, and at least two <strong>lighter
        alternatives</strong>. Nothing fans out until you approve.
      </p>

      <h2>4. Bypass the gate when you know what you want</h2>
      <p>
        Pass <code>--yes</code> (or <code>-y</code>) as the first argument to skip the prompt. Usage
        still logs to <code>.hub/usage.json</code>.
      </p>
      <CodeBlock code="/hub:debug -y login returns 500 after reset-password" lang="text" />

      <h2>5. Review what you spent</h2>
      <p>
        <code>/hub:ledger weekly</code> (or <code>@hub ledger weekly</code>) shows ISO-week totals
        by tier, top agents, and top skills — pulled from the local{" "}
        <code>.hub/usage.json</code> file. It never leaves your machine.
      </p>

      <h2>Next steps</h2>
      <ul>
        <li>Read the <Link href="/docs/workflows">recommended workflow</Link> for multi-step work.</li>
        <li>
          Browse the <Link href="/docs/commands">commands reference</Link> for the full list.
        </li>
        <li>
          Learn the <Link href="/docs/tiers">approval-gate tiers</Link> in depth.
        </li>
      </ul>
    </div>
  );
}
