---
name: instincts
description: Project-scoped learned preferences stored in .hub/instincts.yaml.
argument-hint: [status|show|promote|clear]
tier: LIGHT
estimated-tokens: "<2k"
platform: codex
---

# /hub:instincts — Project Preferences

$ARGUMENTS

Manages `.hub/instincts.yaml` (git-tracked by default for team visibility).

- `status` (default) → show active instincts count + confidence distribution
- `show [session|project|global]` → list instincts by scope
- `promote` → surface session observations, ask user approval, write to instincts.yaml
- `clear [session|project|global]` → remove instincts at a scope

No background capture. No auto-decay. User-approved promotion only.
No agent dispatch.
