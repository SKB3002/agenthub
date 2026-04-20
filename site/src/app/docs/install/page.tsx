import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";

export const metadata: Metadata = {
  title: "Install",
  description:
    "Install AgentHub on Claude Code or OpenAI Codex in under a minute. Marketplace + CLI options for both platforms.",
};

export default function InstallPage() {
  return (
    <div>
      <h1>Install</h1>
      <p className="text-lg text-muted-foreground">
        AgentHub ships as a single marketplace plugin that works on both{" "}
        <strong>Claude Code</strong> and <strong>OpenAI Codex</strong>. Pick your platform below.
      </p>

      <h2>Pick your platform</h2>

      <Tabs
        defaultId="claude"
        tabs={[
          {
            id: "claude",
            label: "Claude Code",
            content: (
              <div>
                <h3>VS Code / Cursor extension</h3>
                <ol>
                  <li>
                    Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">/</kbd> in
                    the Claude Code sidebar → <strong>Manage Plugins</strong> →{" "}
                    <strong>Marketplace</strong>
                  </li>
                  <li>
                    Paste <code>https://github.com/SKB3002/agenthub</code> and confirm
                  </li>
                  <li>
                    Open <strong>Plugins</strong>, search <strong>hub</strong>, click{" "}
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
                <p>
                  Verify it&apos;s loaded by running <code>/hub:help</code> — you should see the full
                  list of 17 commands, 20 agents, and 42 skills. Or simply press{" "}
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">/</kbd>{" "}
                  and manually scan the new commands in the palette.
                </p>

                <h3>CLI</h3>
                <CodeBlock code="claude plugin install https://github.com/SKB3002/agenthub" />
                <p>
                  Then search <strong>hub</strong> in <code>/plugin</code> and install.
                </p>

                <h3>Updating</h3>
                <p>
                  Open <strong>Manage Plugins → Marketplace</strong> and click <strong>Update</strong>{" "}
                  next to <code>agenthub</code>. Restart the window to pick up the new release.
                </p>
              </div>
            ),
          },
          {
            id: "codex",
            label: "OpenAI Codex",
            content: (
              <div>
                <h3>CLI install</h3>
                <CodeBlock
                  code={`# 1. Install the Codex CLI (if you haven't already)
npm install -g @openai/codex

# 2. Register the AgentHub marketplace
codex marketplace add https://github.com/SKB3002/agenthub

# 3. Start Codex, then install the plugin
codex`}
                />
                <p>
                  Inside Codex: press <code>/plugin</code> → search <strong>hub</strong> →{" "}
                  <strong>Install</strong>.
                </p>

                <h3>Verify</h3>
                <p>
                  Type <code>@hub help</code> in the composer. Codex should return the full
                  capability index.
                </p>

                <blockquote>
                  <strong>Use <code>@hub</code>, not <code>/hub:</code>.</strong> The <code>/</code>{" "}
                  prefix is reserved for Codex built-ins, so <code>/hub:debug</code> will be
                  rejected. Always type <code>@hub debug</code>, <code>@hub plan</code>, etc.
                </blockquote>

                <h3>Updating</h3>
                <p>
                  Re-run <code>codex marketplace add https://github.com/SKB3002/agenthub</code> to
                  pull the latest release manifest, then re-install from <code>/plugin</code>.
                </p>
              </div>
            ),
          },
        ]}
      />

      <h2>Platform differences at a glance</h2>
      <table>
        <thead>
          <tr>
            <th>Thing</th>
            <th>Claude Code</th>
            <th>OpenAI Codex</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Invocation</td>
            <td><code>/hub:&lt;command&gt;</code></td>
            <td><code>@hub &lt;workflow&gt;</code></td>
          </tr>
          <tr>
            <td>Manifest</td>
            <td><code>.claude-plugin/plugin.json</code></td>
            <td><code>plugins/hub/.codex-plugin/plugin.json</code></td>
          </tr>
          <tr>
            <td>Session protocol</td>
            <td><code>claude/PROTOCOL.md</code></td>
            <td><code>plugins/hub/AGENTS.md</code></td>
          </tr>
          <tr>
            <td>Skills shared?</td>
            <td colSpan={2} style={{ textAlign: "center" }}>
              Yes — all 42 skills live in <code>skills/</code> and mirror into the Codex plugin.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Troubleshooting</h2>
      <h3>Claude Code: &ldquo;invalid manifest&rdquo; on install</h3>
      <p>
        Make sure you&apos;re on the latest release. Pre-v0.4.4 manifests included fields Claude
        Code no longer accepts. Update the marketplace and retry.
      </p>

      <h3>Codex: 0 skills / 0 agents after install</h3>
      <p>
        Pre-v0.4.4 shipped the Codex plugin with a Windows junction for the skills folder, which
        didn&apos;t replicate over git. v0.4.4+ vendors all 42 skills + 20 agents + 17 commands as
        real files inside the plugin. Run{" "}
        <code>codex marketplace add https://github.com/SKB3002/agenthub</code> again to pull the
        fix.
      </p>

      <h3>Codex suggests <code>/hub:</code> commands back to me</h3>
      <p>
        Update to the latest release — v0.4.4+ explicitly tells the model to translate{" "}
        <code>/hub:</code> mentions (which appear in shared skill files) to{" "}
        <code>@hub</code> when replying to users.
      </p>
    </div>
  );
}
