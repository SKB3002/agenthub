# AGENTS.md — Claude Code Kit (Codex Platform)

> This is the Codex equivalent of `CLAUDE.md`. Codex reads this file before every task.
> The `CLAUDE.md` at repo root is for Claude Code sessions only.

---

## What this repo is

A **dual-platform plugin** — 20 specialist subagents, 42 skills, and 17 slash commands for both **Claude Code** and **OpenAI Codex**.

- Shared core: `agents/` (markdown, both platforms) · `skills/` (markdown, both platforms)
- Claude Code platform: `commands/`, `.claude-plugin/`, `PROTOCOL.md`
- Codex platform: `codex/commands/`, `codex/agents/` (TOML), `codex/.codex-plugin/`
- Generator: `tools/generate_codex.py` syncs agents → TOML on release

---

## Plugin handle

Slash commands are namespaced `/hub:<name>` on both platforms. Always use the `/hub:` prefix.

---

## Agent routing (Codex)

When a user's request matches a domain, route to the appropriate subagent:

| Domain | Subagent |
|---|---|
| Bug / error / crash | `hub:debugger` |
| New application | `hub:project-planner` → `hub:backend-specialist` + `hub:frontend-specialist` |
| Feature addition | `hub:backend-specialist` or `hub:frontend-specialist` (stack-aware) |
| Database / schema | `hub:database-architect` |
| Security audit | `hub:security-auditor` |
| Performance | `hub:performance-optimizer` |
| Deployment | `hub:devops-engineer` |
| Tests | `hub:test-engineer` |
| UI / design | `hub:frontend-specialist` |
| Exploration | `hub:explorer-agent` |
| Documentation | `hub:documentation-writer` |
| Planning only | `hub:project-planner` |
| Brainstorm | `hub:product-manager` |

Invoke via Codex's native subagent mechanism. Each subagent's TOML is in `codex/agents/`.

---

## Approval-first dispatch

Every `/hub:*` command declares a tier:

- **LIGHT** — runs directly, no gate
- **MEDIUM** — one-line confirm before dispatching
- **HEAVY** — full gate: planned agents, skills, ~token estimate, MoSCoW, ≥2 alternatives

Pass `--yes` or `-y` to bypass any gate. Usage still logs to `.hub/usage.json`.

---

## Shared skills

Skills in `skills/*/SKILL.md` are platform-agnostic. Both Codex and Claude Code sessions load them by name (`hub:<name>`). Do not duplicate skill content in `codex/` — always reference the shared `skills/` folder.

---

## Rule priority

P0 (this file) > P1 (agent TOML) > P2 (skill SKILL.md)

When editing content, keep that hierarchy intact. Narrower files should not contradict broader ones.

---

## Honesty contract

Anywhere the kit shows a token count: prefix `~`. Never convert to dollars. Never fabricate remaining-quota or reset-timestamp numbers.
