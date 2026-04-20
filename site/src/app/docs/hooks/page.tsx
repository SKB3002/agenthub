import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { GITHUB_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hooks",
  description:
    "Opt-in hooks to wire lint-on-edit, security-on-save, or test-on-stop. The plugin ships hooks.json empty on purpose.",
};

export default function HooksPage() {
  return (
    <div>
      <h1>Hooks</h1>
      <p className="text-lg text-muted-foreground">
        Hooks let Claude Code run shell commands around its lifecycle — before/after edits, on
        stop, on save. AgentHub ships with <code>hooks.json</code> intentionally empty; opt in by
        copying from the example file.
      </p>

      <h2>Turning on lint-on-edit</h2>
      <p>
        Open <code>claude/hooks/hooks.example.json</code> and copy the relevant entries into{" "}
        <code>claude/hooks/hooks.json</code>. Then reload Claude Code.
      </p>
      <CodeBlock
        code={`{
  "hooks": {
    "postEdit": [
      { "matcher": "**/*.{ts,tsx,js,jsx}", "command": "npx eslint --fix $CLAUDE_FILE" }
    ]
  }
}`}
        lang="json"
      />

      <h2>Generating hooks from natural language</h2>
      <p>
        <code>/hub:hookify</code> takes a plain-English description and emits a ready-to-paste
        snippet. It <em>never</em> writes the hooks file for you — you always paste manually.
      </p>
      <CodeBlock
        code={`/hub:hookify run prettier on every TS file I save, and run vitest after any test file change`}
        lang="text"
      />

      <h2>Why the file ships empty</h2>
      <p>
        Hooks execute shell commands on your machine. We never auto-enable anything that could run
        arbitrary code without the user opting in explicitly. Every entry in{" "}
        <code>hooks.example.json</code> is there for reference only.
      </p>

      <h2>See also</h2>
      <ul>
        <li>
          <a
            href={`${GITHUB_URL}/blob/main/claude/hooks/hooks.example.json`}
            target="_blank"
            rel="noopener noreferrer"
          >
            hooks.example.json on GitHub
          </a>
        </li>
      </ul>
    </div>
  );
}
