---
description: Report current session's context usage and recommend strategic /compact points before the auto-compact wall. Read-only, no agent dispatch.
argument-hint: [verbose]
tier: LIGHT
tier-rationale: Pure introspection of the current session. No agents, no file writes, no network.
estimated-tokens: "<3k"
risk: None — read-only.
---

# /hub:context-budget — Session context report

$ARGUMENTS

> Complement to `/hub:ledger`. **Ledger** measures what you've *already spent* across runs (`.hub/usage.json`). **Context-budget** measures what's *currently loaded* in this session and suggests when to `/compact`. Different axes, both read-only.

---

## Honesty contract (MANDATORY)

- Claude Code does **not** expose the live context-window fill percentage to plugins. We estimate locally from what we can observe: files read, agents dispatched, skills loaded, and rough byte counts of tool results.
- Every number shown carries `~` (approximate).
- Never fabricate "X tokens remaining" or "Y% until auto-compact" — the auto-compact threshold and exact window size aren't knowable from inside the session.
- If you cannot estimate a component, say `unknown` — do not fill with a plausible-looking number.

---

## Flow

**Step 1 — Parse mode.**

| `$ARGUMENTS` | Mode |
|---|---|
| *empty*      | SUMMARY — compact one-screen report |
| `verbose`    | DETAIL — same report + per-file / per-skill breakdown |

**Step 2 — Gather signal (main-context, cheap).**

Scan the current session for:
- **Agents dispatched so far** — count `Agent(subagent_type=…)` calls and sum the response bodies you remember receiving
- **Skills loaded** — count distinct `Skill` tool invocations and their returned bodies
- **Files read** — count `Read` tool calls, with per-file byte length if known
- **Commands run** — count `/hub:*` invocations in this session (from the conversation, not `.hub/usage.json`)
- **Tool-call rounds** — total count of assistant turns with tool calls

Use the same estimation formula as [skills/approval-gate/tiers.md](../skills/approval-gate/tiers.md): `ceil(len(body) / 4) + 500` per agent response, rough overhead per tool round.

**Step 3 — Render SUMMARY.**

```
📐  /hub:context-budget (session snapshot)

Agents dispatched:   <N>   (~<tokens>k)
Skills loaded:       <N>   (~<tokens>k)
Files read:          <N>   (~<tokens>k)
Commands run:        <N>
Tool-call rounds:    <N>

Approximate session load: ~<N>k tokens
Headroom signal: <GREEN | YELLOW | RED>
  GREEN  — modest load, keep going
  YELLOW — consider /compact at the next logical breakpoint
  RED    — compact now; further HEAVY work risks the auto-compact wall

Recommendation:
<one to two sentences tailored to what's actually loaded>
  e.g. "You've loaded hub:frontend-specialist + 3 design skills for the
  current task. The next /hub:enhance will pull hub:backend-specialist
  too — consider /compact first to reset non-essential skill context."
```

Thresholds (chosen conservatively, not from a real quota number):
- `<30k` → GREEN
- `30k–80k` → YELLOW
- `>80k` → RED

These are heuristics on our own estimate, not claims about Anthropic's window. Document this in the output footer: `Thresholds are heuristics on our local estimate, not Anthropic billing.`

**Step 4 — Render DETAIL (verbose only).**

Add three extra sections under the summary:

```
Per-agent load:
  hub:frontend-specialist   ~<N>k    (dispatched <N>x)
  hub:backend-specialist    ~<N>k    (dispatched <N>x)
  ...

Per-skill load:
  hub:frontend-design       ~<N>k
  hub:web-design-guidelines ~<N>k
  ...

Drop candidates (skills no longer in scope):
  hub:<name> — last referenced <N> rounds ago
  hub:<name> — loaded but not cited since round <N>
```

The drop-candidates list is inference over the conversation: skills loaded ≥5 rounds ago and not referenced since are the cheapest things to shed via `/compact`.

**Step 5 — Footer.**

```
Related:
  /compact                  — Claude Code built-in; compacts the session
  /hub:ledger weekly        — what you've spent across runs (different view)
  /hub:budget [level]       — set optional budget level (enriches the HEAVY gate)
```

---

## What this does NOT do

- Does not auto-compact — user always approves `/compact` themselves
- Does not call the Anthropic count-tokens API (no network, no cost)
- Does not write to `.hub/usage.json` — this is a read-only introspection command, not a run to be logged
- Does not dispatch any agent — LIGHT tier, main-context only

---

## Usage

```
/hub:context-budget            # one-screen summary
/hub:context-budget verbose    # + per-agent/per-skill breakdown + drop candidates
```
