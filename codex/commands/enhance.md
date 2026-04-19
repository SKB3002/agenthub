---
name: enhance
description: Add or update features in an existing application. Iterative development mode.
argument-hint: <change to make>
tier: HEAVY
estimated-tokens: "50k–150k"
platform: codex
---

# /hub:enhance — Update Existing Application

$ARGUMENTS

## Flow

**Step 1 — Parse bypass flag.**

**Step 2 — Scout (cheap, no agents).**
Read README, package.json/pyproject.toml, grep for the feature area. Identify stack and affected files.

**Step 3 — Build agent plan** (minimum set for the change):
- UI only → `hub:frontend-specialist`
- API/logic → `hub:backend-specialist`
- Schema → `hub:database-architect` + backend
- Cross-cutting → `hub:project-planner` → backend + frontend

**Step 4 — Render HEAVY gate (skip if `bypass`).**

**Step 5 — Dispatch per chosen alternative.**

**Step 6 — Write usage log.**
Append to `.hub/usage.json` in the user's project directory.

## Examples
```
/hub:enhance add dark mode
/hub:enhance integrate Stripe payments
/hub:enhance -y add rate limiting to /api/generate
```
