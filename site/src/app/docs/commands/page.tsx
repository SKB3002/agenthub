import type { Metadata } from "next";
import { COMMANDS, tierColor } from "@/lib/data";

export const metadata: Metadata = {
  title: "Commands",
  description:
    "All 17 AgentHub commands with tier, ~token estimate, and what they do. Works as /hub:<command> on Claude Code and @hub <command> on Codex.",
};

export default function CommandsPage() {
  return (
    <div>
      <h1>Commands</h1>
      <p className="text-lg text-muted-foreground">
        17 commands, each with a declared tier. Invoke them as{" "}
        <code>/hub:&lt;name&gt;</code> in Claude Code, or <code>@hub &lt;name&gt;</code> in Codex.
      </p>

      <div className="not-prose my-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
        <p className="font-semibold">How to read this table</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>
            <strong className="text-green-600 dark:text-green-500">LIGHT</strong> — runs directly,
            no approval prompt.
          </li>
          <li>
            <strong className="text-amber-600 dark:text-amber-500">MEDIUM</strong> — one-line
            preview, y/n/tweak prompt.
          </li>
          <li>
            <strong className="text-red-600 dark:text-red-500">HEAVY</strong> — full gate with
            planned agents, skills, token estimate, and alternatives.
          </li>
          <li>
            Pass <code>--yes</code> or <code>-y</code> as the first argument to bypass any gate
            (usage still logs).
          </li>
        </ul>
      </div>

      <div className="not-prose overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Command</th>
              <th className="px-4 py-3 text-left font-semibold">Tier</th>
              <th className="px-4 py-3 text-left font-semibold">~Tokens</th>
              <th className="px-4 py-3 text-left font-semibold">What it does</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {COMMANDS.map((c) => (
              <tr key={c.name} className="transition-colors hover:bg-accent/30">
                <td className="px-4 py-3 align-top">
                  <code className="whitespace-nowrap rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    /hub:{c.name}
                    {c.args ? ` ${c.args}` : ""}
                  </code>
                </td>
                <td className={`px-4 py-3 align-top font-semibold ${tierColor(c.tier)}`}>
                  {c.tier}
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                  {c.tokens}
                </td>
                <td className="px-4 py-3 align-top text-foreground/90">{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Codex equivalents</h2>
      <p>
        Everything above translates 1:1 to Codex by swapping the prefix:{" "}
        <code>/hub:debug</code> → <code>@hub debug</code>, <code>/hub:plan</code> →{" "}
        <code>@hub plan</code>, and so on.
      </p>
      <blockquote>
        The <code>/</code> prefix is reserved for Codex built-in commands. Typing{" "}
        <code>/hub:debug</code> inside Codex will be rejected. Always use <code>@hub debug</code>.
      </blockquote>
    </div>
  );
}
