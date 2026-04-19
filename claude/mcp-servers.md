---
description: Guide to the MCP servers bundled with agenthub — how to enable, configure, and extend.
---

# MCP Servers — Opt-In Reference

`.mcp.json` ships **empty**. The kit does not auto-spawn any MCP servers. This document lists the servers we've pre-validated, how to enable them, and what env vars each needs.

---

## How to enable

1. Open `.mcp.example.json`
2. Copy the server(s) you want into `.mcp.json` under the `mcpServers` key
3. Set any required env vars in your shell (`.bashrc`, `.zshrc`, or Windows env vars)
4. Restart Claude Code

> Do **not** copy the `_doc` key. JSON rejects unknown fields in strict MCP loaders.

---

## Pre-validated servers

### `filesystem`

Gives the agent structured file operations beyond the built-in Read/Write/Edit tools — useful for directory trees, cross-cutting renames, and batch ops.

| | |
|--|--|
| Command | `npx -y @modelcontextprotocol/server-filesystem <path>` |
| Required env | None |
| Docs | https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem |

### `github`

Repo search, issue/PR creation, file commits via the GitHub API. Use only when `gh` CLI is insufficient (e.g., querying across many repos).

| | |
|--|--|
| Command | `npx -y @modelcontextprotocol/server-github` |
| Required env | `GITHUB_PERSONAL_ACCESS_TOKEN` (classic PAT with `repo` scope) |
| Docs | https://github.com/modelcontextprotocol/servers/tree/main/src/github |

### `postgres`

Read-only SQL over a Postgres database. The agent can introspect schemas and run `SELECT` queries — **it cannot write**. Good for analytics + debugging.

| | |
|--|--|
| Command | `npx -y @modelcontextprotocol/server-postgres <connection-string>` |
| Required env | `POSTGRES_CONNECTION_STRING` (e.g., `postgresql://user:pass@host/db`) |
| Docs | https://github.com/modelcontextprotocol/servers/tree/main/src/postgres |

### `fetch`

HTTP GET / HEAD. Fetches and converts HTML to markdown for the agent. A lightweight alternative to the built-in WebFetch tool.

| | |
|--|--|
| Command | `uvx mcp-server-fetch` |
| Required env | None |
| Requires | `uv` / `uvx` installed (https://github.com/astral-sh/uv) |
| Docs | https://github.com/modelcontextprotocol/servers/tree/main/src/fetch |

### `sequential-thinking`

Forces the agent into a structured, step-by-step reasoning mode. Useful for hard planning or debugging tasks where you want transparency into the thought chain.

| | |
|--|--|
| Command | `npx -y @modelcontextprotocol/server-sequential-thinking` |
| Required env | None |
| Docs | https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking |

---

## Adding your own server

Any MCP-compliant server can be added to `.mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/abs/path/to/server.js"],
      "type": "stdio",
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

The kit's own `mcp-builder` skill walks through building a new server from scratch. See [skills/mcp-builder/](skills/mcp-builder/).

---

## Why empty by default

Every MCP server is a subprocess that consumes resources, may require credentials, and expands the agent's blast radius. Opt-in is safer than opt-out.

Servers you might connect to third-party APIs (Linear, Slack, Notion, Figma) typically live in your personal `~/.claude/mcp.json`, not in a shared plugin config. The kit stays platform-agnostic.
