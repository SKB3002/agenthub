import Link from "next/link";
import { GITHUB_URL } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-block h-5 w-5 rounded-md bg-brand" />
              AgentHub
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              20 subagents · 42 skills · 17 workflows. For Claude Code and OpenAI Codex.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Docs</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/docs/install" className="hover:text-foreground">Install</Link></li>
              <li><Link href="/docs/commands" className="hover:text-foreground">Commands</Link></li>
              <li><Link href="/docs/agents" className="hover:text-foreground">Agents</Link></li>
              <li><Link href="/docs/skills" className="hover:text-foreground">Skills</Link></li>
              <li><Link href="/docs/workflows" className="hover:text-foreground">Workflows</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Project</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
              <li><Link href="/docs/contributing" className="hover:text-foreground">Contributing</Link></li>
              <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a></li>
              <li><a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Issues</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Platforms</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Claude Code</li>
              <li>OpenAI Codex</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>MIT licensed — use commercially, personally, or in side projects.</p>
          <p>
            Built on{" "}
            <a
              href="https://github.com/vudovn/antigravity-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              antigravity-kit
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
