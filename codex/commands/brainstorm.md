---
name: brainstorm
description: Structured brainstorming. Explores multiple options before implementation.
argument-hint: <topic to brainstorm>
tier: MEDIUM
estimated-tokens: "10k–30k"
platform: codex
---

# /hub:brainstorm — Structured Idea Exploration

$ARGUMENTS

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Render the MEDIUM gate (skip if `bypass`).**

```
⚖️  /hub:brainstorm "<args>"
    → hub:product-manager  (+ hub:socratic-gate)
    Tier: MEDIUM · 10k–30k tokens · writes 0 files
    Proceed? (y/n/tweak)
```

**Step 3 — Dispatch.**

```
subagent(
  name="hub:product-manager",
  prompt="""
    TOPIC: <stripped args>

    1. Apply the Socratic Gate: ask 3 clarifying questions, wait for reply.
    2. Produce ≥3 distinct approaches with pros, cons, effort (Low/Medium/High).
    3. Recommend one with reasoning. End with: "What direction would you like to explore?"

    No code. Ideas only.
  """
)
```

**Step 4 — Write usage log.**
Append to `.hub/usage.json` in the user's project directory.

## Examples
```
/hub:brainstorm authentication strategy
/hub:brainstorm caching for LLM gateway
/hub:brainstorm -y state management approach
```
