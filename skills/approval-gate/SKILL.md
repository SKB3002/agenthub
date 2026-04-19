---
name: approval-gate
description: User-approval gate that every MEDIUM and HEAVY /hub:* command must render before dispatching agents. Handles tier lookup from command frontmatter, gate rendering with alternatives, reading the optional budget file, appending to the project usage log, and gracefully handling --yes bypass. Load this skill from any command that dispatches agents or writes files.
allowed-tools: Read, Glob, Write, Edit, Bash
---

# Approval Gate — pre-dispatch user control

> **Contract:** no MEDIUM or HEAVY `/hub:*` command dispatches an agent or writes a file until the user has approved this gate (or passed `--yes`/`-y`). LIGHT commands never gate.

See [tiers.md](tiers.md) for the tier taxonomy and the token-estimation formula.

---

## 1. When to load this skill

Load from the body of any `/hub:*` command whose frontmatter declares `tier: MEDIUM` or `tier: HEAVY`.
Do **not** load for `tier: LIGHT` — those commands run directly.

Typical invocation from a command body:

```markdown
## Flow

1. Load the `approval-gate` skill.
2. Compute planned agents + skills list for the user's task.
3. Render the gate per this skill's contract (§3).
4. Parse the user's reply.
5. On "go" / chosen alternative → dispatch. On "tweak" → ask clarifying Qs, re-render. On "cancel" → stop, append cancelled run to usage log.
6. After dispatch, run the post-run ledger (§5).
```

---

## 2. Inputs to the gate (computed by the calling command)

| Input | How the command produces it |
|---|---|
| `command_name` | Literal string, e.g. `/hub:create` |
| `user_args` | The original `$ARGUMENTS` string |
| `planned_agents` | List of `hub:<name>` the command intends to dispatch, in order |
| `planned_skills` | List of `hub:<name>` skills likely to load |
| `tier` | From the command's own frontmatter — `MEDIUM` or `HEAVY` |
| `tier_rationale` | From frontmatter |
| `estimated_tokens` | From frontmatter, e.g. `"80k–200k"` |
| `risk` | From frontmatter |
| `alternatives` | Only for HEAVY — list of 2–3 lighter paths. See §4. |
| `moscow` | Only for HEAVY — {must, should, could, won't} breakdown. See §4. |

---

## 3. Rendering contract

### 3.1 Prefix rule (MANDATORY)

Every primitive mentioned in the gate carries the `hub:` prefix:
- Commands: `/hub:<name>`
- Agents: `hub:<name>`
- Skills: `hub:<name>`

This matches the README-wide convention. Never strip the prefix in gate output, even when a line feels redundant.

### 3.2 MEDIUM gate — one-liner + prompt

```
⚖️  /hub:<cmd> "<args>"
    → <agent list, hub: prefixed, comma-separated>  (+ <skill list>)
    Tier: MEDIUM · <estimated-tokens> · writes <N> files
    Proceed? (y/n/tweak)
```

Rationale: MEDIUM commands are frequent; the user is typically in flow. One line keeps friction low but still provides consent.

### 3.3 HEAVY gate — full preview

Render the 8 sections below, in order:

1. **Header** — `⚖️  Kit dispatch preview — /hub:<cmd>`
2. **Task** — the `$ARGUMENTS` verbatim, quoted
3. **Planned agents** — each on its own line, with the order-of-dispatch and a 3–6 word purpose suffix
4. **Planned skills** — comma-separated, one line
5. **Tier block** — `Tier: HEAVY  (<estimated-tokens>, ~<wall-clock>) · Why: <tier-rationale> · Risk: <risk>`
6. **MoSCoW for this task** — 4 lines (MUST / SHOULD / COULD / WON'T). See §4.2.
7. **Alternatives** — 2–3 options (a/b/c) of progressively lighter scope, each with its own estimated tokens
8. **Budget line** (only if `~/.hub/budget.json` or project `.hub/budget.json` exists) — `Your budget: <level>` + recommendation
9. **Reply options** — one line listing every valid reply

### 3.4 Reply parsing

Accept (case-insensitive, trimmed):
- `go`, `yes`, `y`, `a` → proceed with main plan
- `b` / `c` → proceed with alternative B / C
- `tweak` → ask clarifying questions, re-render the gate
- `cancel`, `no`, `n` → abort, append cancellation to usage log, return cleanly

Anything else → re-prompt once with the valid-reply list.

### 3.5 `--yes` / `-y` bypass

If the user's `$ARGUMENTS` starts with `--yes` or `-y` (whitespace-separated), skip rendering entirely, treat as `go`, strip the flag before passing the rest to the agents. Still append the run to `.hub/usage.json` — the bypass skips the gate, not the ledger.

---

## 4. Alternatives and MoSCoW (HEAVY only)

### 4.1 How to propose alternatives

Every HEAVY gate must offer at least two lighter alternatives beyond the main plan. The calling command owns the exact content; the skill requires the shape:

```
(a) Proceed as-is (HEAVY)                                    ~<range>
(b) MUST-only: <what's cut>                                   ~<range>  (≈MEDIUM)
(c) Plan-only: <which agent(s) remain>                        ~<range>  (≈LIGHT)
```

Rules:
- (a) is always the full plan
- At least one option must drop a tier (HEAVY→MEDIUM or MEDIUM→LIGHT)
- Ranges are honest brackets from [tiers.md](tiers.md), not made up
- Never hide an option — if a cheaper path genuinely fits, show it

### 4.2 MoSCoW block

Four lines, each ≤ 80 chars:

```
MoSCoW for this task:
  MUST    — <bare minimum for the user's stated goal>
  SHOULD  — <valuable additions the main plan includes>
  COULD   — <scope creep candidates the user might want to defer>
  WON'T   — <explicit out-of-scope guardrails>
```

MoSCoW is taken from [claude/agents/product-manager.md](../../claude/agents/product-manager.md) prioritization. Its purpose in the gate is to let the user trim at point-of-approval by picking alternative (b).

---

## 5. Post-run ledger (fires after every run, gated or not)

Every `/hub:*` run appends one entry to `.hub/usage.json` in the project root. This is how the kit keeps an honest record of cost.

### 5.1 File location and creation

- Path: `.hub/usage.json` relative to **the user's current working directory** (their project). This is NOT inside `${CLAUDE_PLUGIN_ROOT}`. When in doubt, look for the directory that contains `.git/`, `package.json`, `pyproject.toml`, `Cargo.toml`, or `go.mod`.
- Auto-created on first run if absent. The `.hub/` directory is gitignored; `instincts.yaml` inside it is git-tracked (see `.gitignore` negation).
- Never write above the project root. Never create if cwd is outside a recognisable project.

### 5.2 Run-entry shape

See [../../docs/PLAN-v0.3-user-approval-economy.md §6.2](../../docs/PLAN-v0.3-user-approval-economy.md) for the authoritative schema. Minimum required fields per run:

```
id                       e.g. "r_2026-04-19_001"  (date + sequence)
started_at, ended_at     ISO-8601 UTC
duration_seconds         integer
command                  "/hub:<name>"
args                     string
tier_declared            from frontmatter
tier_observed            recomputed from actual dispatch
approved                 true | false
chosen_alternative       "a" | "b" | "c" | null
agents[]                 [{name, approx_tokens, skipped?}]
skills[]                 list of hub:<name>
files_written            integer
files_changed            integer
approx_total_tokens      integer (sum of agents + overhead)
user_verdict             null | "useful" | "wasted" | "partial"
notes                    null | string
```

### 5.3 Appending (MANDATORY — use the Write tool, do not skip or defer)

1. Use the **Read tool** to read `.hub/usage.json` in the project directory. If it doesn't exist, start with `{"runs": []}`.
2. Parse the JSON, append the new run entry to `runs[]`.
3. Use the **Write tool** to write the updated JSON back to `.hub/usage.json`.

If the file is corrupt, write the new entry to `.hub/usage-RECOVERED.json` and inform the user instead of overwriting.

### 5.4 Cancellations still log

If the user replies `cancel`, append an entry with:
- `approved: false`
- `agents: []`
- `approx_total_tokens: 0`
- `notes: "cancelled at gate"`

This is what lets `/hub:ledger weekly` show "3 runs cancelled — estimated saved ~350k tokens" — the savings line is computed from the declared `estimated_tokens` of cancelled HEAVY runs.

---

## 6. Reading the optional budget file

### 6.1 Resolution order

1. Project-local `<project-root>/.hub/budget.json` (takes precedence if present)
2. Home-level `~/.hub/budget.json`
3. Neither present → budget features are invisible (no budget line in gate, no adaptation)

### 6.2 Schema

```json
{
  "level": "low" | "medium" | "ok",
  "weekly_reset_day": "monday" | "tuesday" | ... | null,
  "notes": "free-text" | null
}
```

### 6.3 Effect on gate (when file exists)

| Level | Add budget line | Default alternative | Warn on HEAVY |
|---|---|---|---|
| `low`    | yes | (c) Plan-only | yes, explicit |
| `medium` | yes | (a) as-is | no |
| `ok`     | yes, minimal | (a) as-is | no |

When `weekly_reset_day` is set, add one line to the gate: `Your declared reset day is <Monday> — today is <Thursday>, 3 days to reset.` Pure arithmetic, no fabrication.

---

## 7. Inline ledger (prints after a gated run completes)

After dispatch finishes (or cancels), render the inline ledger block described in [../../docs/PLAN-v0.3-user-approval-economy.md §6.4](../../docs/PLAN-v0.3-user-approval-economy.md). The ledger includes:

- Agents ran vs planned
- Skills consumed
- Files written
- Approximate token share per agent (percentages + `~` absolute)
- Tier declared vs observed (with in-tier ✓ / drift ✗ marker)
- Duration
- Usage-log ID for later verdict tagging
- "Worth it?" sentence
- Next suggested LIGHT/MEDIUM follow-up

---

## 8. Anti-patterns (never do)

- ❌ Dispatch agents before the user replies to the gate (except on `--yes`)
- ❌ Fabricate a remaining-weekly-quota number
- ❌ Compute token values without the `~` prefix in user-facing output
- ❌ Auto-create `.hub/budget.json` or prompt for it
- ❌ Silently skip the usage-log append, even for cancellations
- ❌ Strip the `hub:` prefix from anything user-facing
- ❌ Add an "are you sure?" follow-up prompt after the gate — one approval is enough; trust the user

---

## 9. Where to edit what

| Change | File |
|---|---|
| Tier ranges, estimation formula | [tiers.md](tiers.md) |
| Gate rendering contract | this file |
| Schema of `.hub/usage.json` | [../../docs/PLAN-v0.3-user-approval-economy.md §6.2](../../docs/PLAN-v0.3-user-approval-economy.md) |
| Per-command `tier` / `estimated-tokens` | each `commands/<name>.md` frontmatter |

Keep those four places in sync — a mismatch is a bug.
