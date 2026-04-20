---
name: test
description: Generate tests, run existing tests, or show coverage. Stack-aware.
argument-hint: [generate <target>|run|coverage|watch]
tier: MEDIUM
estimated-tokens: "15k–60k"
platform: codex
---

# @hub test — Test Generation & Execution

$ARGUMENTS

## Flow

**Step 1 — Classify sub-command.**

| Args | Mode | Tier |
|---|---|---|
| *empty* / `run` | RUN-ALL | LIGHT |
| `coverage` | COVERAGE | LIGHT |
| `watch` | WATCH | LIGHT |
| file path or feature | GENERATE | MEDIUM |

**Step 2 — LIGHT modes (no gate).**
Detect stack, run the matching command (`pytest` / `npm test` / `playwright test`), stream output.

**Step 3 — GENERATE mode.**
Show MEDIUM gate, then dispatch `hub:test-engineer`.

**Step 4 — Write usage log (GENERATE only).**
Append to `.hub/usage.json` in the user's project directory.

## Examples
```
@hub test                           # run all tests
@hub test generate src/auth.py      # generate tests for a file
@hub test coverage
```
