# AgentHub

> **20 specialist subagents · 42 skills · 17 workflows** — works on both **Claude Code** and **OpenAI Codex**. One repo, two platforms, shared core.

AgentHub gives your AI coding sessions an instant upgrade: domain experts that activate automatically, deep knowledge modules loaded on demand, and workflow commands that orchestrate entire feature builds — all on your budget, with your consent.

| Platform | Invocation | Manifest | Skills | Protocol |
|---|---|---|---|---|
| Claude Code | `/hub:<command>` | `.claude-plugin/plugin.json` | `skills/*/SKILL.md` | `claude/PROTOCOL.md` |
| OpenAI Codex | `@hub <workflow>` | `plugins/hub/.codex-plugin/plugin.json` | `skills/*/SKILL.md` | `plugins/hub/AGENTS.md` |

> **Platform difference:** Claude Code uses `/hub:` slash commands. Codex uses `@hub` mentions. The `/` prefix is reserved for Codex built-ins — typing `/hub:debug` in Codex will be rejected. Always use `@hub debug` in Codex.

`tools/generate_codex.py` keeps the Codex agent TOML files in sync with the Claude source on every release.

---

## Why this exists

Claude Code and Codex ship powerful runtimes, but every project reinvents the same scaffolding:

- Who is the "backend expert" and what do they know?
- Which skills load for a database change vs. a UI change?
- How do you orchestrate multiple agents without burning your token budget?

AgentHub gives you a curated, MIT-licensed answer. One install, both ecosystems.

---

## Install

### Claude Code

**VS Code / Cursor extension:**

1. Press `/` in the Claude Code sidebar → **Manage Plugins** → **Marketplace**
2. Paste `https://github.com/SKB3002/agenthub` and confirm
3. Go to **Plugins**, search **hub**, and click **Install**

Run `/hub:help` to verify — it will list all 17 commands, 20 agents, and 42 skills.

**CLI:**

```bash
claude plugin install https://github.com/SKB3002/agenthub
```

Then search **hub** in `/plugin` and install.

---

### OpenAI Codex

```bash
# 1. Install the Codex CLI (if you haven't already)
npm install -g @openai/codex

# 2. Register the AgentHub marketplace
codex marketplace add https://github.com/SKB3002/agenthub

# 3. Start Codex, then install the plugin
codex
```

Inside Codex: press `/plugin` → search **hub** → **Install**.

Use `@hub help` to verify. **Always use `@hub` in Codex, never `/hub:`** — the `/` prefix is reserved for Codex built-ins.

---

## Recommended workflow

### Claude Code (`/hub:` commands)

```
1. /hub:brainstorm <idea>        — explore options before writing any code  (MEDIUM)
2. /hub:plan <feature>           — turn the chosen direction into a plan file  (MEDIUM)
3. /hub:create <app>             — scaffold a greenfield app  (HEAVY)
   or /hub:enhance <change>      — add/update features in an existing app  (HEAVY)
4. /hub:test generate <module>   — generate tests for the new code  (MEDIUM)
   or /hub:test                  — run existing tests  (LIGHT)
5. /hub:deploy staging           — pre-flight + deploy  (HEAVY)
   then /hub:deploy production
```

**Sprinting on a bug?** `/hub:debug` → `/hub:test` → done.

### OpenAI Codex (`@hub` mentions)

```
1. @hub brainstorm <idea>        — explore options before writing any code
2. @hub plan <feature>           — turn the chosen direction into a plan file
3. @hub create <app>             — scaffold a greenfield app
   or @hub enhance <change>      — add/update features in an existing app
4. @hub test generate <module>   — generate tests for the new code
   or @hub test                  — run existing tests
5. @hub deploy staging           — pre-flight + deploy
   then @hub deploy production
```

**Sprinting on a bug?** `@hub debug` → `@hub test` → done.

Every MEDIUM/HEAVY command renders an approval gate before dispatching agents — you always see what will run and can cancel or pick a lighter alternative. Pass `--yes` / `-y` to bypass.

---

## Commands (17)

> Use `/hub:<command>` in **Claude Code** · Use `@hub <command>` in **OpenAI Codex**

| Claude Code | Codex | Tier | ~Tokens | What it does |
|---|---|---|---|---|
| `/hub:brainstorm <idea>` | `@hub brainstorm <idea>` | MEDIUM | 10k–30k | Explore 3+ options with trade-offs — no code, ideas only |
| `/hub:budget [low\|medium\|ok\|clear]` | `@hub budget [...]` | LIGHT | <2k | Opt-in budget hint; adds a budget line to the HEAVY gate |
| `/hub:context-budget [verbose]` | `@hub context-budget` | LIGHT | <2k | Session headroom signal (GREEN/YELLOW/RED) + drop-candidate detection |
| `/hub:create <what to build>` | `@hub create <app>` | HEAVY | 80k–200k | Scaffold a new app — up to 5 specialists from planner through devops |
| `/hub:debug <symptom or error>` | `@hub debug <symptom>` | MEDIUM | 15k–40k | Systematic root-cause investigation and fix |
| `/hub:deploy [check\|staging\|production\|rollback]` | `@hub deploy [...]` | HEAVY | 40k–100k | Pre-flight checks, deployment, and post-deploy verification |
| `/hub:enhance <change to make>` | `@hub enhance <change>` | HEAVY | 50k–150k | Add or update features in an existing app |
| `/hub:help [commands\|agents\|skills\|<name>]` | `@hub help [...]` | LIGHT | <5k | Full capability index — reads CATALOG.md, no bash |
| `/hub:hookify <nl description>` | `@hub hookify <desc>` | LIGHT | <2k | Natural language → hooks.json snippet (never writes the file itself) |
| `/hub:instincts [status\|show\|promote\|clear]` | `@hub instincts [...]` | LIGHT | <2k | Project-scoped learned preferences in `.hub/instincts.yaml` |
| `/hub:ledger [weekly\|by-agent\|by-skill\|roi\|...]` | `@hub ledger [...]` | LIGHT | <3k | Read-only views over `.hub/usage.json` |
| `/hub:orchestrate <task or plan>` | `@hub orchestrate <task>` | HEAVY | 80k–250k | Coordinate ≥3 agents in a 2-phase plan→approve→implement pipeline |
| `/hub:plan <what to plan>` | `@hub plan <feature>` | MEDIUM | 20k–50k | Generate `docs/PLAN-<slug>.md` — no code, plan file only |
| `/hub:preview [start\|stop\|url]` | `@hub preview [...]` | LIGHT | <2k | Start/stop the dev server and show the local URL |
| `/hub:status` | `@hub status` | LIGHT | <2k | Project state: stack, git, open TODOs, recent changes |
| `/hub:test [generate\|run\|coverage\|watch]` | `@hub test [...]` | MEDIUM | 15k–60k | `generate` = MEDIUM (writes tests); other modes = LIGHT |
| `/hub:ui-ux-pro-max <target>` | `@hub ui-ux-pro-max <target>` | HEAVY | 60k–180k | Deep UI/UX audit + redesign via frontend-specialist + 3 design skills |

---

## Agents (20)

Dispatch via `Agent(subagent_type="hub:<name>")`. All agents are namespaced `hub:`.

### Architects / Leads

| Agent | What it does |
|---|---|
| `hub:orchestrator` | Multi-agent coordinator — breaks large tasks into parallel slices |
| `hub:project-planner` | Task breakdown, dependency graphs, `docs/PLAN-*.md` output |
| `hub:product-owner` | Requirements, user stories, acceptance criteria, backlog |
| `hub:product-manager` | MoSCoW prioritisation, "build the right thing on the right budget" |
| `hub:code-archaeologist` | Legacy code reading, reverse engineering, modernisation planning |

### Backend / Data / Infra

| Agent | What it does |
|---|---|
| `hub:backend-specialist` | API routes, services, business logic (Node.js, Python/FastAPI, edge) |
| `hub:database-architect` | Schema design, migrations, query optimisation, indexing |
| `hub:devops-engineer` | Deployment, CI/CD, server management, rollbacks — high-risk ops |
| `hub:security-auditor` | OWASP 2025 audits, zero-trust architecture, supply chain security |
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
| `hub:test-engineer` | Test writing, TDD, coverage improvement |
| `hub:qa-automation-engineer` | Playwright, Cypress, E2E pipelines, regression suites |
| `hub:documentation-writer` | READMEs, API docs, changelogs — invoked only on explicit request |
| `hub:explorer-agent` | Deep codebase discovery, architectural analysis, initial audits |

---

## What's inside

| Primitive | Count | Location |
|---|---|---|
| Subagents | 20 | [`agents/`](agents/) (Claude) · [`plugins/hub/agents/`](plugins/hub/agents/) (Codex, TOML) |
| Skills | 42 | [`skills/`](skills/) — shared by both platforms |
| Slash commands | 17 | [`commands/`](commands/) (Claude) · [`plugins/hub/commands/`](plugins/hub/commands/) (Codex) |
| Validation scripts | 16 | `skills/<skill>/scripts/` (co-located with the skill) |
| MCP servers | 5 pre-validated, opt-in | [`claude/mcp.example.json`](claude/mcp.example.json) + [`claude/mcp-servers.md`](claude/mcp-servers.md) |
| Hooks | opt-in scaffold | [`claude/hooks/`](claude/hooks/) |

### Highlighted skills

Skills are loaded on demand by agents. All 42 live in `skills/` and are shared across platforms:

- **Cross-stack quality:** `hub:clean-code`, `hub:lint-and-validate`, `hub:testing-patterns`, `hub:tdd-workflow`, `hub:systematic-debugging`, `hub:code-review-checklist`
- **Backend / Python:** `hub:fastapi-expert`, `hub:sqlalchemy-expert`, `hub:python-patterns`, `hub:api-patterns`, `hub:database-design`
- **LLM / AI:** `hub:llm-observability`, `hub:mcp-builder`
- **Frontend:** `hub:frontend-design`, `hub:web-design-guidelines`, `hub:tailwind-patterns`, `hub:nextjs-react-expert`, `hub:mobile-design`
- **Workflow:** `hub:socratic-gate`, `hub:approval-gate`, `hub:plan-writing`, `hub:parallel-agents`, `hub:intelligent-routing`, `hub:behavioral-modes`
- **Security:** `hub:vulnerability-scanner`, `hub:red-team-tactics`
- **Ops:** `hub:deployment-procedures`, `hub:server-management`, `hub:performance-profiling`

Full list: [`skills/`](skills/). Run `/hub:help skills` (Claude Code) or `@hub help skills` (Codex) to list everything live.

---

## Approval-first by design

Every command declares a tier. Commands never silently fan out agents on your tokens.

| Tier | Behaviour | Claude Code | Codex |
|---|---|---|---|
| **LIGHT** | Runs directly — no gate. | `/hub:status`, `/hub:preview`, `/hub:budget` | `@hub status`, `@hub preview`, `@hub budget` |
| **MEDIUM** | One-line preview + `y/n/tweak` prompt. | `/hub:debug`, `/hub:plan`, `/hub:brainstorm` | `@hub debug`, `@hub plan`, `@hub brainstorm` |
| **HEAVY** | Full gate — agents, skills, estimated tokens, MoSCoW scope, alternatives. | `/hub:create`, `/hub:enhance`, `/hub:deploy` | `@hub create`, `@hub enhance`, `@hub deploy` |

Pass `--yes` or `-y` as the first argument to bypass any gate.

**Usage log — `.hub/usage.json`** (gitignored, project-local)

Read it via `/hub:ledger` (Claude Code) or `@hub ledger` (Codex):

- `ledger weekly` — ISO-week totals by tier, top agents, top skills
- `ledger by-agent` / `by-skill` / `by-tier` — ranked aggregations
- `ledger roi` — useful/wasted/partial ratios (from runs you tag)

**Honesty contract:** every token number is prefixed `~`. No dollar conversion, ever.

---

## Hooks — opt-in

`claude/hooks/hooks.json` ships **empty**. To wire lint-on-edit, security-on-save, or test-on-stop, copy entries from [`claude/hooks/hooks.example.json`](claude/hooks/hooks.example.json) into `claude/hooks/hooks.json` and restart Claude Code.

---

## MCP servers — opt-in

Copy entries from [`claude/mcp.example.json`](claude/mcp.example.json) into your project's `.mcp.json` to activate any of the 5 pre-validated servers (filesystem, github, postgres, fetch, sequential-thinking).

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Whether you're adding a subagent, fixing a skill, or proposing a workflow — all contributions are appreciated.

---

## Credits

- Built on [antigravity-kit](https://github.com/vudovn/antigravity-kit) by [@vudovn](https://github.com/vudovn) — the structural blueprint. Licensed MIT.
- Skill content draws from Vercel's React & Web Design Guidelines, OWASP, Core Web Vitals, and the broader open-source community.

---

## License

MIT — see [LICENSE](LICENSE). Use it commercially, personally, or in your side project. Forks, remixes, and derivatives are welcome.
