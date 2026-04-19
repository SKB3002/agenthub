---
name: orchestrate
description: Coordinate multiple agents for complex multi-domain tasks. Minimum 3 agents, 2-phase plan+implement pipeline.
argument-hint: <task or plan file>
tier: HEAVY
estimated-tokens: "80k–250k"
platform: codex
---

# /hub:orchestrate — Multi-Agent Orchestration

$ARGUMENTS

## Contract

- MINIMUM 3 different subagents
- 2-phase: Phase 1 (plan) → user approval → Phase 2 (implement)
- Every subagent prompt must include: original request, decisions made, previous agent outputs, plan state

## Flow

**Step 1 — Parse bypass flag.**

**Step 2 — Render HEAVY gate (skip if `bypass`).**

**Phase 1 — Planning (sequential).**
Dispatch `hub:project-planner` → writes `docs/PLAN-{slug}.md`.
Stop. Show plan path. Ask: `Approve? (Y/N)`.

**Phase 2 — Implementation (parallel where independent).**
Only after explicit approval. Dispatch ≥3 specialists with full context passed to each.

**Final — Write usage log.**
Append to `.hub/usage.json` in the user's project directory.

## Examples
```
/hub:orchestrate implement docs/PLAN-auth-refactor.md
/hub:orchestrate build rate limiting for the LLM gateway
/hub:orchestrate -y security audit + fix the top 3 findings
```
