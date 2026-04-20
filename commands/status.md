---
description: Display current project state — tech stack, completed features, pending work, preview status.
argument-hint: ""
tier: LIGHT
tier-rationale: Read-only snapshot; globs project files, no agents dispatched, no writes.
estimated-tokens: "3k–10k"
risk: Very large repos with many config files can push file reads higher, but rarely drifts out of LIGHT.
---

# /status — Project Status

$ARGUMENTS

---

## Task

Show a compact snapshot of the current project.

### What to Show

1. **Project info**
   - Name (from package.json / pyproject.toml / directory name)
   - Path (cwd)
   - Detected stack (framework, DB, auth, payment)
   - Current git branch + dirty/clean state

2. **Features**
   - Inferred from folder structure (routes, models, services)
   - Recently-added (last 5 commits)
   - Mentioned in any `docs/PLAN-*.md`

3. **File statistics**
   - Files changed since last release tag (or last 10 commits)
   - Total LOC per primary language

4. **Preview status**
   - Is a dev server running on conventional ports (3000, 5173, 8000, 8080)?
   - Health check result

---

## Example Output

```
=== Project Status ===

📁 Project: apguru-analytics-dashboard
📂 Path: c:/Suyash_Projects/apguru-analytics-dashboard
🌿 Branch: suyash/llm-observability (dirty: 7 modified, 2 untracked)
🏷 Stack: FastAPI + SQLAlchemy 2.0 + MySQL + Gemini

✅ Features (inferred):
   • /api/v1/chat (ai tutoring)
   • /api/v1/errors (error analysis)
   • /api/v1/recommendations
   • /api/v1/observability

📝 Pending work (from docs/PLAN-*.md):
   • Langfuse migration (in progress)
   • Rate limiting (not started)

📄 Since last commit (HEAD~10): 43 files changed, +1,284 / -312

=== Preview ===
🌐 http://localhost:8080 — UP (200 on /docs)
```

---

## Implementation Notes

Gather data via:

| Source | Command |
|--------|---------|
| Git state | `git status --short`, `git branch --show-current`, `git log --oneline -10` |
| Stack detection | check for `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod` |
| Port scan | `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/` |
| Plans | `ls docs/PLAN-*.md` |

Keep output under 30 lines. Prefer a terse dashboard over a verbose dump.
