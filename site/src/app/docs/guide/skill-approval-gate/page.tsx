import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Skill · Approval gate",
  description: "The governance layer behind every MEDIUM/HEAVY command — how tiers, MoSCoW, and the ledger connect.",
};

export default function Page() {
  return (
    <div>
      <h1>Skill · Approval gate</h1>
      <p className="text-lg text-muted-foreground">
        The skill every MEDIUM and HEAVY command loads to render its gate. It handles tier lookup,
        gate rendering, budget overlays, ledger writes, and the <code>--yes</code> bypass — so
        commands don&apos;t reinvent approval UX.
      </p>

      <h2>When it activates</h2>
      <p>
        Every time a command with <code>tier: MEDIUM</code> or <code>tier: HEAVY</code> in its
        frontmatter dispatches an agent. The skill reads the tier, constructs the frame, and asks
        the user.
      </p>

      <h2>What it teaches</h2>
      <ul>
        <li><strong>Gate shape per tier</strong> — LIGHT: none. MEDIUM: one line + y/n/tweak. HEAVY: full block (agents, skills, ~tokens, MoSCoW, alternatives).</li>
        <li><strong>MoSCoW scoping</strong> for HEAVY — always emit MUST/SHOULD/COULD/WON&apos;T, with WON&apos;T explicit so users see what&apos;s left out.</li>
        <li><strong>Budget overlay</strong> — if <code>.hub/budget.json</code> exists, the gate adds a line comparing the estimate to the budget.</li>
        <li><strong>Ledger write</strong> — every gate, approved or declined, appends to <code>.hub/usage.json</code>. Declined runs log zero spend but are still visible in <code>/hub:ledger</code>.</li>
        <li><strong>Bypass handling</strong> — <code>--yes</code> or <code>-y</code> as the first argument skips the prompt. Everything else still logs.</li>
      </ul>

      <h2>The HEAVY frame</h2>
      <CodeBlock
        lang="text"
        code={`HEAVY — /hub:<command> "<summary>"

Planned agents:
  - hub:<agent-1>    (<role>)
  - hub:<agent-2>    (<role>)
  ...

Skills loaded:
  <skill-1>, <skill-2>, ...

Token estimate:  ~<P50>  (P50: ~<P50>, P95: ~<P95>)
Session budget:  <OK | WARN | OVER>  (<used> / <cap>)   [only if .hub/budget.json set]

MoSCoW scope:
  MUST   — ...
  SHOULD — ...
  COULD  — ...
  WON'T  — ...

Lighter alternatives:
  A) /hub:<other>  — <why>
  B) /hub:plan only — ship a plan first, build later

Proceed? [y/n/tweak]`}
      />
      <p>
        Every HEAVY gate matches this template. If a command&apos;s frontmatter or dispatch
        information doesn&apos;t supply a section, the skill refuses to dispatch — better to ask
        than to silently skip.
      </p>

      <h2>Tweak mode</h2>
      <p>
        Replying <code>tweak</code> at the prompt lets you adjust scope <em>without</em> retyping
        the whole command. Common tweaks:
      </p>
      <ul>
        <li><code>drop backend-specialist</code> — remove an agent from the chain.</li>
        <li><code>reduce scope: keep MUST only</code> — cut SHOULD/COULD to shrink the estimate.</li>
        <li><code>tighter: no email, no billing</code> — free-form constraints.</li>
      </ul>

      <h2>Ledger mechanics</h2>
      <p>
        <code>.hub/usage.json</code> is append-only, project-local, and gitignored. Each entry
        stores: timestamp, command, tier, planned agents/skills, estimate, actual tokens,
        disposition (approved / declined / bypassed), and optional ROI tag. <code>/hub:ledger</code>{" "}
        is the read-only view.
      </p>

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Don&apos;t blanket-bypass.</strong> <code>--yes</code> is for cases you&apos;ve run before. New or HEAVY commands deserve a look at the frame.</li>
        <li><strong>Set a budget early.</strong> <code>/hub:budget low</code> overlays a useful reminder without changing behaviour.</li>
        <li><strong>Tag after runs.</strong> <code>/hub:ledger tag last useful|partial|wasted</code> feeds the ROI view.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/tiers">Tiers & gates reference</Link></li>
        <li><Link href="/docs/ledger">Usage ledger</Link></li>
        <li><Link href="/docs/skills">All skills</Link></li>
      </ul>
    </div>
  );
}
