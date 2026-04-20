---
description: Systematic debugging. Activates DEBUG mode for methodical problem investigation.
argument-hint: <symptom or error>
tier: MEDIUM
tier-rationale: Single debugger agent + systematic-debugging skill; reads files, writes 0–2 fixes.
estimated-tokens: "15k–40k"
risk: Cross-layer bugs (frontend ↔ backend) can pull in a second specialist and push toward HEAVY.
---

# /hub:debug — Systematic Problem Investigation

$ARGUMENTS

---

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` begins with `--yes` or `-y` (whitespace-separated), set `bypass = true` and strip the flag from `$ARGUMENTS` before continuing. Otherwise `bypass = false`.

**Step 2 — Load the approval-gate skill.**
Read `skills/approval-gate/SKILL.md` for the gate contract.

**Step 3 — Compute the plan.**
- Planned agent: `hub:debugger`
- Planned skills: `hub:systematic-debugging`, `hub:clean-code`
- Tier: MEDIUM (from this file's frontmatter)

**Step 4 — Render the MEDIUM gate (skip if `bypass`).**

```
⚖️  /hub:debug "<stripped args>"
    → hub:debugger  (+ hub:systematic-debugging, hub:clean-code)
    Tier: MEDIUM · 15k–40k tokens · writes 0–2 files
    Proceed? (y/n/tweak)
```

Parse the user's reply per §3.4 of the approval-gate skill:
- `y`/`yes`/`go` → continue to Step 5
- `n`/`cancel` → append a cancelled-run entry to `.hub/usage.json` and stop. Print: `🚫 Cancelled. No tokens spent beyond this gate.`
- `tweak` → ask the user one clarifying question about scope or symptom, then re-render the gate
- Anything else → re-prompt once with the valid replies listed

**Step 5 — Dispatch.**

```
Agent(
  subagent_type="hub:debugger",
  description="Debug: <short symptom>",
  prompt="<full $ARGUMENTS with context the user supplied>\n\nFollow the systematic-debugging skill. Report root cause, fix, and prevention."
)
```

**Step 6 — Write usage log (MANDATORY — use the Write tool, do not skip).**

Path: `.hub/usage.json` in the **user's current working directory** (their project), NOT inside `${CLAUDE_PLUGIN_ROOT}`.

1. Read `.hub/usage.json` if it exists → parse the JSON. If absent → start with `{"runs": []}`.
2. Append one entry to `runs`:
   - `id`: `"r_<YYYY-MM-DD>_<NNN>"` (today + zero-padded seq = existing length + 1)
   - `started_at` / `ended_at`: ISO-8601 UTC, `command`: `"/hub:debug"`, `args`: stripped args
   - `tier_declared`: `"MEDIUM"`, `tier_observed`: recomputed from output size
   - `approved`: `true` (or `false` if cancelled), `chosen_alternative`: `null`
   - `agents`: `[{"name": "hub:debugger", "approx_tokens": <N>}]`
   - `skills`: `["hub:systematic-debugging", "hub:clean-code"]`
   - `files_written`: integer, `approx_total_tokens`: integer, `user_verdict`: `null`, `notes`: `null`
3. Write the updated JSON back using the **Write tool**.

**Step 7 — Print the inline ledger.**

```
📒  /hub:debug ledger
Ran: hub:debugger
Skills: hub:systematic-debugging, hub:clean-code
Files changed: <N>
Approximate tokens: ~<N>k
Tier declared: MEDIUM (15k–40k) · observed: ~<N>k (<in-tier ✓ | drift ✗>) · duration: <Xm Ys>
Logged to .hub/usage.json (<run-id>)
```

---

## Key principles (inherited by the dispatched agent)

- **Ask before assuming** — get full error context before forming hypotheses
- **Test hypotheses** — don't guess randomly, eliminate systematically
- **Explain why** — root cause, not just the line that changed
- **Prevent recurrence** — add a test, assertion, or guard

The debugger agent's own instructions enforce these. This command file only handles dispatch + accounting.

---

## Examples

```
/hub:debug login not working
/hub:debug API returns 500 on POST /users
/hub:debug form doesn't submit
/hub:debug async DB query hangs under load
/hub:debug -y Alembic migration fails on NOT NULL   (bypass gate)
```
