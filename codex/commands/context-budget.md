---
name: context-budget
description: Session headroom signal (GREEN/YELLOW/RED) with drop-candidate detection. Does not write to usage.json.
argument-hint: [verbose]
tier: LIGHT
estimated-tokens: "<2k"
platform: codex
---

# /hub:context-budget — Session Introspection

$ARGUMENTS

Estimate current context load. Render headroom signal:
- GREEN (<30k tokens loaded)
- YELLOW (30k–80k)
- RED (>80k — consider starting a fresh session)

`verbose` mode: list per-agent token estimates + drop candidates (large files that could be unloaded).

Does NOT write to `.hub/usage.json` — this is informational only.
No agent dispatch.
