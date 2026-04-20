---
name: budget
description: Opt-in budget declaration. Enriches the HEAVY gate with a budget line and smarter default alternative.
argument-hint: [low|medium|ok|clear|--here]
tier: LIGHT
estimated-tokens: "<2k"
platform: codex
---

# @hub budget — Budget Declaration

$ARGUMENTS

Writes to `~/.hub/budget.json` (home-level default) or `.hub/budget.json` (project-local with `--here`).

- `low` / `medium` / `ok` → sets budget level
- `clear` → removes the file
- no arg → shows current budget (or "not set")

If absent: the feature is completely invisible. No gate changes until you run this command.

No agent dispatch.
