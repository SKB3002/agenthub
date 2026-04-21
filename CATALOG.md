---
description: Pre-built capability index for /hub:help. One Read call — no glob, no bash. Update this file when adding a primitive.
---

# Claude Code Kit — Capability Catalog (v0.3.0)

> This file is read by `/hub:help` instead of globbing the filesystem.
> **When you add a command, agent, or skill: update this file and README.md.**

---

## Recommended workflow

```
1. /hub:brainstorm <idea>       — explore options before committing (MEDIUM)
2. /hub:plan <feature>          — turn chosen direction into a plan file (MEDIUM)
3. /hub:create <app>            — scaffold greenfield app (HEAVY)
   or /hub:enhance <change>     — add/update features in existing app (HEAVY)
4. /hub:test generate <module>  — generate tests for the new code (MEDIUM)
   or /hub:test                 — run existing tests (LIGHT)
5. /hub:deploy staging          — pre-flight + deploy (HEAVY)
   then /hub:deploy production
```

Sprinting on a bug? `/hub:debug` → `/hub:test` → done.
Need a second opinion? `/hub:brainstorm` → `/hub:plan` before any code.

---

## Commands (17 workflows + 20 agent shims = 37 total)

The first 17 below are the workflow commands — the main surface users interact with. The 20 `/hub:agent-<name>` shims are thin dispatch wrappers, one per agent, for users who want direct access to a specific agent from autocomplete. Use them if the workflow commands don't fit; use workflows when they do.

### Workflows (17)

| Command | Tier | ~Tokens | What it does |
|---|---|---|---|
| `/hub:brainstorm <idea>` | MEDIUM | 10k–30k | Explore 3+ options with trade-offs via product-manager — no code, ideas only |
| `/hub:budget [low\|medium\|ok\|clear]` | LIGHT | <2k | Opt-in budget declaration; enriches HEAVY gate with budget line + recommendation |
| `/hub:context-budget [verbose]` | LIGHT | <2k | Session headroom signal (GREEN/YELLOW/RED) + drop-candidate detection |
| `/hub:create <what to build>` | HEAVY | 80k–200k | Scaffold a new application — 4–5 specialists from planner through devops |
| `/hub:debug <symptom or error>` | MEDIUM | 15k–40k | Systematic root-cause investigation via hub:debugger + fix |
| `/hub:deploy [check\|staging\|production\|rollback]` | HEAVY | 40k–100k | Pre-flight checks, deployment, and post-deploy verification |
| `/hub:enhance <change to make>` | HEAVY | 50k–150k | Add or update features in an existing app — minimum agent set, scoped |
| `/hub:help [commands\|agents\|skills\|<name>]` | LIGHT | <5k | This command — reads CATALOG.md, no bash, no glob |
| `/hub:hookify <nl description>` | LIGHT | <2k | Convert natural language to a hooks.json snippet — never writes the file itself |
| `/hub:instincts [status\|show\|promote\|clear]` | LIGHT | <2k | Project-scoped learned preferences stored in .hub/instincts.yaml |
| `/hub:ledger [weekly\|by-agent\|by-skill\|roi\|...]` | LIGHT | <3k | Read-only aggregations over .hub/usage.json |
| `/hub:orchestrate <task or plan>` | HEAVY | 80k–250k | Coordinate ≥3 agents in Plan→approve→Implement pipeline |
| `/hub:plan <what to plan>` | MEDIUM | 20k–50k | Generate docs/PLAN-<slug>.md — no code, plan file only |
| `/hub:preview [start\|stop\|url]` | LIGHT | <2k | Start/stop the dev server and show the local URL |
| `/hub:status` | LIGHT | <2k | Project state: stack, git, open TODOs, recent changes |
| `/hub:test [generate\|run\|coverage\|watch]` | MEDIUM | 15k–60k | `generate` = MEDIUM (writes tests); `run`/`coverage`/`watch` = LIGHT (no gate) |
| `/hub:ui-ux-pro-max <target>` | HEAVY | 60k–180k | Deep UI/UX audit + redesign — frontend-specialist + 3 design skills |

Pass `--yes` or `-y` to any command to bypass the gate (MEDIUM/HEAVY). Usage still logs.

### Agent shims (20) — direct dispatch, LIGHT, no gate

Each `/hub:agent-<name>` is a thin wrapper that dispatches the named agent with your arguments. Useful when you want a specific expert by name instead of going through a workflow.

| Shim | Dispatches |
|---|---|
| `/hub:agent-orchestrator <task>` | `hub:orchestrator` |
| `/hub:agent-project-planner <task>` | `hub:project-planner` |
| `/hub:agent-product-owner <task>` | `hub:product-owner` |
| `/hub:agent-product-manager <task>` | `hub:product-manager` |
| `/hub:agent-code-archaeologist <task>` | `hub:code-archaeologist` |
| `/hub:agent-backend-specialist <task>` | `hub:backend-specialist` |
| `/hub:agent-database-architect <task>` | `hub:database-architect` |
| `/hub:agent-devops-engineer <task>` | `hub:devops-engineer` |
| `/hub:agent-security-auditor <task>` | `hub:security-auditor` |
| `/hub:agent-penetration-tester <task>` | `hub:penetration-tester` |
| `/hub:agent-performance-optimizer <task>` | `hub:performance-optimizer` |
| `/hub:agent-frontend-specialist <task>` | `hub:frontend-specialist` |
| `/hub:agent-mobile-developer <task>` | `hub:mobile-developer` |
| `/hub:agent-seo-specialist <task>` | `hub:seo-specialist` |
| `/hub:agent-game-developer <task>` | `hub:game-developer` |
| `/hub:agent-debugger <task>` | `hub:debugger` |
| `/hub:agent-test-engineer <task>` | `hub:test-engineer` |
| `/hub:agent-qa-automation-engineer <task>` | `hub:qa-automation-engineer` |
| `/hub:agent-documentation-writer <task>` | `hub:documentation-writer` |
| `/hub:agent-explorer-agent <task>` | `hub:explorer-agent` |

---

## Agents (20)

### Architects / Leads

| Agent | What it does |
|---|---|
| `hub:orchestrator` | Multi-agent coordinator — breaks large tasks into parallel slices |
| `hub:project-planner` | Task breakdown, dependency graphs, docs/PLAN-*.md output |
| `hub:product-owner` | Requirements, user stories, acceptance criteria, backlog management |
| `hub:product-manager` | MoSCoW prioritisation, "build the right thing on the right budget" |
| `hub:code-archaeologist` | Legacy code reading, reverse engineering, modernisation planning |

### Backend / Data / Infra

| Agent | What it does |
|---|---|
| `hub:backend-specialist` | API routes, services, business logic (Node.js, Python/FastAPI, edge) |
| `hub:database-architect` | Schema design, migrations, query optimisation, indexing |
| `hub:devops-engineer` | Deployment, CI/CD, server management, rollbacks — high-risk ops |
| `hub:security-auditor` | OWASP 2025 audits, zero-trust, supply chain security |
| `hub:penetration-tester` | Offensive security, red team, exploit simulations (CTF / engagement) |
| `hub:performance-optimizer` | Profiling, Core Web Vitals, bundle size, runtime bottlenecks |

### Frontend / UX

| Agent | What it does |
|---|---|
| `hub:frontend-specialist` | React, Next.js, Vue, Svelte — components, state, responsive design |
| `hub:mobile-developer` | React Native, Flutter — cross-platform mobile apps and native features |
| `hub:seo-specialist` | SEO audits, Core Web Vitals, E-E-A-T, AI search (GEO) visibility |
| `hub:game-developer` | Unity, Godot, Phaser, Three.js — mechanics, multiplayer, 2D/3D |

### Quality / Ops

| Agent | What it does |
|---|---|
| `hub:debugger` | Systematic root-cause analysis — the specialist for hard bugs |
| `hub:test-engineer` | Test writing, TDD, coverage improvement — unit through integration |
| `hub:qa-automation-engineer` | Playwright, Cypress, E2E pipelines, regression suites |
| `hub:documentation-writer` | READMEs, API docs, changelogs — invoked only on explicit request |
| `hub:explorer-agent` | Deep codebase discovery, architectural analysis, initial audits |

---

## Skills (42)

### Cross-stack quality (7)
`hub:clean-code` · `hub:lint-and-validate` · `hub:testing-patterns` · `hub:tdd-workflow` · `hub:systematic-debugging` · `hub:code-review-checklist` · `hub:webapp-testing`

### Backend / Python (10)
`hub:fastapi-expert` · `hub:sqlalchemy-expert` · `hub:python-patterns` · `hub:api-patterns` · `hub:database-design` · `hub:app-builder` · `hub:nodejs-best-practices` · `hub:bash-linux` · `hub:powershell-windows` · `hub:rust-pro`

### LLM / AI (2)
`hub:llm-observability` · `hub:mcp-builder`

### Frontend (9)
`hub:frontend-design` · `hub:web-design-guidelines` · `hub:tailwind-patterns` · `hub:nextjs-react-expert` · `hub:mobile-design` · `hub:geo-fundamentals` · `hub:seo-fundamentals` · `hub:i18n-localization` · `hub:game-development`

### Workflow (9)
`hub:socratic-gate` · `hub:approval-gate` · `hub:plan-writing` · `hub:parallel-agents` · `hub:intelligent-routing` · `hub:behavioral-modes` · `hub:instincts` · `hub:architecture` · `hub:documentation-templates`

### Security (2)
`hub:vulnerability-scanner` · `hub:red-team-tactics`

### Ops (3)
`hub:deployment-procedures` · `hub:server-management` · `hub:performance-profiling`
