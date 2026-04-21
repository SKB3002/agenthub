import Link from "next/link";
import {
  ArrowRight,
  Star,
  Sparkles,
  ShieldCheck,
  Gauge,
  Workflow,
  Layers,
  Bot,
  Terminal,
  BookOpen,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";
import { GithubIcon } from "@/components/github-icon";
import { getRepoStats, getLatestRelease } from "@/lib/github";
import { GITHUB_URL } from "@/lib/utils";

export default async function Home() {
  const [stats, latest] = await Promise.all([getRepoStats(), getLatestRelease()]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 h-[600px]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur transition hover:bg-accent hover:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              {latest ? `Latest release: ${latest.tag_name}` : "Open source, MIT licensed"}
              <ArrowRight className="h-3 w-3" />
            </a>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              AI coding superpowers.{" "}
              <span className="bg-gradient-to-r from-brand to-foreground bg-clip-text text-transparent">
                Approval-first.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              20 specialist subagents, 42 skills, and 17 workflows. One repo. Works on both{" "}
              <span className="font-semibold text-foreground">Claude Code</span> and{" "}
              <span className="font-semibold text-foreground">OpenAI Codex</span>.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs/install"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Install <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                <GithubIcon className="h-4 w-4" />
                Star on GitHub
                {stats ? (
                  <span className="ml-1 flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {stats.stars}
                  </span>
                ) : null}
              </a>
            </div>

            <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-8">
              <Stat n="20" label="Subagents" />
              <Stat n="42" label="Skills" />
              <Stat n="17" label="Workflows" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform strip */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">
            One repo · two platforms · shared core
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Claude Code: <code className="text-muted-foreground">/hub:&lt;command&gt;</code>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              OpenAI Codex: <code className="text-muted-foreground">@hub &lt;workflow&gt;</code>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              42 skills shared across both
            </span>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why AgentHub</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Claude Code and Codex ship powerful runtimes. But every project reinvents the same
            scaffolding. AgentHub is the curated, MIT-licensed answer.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Bot className="h-5 w-5" />} title="Domain experts, ready">
            Pre-built subagents for backend, frontend, DB, security, DevOps, QA — 20 in total, each
            briefed to know what &ldquo;good&rdquo; looks like.
          </Feature>
          <Feature icon={<Layers className="h-5 w-5" />} title="Skills load on demand">
            42 knowledge modules (OWASP, Core Web Vitals, TDD, FastAPI, Next.js patterns…) load only
            when the work calls for them.
          </Feature>
          <Feature icon={<Workflow className="h-5 w-5" />} title="Workflows, not chaos">
            17 orchestration commands — from <code className="text-xs">brainstorm</code> to{" "}
            <code className="text-xs">deploy</code> — that coordinate agents end-to-end.
          </Feature>
          <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Approval-first by design">
            Every MEDIUM/HEAVY command shows what will run and estimates token spend before
            dispatching. Nothing silently fans out on your budget.
          </Feature>
          <Feature icon={<Gauge className="h-5 w-5" />} title="Honesty contract">
            Token estimates are prefixed <code className="text-xs">~</code>. Never converted to
            dollars. Never fabricated.
          </Feature>
          <Feature icon={<Zap className="h-5 w-5" />} title="Works out of the box">
            Install from the marketplace. One reload. Run{" "}
            <code className="text-xs">/hub:help</code> and you&apos;re off.
          </Feature>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Install in under a minute
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pick your platform. Paste the marketplace URL. You&apos;re done.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <Tabs
              defaultId="claude"
              tabs={[
                {
                  id: "claude",
                  label: "Claude Code",
                  content: (
                    <div>
                      <p className="mb-3 text-sm text-muted-foreground">
                        In the Claude Code VS Code / Cursor extension sidebar:
                      </p>
                      <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-sm text-foreground/90">
                        <li>
                          Press{" "}
                          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
                            /
                          </kbd>{" "}
                          in the Claude Code sidebar → <strong>Manage Plugins</strong> →{" "}
                          <strong>Marketplace</strong>
                        </li>
                        <li>
                          Paste <code className="text-xs">https://github.com/SKB3002/agenthub</code>{" "}
                          and confirm
                        </li>
                        <li>
                          Go to <strong>Plugins</strong>, search <strong>hub</strong>, and click{" "}
                          <strong>Install</strong>
                        </li>
                        <li>
                          Press{" "}
                          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
                            Ctrl+Shift+P
                          </kbd>{" "}
                          → <strong>Reload Window</strong>
                        </li>
                      </ol>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Run <code className="text-xs">/hub:help</code> to verify — it will list all
                        17 commands, 20 agents, and 42 skills. Or press{" "}
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
                          /
                        </kbd>{" "}
                        and manually check the newly loaded commands.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "codex",
                  label: "OpenAI Codex",
                  content: (
                    <div>
                      <CodeBlock
                        lang="powershell"
                        code={`# 1. Install the Codex CLI (if you haven't already)
npm install -g @openai/codex

# 2. Register the AgentHub marketplace (either command works)
codex plugin marketplace add https://github.com/SKB3002/agenthub
# or the older short form:
codex marketplace add https://github.com/SKB3002/agenthub

# 3. Start Codex in PowerShell (or your terminal)
codex`}
                      />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Inside Codex: type <code className="text-xs">/plugin</code> → search{" "}
                        <strong>hub</strong> → <strong>Install</strong>.
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Use <code className="text-xs">@hub help</code> to verify.
                      </p>
                      <div className="mt-4 rounded-md border border-border bg-background p-4 text-sm">
                        <p className="font-semibold">
                          Always use <code>@hub</code> in Codex, never <code>/hub:</code>
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          The <code>/</code> prefix is reserved for Codex built-ins — typing{" "}
                          <code>/hub:debug</code> in Codex will be rejected.
                        </p>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The recommended flow</h2>
          <p className="mt-4 text-muted-foreground">
            Start small, gate the big stuff. Every MEDIUM/HEAVY command renders an approval gate
            before agents run.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          <WorkflowStep
            n="1"
            cmd="brainstorm"
            tier="MEDIUM"
            desc="Explore 3+ options with trade-offs — no code, just thinking."
          />
          <WorkflowStep
            n="2"
            cmd="plan"
            tier="MEDIUM"
            desc="Turn the chosen direction into a docs/PLAN-<slug>.md file."
          />
          <WorkflowStep
            n="3"
            cmd="create"
            tier="HEAVY"
            desc="Scaffold a greenfield app — up to 5 specialists from planner through devops."
            alt={{ cmd: "enhance", desc: "Add/update features in an existing app." }}
          />
          <WorkflowStep
            n="4"
            cmd="test"
            tier="MEDIUM"
            desc="Generate tests for the new code."
          />
          <WorkflowStep
            n="5"
            cmd="deploy"
            tier="HEAVY"
            desc="Pre-flight checks, deployment, post-deploy verification."
          />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
          Sprinting on a bug? <code className="text-foreground">debug</code> →{" "}
          <code className="text-foreground">test</code> → done.
        </p>
      </section>

      {/* Tiers */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three tiers. No surprises.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every command declares its tier. You always see what will run before it runs.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            <TierCard
              tier="LIGHT"
              tokens="<5k"
              desc="Runs directly — no gate."
              examples={["/hub:status", "/hub:help", "/hub:ledger"]}
            />
            <TierCard
              tier="MEDIUM"
              tokens="10k–60k"
              desc="One-line preview + y/n/tweak prompt."
              examples={["/hub:debug", "/hub:plan", "/hub:brainstorm"]}
              accent
            />
            <TierCard
              tier="HEAVY"
              tokens="40k–250k"
              desc="Full gate: agents, skills, token est., MoSCoW, alternatives."
              examples={["/hub:create", "/hub:deploy", "/hub:orchestrate"]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background to-muted p-10 text-center sm:p-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to upgrade your AI coding?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Install AgentHub in under a minute. MIT licensed — use commercially, personally, or in
            side projects. Forks and remixes welcome.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/docs/install"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              <Terminal className="h-4 w-4" />
              Install guide
            </Link>
            <Link
              href="/docs/commands"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:bg-accent"
            >
              <BookOpen className="h-4 w-4" />
              Browse commands
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold tracking-tight text-foreground">{n}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent/30">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-brand">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function WorkflowStep({
  n,
  cmd,
  tier,
  desc,
  alt,
}: {
  n: string;
  cmd: string;
  tier: "LIGHT" | "MEDIUM" | "HEAVY";
  desc: string;
  alt?: { cmd: string; desc: string };
}) {
  const tierColor =
    tier === "LIGHT"
      ? "text-green-600 dark:text-green-500"
      : tier === "MEDIUM"
      ? "text-amber-600 dark:text-amber-500"
      : "text-red-600 dark:text-red-500";

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-sm font-semibold">
        {n}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm">/hub:{cmd}</code>
          <span className={`text-xs font-semibold ${tierColor}`}>{tier}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        {alt ? (
          <p className="mt-1 text-sm text-muted-foreground">
            or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/hub:{alt.cmd}</code>{" "}
            — {alt.desc}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function TierCard({
  tier,
  tokens,
  desc,
  examples,
  accent,
}: {
  tier: string;
  tokens: string;
  desc: string;
  examples: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-card p-6 ${
        accent ? "border-brand/40 ring-1 ring-brand/20" : "border-border"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="font-bold">{tier}</h3>
        <span className="font-mono text-xs text-muted-foreground">~{tokens}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <ul className="mt-4 space-y-1">
        {examples.map((e) => (
          <li key={e} className="font-mono text-xs text-foreground/80">
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}
