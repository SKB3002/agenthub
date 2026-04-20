# Tier taxonomy + token-estimation methodology

This document defines the three tiers used by the approval gate, the token-estimation formula behind every `~N` number the kit reports, and the self-dogfood measurements that seeded the initial ranges.

Keep this file synchronized with the `tier` / `estimated-tokens` frontmatter in every `commands/<name>.md`. A mismatch between a command's declared range and this file's tier definition is a bug.

---

## 1. The three tiers

| Tier | Token range | Typical characteristics | Gate behaviour |
|---|---|---|---|
| **LIGHT** | **≤ 10k** | Read-only or process control. No agents dispatched. No file writes (or ≤ 1 trivial write). Cancelling would cost more than running it. | **No gate.** Runs directly. |
| **MEDIUM** | **10k – 60k** | 1 agent, 1–2 skills loaded, small number of file reads, 0–5 file writes. Typically a single "focused" task. | **One-line preview** + `y/n/tweak` prompt. |
| **HEAVY** | **60k – 300k** | 2+ agents (often 3–5), multiple skills, parallel fan-out is possible, 5+ file writes, often external side effects (deploys, scaffolds). | **Full gate** with agents list, skills list, MoSCoW, 2–3 alternatives, budget line. |

Ranges are **brackets, not predictions.** A HEAVY run that lands at 58k is "under-tier" (noteworthy — the command may warrant re-tiering) but not a bug. A HEAVY run that lands at 400k is out-of-tier and the command's `risk` note should explain how that happens.

### 1.1 Tier decision rule

Classify a command by the **largest reasonable invocation** it services, not the median.

- If a user could plausibly give input that triggers ≥3 agents → HEAVY.
- If the command's frontmatter declares parallel fan-out — HEAVY.
- If the command writes files and calls at least one agent → minimum MEDIUM.
- If it only reads state or manages a process → LIGHT.

When borderline, pick the heavier tier. Over-gating is a minor annoyance; under-gating surprises the user with cost.

---

## 2. Token-estimation formula

We do not have access to Anthropic's billing meter from inside a plugin command. What we do have:

1. The **response bodies** of every `Agent(subagent_type=...)` call we make
2. The **Bash / Read / Write / Edit tool calls** the orchestrating command issues
3. The user's `$ARGUMENTS` string
4. Wall-clock timing

Token estimation uses these sources only. No hidden models, no scraping, no guesses.

### 2.1 Per-agent approximation

For each `Agent(...)` response:

```
approx_tokens(agent) = ceil(len(response_body) / 4) + tool_overhead
```

where:
- `len(response_body)` is character count of what the agent returned (its Final Summary text)
- Division by 4 is the standard rough "chars per token" rule
- `tool_overhead = 500` — covers the schema + instruction framing Anthropic adds per Agent tool call

Input tokens to the agent (its prompt from us) are **not** counted separately here because they are derived from the same user context and would double-count. For billing purposes Anthropic charges both; our estimate is deliberately conservative about what we can measure cleanly.

### 2.2 Overhead from the orchestrating command

```
overhead = 2000
  + 100 * (number_of_file_reads)
  + 300 * (number_of_file_writes)
  + 500 * (number_of_bash_calls)
```

Based on observed average sizes of each tool call's round-trip during v0.2.1 self-dogfooding. A read of a 200-line file ≈ 1000 chars → ≈ 250 tokens, but the 100-per-read constant captures the tool schema + frame tokens that are always present even for tiny files.

### 2.3 Total

```
approx_total_tokens = sum(approx_tokens(agent)) + overhead
```

Rendered to the user with one significant figure below the thousand (e.g. `~145k`, not `~145,217`). Always prefixed `~`.

---

## 3. Self-dogfood baseline (v0.2.1 functional test)

Ranges in the current command frontmatter come from runs we captured during the v0.2.1 end-to-end test. Summary:

| Command | Min observed | Median | Max observed | Tier |
|---|---|---|---|---|
| `/hub:status`         | ~3k   | ~5k   | ~9k    | LIGHT |
| `/hub:preview check`  | ~2k   | ~4k   | ~7k    | LIGHT |
| `/hub:debug`          | ~14k  | ~22k  | ~41k   | MEDIUM |
| `/hub:test`           | ~12k  | ~28k  | ~58k   | MEDIUM |
| `/hub:plan`           | ~18k  | ~31k  | ~48k   | MEDIUM |
| `/hub:brainstorm`     | ~9k   | ~19k  | ~29k   | MEDIUM |
| `/hub:enhance`        | ~42k  | ~90k  | ~160k  | HEAVY |
| `/hub:create`         | ~78k  | ~140k | ~205k  | HEAVY |
| `/hub:deploy`         | ~38k  | ~65k  | ~105k  | HEAVY |
| `/hub:ui-ux-pro-max`  | ~55k  | ~110k | ~180k  | HEAVY |
| `/hub:orchestrate`    | ~85k  | ~160k | ~260k  | HEAVY |

These are working estimates, not authoritative commitments. After v0.3.0 ships, `/hub:ledger by-tier` in real user projects will refine these ranges. A contributor PR that updates this table with their own measurements (and a note on methodology) is welcome.

---

## 4. Worked example

Imagine `/hub:create "todo app with auth"` runs with:

| Step | Chars in response | Tokens (÷4) |
|---|---|---|
| `hub:project-planner` agent | 72,000 | 18,000 |
| `hub:frontend-specialist` | 136,000 | 34,000 |
| `hub:backend-specialist` | 104,000 | 26,000 |
| `hub:devops-engineer` (skipped by user) | 0 | 0 |
| Tool overhead (18 reads, 23 writes, 4 bash) | | 11,700 |
| **Total** | | **~89,700** |

Plus the constant `2,000` baseline → **~91,700** → rendered `~92k`.

Declared tier HEAVY, range 80k–200k → **observed: ~92k (in-tier ✓)** in the ledger. Good: the command matched its own declaration.

---

## 5. How the tier gets promoted/demoted

A command's tier is not fixed forever. If `/hub:ledger by-tier` shows a command's observed tokens consistently land in a different tier than declared, the command's frontmatter should be updated. Rough rule:

- **≥ 30% of runs over upper bound** → bump tier up (MEDIUM → HEAVY)
- **100% of runs under lower bound by ≥ 40%** → bump tier down (HEAVY → MEDIUM)

Updating frontmatter is a one-line PR. Leave a note in the commit message linking to the measurement data (e.g. exported ledger JSON).

---

## 6. Why we don't show dollar values

Anthropic's per-model pricing changes. The user's plan determines what a token costs. Showing `$0.82` would:

1. Be wrong the moment pricing updates
2. Mislead Pro / Max users who have no per-request cost at all (just weekly quotas)
3. Cross from "honest signal" into "fabricated authority"

Tokens are raw signal. Users who want dollars can multiply themselves. We will never ship a `--dollars` flag or a `priced_tokens` field in `usage.json`.
