# Publishing AgentHub to OpenAI Codex

> **Status (April 2026):** OpenAI Codex's plugin/agent ecosystem is still maturing. This document covers what is known and flags where you'll need to verify against current OpenAI docs.

---

## What "publishing" means for each platform

| Platform | Marketplace | CLI install | Local use |
|---|---|---|---|
| Claude Code | Yes — `claude plugin install <repo>` or VS Code sidebar | Yes | `claude --plugin-dir ./agenthub` |
| OpenAI Codex | Unclear — see below | `codex plugin install ./agenthub/codex` (local) | Point Codex at `codex/` subfolder |

---

## Current state of Codex plugins

OpenAI Codex (the coding agent, distinct from the older Codex API/model) does not have a publicly documented third-party plugin marketplace as of this writing. The `codex/.codex-plugin/plugin.json` manifest format used in this repo is modelled on Claude Code's plugin format — it may not be officially supported by OpenAI Codex yet, or the specification may differ.

**What is confirmed:**
- Codex can load local agent/skill/command configurations when pointed at a directory
- The `AGENTS.md` file at `codex/AGENTS.md` is read automatically at session start (equivalent to Claude Code's `CLAUDE.md`)
- Agent definitions in TOML format (`codex/agents/*.toml`) align with Codex's agent specification

**What is unclear:**
- Whether a public plugin registry exists for Codex
- Whether `codex plugin install <url>` is a supported CLI command
- Submission/review requirements for any Codex marketplace

---

## How to use AgentHub with Codex today (local install)

```bash
git clone https://github.com/SKB3002/agenthub.git

# Option A — point Codex at the codex/ subfolder
codex --plugin-dir ./agenthub/codex

# Option B — if Codex supports plugin install CLI
codex plugin install ./agenthub/codex
```

The `codex/AGENTS.md` file is picked up automatically and loads the routing protocol.

---

## Steps to publish once a marketplace exists

When OpenAI opens a plugin marketplace for Codex, the likely process will mirror other AI tool ecosystems:

1. **Verify `codex/.codex-plugin/plugin.json`** is complete and valid:
   - `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`
   - `agents_dir`, `skills_dir`, `commands_dir` pointing to correct relative paths

2. **Run the sync tool** to ensure Codex agents are up to date:
   ```bash
   python tools/generate_codex.py --check
   ```

3. **Test locally** against the Codex CLI before submitting:
   ```bash
   codex --plugin-dir ./agenthub/codex
   # Run /hub:help to verify all agents and commands load
   ```

4. **Submit via the Codex marketplace** — check `https://platform.openai.com` or the Codex CLI docs for the current submission endpoint.

---

## Tracking OpenAI Codex plugin docs

Monitor these sources for updates:
- OpenAI developer docs: `https://platform.openai.com/docs`
- OpenAI Codex changelog / release notes
- The `openai/codex` GitHub repository (if public)

When the process becomes clear, update this file with the exact commands and replace this notice.
