---
name: ledger
description: Read-only views over .hub/usage.json — weekly totals, per-agent/skill/tier breakdowns, ROI, and verdict tagging.
argument-hint: [weekly|by-agent|by-skill|by-tier|roi|verdict <id> <tag>|clear]
tier: LIGHT
estimated-tokens: "<3k"
platform: codex
---

# /hub:ledger — Usage Log Views

$ARGUMENTS

Read `.hub/usage.json` in the user's project directory. Every number shown is approximate (~).

Sub-commands: *empty* (last 5 runs) · `weekly` · `by-agent` · `by-skill` · `by-tier` · `roi` · `verdict <id> useful|wasted|partial` · `clear` (requires confirmation).

If no log exists: print guidance to run a MEDIUM or HEAVY command first.

No agent dispatch. No writes (except `verdict` tagging and `clear`).
