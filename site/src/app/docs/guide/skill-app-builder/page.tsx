import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Skill · App builder",
  description: "How /hub:create actually picks a stack — templates, detection, and handoff.",
};

export default function Page() {
  return (
    <div>
      <h1>Skill · App builder</h1>
      <p className="text-lg text-muted-foreground">
        The skill <code>/hub:create</code> loads to turn natural language into a working scaffold.
        It handles detection, stack selection, template matching, and agent handoff.
      </p>

      <h2>When it activates</h2>
      <p>
        Automatically, whenever <code>/hub:create</code> or <code>hub:project-planner</code>{" "}
        decides to scaffold a greenfield app. You rarely invoke it directly.
      </p>

      <h2>What it teaches</h2>
      <p>The skill has four sub-references, each loaded when relevant:</p>
      <ul>
        <li><strong>project-detection</strong> — empty folder vs. existing repo, framework fingerprints, monorepo markers.</li>
        <li><strong>tech-stack</strong> — pick Next.js vs. Nuxt vs. SvelteKit based on prompt + existing config.</li>
        <li><strong>scaffolding</strong> — 13 built-in templates: Next.js static/SaaS/fullstack, Nuxt, Astro, Flutter, React Native, Electron, Chrome extension, Express API, FastAPI, Turborepo, CLI tool.</li>
        <li><strong>agent-coordination</strong> — the hand-off order: planner → db → backend → frontend → devops.</li>
      </ul>

      <h2>The template picker</h2>
      <p>When you run <code>/hub:create a SaaS with auth and billing</code>, the skill maps:</p>
      <CodeBlock
        lang="text"
        code={`match:
  keywords:   SaaS, auth, billing
  signals:    no framework declared → default to Next.js (team's primary)
  template:   nextjs-saas
  extras:     Prisma (from stack), Resend (from prompt implies email), Stripe`}
      />
      <p>
        The chosen template is a directory of <code>TEMPLATE.md</code> instructions, not a
        pre-built repo. The scaffolding step writes files based on those instructions so each
        scaffold matches your prompt — not a frozen cookiecutter.
      </p>

      <h2>Example: what it refuses</h2>
      <p>
        Running <code>/hub:create</code> in a folder that already has <code>package.json</code>{" "}
        triggers a refusal:
      </p>
      <CodeBlock
        lang="text"
        code={`This folder already contains a Next.js project (package.json detected).
/hub:create is for greenfield. For changes to an existing app, use:

  /hub:enhance <change to make>
or
  /hub:plan <what to add>`}
      />

      <h2>Where it lives</h2>
      <p>
        <code>skills/app-builder/</code> — SKILL.md plus 4 sub-references and a{" "}
        <code>templates/</code> folder with one directory per supported stack. Add a new template
        by dropping a <code>TEMPLATE.md</code> into <code>templates/&lt;name&gt;/</code> and adding
        a keyword map to <code>tech-stack.md</code>.
      </p>

      <h2>Pro tips</h2>
      <ul>
        <li><strong>Name your stack in the prompt</strong> if you care. &ldquo;using Astro + Svelte&rdquo; beats &ldquo;static site.&rdquo;</li>
        <li><strong>Mention constraints upfront:</strong> &ldquo;no Prisma, we use Drizzle&rdquo; saves a rework.</li>
        <li><strong>Contribute a template</strong> if yours isn&apos;t in the 13. PRs welcome.</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li><Link href="/docs/guide/create">/hub:create</Link> — the command.</li>
        <li><Link href="/docs/guide/agent-project-planner">Project planner</Link> — the agent that drives app-builder.</li>
        <li><Link href="/docs/contributing">Contributing</Link> — add a template.</li>
      </ul>
    </div>
  );
}
