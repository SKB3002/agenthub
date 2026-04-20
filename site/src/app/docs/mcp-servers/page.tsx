import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { GITHUB_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MCP servers",
  description: "Opt-in configs for 5 pre-validated MCP servers: filesystem, GitHub, Postgres, fetch, sequential-thinking.",
};

export default function McpServersPage() {
  return (
    <div>
      <h1>MCP servers</h1>
      <p className="text-lg text-muted-foreground">
        AgentHub ships <code>mcp.example.json</code> with 5 pre-validated Model Context Protocol
        server configs. Copy entries into your project&apos;s <code>.mcp.json</code> to activate.
      </p>

      <h2>The five</h2>
      <ul>
        <li><strong>filesystem</strong> — read/write arbitrary paths with explicit allowlist</li>
        <li><strong>github</strong> — PRs, issues, releases, gists (needs <code>GITHUB_TOKEN</code>)</li>
        <li><strong>postgres</strong> — query a Postgres database read-only by default</li>
        <li><strong>fetch</strong> — HTTP GET with cache control</li>
        <li><strong>sequential-thinking</strong> — chain-of-thought scratchpad for hard problems</li>
      </ul>

      <h2>Activating one</h2>
      <CodeBlock
        code={`// .mcp.json in your project root
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$GITHUB_TOKEN" }
    }
  }
}`}
        lang="json"
      />

      <h2>Security note</h2>
      <p>
        MCP servers can read files, hit networks, and execute queries. Only add servers you trust
        and keep scopes narrow. The filesystem server specifically should only get access to paths
        you&apos;re comfortable with the model touching.
      </p>

      <h2>See also</h2>
      <ul>
        <li>
          <a href={`${GITHUB_URL}/blob/main/claude/mcp.example.json`} target="_blank" rel="noopener noreferrer">
            claude/mcp.example.json
          </a>
        </li>
        <li>
          <a href={`${GITHUB_URL}/blob/main/claude/mcp-servers.md`} target="_blank" rel="noopener noreferrer">
            Full MCP servers write-up
          </a>
        </li>
      </ul>
    </div>
  );
}
