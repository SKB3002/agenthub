---
name: create
description: Create a new application. Coordinates project-planner, database-architect, backend-specialist, and frontend-specialist.
argument-hint: <what to build>
tier: HEAVY
estimated-tokens: "80k–200k"
platform: codex
---

# @hub create — New Application

$ARGUMENTS

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Mini Socratic gate (skip if `bypass`).**
Ask only what you can't infer: stack, auth needed, hosting target, DB flavour.

**Step 3 — Render HEAVY gate (skip if `bypass`).**

```
⚖️  Kit dispatch preview — @hub create

Task: "<args>"
Planned agents: hub:project-planner → hub:database-architect → hub:backend-specialist → hub:frontend-specialist → hub:devops-engineer
Tier: HEAVY · 80k–200k tokens · ~6–14 min

MoSCoW:
  MUST    — working scaffold, DB schema, one end-to-end feature, README
  SHOULD  — tests, CI, seed records, .env.example
  COULD   — Dockerfile, example docs
  WON'T   — actual deployment (run @hub deploy separately)

Alternatives:
  (a) Full build                                  ~80k–200k
  (b) MUST-only scaffold                          ~40k–90k
  (c) Plan-only (hub:project-planner only)        ~15k–40k

Reply: go/a · b · c · tweak · cancel
```

**Step 4 — Dispatch per chosen alternative.**
Dispatch agents sequentially (planner first, then parallel where independent).

**Step 5 — Write usage log.**
Append to `.hub/usage.json` in the user's project directory.

## Examples
```
@hub create todo app with auth
@hub create FastAPI service with Langfuse observability
@hub create -y simple static portfolio
```
