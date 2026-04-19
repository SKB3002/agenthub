---
name: help
description: List kit commands, agents, and skills. Accepts optional subject: "commands", "agents", "skills", or a specific name.
argument-hint: [commands|agents|skills|<name>]
tier: LIGHT
estimated-tokens: "<5k"
platform: codex
---

# /hub:help — Capability Index

$ARGUMENTS

## Flow

Read `CATALOG.md` from the plugin root (one Read call — no bash, no glob).

Render per argument:
- *empty* → OVERVIEW: workflow + tier-bucketed commands + agent roster
- `commands` → full command table from CATALOG.md
- `agents` → all 20 agents grouped by domain from CATALOG.md
- `skills` → all 42 skills grouped by cluster from CATALOG.md
- `<name>` → LOOKUP: read `codex/commands/<name>.md`, `codex/agents/<name>.toml`, or `skills/<name>/SKILL.md`

No agent dispatch. No writes. One Read call for overview; two for lookup.

## Examples
```
/hub:help
/hub:help commands
/hub:help agents
/hub:help debugger
/hub:help approval-gate
```
