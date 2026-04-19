---
description: Inspect, promote, or clear learned instincts for this project. Captures patterns across sessions — opt-in, synchronous, no background capture.
argument-hint: [show|promote|clear|status]
tier: LIGHT
tier-rationale: Reads/writes a single YAML file. No agent dispatch, no background process, no LLM inference outside the user's explicit invocation.
estimated-tokens: "3k–8k"
risk: Promoting a weak instinct that nudges future sessions incorrectly. Mitigated by user approving each promotion individually, and by `/hub:instincts clear` being one command away.
---

# /hub:instincts — Project-scoped learning

$ARGUMENTS

> The kit never captures patterns silently. This command is the **only** way instincts get recorded. No background agent watches your tool calls, no Haiku inference burns on idle, no LLM fee on every edit. Zero overhead when not invoked.

See [skills/instincts/SKILL.md](../skills/instincts/SKILL.md) for the mental model and [skills/instincts/schema.md](../skills/instincts/schema.md) for the YAML schema reference.

---

## Flow

**Step 1 — Load the instincts skill.**
Read `skills/instincts/SKILL.md` — it encodes the scope model (session / project / global), the confidence scoring, and the promotion guardrails.

**Step 2 — Parse the sub-command.**

| `$ARGUMENTS` | Mode |
|---|---|
| *empty* or `status`  | STATUS — counts across scopes, top 5 by confidence |
| `show [scope]`       | SHOW — list entries (scope: `session` / `project` / `global`; default `project`) |
| `promote`            | PROMOTE — synchronous review of session observations; user approves each one |
| `clear [id]`         | CLEAR — remove one entry by id, or all (with confirmation) if id omitted |

**Step 3 — Locate storage.**

| Scope | Path | Git-tracked? |
|---|---|---|
| session | transient — in the conversation, never written | N/A |
| project | `<project-root>/.hub/instincts.yaml` | **Yes, by default** — team visibility is the feature |
| global  | `~/.claude/kit/instincts.yaml` | No — user-home only |

Session scope lives in the current Claude conversation. "Observations" in session scope are whatever Claude has noticed this session — preferences, repeated corrections, recurring trade-offs. They only become durable via `promote`.

**Step 4 — Render per mode.**

### STATUS (default)

```
🧭  /hub:instincts status

Scope     Count   Avg confidence
session   <N>     <0.XX>
project   <N>     <0.XX>   (<path>)
global    <N>     <0.XX>   (<path>)

Top 5 by confidence:
  1. <id>    (<scope>, conf <0.XX>)   — <one-line action>
  2. ...

Run /hub:instincts show project  — full list
Run /hub:instincts promote       — review session observations
```

If a scope file doesn't exist, show `0` for its count and `—` path. Do not auto-create.

### SHOW [scope]

Read the scope's YAML (or list session observations inline) and render:

```
🧭  /hub:instincts show <scope>  — <path or "session">

- id: <slug>
  trigger: <when this applies>
  action:  <what to do>
  domain:  <python-backend | frontend-react | …>
  confidence: <0.XX>
  evidence:
    - <short note>
    - <short note>
  scope: <scope>
  created: <YYYY-MM-DD>
  last_seen: <YYYY-MM-DD>

- id: ...
```

No pagination — the file is small (<50 entries in practice). If it's genuinely large, suggest `clear` for low-confidence items.

### PROMOTE

Synchronous, one-at-a-time, user-approved. The command:

1. Scans this session for **candidates** — patterns Claude has observed (e.g. "user replaced `requests` with `httpx` in 3 edits", "user rejected a mock-based test and asked for real-db integration"). Candidates come from observable session history, not fabricated.
2. For each candidate, renders:

   ```
   Candidate <N>/<M>:
     trigger:  writing Python HTTP client code
     action:   use httpx, not requests
     domain:   python-backend
     confidence: 0.75  (3 observations this session)
     evidence:
       - replaced requests with httpx in commits a1b2, c3d4, e5f6
       - pyproject.toml declares httpx as direct dep

     Promote to [p]roject | [g]lobal | [s]kip | [q]uit?
   ```

3. On `p` → append to `<project-root>/.hub/instincts.yaml` with `scope: project`.
4. On `g` → append to `~/.claude/kit/instincts.yaml` with `scope: global`, but **only** if the same trigger+action already exists in ≥1 project file with confidence ≥ 0.8. Otherwise refuse and explain: "Global promotion requires cross-project evidence. Save to project first, then re-run after it appears in another project."
5. On `s` → skip this candidate.
6. On `q` → stop reviewing. Print summary: `<N> promoted, <M> skipped`.

Writes are atomic (temp file + rename). If the target file is corrupt, bail with a clear error pointing at the path — never overwrite.

### CLEAR

- `/hub:instincts clear <id>` → remove that entry from the project file (and global if it lives there). Print `🧹 Removed <id>.`
- `/hub:instincts clear` → resolve scope (default project), print count and confirm `Wipe all instincts from <path>? (y/N)`. On `y`, delete the file. On anything else, `Cancelled.`

**Step 5 — Read-back on future sessions.**

Instincts are **not auto-loaded** by every future session — that would defeat the zero-overhead design. They surface in two ways:

1. Explicit: the user runs `/hub:instincts show` to review what's recorded.
2. Implicit: an agent handling a relevant domain (e.g. `hub:backend-specialist` on Python work) can check `.hub/instincts.yaml` as part of its own scouting. The agent decides whether the instinct applies — no blind rule enforcement.

This is documented in the instincts skill so agents know to consult the file when relevant, without the file becoming a context-window tax on every session.

---

## Non-goals

- ❌ Automated pattern extraction from git log (noisy, low-precision)
- ❌ Background Haiku agent watching tool calls (burns tokens silently)
- ❌ LLM inference on every tool use (zero-overhead principle)
- ❌ Blind enforcement — agents judge whether an instinct fits the current situation
- ❌ Auto-promotion to global — cross-project evidence required

---

## Usage

```
/hub:instincts                            # status — counts + top 5
/hub:instincts show                       # list project instincts
/hub:instincts show session               # list this-session observations
/hub:instincts show global                # list cross-project instincts
/hub:instincts promote                    # review session candidates one-by-one
/hub:instincts clear prefer-httpx         # remove one by id
/hub:instincts clear                      # wipe project file (confirm)
```
