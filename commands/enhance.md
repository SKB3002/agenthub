---
description: Add or update features in an existing application. Iterative development mode.
argument-hint: <change to make>
tier: HEAVY
tier-rationale: Typically 2–3 specialists depending on scope (frontend + backend, or + db), writes multiple files.
estimated-tokens: "50k–150k"
risk: Cross-cutting changes (auth, schema rename) pull in more agents and exceed upper bound.
---

# /hub:enhance — Update Existing Application

$ARGUMENTS

---

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Load the approval-gate skill.**
Read `skills/approval-gate/SKILL.md`.

**Step 3 — Scout (main-context, cheap).**
Before dispatching any agent, spend a small budget on scouting:
- Read `README.md`, `CLAUDE.md`, `PROTOCOL.md`, and `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` if present
- Grep for the feature area the user mentioned (e.g. "auth", "dark mode", "stripe")
- Identify: tech stack, likely affected files, existing conventions

Do NOT invoke agents yet. This is orientation only — keeps the gate's agent list accurate.

**Step 4 — Build the agent plan** based on Step 3:

| Change type | Typical agents |
|---|---|
| UI only (theme, layout, component) | `hub:frontend-specialist` |
| API / business logic | `hub:backend-specialist` |
| Schema / migration | `hub:database-architect` (+ backend) |
| Cross-cutting (auth, full feature) | `hub:project-planner` → `hub:backend-specialist` → `hub:frontend-specialist` |
| Infra / deployment config | `hub:devops-engineer` |

Pick the minimum set that actually covers the change. Don't over-staff.

**Step 5 — Render the HEAVY gate (skip if `bypass`).**

```
⚖️  Kit dispatch preview — /hub:enhance

Task: "<stripped args>"

Planned agents (in order):
  <hub:agent-1>          — <3–6 word purpose>
  <hub:agent-2>          — <3–6 word purpose>
  ...

Planned skills: <hub:skill-a>, <hub:skill-b>, ...

Tier: HEAVY  (50k–150k tokens, ~4–10 min wall-clock)
Why:  <tier-rationale from frontmatter, tailored to this task>
Risk: <risk from frontmatter, tailored to this task>

MoSCoW for this task:
  MUST    — <minimum that satisfies the user's stated goal>
  SHOULD  — <valuable additions the main plan includes>
  COULD   — <scope creep candidates to defer>
  WON'T   — <explicit out-of-scope guardrails; always include test generation if not asked>

Alternatives:
  (a) Proceed as-is                                           ~50k–150k
  (b) MUST-only: drop SHOULDs, skip tests/docs               ~25k–60k  (≈MEDIUM)
  (c) Plan-only: run hub:project-planner, no file writes     ~15k–40k  (≈MEDIUM)

[if ~/.hub/budget.json or ./.hub/budget.json present:]
Your budget: <level> (from <path>)
Recommended: <(c) if low, (a) if medium/ok>

Reply:  go / a   — proceed with full plan
        b        — MUST-only
        c        — plan-only
        tweak    — edit scope or agent list first
        cancel
```

Reply parsing per §3.4 of the approval-gate skill.
On cancel: append cancelled-run entry (with `estimated_tokens` recorded so `/hub:ledger weekly` can show the savings), print `🚫 Cancelled. No changes made.` and stop.

**Step 6 — Dispatch per the chosen alternative.**

- **(a) Full plan** — dispatch the agents from Step 4 in order (or in parallel if independent).
- **(b) MUST-only** — dispatch the same agents but prefix each prompt with `SCOPE: MUSTs only — <the MUSTs list>. Do NOT implement SHOULDs/COULDs.`
- **(c) Plan-only** — dispatch only `hub:project-planner` to write `docs/PLAN-enhance-<slug>.md`. No specialist agents.

Each Agent call carries:

```
Agent(
  subagent_type="<hub:...>",
  description="Enhance: <slice>",
  prompt=<<
    REPO CONTEXT (from Step 3 scouting): <stack, conventions, affected files>
    TASK: <the slice of $ARGUMENTS this agent owns>
    SCOPE: <MUST-only or full, per chosen alternative>
    CONVENTIONS:
    - Follow existing file/naming patterns
    - Commit each logical change separately
    - Run the project's lint + test suite before finishing
    - If the change affects >10 files unexpectedly, stop and report instead of proceeding
  >>
)
```

**Step 7 — Write usage log (MANDATORY — use the Write tool, do not skip).**

Path: `.hub/usage.json` in the **user's current working directory** (their project), NOT inside `${CLAUDE_PLUGIN_ROOT}`.

1. Read `.hub/usage.json` if it exists → parse the JSON. If absent → start with `{"runs": []}`.
2. Append one entry to `runs`:
   - `id`: `"r_<YYYY-MM-DD>_<NNN>"` (today + zero-padded seq = existing length + 1)
   - `started_at` / `ended_at`: ISO-8601 UTC, `command`: `"/hub:enhance"`, `args`: stripped args
   - `tier_declared`: `"HEAVY"`, `tier_observed`: recomputed from output size
   - `approved`: `true` (or `false` if cancelled), `chosen_alternative`: `"a"` | `"b"` | `"c"`
   - `agents`: array of `{"name": "hub:<name>", "approx_tokens": <N>}` for each dispatched agent
   - `skills`: array of skills consumed, `files_written`: integer, `files_changed`: integer
   - `approx_total_tokens`: sum across agents, `user_verdict`: `null`, `notes`: `null`
3. Write the updated JSON back using the **Write tool**.

**Step 8 — Print the inline HEAVY ledger.**

```
📒  /hub:enhance ledger
Ran: <N> of <M> planned agents <(+ any skipped)>
Skills: <list>
Files written: <N>  ·  files changed: <N>
Approximate token share:
  <hub:agent-1>   <N>%   (~<N>k)
  <hub:agent-2>   <N>%   (~<N>k)
  other           <N>%   (~<N>k)
Tier declared: HEAVY (50k–150k) · observed: ~<N>k (<in-tier ✓ | drift ✗>) · duration: <Xm Ys>
Logged to .hub/usage.json (<run-id>)
Worth it? — <one sentence: what the user now has>.
    Tag later with /hub:ledger verdict <run-id> useful|wasted|partial
Next suggested: /hub:test <feature>   (MEDIUM)  or  /hub:deploy check  (HEAVY)
```

---

## Cautions

- **Warn on conflicting requests** before entering the gate — e.g. user asks "add Firebase auth" when the project uses Postgres/JWT. Surface the conflict, ask, don't ignore.
- **Don't skip migrations review** — any schema change routes through `hub:database-architect`.
- **Commit each logical change separately** — never a single mega-commit.

---

## Examples

```
/hub:enhance add dark mode
/hub:enhance build admin panel
/hub:enhance integrate Stripe payments
/hub:enhance add full-text search
/hub:enhance edit profile page
/hub:enhance make the dashboard responsive
/hub:enhance add rate limiting to /api/v1/generate
/hub:enhance -y switch from LangSmith to Langfuse   (bypass gate)
```
