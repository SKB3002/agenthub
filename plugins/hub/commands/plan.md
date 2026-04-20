---
name: plan
description: Create a project plan. No code — only plan file generation.
argument-hint: <what to plan>
tier: MEDIUM
estimated-tokens: "20k–50k"
platform: codex
---

# @hub plan — Project Planning Mode

$ARGUMENTS

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Render the MEDIUM gate (skip if `bypass`).**

```
⚖️  @hub plan "<args>"
    → hub:project-planner  (+ hub:plan-writing, hub:socratic-gate)
    Tier: MEDIUM · 20k–50k tokens · writes 1 file (docs/PLAN-<slug>.md)
    Proceed? (y/n/tweak)
```

**Step 3 — Dispatch.**

Derive slug: 2–3 key words, lowercase, hyphen-joined, ≤30 chars.

```
subagent(
  name="hub:project-planner",
  prompt="""
    CONTEXT:
    - User request: $ARGUMENTS
    - Mode: PLANNING ONLY — no code.
    - Output: docs/PLAN-<slug>.md

    Write docs/PLAN-<slug>.md with: goals, task breakdown, dependencies,
    agent assignments, and a verification checklist. Return the filename.
  """
)
```

**Step 4 — Write usage log.**
Append to `.hub/usage.json` in the user's project directory.

## Examples
```
@hub plan e-commerce site with cart
@hub plan FastAPI rate limiting with Redis
@hub plan -y mobile onboarding flow
```
