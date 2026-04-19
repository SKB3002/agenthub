---
name: debug
description: Systematic debugging. Activates DEBUG mode for methodical problem investigation.
argument-hint: <symptom or error>
tier: MEDIUM
estimated-tokens: "15k–40k"
platform: codex
---

# /hub:debug — Systematic Problem Investigation

$ARGUMENTS

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Render the MEDIUM gate (skip if `bypass`).**

```
⚖️  /hub:debug "<args>"
    → hub:debugger  (+ hub:systematic-debugging, hub:clean-code)
    Tier: MEDIUM · 15k–40k tokens · writes 0–2 files
    Proceed? (y/n/tweak)
```

**Step 3 — Dispatch.**

```
subagent(
  name="hub:debugger",
  prompt="<full $ARGUMENTS>\n\nFollow the systematic-debugging skill. Report root cause, fix, and prevention."
)
```

**Step 4 — Write usage log.**
Append to `.hub/usage.json` in the user's project directory (not the plugin directory).

## Examples
```
/hub:debug login not working
/hub:debug API returns 500 on POST /users
/hub:debug -y Alembic migration fails on NOT NULL
```
