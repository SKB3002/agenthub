# AGENTS.md — AgentHub (Codex Platform)

> Codex reads this file before every task. It is the session protocol for the `hub` plugin.

---

## How to invoke this plugin

**Primary:** Type `@hub` in the Codex composer. Codex will show the plugin and its bundled skills via autocomplete.

**Skills picker:** Type `$` in the composer to open the skill picker. Hub skills appear as `$hub-debug`, `$hub-plan`, etc.

**Do NOT use `/hub:*`** — the `/` prefix is reserved for Codex built-in commands. Plugin commands typed as `/hub:debug` will be rejected as unknown commands by Codex.

The `name` field in this plugin's manifest is `hub` — that is the `@hub` handle.

---

## What this plugin is

**AgentHub** — 20 specialist subagents, 42 skills, and 17 workflows for OpenAI Codex.

- `agents/*.toml` — 20 Codex agent definitions
- `commands/*.md` — 17 workflow templates (invoked via `@hub`, not `/hub:`)
- `skills/*/SKILL.md` — 42 shared skills (platform-agnostic, also used by Claude Code)
- `.codex-plugin/plugin.json` — manifest

All paths above are relative to this plugin's root (`plugins/hub/` in the source repo).

---

## Workflow invocation via @hub

When a user types `@hub` followed by a workflow name, read the matching file from `commands/<name>.md` (relative to this plugin's root) and follow its `## Flow` section. The `$ARGUMENTS` placeholder is replaced with whatever the user typed after the workflow name.

| User types | Read this file | Description |
|---|---|---|
| `@hub debug <symptom>` | `commands/debug.md` | Systematic root-cause investigation |
| `@hub plan <feature>` | `commands/plan.md` | Generate docs/PLAN-*.md, no code |
| `@hub create <app>` | `commands/create.md` | Scaffold a new application |
| `@hub enhance <change>` | `commands/enhance.md` | Add/update features |
| `@hub test [generate\|run]` | `commands/test.md` | Write or run tests |
| `@hub deploy [staging\|prod]` | `commands/deploy.md` | Pre-flight + deploy |
| `@hub brainstorm <idea>` | `commands/brainstorm.md` | Explore options, no code |
| `@hub orchestrate <task>` | `commands/orchestrate.md` | ≥3 agents, 2-phase pipeline |
| `@hub status` | `commands/status.md` | Project state snapshot |
| `@hub help [agents\|skills\|<name>]` | `commands/help.md` | Capability index |

---

## Agent routing

When a request matches a domain, route to the appropriate agent:

| Domain | Agent |
|---|---|
| Bug / error / crash | `hub:debugger` |
| New application | `hub:project-planner` → `hub:backend-specialist` + `hub:frontend-specialist` |
| Feature addition | `hub:backend-specialist` or `hub:frontend-specialist` (stack-aware) |
| Database / schema | `hub:database-architect` |
| Security audit | `hub:security-auditor` |
| Offensive security / CTF | `hub:penetration-tester` |
| Performance | `hub:performance-optimizer` |
| Deployment / CI/CD | `hub:devops-engineer` |
| Tests / TDD | `hub:test-engineer` |
| E2E / Playwright | `hub:qa-automation-engineer` |
| UI / React / components | `hub:frontend-specialist` |
| Mobile / React Native | `hub:mobile-developer` |
| SEO / Core Web Vitals | `hub:seo-specialist` |
| Game development | `hub:game-developer` |
| Codebase exploration | `hub:explorer-agent` |
| Documentation only | `hub:documentation-writer` |
| Planning only | `hub:project-planner` |
| Brainstorm / options | `hub:product-manager` |
| Multi-domain / complex | `hub:orchestrator` (≥3 agents, 2-phase) |
| Legacy / reverse-engineering | `hub:code-archaeologist` |

---

## Approval-first dispatch

Every workflow declares a tier. Workflows never silently fan out agents.

- **LIGHT** — runs directly (`@hub status`, `@hub help`, `@hub preview`)
- **MEDIUM** — one-line confirm before dispatching (`@hub debug`, `@hub plan`, `@hub test generate`)
- **HEAVY** — full gate: planned agents, skills, ~token estimate, MoSCoW, ≥2 alternatives (`@hub create`, `@hub enhance`, `@hub deploy`, `@hub orchestrate`)

Pass `--yes` or `-y` after the workflow name to bypass any gate. Usage logs to `.hub/usage.json` in the user's project.

---

## Skill loading

Skills in `skills/*/SKILL.md` are platform-agnostic. Each agent TOML lists its skills in `[skills] config` and its `[instructions]` block includes explicit read directives. Skills surface to users via the `$` picker as `$hub-<skill-name>`.

---

## Rule priority

P0 (this file) > P1 (agent TOML `[instructions]`) > P2 (skill `SKILL.md`)

---

## Honesty contract

Token estimates are always prefixed `~`. Never convert to dollars. Never fabricate quota or reset-timestamp numbers.
