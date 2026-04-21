import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "Deploy walkthrough",
  description: "Pre-flight, staging, production, rollback — with what the gate actually checks.",
};

export default function Page() {
  return (
    <div>
      <h1>Deploy</h1>
      <p className="text-lg text-muted-foreground">
        <code>/hub:deploy</code> has four modes: <code>check</code>, <code>staging</code>,{" "}
        <code>production</code>, and <code>rollback</code>. All HEAVY. All gated. All logged.
      </p>

      <h2>Modes</h2>
      <ul>
        <li><code>/hub:deploy check</code> — pre-flight only. Lints, tests, env audit. No deploy.</li>
        <li><code>/hub:deploy staging</code> — runs <code>check</code> then deploys to staging.</li>
        <li><code>/hub:deploy production</code> — staging gate must have passed in this session.</li>
        <li><code>/hub:deploy rollback</code> — reverts to the previous release tag.</li>
      </ul>

      <h2>When NOT to use it</h2>
      <ul>
        <li>No CI wired yet. Use your platform&apos;s native deploy first; add AgentHub once the pipeline is boring.</li>
        <li>You&apos;re just testing locally. Use <code>/hub:preview</code>.</li>
      </ul>

      <h2>Invocation</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock lang="text" code={`/hub:deploy staging
/hub:deploy production
/hub:deploy rollback`} /> },
          { id: "codex", label: "Codex", content: <CodeBlock lang="text" code={`@hub deploy staging
@hub deploy production
@hub deploy rollback`} /> },
        ]}
      />

      <h2>What pre-flight actually checks</h2>
      <ul>
        <li>Git: clean tree, branch is ahead of <code>main</code> only by expected commits, no unresolved merge conflicts.</li>
        <li>Tests: all green on latest commit; coverage hasn&apos;t regressed.</li>
        <li>Env: required variables present in the target environment&apos;s config.</li>
        <li>Dependencies: no known CVEs (via <code>vulnerability-scanner</code> skill).</li>
        <li>Migrations: any new schema change has a down path.</li>
      </ul>

      <h2>Example session</h2>
      <Dialogue
        title="Shipping to staging then prod"
        lines={[
          { role: "user", text: "/hub:deploy staging" },
          { role: "gate", text: "HEAVY · hub:devops-engineer · ~48k tokens · preflight + deploy-staging · [y/n/tweak]" },
          { role: "user", text: "y" },
          { role: "agent", name: "devops-engineer", text: "Preflight: 124 tests green, coverage stable, no new CVEs. All env vars present for staging. Deploying…" },
          { role: "agent", name: "devops-engineer", text: "Staging up at https://staging.example.com. Smoke checks pass. Release tagged v1.4.0-rc.1." },
          { role: "user", text: "looks good. /hub:deploy production" },
          { role: "gate", text: "HEAVY · hub:devops-engineer · ~35k tokens · staging gate passed this session · [y/n/tweak]" },
          { role: "user", text: "y" },
          { role: "agent", name: "devops-engineer", text: "Deploying v1.4.0. Rolling update, 3 instances at a time. Post-deploy /healthz and error-rate watch for 5 min. Green. Release v1.4.0 live." },
        ]}
      />

      <h2>Rollback</h2>
      <p>
        <code>/hub:deploy rollback</code> reverts to the previous release tag, pauses, and asks for
        confirmation before flipping traffic. Use when a post-deploy alert fires — it&apos;s faster
        than fixing forward on a hot path.
      </p>

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Always run <code>check</code> before staging</strong> if you haven&apos;t pushed in a while — it surfaces stale CI.</li>
        <li><strong>Use tags for rollback.</strong> If your deploys aren&apos;t tagged, rollback has nothing to target.</li>
        <li><strong>Don&apos;t ship from a dirty tree.</strong> The pre-flight refuses anyway, but fix the habit.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/agent-security-auditor">Security auditor</Link> — review hardening before prod.</li>
        <li><Link href="/docs/tiers">Tiers & gates</Link> — HEAVY mechanics.</li>
        <li><Link href="/docs/ledger">Usage ledger</Link> — audit deploy spend over time.</li>
      </ul>
    </div>
  );
}
