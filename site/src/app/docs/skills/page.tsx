import type { Metadata } from "next";
import { SKILL_CATEGORIES } from "@/lib/data";
import { GITHUB_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "42 on-demand knowledge modules — OWASP, Core Web Vitals, TDD, FastAPI, Next.js patterns, and more. Loaded only when the work calls for them.",
};

export default function SkillsPage() {
  const total = SKILL_CATEGORIES.reduce((n, c) => n + c.skills.length, 0);

  return (
    <div>
      <h1>Skills</h1>
      <p className="text-lg text-muted-foreground">
        42 knowledge modules, loaded on demand by agents. Think of them as reference sheets the
        model consults when it&apos;s about to do a specific kind of work.
      </p>

      <div className="not-prose my-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
        <p className="font-semibold">How skills load</p>
        <p className="mt-2 text-muted-foreground">
          Each agent lists the skills it wants in its YAML frontmatter (Claude Code) or TOML{" "}
          <code>[skills]</code> table (Codex). When the agent starts, those files are read into
          context. On Codex, users can also open the skill picker with{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">$</kbd> to
          pull a specific skill into any conversation.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        {total} skills across {SKILL_CATEGORIES.length} categories · Full source at{" "}
        <a
          href={`${GITHUB_URL}/tree/main/skills`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          /skills
        </a>
      </p>

      {SKILL_CATEGORIES.map((cat) => (
        <section key={cat.title} className="not-prose mt-10">
          <h2 className="mb-1 mt-0 text-xl font-semibold">{cat.title}</h2>
          <p className="mb-4 text-sm text-muted-foreground">{cat.desc}</p>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((s) => (
              <a
                key={s}
                href={`${GITHUB_URL}/tree/main/skills/${s}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground/80 transition-colors hover:border-brand/40 hover:bg-accent/40 hover:text-foreground"
              >
                hub:{s}
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
