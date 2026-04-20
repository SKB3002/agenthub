---
name: deploy
description: Production deployment with pre-flight checks, deploy execution, and verification.
argument-hint: [check|staging|production|rollback]
tier: HEAVY
estimated-tokens: "40k–100k"
platform: codex
---

# @hub deploy — Production Deployment

$ARGUMENTS

⚠ Real-world blast radius. The gate is the last safety net before changes leave the machine.

## Flow

**Step 1 — Classify sub-command** (check=MEDIUM, staging/production/rollback=HEAVY).

**Step 2 — Scout**: detect deployment target (vercel.json, fly.toml, Dockerfile, .github/workflows/).

**Step 3 — Render gate** per tier. For `production`: add explicit warning line.

**Step 4 — Dispatch `hub:devops-engineer`.**

**Step 5 — Write usage log.**
Append to `.hub/usage.json`. Include platform and deployment URL in `notes`.

## Examples
```
@hub deploy check
@hub deploy staging
@hub deploy production
@hub deploy rollback
```
