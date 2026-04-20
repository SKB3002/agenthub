# AGENTS.md — AgentHub (Codex Platform)

> Codex reads this file before every task. It is the session protocol for the `hub` plugin.

---

## What this plugin is

**AgentHub** — 20 specialist subagents, 42 skills, and 17 slash commands for OpenAI Codex.

File layout (relative to the repo root, not this file):

- `skills/*/SKILL.md` — 42 shared skills (platform-agnostic markdown)
- `codex/agents/*.toml` — 20 Codex agent definitions
- `codex/commands/*.md` — 17 slash commands
- `codex/.codex-plugin/plugin.json` — manifest (paths relative to this file: `../agents`, `../commands`, `../../skills`)

---

## Plugin handle

All slash commands are `/hub:<name>`. All agents are `hub:<name>`. Never drop the `hub:` prefix.

---

## Agent routing

When a user's request matches a domain, route to the appropriate agent:

| Domain | Agent |
|---|---|
| Bug / error / crash / not working | `hub:debugger` |
| New application / scaffold | `hub:project-planner` → `hub:backend-specialist` + `hub:frontend-specialist` |
| Feature addition / enhancement | `hub:backend-specialist` or `hub:frontend-specialist` (stack-aware) |
| Database / schema / migration | `hub:database-architect` |
| Security audit / vulnerability | `hub:security-auditor` |
| Offensive security / CTF | `hub:penetration-tester` |
| Performance / profiling | `hub:performance-optimizer` |
| Deployment / CI/CD / servers | `hub:devops-engineer` |
| Tests / TDD / coverage | `hub:test-engineer` |
| E2E / Playwright / Cypress | `hub:qa-automation-engineer` |
| UI / React / components | `hub:frontend-specialist` |
| Mobile / React Native / Flutter | `hub:mobile-developer` |
| SEO / Core Web Vitals | `hub:seo-specialist` |
| Game development | `hub:game-developer` |
| Codebase exploration / audit | `hub:explorer-agent` |
| Documentation only | `hub:documentation-writer` |
| Planning / roadmap only | `hub:project-planner` |
| Brainstorm / options | `hub:product-manager` |
| Multi-domain / complex task | `hub:orchestrator` (≥3 agents, 2-phase) |
| Legacy code / reverse engineering | `hub:code-archaeologist` |

---

## Approval-first dispatch

Every `/hub:*` command declares a tier. Commands never silently fan out agents.

- **LIGHT** — runs directly, no gate (`/hub:status`, `/hub:help`, `/hub:preview`)
- **MEDIUM** — one-line confirm before dispatching (`/hub:debug`, `/hub:plan`, `/hub:test generate`)
- **HEAVY** — full gate: planned agents, skills, ~token estimate, MoSCoW, ≥2 alternatives (`/hub:create`, `/hub:enhance`, `/hub:deploy`, `/hub:orchestrate`)

Pass `--yes` or `-y` as the first argument to bypass any gate. Usage still logs to `.hub/usage.json` in the user's project (not inside this plugin).

---

## Slash commands and how Codex executes them

Codex does not natively execute `/hub:*` as CLI commands. Instead:

1. Commands in `codex/commands/*.md` are **prompt templates** — Codex reads the matching file and follows its `## Flow` section.
2. The `$ARGUMENTS` placeholder in each command file is replaced with whatever the user typed after `/hub:<name>`.
3. If Codex does not support native slash-command dispatch, treat any message starting with `/hub:` as a trigger: read `codex/commands/<name>.md` and follow its Flow.

---

## Shared skills

Skills in `skills/*/SKILL.md` are platform-agnostic. Load them by reading the file directly — they contain domain knowledge, decision trees, and step-by-step patterns. Do not duplicate skill content inside `codex/`.

Skill loading flow:
```
Agent invoked → read agent TOML `[skills] config` → read each SKILL.md → apply only the sections relevant to the task
```

---

## Rule priority

P0 (this file) > P1 (agent TOML `[instructions]`) > P2 (skill `SKILL.md`)

Narrower files must not contradict broader ones.

---

## Honesty contract

Token estimates are always prefixed `~`. Never convert to dollars. Never fabricate quota or reset-timestamp numbers.
