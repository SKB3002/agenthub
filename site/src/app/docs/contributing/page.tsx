import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { GITHUB_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contributing",
  description: "How to add a subagent, fix a skill, or propose a new workflow to AgentHub.",
};

export default function ContributingPage() {
  return (
    <div>
      <h1>Contributing</h1>
      <p className="text-lg text-muted-foreground">
        AgentHub is MIT-licensed and open to PRs. Whether you&apos;re fixing a typo or adding a
        whole new agent, here&apos;s the shape of what lands.
      </p>

      <h2>Repo layout (dual-platform)</h2>
      <table>
        <thead>
          <tr>
            <th>Primitive</th>
            <th>Claude Code path</th>
            <th>Codex path</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Agents</td>
            <td><code>agents/*.md</code> (YAML frontmatter)</td>
            <td><code>plugins/hub/agents/*.toml</code> (auto-generated)</td>
          </tr>
          <tr>
            <td>Commands</td>
            <td><code>commands/*.md</code></td>
            <td><code>plugins/hub/commands/*.md</code> (mirror)</td>
          </tr>
          <tr>
            <td>Skills</td>
            <td colSpan={2} style={{ textAlign: "center" }}>
              <code>skills/*/SKILL.md</code> — shared between platforms, mirrored into{" "}
              <code>plugins/hub/skills/</code>
            </td>
          </tr>
          <tr>
            <td>Manifest</td>
            <td><code>.claude-plugin/plugin.json</code></td>
            <td><code>plugins/hub/.codex-plugin/plugin.json</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Adding a skill</h2>
      <ol>
        <li>
          Create <code>skills/&lt;skill-name&gt;/SKILL.md</code> with YAML frontmatter (<code>name</code>,{" "}
          <code>description</code>, <code>allowed-tools</code>).
        </li>
        <li>Add longer sub-references as sibling <code>.md</code> files if needed.</li>
        <li>
          Copy the whole folder into <code>plugins/hub/skills/&lt;skill-name&gt;/</code> so Codex
          users get it too.
        </li>
        <li>Update <code>CATALOG.md</code> and the <code>Highlighted skills</code> section in the README.</li>
      </ol>

      <blockquote>
        <strong>YAML trap:</strong> if your <code>description</code> contains a colon, quote the
        whole thing or YAML will parse it as a nested mapping. Wrap in double quotes, use an
        em-dash, or both.
      </blockquote>

      <h2>Adding an agent</h2>
      <ol>
        <li>
          Create <code>agents/&lt;agent-name&gt;.md</code> with YAML frontmatter: <code>name</code>,{" "}
          <code>description</code>, <code>tools</code>, <code>model</code>, <code>skills</code>.
        </li>
        <li>
          Regenerate the Codex TOML mirror:
          <CodeBlock code="python tools/generate_codex.py --write" lang="bash" />
        </li>
        <li>
          Add the agent to <code>CATALOG.md</code> and the <code>Agents (20)</code> table in the
          README.
        </li>
      </ol>

      <h2>Adding a command</h2>
      <ol>
        <li>
          Create <code>commands/&lt;name&gt;.md</code> with frontmatter: <code>description</code>,{" "}
          <code>tier</code> (LIGHT/MEDIUM/HEAVY), <code>argument-hint</code>.
        </li>
        <li>
          Copy into <code>plugins/hub/commands/&lt;name&gt;.md</code> (there&apos;s no auto-sync
          yet).
        </li>
        <li>Add to <code>CATALOG.md</code> and the commands table.</li>
      </ol>

      <h2>Before you PR</h2>
      <ul>
        <li>Run <code>python tools/generate_codex.py --check</code> — CI will fail if the TOML is stale.</li>
        <li>Validate your skill frontmatter parses as YAML (see the trap above).</li>
        <li>Test the install path end to end on at least one platform.</li>
      </ul>

      <h2>Where to start</h2>
      <ul>
        <li>
          <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer">
            Open issues on GitHub
          </a>{" "}
          — good-first-issue tags welcome.
        </li>
        <li>
          <a
            href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            CONTRIBUTING.md
          </a>{" "}
          — the canonical version of this page lives here.
        </li>
      </ul>
    </div>
  );
}
