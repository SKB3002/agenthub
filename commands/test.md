---
description: Generate tests, run existing tests, or show coverage. Stack-aware (pytest, Jest, Vitest, etc.).
argument-hint: [target|coverage|watch]
tier: MEDIUM
tier-rationale: Generation mode dispatches test-engineer and may write 1–5 files. Run-only modes (no args, coverage, watch) are LIGHT and skip the gate.
estimated-tokens: "15k–60k"
risk: Generating tests from scratch for a large module pulls many file reads and can drift toward HEAVY.
---

# /hub:test — Test Generation & Execution

$ARGUMENTS

---

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Classify the sub-command.**

| Pattern in stripped args | Mode | Effective tier |
|---|---|---|
| *empty*                   | RUN-ALL | LIGHT |
| `coverage`                | COVERAGE | LIGHT |
| `watch`                   | WATCH | LIGHT |
| a file path or feature    | GENERATE | MEDIUM |

**Step 3 — RUN-ALL / COVERAGE / WATCH path (LIGHT — no gate).**

Detect the stack, run the matching command (table below), stream output, append a LIGHT entry to `.hub/usage.json` with `agents: []`. Done.

| Stack | Run | Coverage | Watch |
|---|---|---|---|
| **Jest / Vitest** | `npm test` | `npm run coverage` or `vitest --coverage` | `vitest --watch` |
| **pytest** | `pytest` | `pytest --cov=app --cov-report=term-missing` | `pytest-watch` |
| **Playwright** | `npx playwright test` | `npx playwright test --reporter=html` | `npx playwright test --ui` |
| **go** | `go test ./...` | `go test -cover ./...` | n/a |
| **cargo** | `cargo test` | `cargo tarpaulin` | `cargo watch -x test` |

**Step 4 — GENERATE path (MEDIUM — gate required).**

Load `skills/approval-gate/SKILL.md`. Compute:
- Planned agent: `hub:test-engineer`
- Planned skills: `hub:testing-patterns`, `hub:tdd-workflow`, `hub:clean-code`
- Tier: MEDIUM

Render the gate (skip if `bypass`):

```
⚖️  /hub:test "<target>"
    → hub:test-engineer  (+ hub:testing-patterns, hub:tdd-workflow, hub:clean-code)
    Tier: MEDIUM · 15k–60k tokens · writes 1–5 test files
    Proceed? (y/n/tweak)
```

Replies per §3.4 of the approval-gate skill. On cancel: append cancelled-run to `.hub/usage.json`, print `🚫 Cancelled. No tests generated.` and stop.

**Step 5 — Dispatch (GENERATE only).**

```
Agent(
  subagent_type="hub:test-engineer",
  description="Generate tests: <target>",
  prompt=<<
    TARGET: <stripped args>

    CONTEXT:
    - Auto-detect the project's existing test framework and follow its conventions
      (fixture style, directory layout, naming).
    - Mock only external boundaries — never the code under test.

    TASK:
    1. Analyze the target: parse functions/classes, list edge cases (empty,
       None, large, concurrent), identify external deps.
    2. Produce a short Test Plan table (case / type / coverage).
    3. Write the tests to the conventional path for this stack.
    4. Report the filename(s) written and the command to run them.
  >>
)
```

**Step 6 — Write usage log (MANDATORY — use the Write tool, do not skip).**

Path: `.hub/usage.json` in the **user's current working directory** (their project), NOT inside `${CLAUDE_PLUGIN_ROOT}`.

1. Read `.hub/usage.json` if it exists → parse the JSON. If absent → start with `{"runs": []}`.
2. Append one entry to `runs`:
   - `id`: `"r_<YYYY-MM-DD>_<NNN>"` (today + zero-padded seq = existing length + 1)
   - `started_at` / `ended_at`: ISO-8601 UTC, `command`: `"/hub:test"`, `args`: stripped args
   - `tier_declared`: `"MEDIUM"`, `tier_observed`: recomputed from output size
   - `approved`: `true` (or `false` if cancelled), `chosen_alternative`: `null`
   - `agents`: `[{"name": "hub:test-engineer", "approx_tokens": <N>}]`
   - `skills`: skills consumed (e.g. `["hub:testing-patterns", "hub:tdd-workflow"]`)
   - `files_written`: integer, `approx_total_tokens`: integer, `user_verdict`: `null`, `notes`: `null`
3. Write the updated JSON back using the **Write tool**.

**Step 7 — Print the inline ledger (GENERATE mode).**

```
📒  /hub:test ledger
Ran: hub:test-engineer
Skills: hub:testing-patterns, hub:tdd-workflow, hub:clean-code
Test files written: <N>  →  <paths>
Approximate tokens: ~<N>k
Tier declared: MEDIUM (15k–60k) · observed: ~<N>k (<in-tier ✓ | drift ✗>) · duration: <Xm Ys>
Logged to .hub/usage.json (<run-id>)
Next suggested: /hub:test   (run the new suite, LIGHT)
```

For RUN-ALL / COVERAGE / WATCH modes, print a one-line ledger:

```
📒  /hub:test ledger  · mode: <run-all|coverage|watch>  · tier: LIGHT  · duration: <Xs>  · logged as <run-id>
```

---

## Key principles (inherited by the test-engineer agent)

- Test behavior, not implementation
- One logical assertion per test (when practical)
- Descriptive names: `test_rejects_invalid_email` beats `test_1`
- Arrange-Act-Assert pattern
- Mock external APIs / DBs in unit tests — real DB in integration tests

---

## FastAPI patterns (quick reference; full content lives in `hub:testing-patterns`)

```python
# Async integration
from httpx import AsyncClient
async def test_create_user(client: AsyncClient):
    r = await client.post("/api/v1/users", json={"email": "a@b.com"})
    assert r.status_code == 201

# Mocking LLM
from unittest.mock import AsyncMock
async def test_chat(monkeypatch):
    monkeypatch.setattr("app.services.llm.gemini_service.generate",
                        AsyncMock(return_value="hi"))
```

---

## Examples

```
/hub:test                                        # run all (LIGHT, no gate)
/hub:test coverage                               # coverage report (LIGHT, no gate)
/hub:test watch                                  # watch mode (LIGHT, no gate)
/hub:test app/services/auth_service.py           # generate (MEDIUM, gated)
/hub:test user registration flow                 # generate (MEDIUM, gated)
/hub:test -y integration/test_llm_retry.py       # generate, bypass gate
```
