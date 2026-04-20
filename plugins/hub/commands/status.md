---
name: status
description: Show project state — stack detected, git status, open TODOs, recent changes.
argument-hint: ""
tier: LIGHT
estimated-tokens: "<2k"
platform: codex
---

# @hub status — Project State

No agent dispatch. Read-only snapshot:

1. Detect stack (package.json / pyproject.toml / Cargo.toml / go.mod)
2. Git: current branch, last 3 commits, uncommitted changes count
3. Open TODOs: grep for `TODO`, `FIXME`, `HACK` — show top 5
4. Recent changes: files modified in last 24h

Print a compact summary. Suggest the most relevant next command.
