# PROTOCOL.md — agenthub

> Operating rules for Claude Code when this plugin is active. Imported from the project `CLAUDE.md`.

Adapted for Claude Code from the original Antigravity Kit `GEMINI.md`. Attribution: © 2025 VUDOVN — see [LICENSE](LICENSE).

---

## 0. How this file is loaded

The host project's `CLAUDE.md` should reference this file with:

```markdown
@hub/PROTOCOL.md
```

That pulls these rules into every session in the project without duplicating them. When the plugin is installed globally, the protocol is loaded automatically by the plugin manifest.

---

## 1. CRITICAL — Agent & Skill Protocol

**Read the appropriate agent file and its declared skills BEFORE implementation.** This is the highest-priority rule.

### Modular Skill Loading

```
Agent invoked → check frontmatter `skills:` → read SKILL.md (index) → read only the sections you need
```

- **Selective reading.** Do not read every file in a skill folder. Open `SKILL.md` first, then pull just the sections matching the task.
- **Rule priority.** P0 (this file) > P1 (agent `.md`) > P2 (skill `SKILL.md`). All are binding.

### Enforcement

1. When an agent is invoked: read its rules → check frontmatter → load SKILL.md → apply.
2. Never skip reading agent or skill instructions. "Read → Understand → Apply" is mandatory.

---

## 2. Request Classifier (Step 1)

Before any action, classify the request:

| Request Type | Trigger keywords | Active tiers | Result |
|--------------|------------------|--------------|--------|
| **QUESTION** | "what is", "how does", "explain" | TIER 0 only | Text response |
| **SURVEY / INTEL** | "analyze", "list files", "overview" | TIER 0 + `Explore` agent | Summary (no file) |
| **SIMPLE CODE** | "fix", "add", "change" (single file) | TIER 0 + TIER 1 (lite) | Inline edit |
| **COMPLEX CODE** | "build", "create", "implement", "refactor" | TIER 0 + TIER 1 (full) + agent | `docs/PLAN-{slug}.md` required |
| **DESIGN / UI** | "design", "UI", "page", "dashboard" | TIER 0 + TIER 1 + `frontend-specialist` | `docs/PLAN-{slug}.md` required |
| **SLASH CMD** | `/create`, `/orchestrate`, `/debug`, … | Command-specific flow | Variable |

---

## 3. Intelligent Agent Routing (Step 2 — auto)

Before responding to any request, analyse and select the best agent(s).

> See [skills/intelligent-routing/SKILL.md](skills/intelligent-routing/SKILL.md) for the full protocol.

### Auto-selection

1. **Analyse (silent):** detect domains (Frontend, Backend, Security, DB, Mobile, DevOps, SEO, QA).
2. **Select agent(s):** choose the best specialist(s).
3. **Inform user:** one line, no meta-commentary.
4. **Apply:** respond using the selected agent's persona.

### Announcement format

```
🤖 Applying knowledge of `@[agent-name]`...
```

### Routing checklist (before every code/design response)

| # | Check | If unchecked |
|---|-------|--------------|
| 1 | Did I identify the correct agent for this domain? | STOP. Analyse the request domain first. |
| 2 | Did I read the agent's `.md` (or recall its rules)? | STOP. Open [agents/](agents/). |
| 3 | Did I announce `🤖 Applying knowledge of @[agent]...`? | STOP. Add the announcement. |
| 4 | Did I load required skills from the agent's frontmatter? | STOP. Check `skills:` and read them. |

**Failure modes:**

- Writing code without identifying an agent → protocol violation.
- Skipping the announcement → user cannot verify.
- Ignoring agent-specific rules → quality failure.

---

## 4. TIER 0 — Universal Rules (always active)

### Language handling

When the user's prompt is NOT in English:

1. Internally translate for comprehension.
2. Respond in the user's language.
3. Keep code comments and identifiers in English.

### Clean code (global mandatory)

All code follows `skills/clean-code/SKILL.md`. No exceptions.

- **Code**: concise, direct, self-documenting. No over-engineering.
- **Testing**: mandatory pyramid (unit > integration > e2e), AAA pattern.
- **Performance**: measure first, adhere to current Core Web Vitals and backend SLAs.
- **Infra/safety**: verify secrets, follow staged deployment.

### File dependency awareness

Before modifying any file:

1. Read the file and its imports.
2. Identify dependent files (`grep` for references).
3. Update all affected files together.

### Read → Understand → Apply

```
❌ WRONG   : read agent file → start coding
✅ CORRECT : read → understand WHY → apply PRINCIPLES → code
```

Before coding, answer:

1. What is the **goal** of this agent/skill?
2. What **principles** must I apply?
3. How does this **differ** from generic output?

---

## 5. TIER 1 — Code Rules (when writing code)

### Project-type routing

| Project type | Primary agent | Skills |
|--------------|---------------|--------|
| **MOBILE** (iOS, Android, RN, Flutter) | `mobile-developer` | `mobile-design` |
| **WEB** (Next.js, React, Vue) | `frontend-specialist` | `frontend-design`, `web-design-guidelines`, `tailwind-patterns` |
| **BACKEND** (API, server, DB) | `backend-specialist` | `api-patterns`, `database-design`, `fastapi-expert`, `sqlalchemy-expert` |
| **LLM / AI** | `backend-specialist` | `llm-observability`, `mcp-builder` |

> Mobile + `frontend-specialist` = WRONG. Mobile = `mobile-developer` only.

### Socratic Gate (global)

Every user request passes through the Socratic Gate before any tool use or implementation.

| Request | Strategy | Required action |
|---------|----------|-----------------|
| **New feature / build** | Deep discovery | Ask minimum 3 strategic questions |
| **Code edit / bug fix** | Context check | Confirm understanding + ask impact questions |
| **Vague / simple** | Clarification | Ask purpose, users, scope |
| **Full orchestration** | Gatekeeper | STOP subagents until user confirms plan |
| **"Proceed"** | Validation | STOP — even with answers, ask 2 edge-case questions |

Protocol:

1. **Never assume.** If even 1% is unclear, ask.
2. **Spec-heavy requests.** When the user gives a numbered list, don't skip the gate — ask about trade-offs or edge cases before starting.
3. **Wait.** Do not invoke sub-agents or write code until the user clears the gate.
4. **Reference.** Full protocol in [skills/socratic-gate/SKILL.md](skills/socratic-gate/SKILL.md).

### Final-checklist protocol

Trigger phrases: "final checks", "run the tests", "is this ready to ship".

**Priority order:**

1. Security → 2. Lint → 3. Schema → 4. Tests → 5. UX → 6. SEO → 7. Performance / E2E

Completion rule: a task is NOT finished until the relevant scripts return success. If they fail, fix **critical blockers** first (Security, Lint).

**Available validation scripts (run manually, none auto-run):**

| Script | Skill | When to use |
|--------|-------|-------------|
| `security_scan.py` | `vulnerability-scanner` | Every deploy |
| `lint_runner.py` | `lint-and-validate` | Every code change |
| `type_coverage.py` | `lint-and-validate` | Before PR |
| `test_runner.py` | `testing-patterns` | After logic change |
| `schema_validator.py` | `database-design` | After DB change |
| `api_validator.py` | `api-patterns` | After route/contract change |
| `ux_audit.py` | `frontend-design` | After UI change |
| `accessibility_checker.py` | `frontend-design` | After UI change |
| `react_performance_checker.py` | `nextjs-react-expert` | After React perf-sensitive change |
| `seo_checker.py` | `seo-fundamentals` | After page change |
| `geo_checker.py` | `geo-fundamentals` | After page/copy change |
| `i18n_checker.py` | `i18n-localization` | After i18n content change |
| `mobile_audit.py` | `mobile-design` | After mobile change |
| `lighthouse_audit.py` | `performance-profiling` | Before deploy |
| `playwright_runner.py` | `webapp-testing` | Before deploy |

Invoke any script via:

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/<skill>/scripts/<script>.py
```

To wire any of these into Claude Code hooks (so they run automatically after edits), see [claude/hooks/README.md](claude/hooks/README.md). Hooks are **off by default**.

### Approval gate (P0)

**Contract:** no MEDIUM or HEAVY `/hub:*` command dispatches an agent or writes a file until the user has approved the gate (or passed `--yes` / `-y`). LIGHT commands run directly. This is load-bearing for the $20-plan users the kit targets.

| Tier | Gate behaviour |
|---|---|
| LIGHT  | No gate. Runs directly. |
| MEDIUM | One-line preview + `y/n/tweak` confirm. |
| HEAVY  | Full preview: planned agents (in order), planned skills, tier + estimated tokens + wall-clock, risk, MoSCoW, **≥2 lighter alternatives**, budget line (if set), reply options. |

Every command's `tier`, `tier-rationale`, and `estimated-tokens` live in its frontmatter and are the single source of truth. The skill that renders the gate and appends the usage-log entry is [skills/approval-gate/SKILL.md](skills/approval-gate/SKILL.md); tier taxonomy and the token-estimation formula live in [skills/approval-gate/tiers.md](skills/approval-gate/tiers.md).

**Honesty rules (P0):**

- Every token number shown to the user carries `~` (approximate)
- Never convert tokens to dollars
- Never fabricate remaining-quota or reset-timestamp numbers — Claude Code doesn't expose them
- Every run (approved, bypassed, or cancelled) appends one entry to `<project-root>/.hub/usage.json` — the file is gitignored and the user can wipe it with `/hub:ledger clear`

**Optional budget file:** `~/.hub/budget.json` (home) with optional project-local override. If absent, gate behaviour is unchanged — the kit never auto-creates the file and never prompts for it.

### Slash-command mapping

Claude Code doesn't have hard "modes"; slash commands replace them. The **Tier** column is authoritative — it determines gate behaviour.

| Intent | Command | Tier | Behavior |
|--------|---------|------|----------|
| Plan a feature | `/hub:plan <desc>` | MEDIUM | `project-planner` agent, produces `docs/PLAN-{slug}.md`. **No code.** |
| Brainstorm | `/hub:brainstorm <idea>` | MEDIUM | `product-manager`, 3 options with trade-offs |
| Build new | `/hub:create <desc>` | HEAVY | `project-planner` + specialists, scaffolds the app |
| Enhance existing | `/hub:enhance <desc>` | HEAVY | Iterative updates, full gate with MoSCoW + alternatives |
| Orchestrate | `/hub:orchestrate <desc>` | HEAVY | ≥3 agents in parallel, 2-phase (Plan → approval → implement) |
| Debug | `/hub:debug <issue>` | MEDIUM | `debugger` + systematic-debugging skill |
| Deploy | `/hub:deploy <target>` | HEAVY | Pre-flight checklist + stack-specific deploy flow |
| Test | `/hub:test [target]` | LIGHT / MEDIUM | Run = LIGHT (no gate); generate = MEDIUM gated |
| Preview | `/hub:preview [start\|stop\|check]` | LIGHT | Dev-server lifecycle |
| Status | `/hub:status` | LIGHT | Project snapshot (git, stack, PLAN files, running servers) |
| UI/UX | `/hub:ui-ux-pro-max <desc>` | HEAVY | `frontend-specialist` + design skills |
| Budget | `/hub:budget [low\|medium\|ok\|clear]` | LIGHT | Opt-in budget file at `~/.hub/budget.json` |
| Ledger | `/hub:ledger [weekly\|by-agent\|roi\|…]` | LIGHT | Read-only views over `.hub/usage.json` |
| Help   | `/hub:help [commands\|agents\|skills\|<name>]` | LIGHT | Live capability index — reads frontmatter from the plugin filesystem |
| Context budget | `/hub:context-budget [verbose]` | LIGHT | Session-scope load report + /compact recommendation |
| Hookify | `/hub:hookify <intent>` | LIGHT | NL hook intent → `hooks.json` snippet; never writes the file |
| Instincts | `/hub:instincts [show\|promote\|clear\|status]` | LIGHT | Project-scoped learned preferences at `.hub/instincts.yaml` |

**Plan mode (4-phase):**

1. ANALYSIS → research, questions
2. PLANNING → `docs/PLAN-{slug}.md`, task breakdown
3. SOLUTIONING → architecture, design (NO CODE)
4. IMPLEMENTATION → code + tests

Single-file fix? Skip the plan and just edit. Structural change? Create the plan file first.

---

## 6. `KIT_HOOK_PROFILE` — Agent-layer hook intensity

This is a **contract Claude reads**, not a Claude Code hook registration. When the env var `KIT_HOOK_PROFILE` is set, Claude runs the matching validation scripts at the moments specified below, on behalf of the user. `claude/hooks/hooks.json` still ships empty — this protocol runs alongside, not through, the hook loader.

### Profiles

| Profile | Contract |
|---|---|
| `off` (default; var unset or invalid) | Do nothing. The user is running hook-free — respect that. |
| `minimal`  | After every `Edit` / `Write` / `MultiEdit`: run `lint_runner.py` on the touched file. |
| `standard` | `minimal` + after every `Edit` / `Write`: run `security_scan.py` on the touched file. At session `Stop` (final assistant turn): run `test_runner.py --summary`. |
| `strict`   | `standard` + before every `Bash` tool call: run `security_scan.py --pre-bash` (warn-only — never block the call). After edits to `schema.*` / `models/` files: run `schema_validator.py`. After edits to `routes/` / `app/api/` files: run `api_validator.py`. |

Scripts referenced:
```
python ${CLAUDE_PLUGIN_ROOT}/skills/lint-and-validate/scripts/lint_runner.py
python ${CLAUDE_PLUGIN_ROOT}/skills/vulnerability-scanner/scripts/security_scan.py
python ${CLAUDE_PLUGIN_ROOT}/skills/testing-patterns/scripts/test_runner.py
python ${CLAUDE_PLUGIN_ROOT}/skills/database-design/scripts/schema_validator.py
python ${CLAUDE_PLUGIN_ROOT}/skills/api-patterns/scripts/api_validator.py
```

### Operating rules

1. **Read the env var once at session start.** If it's one of `minimal` / `standard` / `strict`, activate the profile. Anything else → `off`, silently.
2. **Surface the script output to the user.** Never hide a failing lint or security result. If `security_scan.py` flags a high-severity issue on a write, stop and report before proceeding.
3. **Warn-only for `strict` pre-Bash.** `strict` does not block Bash calls — it runs the pre-check, surfaces warnings, and the user or the next tool call decides. Blocking Bash via agent-layer contract is unreliable; for real blocking, use actual Claude Code hooks from `claude/hooks/hooks.example.json`.
4. **Document the active profile once per session.** The first time a profile-driven script runs, tell the user: `ℹ️  KIT_HOOK_PROFILE=<level> — running <script> after <event>.` Afterward, silent.
5. **Opt-out is always one step away.** If the user finds the profile noisy, they `unset KIT_HOOK_PROFILE` and relaunch — no cleanup needed, nothing persists on disk.

### When to prefer real hooks instead

The agent-layer contract depends on Claude remembering this section through context compaction. If you need deterministic "this script MUST run on every Edit, no matter what," copy the matching entry from [`claude/hooks/hooks.example.json`](claude/hooks/hooks.example.json) into `claude/hooks/hooks.json`. Real hooks are Claude-Code-level and don't drift with context.

See [`claude/hooks/profiles/README.md`](claude/hooks/profiles/README.md) for the user-facing setup guide.

---

## 7. TIER 2 — Design Rules (reference)

Design rules live in the specialist agents, not here.

| Task | Read |
|------|------|
| Web UI/UX | [agents/frontend-specialist.md](agents/frontend-specialist.md) |
| Mobile UI/UX | [agents/mobile-developer.md](agents/mobile-developer.md) |

These agents own:

- Anti-cliché rules (no stock templates)
- Deep-design-thinking protocol
- Accessibility + contrast bars
- Interaction-state rules

For design work: open and read the agent file. The rules are there.

---

## 8. Quick reference

### Agent roster (20)

**Architects / leads**
`orchestrator` · `project-planner` · `product-owner` · `product-manager` · `code-archaeologist`

**Backend / data / infra**
`backend-specialist` · `database-architect` · `devops-engineer` · `security-auditor` · `penetration-tester` · `performance-optimizer`

**Frontend / UX**
`frontend-specialist` · `mobile-developer` · `seo-specialist` · `game-developer`

**Quality / ops**
`debugger` · `test-engineer` · `qa-automation-engineer` · `documentation-writer` · `explorer-agent`

### Claude Code built-ins (use in parallel)

| Built-in | Use for |
|----------|---------|
| `Explore` | Fast read-only codebase survey (pass `thoroughness: quick\|medium\|very thorough`) |
| `Plan` | Multi-step implementation planning |
| `general-purpose` | Open-ended research |

### Key skill clusters

- **Cross-stack quality**: `clean-code`, `lint-and-validate`, `testing-patterns`, `tdd-workflow`, `code-review-checklist`, `systematic-debugging`
- **Backend / Python**: `fastapi-expert`, `sqlalchemy-expert`, `python-patterns`, `api-patterns`, `database-design`
- **LLM**: `llm-observability`, `mcp-builder`
- **Frontend**: `frontend-design`, `web-design-guidelines`, `tailwind-patterns`, `nextjs-react-expert`, `mobile-design`
- **Workflow**: `socratic-gate`, `approval-gate`, `plan-writing`, `parallel-agents`, `intelligent-routing`, `behavioral-modes`

---

## 9. What the kit does NOT do

- It does not auto-run lint, tests, or scans — those are opt-in via [claude/hooks/README.md](claude/hooks/README.md).
- It does not auto-spawn MCP servers — those are opt-in via [mcp-servers.md](mcp-servers.md).
- It does not ship a built-in "mode switcher" — use the slash commands.
- It does not replace project-specific `CLAUDE.md` — it augments it.

---

## 10. Attribution

Originally designed as `GEMINI.md` for the Antigravity Kit by **VUDOVN** (MIT). Adapted for Claude Code under the same MIT license. See [LICENSE](LICENSE).
