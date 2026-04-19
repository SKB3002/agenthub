---
name: mcp-builder
description: MCP (Model Context Protocol) server building principles. Tool design, resource patterns, best practices.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# MCP Builder

> Principles for building MCP servers.

---

## 1. MCP Overview

### What is MCP?

Model Context Protocol - standard for connecting AI systems with external tools and data sources.

### Core Concepts

| Concept | Purpose |
|---------|---------|
| **Tools** | Functions AI can call |
| **Resources** | Data AI can read |
| **Prompts** | Pre-defined prompt templates |

---

## 2. Server Architecture

### Project Structure

```
# TypeScript (@modelcontextprotocol/sdk)
my-mcp-server/
├── src/
│   └── index.ts      # Main entry
├── package.json
└── tsconfig.json

# Python (mcp SDK)
my-mcp-server/
├── server.py         # Main entry
├── pyproject.toml
└── README.md
```

### SDK Selection

| Language | SDK | Best For |
|----------|-----|----------|
| **TypeScript** | `@modelcontextprotocol/sdk` | Node/Edge, existing TS codebases |
| **Python** | `mcp` (official) | Python ecosystem, AI/ML tooling |
| **Go / Rust** | Community SDKs | Performance-critical servers |

### Transport Types

| Type | Use |
|------|-----|
| **Stdio** | Local, CLI-based |
| **SSE** | Web-based, streaming |
| **WebSocket** | Real-time, bidirectional |

---

## 3. Tool Design Principles

### Good Tool Design

| Principle | Description |
|-----------|-------------|
| Clear name | Action-oriented (get_weather, create_user) |
| Single purpose | One thing well |
| Validated input | Schema with types and descriptions |
| Structured output | Predictable response format |

### Input Schema Design

| Field | Required? |
|-------|-----------|
| Type | Yes - object |
| Properties | Define each param |
| Required | List mandatory params |
| Description | Human-readable |

---

## 4. Resource Patterns

### Resource Types

| Type | Use |
|------|-----|
| Static | Fixed data (config, docs) |
| Dynamic | Generated on request |
| Template | URI with parameters |

### URI Patterns

| Pattern | Example |
|---------|---------|
| Fixed | `docs://readme` |
| Parameterized | `users://{userId}` |
| Collection | `files://project/*` |

---

## 5. Error Handling

### Error Types

| Situation | Response |
|-----------|----------|
| Invalid params | Validation error message |
| Not found | Clear "not found" |
| Server error | Generic error, log details |

### Best Practices

- Return structured errors
- Don't expose internal details
- Log for debugging
- Provide actionable messages

---

## 6. Multimodal Handling

### Supported Types

| Type | Encoding |
|------|----------|
| Text | Plain text |
| Images | Base64 + MIME type |
| Files | Base64 + MIME type |

---

## 7. Security Principles

### Input Validation

- Validate all tool inputs
- Sanitize user-provided data
- Limit resource access

### API Keys

- Use environment variables
- Don't log secrets
- Validate permissions

---

## 8. Configuration

### Claude Desktop / Claude Code Config

| Field | Purpose |
|-------|---------|
| command | Executable to run |
| args | Command arguments |
| env | Environment variables |

### Claude Code Plugin Registration

Plugins can ship MCP servers via `.mcp.json` at the plugin root:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/index.js"],
      "env": {}
    }
  }
}
```

Use `${CLAUDE_PLUGIN_ROOT}` so the path resolves wherever the plugin is installed.

---

## 9. Testing

### Test Categories

| Type | Focus |
|------|-------|
| Unit | Tool logic |
| Integration | Full server |
| Contract | Schema validation |

---

## 10. Best Practices Checklist

- [ ] Clear, action-oriented tool names
- [ ] Complete input schemas with descriptions
- [ ] Structured JSON output
- [ ] Error handling for all cases
- [ ] Input validation
- [ ] Environment-based configuration
- [ ] Logging for debugging

---

> **Remember:** MCP tools should be simple, focused, and well-documented. The AI relies on descriptions to use them correctly.
