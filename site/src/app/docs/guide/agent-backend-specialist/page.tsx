import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "hub:backend-specialist",
  description: "API routes, services, business logic in Node/Python/edge — with a real example.",
};

export default function Page() {
  return (
    <div>
      <h1>hub:backend-specialist</h1>
      <p className="text-lg text-muted-foreground">
        APIs, services, business logic. Equally fluent in Node.js (Express, Fastify, Next API
        routes), Python (FastAPI, Flask), and edge runtimes.
      </p>

      <h2>What it&apos;s good at</h2>
      <ul>
        <li>REST / GraphQL / tRPC endpoint design — with validation at the boundary.</li>
        <li>Business logic organised into services, not fat controllers.</li>
        <li>Auth flows, rate limiting, idempotency, webhooks.</li>
        <li>Integrations — Stripe, Resend, Twilio, S3 — with the right error model.</li>
      </ul>

      <h2>What it won&apos;t do</h2>
      <ul>
        <li>Design the schema. <code>hub:database-architect</code> handles that first.</li>
        <li>Build UI. <Link href="/docs/guide/agent-frontend-specialist">frontend-specialist</Link>.</li>
        <li>Deploy. <code>hub:devops-engineer</code>.</li>
      </ul>

      <h2>Skills it loads</h2>
      <p>
        <code>api-patterns</code>, <code>clean-code</code>, <code>nodejs-best-practices</code>,{" "}
        <code>python-patterns</code>, <code>fastapi-expert</code>, <code>sqlalchemy-expert</code>,{" "}
        <code>mcp-builder</code>, <code>database-design</code>, <code>lint-and-validate</code> (13
        total — the agent picks what&apos;s relevant).
      </p>

      <h2>When Claude auto-dispatches it</h2>
      <p>
        Triggers: <em>API, endpoint, route, service, webhook, REST, GraphQL, tRPC, FastAPI, backend,
        server, auth, database integration</em>.
      </p>

      <h2>Example session</h2>
      <Dialogue
        title="Add a Stripe webhook"
        lines={[
          { role: "user", text: "add a /api/webhooks/stripe route that validates the signature and updates the subscription state" },
          {
            role: "agent",
            name: "backend-specialist",
            text: (
              <div className="space-y-2">
                <p>Shape: POST, raw body, <code>stripe-signature</code> header verify via Stripe SDK, idempotent upsert against <code>subscriptions</code> table.</p>
                <p>Wrote:</p>
                <ul className="list-disc pl-5">
                  <li><code>app/api/webhooks/stripe/route.ts</code> — uses <code>config.api.bodyParser = false</code>-style raw read in App Router.</li>
                  <li><code>lib/stripe/webhook.ts</code> — handlers per event type, each pure and unit-testable.</li>
                  <li><code>lib/stripe/verify.ts</code> — signature + timestamp-skew check.</li>
                </ul>
                <p>Tests:</p>
                <ul className="list-disc pl-5">
                  <li>Replay attack rejected (stale timestamp).</li>
                  <li>Unknown event type returns 200 but no-ops.</li>
                  <li>Duplicate event id — idempotent, no double-update.</li>
                </ul>
                <p>Left a <code>STRIPE_WEBHOOK_SECRET</code> entry in <code>.env.example</code>.</p>
              </div>
            ),
          },
        ]}
      />

      <h2>Direct call</h2>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock lang="text" code="/hub:agent-backend-specialist add webhook for Stripe subscriptions with signature verify" /> },
          { id: "codex", label: "Codex", content: <CodeBlock lang="text" code="@hub agent-backend-specialist add webhook for Stripe subscriptions with signature verify" /> },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Say the validation library.</strong> &ldquo;Zod&rdquo;, &ldquo;Pydantic&rdquo;, &ldquo;joi&rdquo; — it&apos;ll match your project&apos;s style.</li>
        <li><strong>Ask for tests explicitly</strong> for webhooks and auth flows. The agent will write happy-path only otherwise.</li>
        <li><strong>Pair it with security-auditor</strong> for anything touching auth, billing, or PII.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/agent-security-auditor">Security auditor</Link> — review what backend-specialist wrote.</li>
        <li><Link href="/docs/guide/skill-clean-code">Clean code</Link> — the floor for every diff.</li>
        <li><Link href="/docs/agents">All agents</Link></li>
      </ul>
    </div>
  );
}
