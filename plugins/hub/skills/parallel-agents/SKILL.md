---
name: parallel-agents
description: Multi-agent orchestration patterns. Use when multiple independent tasks can run with different domain expertise or when comprehensive analysis requires multiple perspectives.
allowed-tools: Read, Glob, Grep
---

# Parallel & Sequential Agent Orchestration

> Orchestration through Claude Code's built-in `Agent` tool.

## Overview

This skill covers how to coordinate multiple specialized subagents within a single Claude Code session. All orchestration happens through the `Agent` tool and `SendMessage` — no external scripts needed.

## When to Use Orchestration

✅ **Good for:**
- Complex tasks requiring multiple expertise domains
- Code analysis from security, performance, and quality perspectives
- Comprehensive reviews (architecture + security + testing)
- Feature implementation needing backend + frontend + database work

❌ **Not for:**
- Simple, single-domain tasks
- Quick fixes or small changes
- Tasks where one agent suffices

---

## Invocation Patterns

### Single Agent
```
Use the security-auditor agent to review authentication
```

### Parallel Fan-out (independent work)
When multiple domains can be investigated at once, dispatch them in a single assistant turn with multiple `Agent` tool calls — Claude Code will run them concurrently.

```
In one message, spawn:
├── security-auditor → review auth config
├── performance-optimizer → profile slow endpoints
└── test-engineer → find coverage gaps
```

### Sequential Chain (dependent work)
When later steps need earlier findings, run agents one after another.

```
1. explorer-agent: map project structure
2. backend-specialist: review API endpoints using that map
3. test-engineer: identify test gaps for those endpoints
```

### Resume a Previous Agent (same session)
Use `SendMessage` with the agent's ID or name — this preserves the agent's full context rather than restarting.

```
SendMessage → backend-specialist: "Now add rate-limiting to the routes you just reviewed"
```

A new `Agent` call with the same `subagent_type` starts a fresh instance with no memory of the prior run.

---

## Orchestration Patterns

### Pattern 1: Comprehensive Analysis
```
explorer-agent → [parallel domain agents] → orchestrator synthesis

1. explorer-agent: map codebase (sequential, everyone needs this)
2. Fan out in parallel:
   ├── security-auditor → security posture
   ├── backend-specialist → API quality
   ├── frontend-specialist → UI/UX patterns
   └── test-engineer → coverage gaps
3. orchestrator: synthesize all findings
```

### Pattern 2: Feature Review
```
affected-domain-agents (parallel) → test-engineer

1. Identify affected domains (backend? frontend? DB? mobile?)
2. Invoke relevant domain agents in parallel
3. test-engineer verifies behavior across changes
4. Synthesize recommendations
```

### Pattern 3: Security Audit
```
security-auditor → penetration-tester → synthesis

1. security-auditor: configuration and code review (READ-ONLY)
2. penetration-tester: active vulnerability testing (READ-ONLY, authorized only)
3. Synthesize with prioritized remediation
```

### Pattern 4: Greenfield Feature
```
project-planner → parallel build → qa-automation-engineer

1. project-planner: break feature into tasks
2. Fan out: backend-specialist, frontend-specialist, database-architect
3. qa-automation-engineer: write E2E tests
```

---

## Available Kit Agents (20)

| Agent | Expertise | Trigger Phrases |
|-------|-----------|-----------------|
| `orchestrator` | Coordination + synthesis | "comprehensive", "multi-perspective" |
| `project-planner` | Planning, roadmaps | "plan", "roadmap", "milestones" |
| `product-manager` | Product strategy | "requirements", "user story" |
| `product-owner` | Backlog, prioritization | "backlog", "sprint", "priorities" |
| `security-auditor` | Security review (read-only) | "security", "auth", "vulnerabilities" |
| `penetration-tester` | Security testing (read-only) | "pentest", "red team", "exploit" |
| `backend-specialist` | Backend/API | "API", "server", "FastAPI", "Express" |
| `frontend-specialist` | Frontend | "React", "Vue", "UI", "Next.js" |
| `mobile-developer` | Mobile | "React Native", "Flutter", "iOS", "Android" |
| `database-architect` | DB design | "schema", "SQL", "migrations", "indexes" |
| `test-engineer` | Unit/integration tests | "tests", "coverage", "TDD" |
| `qa-automation-engineer` | E2E / CI pipelines | "Playwright", "Cypress", "pipeline" |
| `devops-engineer` | Infra, deploys | "deploy", "CI/CD", "Docker" |
| `performance-optimizer` | Profiling, perf tuning | "slow", "optimize", "profiling" |
| `debugger` | Bug diagnosis | "bug", "error", "not working" |
| `code-archaeologist` | Legacy / refactor | "legacy", "refactor", "understand this" |
| `explorer-agent` | Deep discovery | "explore", "map", "audit" |
| `documentation-writer` | Docs, READMEs | "write docs", "document" |
| `seo-specialist` | SEO + GEO | "SEO", "meta tags", "llms.txt" |
| `game-developer` | Game dev | "Unity", "Godot", "Phaser" |

---

## Claude Code Built-in Agents

These ship with Claude Code and work alongside kit agents:

| Agent | Purpose | When to prefer over kit agents |
|-------|---------|--------------------------------|
| **Explore** | Fast read-only codebase search | Quick "where is X defined?" lookups — save `explorer-agent` for deep audits |
| **Plan** | Research during plan mode | Architectural planning when the task is primarily thinking, not coding |
| **general-purpose** | Complex multi-step work | Tasks that don't match a specialist persona |
| **statusline-setup** | Configure status line | User asks about status line config |
| **claude-code-guide** | Claude Code / Agent SDK / API questions | User asks "how does Claude Code do X?" |

> **Rule of thumb:** Try the built-in `Explore` first for navigation. Escalate to kit agents when the task needs persona-driven judgment.

---

## Synthesis Protocol

After all agents complete, synthesize into a single report:

```markdown
## Orchestration Synthesis

### Task Summary
[What was accomplished]

### Agent Contributions
| Agent | Finding |
|-------|---------|
| security-auditor | Found X |
| backend-specialist | Identified Y |

### Consolidated Recommendations
1. **Critical**: [Issue from Agent A]
2. **Important**: [Issue from Agent B]
3. **Nice-to-have**: [Enhancement from Agent C]

### Action Items
- [ ] Fix critical security issue
- [ ] Refactor API endpoint
- [ ] Add missing tests
```

---

## Best Practices

1. **Parallelize independent work** — one assistant turn, multiple `Agent` calls.
2. **Sequence dependent work** — wait for earlier findings before the next agent fires.
3. **Share context explicitly** — each agent starts fresh; pass the relevant findings in the prompt.
4. **One synthesis report** — collapse findings into a single unified output, not N scattered ones.
5. **Use `SendMessage` to resume** — avoids re-briefing an agent on work it already did.
6. **Prefer built-in `Explore` for lookups** — save kit-agent budget for real reasoning.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Run 5 agents sequentially when they're independent | Fan out in parallel |
| Start a new agent when one exists | `SendMessage` to resume it |
| Ask `security-auditor` to fix the code | Keep security agents read-only; hand off to `backend-specialist` |
| Forget to synthesize | End with a single consolidated report |
| Use `explorer-agent` for "where is foo()" | Use built-in `Explore` for quick lookups |
