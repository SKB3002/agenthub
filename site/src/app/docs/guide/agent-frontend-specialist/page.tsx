import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { Dialogue } from "@/components/dialogue";

export const metadata: Metadata = {
  title: "hub:frontend-specialist",
  description: "React, Next.js, Vue, Svelte — when Claude dispatches it, what it knows, and how to call it directly.",
};

export default function Page() {
  return (
    <div>
      <h1>hub:frontend-specialist</h1>
      <p className="text-lg text-muted-foreground">
        The agent Claude reaches for on components, state, styling, and responsive layout.
        Opinionated toward Next.js + Tailwind but fluent in Vue, Svelte, and vanilla React.
      </p>

      <h2>What it&apos;s good at</h2>
      <ul>
        <li>Component architecture — splitting server vs. client, handling loading/error boundaries.</li>
        <li>State — server state (fetch + cache), UI state (zustand, context), form state (RHF + zod).</li>
        <li>Styling — Tailwind-first, design-token aware, responsive by default.</li>
        <li>Performance — re-renders, bundle budget, Core Web Vitals (pairs with performance-optimizer).</li>
      </ul>

      <h2>What it won&apos;t do</h2>
      <ul>
        <li>Write the backend API. That&apos;s <Link href="/docs/guide/agent-backend-specialist">backend-specialist</Link>.</li>
        <li>Design a database. That&apos;s <code>hub:database-architect</code>.</li>
        <li>Create novel visual designs from scratch — it refines existing ones. For greenfield design, use <code>/hub:ui-ux-pro-max</code>.</li>
      </ul>

      <h2>Skills it loads</h2>
      <p>
        Every dispatch auto-loads: <code>nextjs-react-expert</code>,{" "}
        <code>tailwind-patterns</code>, <code>frontend-design</code>,{" "}
        <code>web-design-guidelines</code>, <code>clean-code</code>, <code>i18n-localization</code>{" "}
        (when relevant).
      </p>

      <h2>When Claude auto-dispatches it</h2>
      <p>
        Claude reads the agent&apos;s <code>description:</code> frontmatter. Keywords that trigger it:{" "}
        <em>component, React, Next.js, Vue, Svelte, UI, UX, CSS, Tailwind, responsive, page,
        layout, accessibility</em>.
      </p>
      <p>You can also ask by name: <em>&ldquo;Use hub:frontend-specialist to refactor this page.&rdquo;</em></p>

      <h2>Example session</h2>
      <Dialogue
        title="Fix a re-render storm"
        lines={[
          { role: "user", text: "the /dashboard page re-renders 40 times on mount. use hub:frontend-specialist to fix." },
          {
            role: "agent",
            name: "frontend-specialist",
            text: (
              <div className="space-y-2">
                <p>Investigated. Three issues compounding:</p>
                <ol className="list-decimal pl-5">
                  <li><code>useSession()</code> called from 6 children — lifted once into a context at <code>&lt;DashboardShell&gt;</code>.</li>
                  <li>Inline <code>{`style={{...}}`}</code> object on the grid — hoisted to a stable reference with <code>useMemo</code>.</li>
                  <li><code>&lt;Chart&gt;</code> missing <code>React.memo</code> — wrapped, passed a stable <code>data</code> prop.</li>
                </ol>
                <p>Mount re-renders: 40 → 3. Lighthouse TBT down from 420ms to 90ms.</p>
              </div>
            ),
          },
        ]}
      />

      <h2>Direct call</h2>
      <p>If you want it explicitly and don&apos;t want to phrase a prompt, use the shim:</p>
      <Tabs
        tabs={[
          { id: "claude", label: "Claude Code", content: <CodeBlock lang="text" code="/hub:agent-frontend-specialist refactor /dashboard to reduce re-renders" /> },
          { id: "codex", label: "Codex", content: <CodeBlock lang="text" code="@hub agent-frontend-specialist refactor /dashboard to reduce re-renders" /> },
        ]}
      />

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Share the file path.</strong> Paste <code>app/dashboard/page.tsx</code> in the prompt — saves a glob.</li>
        <li><strong>Say what you&apos;re optimising for.</strong> Bundle size, re-renders, accessibility, or readability all need different trade-offs.</li>
        <li><strong>Hand it a design system.</strong> If your project has tokens / a component library, mention them — otherwise it&apos;ll reach for generic Tailwind.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/agent-backend-specialist">Backend specialist</Link> — its most common partner.</li>
        <li><Link href="/docs/guide/skill-clean-code">Clean code</Link> — the quality floor.</li>
        <li><Link href="/docs/commands">All commands</Link></li>
      </ul>
    </div>
  );
}
