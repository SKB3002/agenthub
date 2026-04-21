import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "hub:security-auditor",
  description: "OWASP 2025, zero-trust, supply-chain review — the defender.",
};

export default function Page() {
  return (
    <div>
      <h1>hub:security-auditor</h1>
      <p className="text-lg text-muted-foreground">
        The defender. Reviews code and config against OWASP 2025, zero-trust principles, and
        supply-chain threats. Ships findings with severity, evidence, and a recommended fix.
      </p>

      <h2>What it&apos;s good at</h2>
      <ul>
        <li>Auth flows — session handling, token storage, CSRF, password reset, OAuth redirects.</li>
        <li>Input validation, output encoding, injection classes (SQL, NoSQL, command, SSTI).</li>
        <li>Supply chain — dependency CVEs, post-install scripts, lockfile health.</li>
        <li>Secrets hygiene — no hardcoded creds, .env discipline, rotation readiness.</li>
      </ul>

      <h2>What it won&apos;t do</h2>
      <ul>
        <li>Penetration test / exploit. That&apos;s <code>hub:penetration-tester</code>.</li>
        <li>Fix code it&apos;s reviewing — it recommends, the relevant specialist fixes.</li>
        <li>Compliance sign-off (SOC 2, ISO). It helps you prepare, not certify.</li>
      </ul>

      <h2>Skills it loads</h2>
      <p>
        <code>vulnerability-scanner</code>, <code>clean-code</code>,{" "}
        <code>code-review-checklist</code>, <code>api-patterns</code>.
      </p>

      <h2>When Claude auto-dispatches it</h2>
      <p>
        Triggers: <em>security, vulnerability, OWASP, auth, login, session, CSRF, XSS, injection,
        secret, credentials, supply chain, CVE</em>.
      </p>

      <h2>Example session</h2>
      <Dialogue
        title="Auditing a new auth flow"
        lines={[
          { role: "user", text: "review the new /api/auth/reset-password route for issues. use hub:security-auditor." },
          {
            role: "agent",
            name: "security-auditor",
            text: (
              <div className="space-y-2">
                <p>Reviewed. 4 findings:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li><strong>HIGH</strong> · Token comparison uses <code>===</code>. Timing attack surface. Switch to <code>crypto.timingSafeEqual</code>.</li>
                  <li><strong>HIGH</strong> · Token lifetime is 7 days. OWASP says ≤1 hour for reset tokens. Lower to 1h.</li>
                  <li><strong>MEDIUM</strong> · Rate limit missing on <code>/api/auth/reset-password</code>. One IP can enumerate. Add 5/hour per IP + per email.</li>
                  <li><strong>LOW</strong> · Response leaks &ldquo;user not found&rdquo; vs &ldquo;email sent&rdquo;. Return identical 200 in both cases.</li>
                </ul>
                <p>Severity follows OWASP. Evidence and test vectors attached. Hand to <code>hub:backend-specialist</code> to apply.</p>
              </div>
            ),
          },
        ]}
      />

      <h2>Direct call</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock lang="text" code="/hub:agent-security-auditor review /api/auth/reset-password for OWASP issues" /> },
          { id: "codex", label: "Codex", content: <CodeBlock lang="text" code="@hub agent-security-auditor review /api/auth/reset-password for OWASP issues" /> },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Audit before deploy, not after.</strong> Include it in the <code>/hub:deploy check</code> step if the diff touches auth/billing/PII.</li>
        <li><strong>Ask for severity + evidence.</strong> Default output is findings; add &ldquo;with severity and exploitable evidence&rdquo; to get the full breakdown.</li>
        <li><strong>Pair with backend-specialist</strong> for the fix — auditor recommends, specialist applies.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/agent-backend-specialist">Backend specialist</Link> — applies the fixes.</li>
        <li><Link href="/docs/guide/deploy">Deploy</Link> — wire this into pre-flight.</li>
        <li><Link href="/docs/agents">All agents</Link></li>
      </ul>
    </div>
  );
}
