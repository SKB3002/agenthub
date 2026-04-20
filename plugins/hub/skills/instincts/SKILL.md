---
name: instincts
description: Project-scoped learned preferences captured via /hub:instincts promote. Load this skill when an agent needs to consult project-specific conventions that aren't obvious from the code. Never auto-captures — user explicitly approves every entry.
allowed-tools: Read, Glob, Write, Edit, Bash
---

# Instincts — learned project preferences

> **Contract:** instincts are user-authored. No silent capture, no background agent, no LLM fee on idle. An instinct exists only because the user ran `/hub:instincts promote` and approved it. The kit's job is to store them faithfully and make them discoverable — nothing else.

See [schema.md](schema.md) for the YAML reference.

---

## 1. Why this skill exists

Some project conventions aren't visible from the code:
- *"This team has tried three auth libraries and the third one was a disaster — don't reach for it."*
- *"Integration tests must hit a real DB after a mock-based migration bug cost us a quarter."*
- *"Prefer `httpx` over `requests` — we standardized."*

These are learned preferences, not doctrine. They shift over time. Codifying them in CLAUDE.md is too heavy; in comments is too scattered. `.hub/instincts.yaml` is the in-between layer: searchable, git-trackable, per-project, and cheap to edit.

---

## 2. When to load this skill

Load from an agent's `skills:` frontmatter **only** when:

- The agent handles a domain where project-specific preferences are likely (backend, frontend, devops, database) — i.e., *not* purely algorithmic work
- The agent is about to make a judgement call where a user preference could steer the outcome

Do **not** load this skill on every agent dispatch. Loading it means reading the file, which costs context. The calling agent should read `.hub/instincts.yaml` lazily, only when its scouting step flags a relevant domain.

---

## 3. Storage model

| Scope   | Path                                      | Git-tracked | Purpose |
|---|---|---|---|
| session | transient — in the conversation           | N/A         | Observations waiting for promotion |
| project | `<project-root>/.hub/instincts.yaml`      | **Yes**     | Team-visible preferences for this repo |
| global  | `~/.claude/kit/instincts.yaml`            | No          | Cross-project preferences — user's private machine |

**Why project instincts are git-tracked by default:** team visibility is the feature. A new engineer clones the repo and `/hub:instincts show` reveals the preferences the team has already encoded. If a user wants privacy, they add `.hub/` to `.gitignore` explicitly.

**Why global instincts are NOT git-tracked:** they're user-machine scope by design. Never synced, never pushed. A promotion to global requires evidence from ≥2 projects to prevent one repo's preferences from bleeding into all future work.

---

## 4. How agents should use instincts

When an agent loads this skill:

1. **Resolve paths.** Check both `<project-root>/.hub/instincts.yaml` and `~/.claude/kit/instincts.yaml`. Read both if present. Project takes precedence on conflict.
2. **Filter by domain.** Each instinct has a `domain` field (e.g. `python-backend`). Only surface entries whose domain matches the current task.
3. **Judge relevance.** Read the `trigger` field. If the current task genuinely matches, consider the `action`. If not, ignore the instinct — do not force-fit.
4. **Never enforce blindly.** Instincts are suggestions, not rules. If the current situation has reasons to deviate, deviate — and surface that decision to the user.
5. **Report.** When an instinct influenced a decision, note it to the user: `"Following project instinct 'prefer-httpx' — using httpx for this client."` Transparent use builds trust; hidden use breaks it.

---

## 5. Confidence and promotion

Confidence is a number 0.0–1.0 assigned by `/hub:instincts promote` based on session evidence:

| Observations in session | Confidence starting value |
|---|---|
| 1              | 0.4 (weak — user may have just tried it once) |
| 2              | 0.6 |
| 3              | 0.75 |
| 4+             | 0.85 |
| Explicit "always do X" from user | 0.95 |

Promotion rules:
- Any confidence ≥ 0.4 can be promoted to `project` if the user approves
- Promotion to `global` requires the same trigger+action to already exist in ≥1 project file at confidence ≥ 0.8 — blocks the "one repo's quirks leak everywhere" failure mode

Confidence is not magic — it's a heuristic. The user's approval during `promote` is the real gate.

---

## 6. Lifetime and decay

Instincts do **not** auto-expire. The file is small, plain text, and the user can `clear` an entry in one command. Automatic decay ("if an instinct hasn't been cited in 90 days, drop it") is rejected — silent behaviour is exactly what this kit avoids.

The `last_seen` field exists for the user to eyeball staleness during `/hub:instincts show`, not for automated pruning.

---

## 7. Anti-patterns (never do)

- ❌ Auto-capture without `/hub:instincts promote` approval
- ❌ Dispatch a background Haiku agent to watch tool calls
- ❌ Write to `.hub/instincts.yaml` from anywhere except `/hub:instincts promote`
- ❌ Blindly apply an instinct that doesn't fit the current situation
- ❌ Hide instinct influence from the user — always surface when one steered a decision
- ❌ Auto-promote from project to global — cross-project evidence is a hard requirement
- ❌ Expire instincts automatically — user decides when to `clear`

---

## 8. File format

See [schema.md](schema.md) for the authoritative YAML schema + worked examples.

---

## 9. Related

| Need | Go to |
|---|---|
| Inspect or write instincts | [`/hub:instincts`](../../commands/instincts.md) |
| YAML reference | [schema.md](schema.md) |
| "Should I codify this as a skill instead?" | [`skills/plan-writing/SKILL.md`](../plan-writing/SKILL.md) — durable cross-project patterns belong in skills, not instincts |
