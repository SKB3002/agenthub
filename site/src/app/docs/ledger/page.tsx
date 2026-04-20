import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Usage ledger",
  description:
    "Audit your AgentHub token spend. The .hub/usage.json file is append-only, project-local, gitignored, and never leaves your machine.",
};

export default function LedgerPage() {
  return (
    <div>
      <h1>Usage ledger</h1>
      <p className="text-lg text-muted-foreground">
        Every AgentHub command appends a row to <code>.hub/usage.json</code>. That file is
        project-local, gitignored by default, and never sent anywhere.{" "}
        <code>/hub:ledger</code> is a LIGHT command that reads and aggregates it locally.
      </p>

      <h2>Views</h2>
      <ul>
        <li>
          <code>/hub:ledger</code> — default summary, last 7 days.
        </li>
        <li>
          <code>/hub:ledger weekly</code> — ISO-week totals by tier, top agents, top skills.
        </li>
        <li>
          <code>/hub:ledger by-agent</code> — aggregate spend by agent.
        </li>
        <li>
          <code>/hub:ledger by-skill</code> — aggregate spend by skill.
        </li>
        <li>
          <code>/hub:ledger by-tier</code> — observed tokens vs. declared tier.
        </li>
        <li>
          <code>/hub:ledger roi</code> — useful / wasted / partial ratios based on runs you tag.
        </li>
      </ul>

      <h2>Tagging ROI</h2>
      <p>
        After a command finishes, you can tag the run to feed <code>ledger roi</code>:
      </p>
      <CodeBlock
        code={`/hub:ledger tag last useful       # the output was directly useful
/hub:ledger tag last partial      # some use, needed rework
/hub:ledger tag last wasted       # output was discarded`}
        lang="text"
      />

      <h2>Honesty contract</h2>
      <p>
        Every token number in AgentHub output is prefixed with <code>~</code>. We never convert to
        dollars, and we never display a provider quota or reset-timestamp number unless you paste
        it in yourself.
      </p>

      <h2>Privacy</h2>
      <p>
        <code>.hub/usage.json</code> is gitignored. <code>.hub/budget.json</code> (optional
        project-local budget override) is also gitignored. <code>.hub/instincts.yaml</code> (team
        preferences) is git-tracked by default — it&apos;s meant to be shared.
      </p>
    </div>
  );
}
