# Changelog

All notable changes to AgentHub are documented here.

## [0.4.5] — 2026-04-21

### Added
- **20 agent shim commands** — one `/hub:agent-<name>` per agent, so users can reach every specialist from slash autocomplete (`/hub:agent-prod` → `product-manager` / `product-owner`, `/hub:agent-sec` → `security-auditor`, etc.). Each shim is a LIGHT dispatch with no approval gate.
- `tools/generate_agent_shims.py` — regenerates all 20 shims from `agents/*.md` frontmatter. Re-run after adding a new agent.

### Changed
- **CATALOG.md** — commands section split into "Workflows (17)" and "Agent shims (20)". Total command surface: 37.
- **Manifest descriptions** updated to reflect the new surface on both Claude and Codex manifests.

### Fixed (carried from 0.4.4)
- Vendored all 42 skills, 20 agent TOMLs, and 17 workflow commands into `plugins/hub/` as real files — junctions didn't survive `git clone`, which left Codex users with 0 skills after install.
- `skills/lint-and-validate/SKILL.md` YAML parse error (unquoted colon in description).
- `/hub:` → `@hub` sweep in the Codex plugin mirror so the model stops suggesting slash-prefixed commands to Codex users.
- `.claude-plugin/plugin.json` — removed invalid `agents`/`commands` fields that caused "Invalid input" on install; agents and commands auto-discovered from repo root.

## [0.4.0] — 2026-04-20

### Changed
- **Repo rebranded** from `claude-code-kit` to `agenthub` (`SKB3002/agenthub`)
- **Plugin namespace** changed from `kit` to `hub` — all slash commands are now `/hub:*`, all agents `hub:*`
- **Repo restructured** for dual-platform symmetry:
  - Claude Code platform files moved from root into `claude/` (`agents/`, `commands/`, `claude/hooks/`)
  - `KIT_PROTOCOL.md` renamed to `claude/PROTOCOL.md`
  - `.mcp.json` + `.mcp.example.json` merged into `claude/mcp.example.json`
  - `skills/` and `tools/` remain at root (shared by both platforms)
  - `codex/` unchanged structurally
- **Usage log** path changed from `.kit/` to `.hub/` (`.hub/usage.json`, `.hub/budget.json`, `.hub/instincts.yaml`)
- `.claude-plugin/plugin.json` updated with explicit path fields pointing to `claude/` subdirectory
- `tools/generate_codex.py` source path updated to `agents/`
- Version bumped to `0.4.0` in both plugin manifests

---

For history prior to v0.4.0, see the `claude-code-kit` repository at `https://github.com/SKB3002/claude-code-kit`.
