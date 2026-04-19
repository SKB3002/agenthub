# Changelog

All notable changes to AgentHub are documented here.

## [0.4.0] — 2026-04-20

### Changed
- **Repo rebranded** from `claude-code-kit` to `agenthub` (`SKB3002/agenthub`)
- **Plugin namespace** changed from `kit` to `hub` — all slash commands are now `/hub:*`, all agents `hub:*`
- **Repo restructured** for dual-platform symmetry:
  - Claude Code platform files moved from root into `claude/` (`claude/agents/`, `claude/commands/`, `claude/hooks/`)
  - `KIT_PROTOCOL.md` renamed to `claude/PROTOCOL.md`
  - `.mcp.json` + `.mcp.example.json` merged into `claude/mcp.example.json`
  - `skills/` and `tools/` remain at root (shared by both platforms)
  - `codex/` unchanged structurally
- **Usage log** path changed from `.kit/` to `.hub/` (`.hub/usage.json`, `.hub/budget.json`, `.hub/instincts.yaml`)
- `.claude-plugin/plugin.json` updated with explicit path fields pointing to `claude/` subdirectory
- `tools/generate_codex.py` source path updated to `claude/agents/`
- Version bumped to `0.4.0` in both plugin manifests

---

For history prior to v0.4.0, see the `claude-code-kit` repository at `https://github.com/SKB3002/claude-code-kit`.
