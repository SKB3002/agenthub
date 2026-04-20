---
description: Production deployment with pre-flight checks, deploy execution, and verification.
argument-hint: [check|preview|production|rollback]
tier: HEAVY
tier-rationale: Pre-flight + deploy + verify via devops-engineer; external side effects (pushes, build runs).
estimated-tokens: "40k–100k"
risk: Rollbacks or failing health checks trigger additional agent rounds; also HEAVY has real-world blast radius beyond tokens.
---

# /hub:deploy — Production Deployment

$ARGUMENTS

---

## ⚠ Real-world blast radius

This command writes to the outside world — builds, pushes, cloud APIs. The approval gate is the last safety net before changes leave the machine. **`--yes`/`-y` bypass is accepted but strongly discouraged for `production`.** Documented in the gate's risk line.

---

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Classify the sub-command.**

| `$ARGUMENTS` | Mode | Tier override |
|---|---|---|
| *empty* or `check`         | CHECK          | MEDIUM (no external side effects) |
| `preview` or `staging`     | DEPLOY-PREVIEW | HEAVY |
| `production` or `prod`     | DEPLOY-PROD    | HEAVY + safety caveat |
| `rollback`                 | ROLLBACK       | HEAVY + safety caveat |

**Step 3 — Load the approval-gate skill.**
Read `skills/approval-gate/SKILL.md`.

**Step 4 — Scout (main-context, cheap).**
Before gating: read `README.md`, `package.json` / `pyproject.toml`, look for `vercel.json`, `fly.toml`, `railway.toml`, `Dockerfile`, `docker-compose.yml`, `k8s/`, `.github/workflows/` — identify the deployment target. The gate must name the actual platform, not guess.

**Step 5 — Build the agent plan.**

| Mode | Agents |
|---|---|
| CHECK            | `hub:devops-engineer` (read-only pre-flight) |
| DEPLOY-PREVIEW   | `hub:devops-engineer` (pre-flight → build → deploy → verify) |
| DEPLOY-PROD      | `hub:security-auditor` (1 pass) → `hub:devops-engineer` |
| ROLLBACK         | `hub:devops-engineer` |

Add `hub:test-engineer` to CHECK/DEPLOY-PREVIEW/DEPLOY-PROD if the test suite hasn't run recently (main-context heuristic: check `git log --since=1.day` for test file touches — if the user's last N commits don't show test runs, we add it).

**Step 6 — Render the gate (skip if `bypass`).**

**For CHECK (MEDIUM one-liner):**

```
⚖️  /hub:deploy check   → hub:devops-engineer  (+ pre-flight checklist)
    Tier: MEDIUM · 8k–20k tokens · no external writes · platform: <detected>
    Proceed? (y/n/tweak)
```

**For DEPLOY-PREVIEW / DEPLOY-PROD / ROLLBACK (HEAVY full gate):**

```
⚖️  Kit dispatch preview — /hub:deploy <mode>

Task: <interpreted: "deploy preview to <platform>" | "deploy production to <platform>" | "rollback to <previous version>">

Planned agents (in order):
  <agents per Step 5, hub: prefixed, each with 3–6 word purpose>

Planned skills: hub:deployment-procedures, hub:server-management, hub:vulnerability-scanner (production only), hub:testing-patterns (if tests will run)

Tier: HEAVY  (40k–100k tokens, ~3–8 min wall-clock)
Why:  <rationale, tailored: "preview deploy to Vercel after full pre-flight">
Risk: <risk, tailored: "production deploy touches real users; rollback available via /hub:deploy rollback">

External actions this will perform:
  - git push origin <branch> (if staged commits exist)
  - <platform> build + deploy
  - post-deploy health check against <url>
  [production only: optional 'git tag v<version>' if requested]

MoSCoW for this task:
  MUST    — <pre-flight pass, build, deploy, health check>
  SHOULD  — <tag release, post-deploy smoke test>
  COULD   — <announce in #releases Slack, update CHANGELOG>
  WON'T   — <rollback previous version unless explicit /hub:deploy rollback>

Alternatives:
  (a) Proceed as-is                                           ~40k–100k
  (b) CHECK-only: run pre-flight, report, stop before deploy ~8k–20k   (≈MEDIUM)
  (c) Preview instead of production (if mode=production)     ~30k–70k   (≈HEAVY but zero prod risk)

[if budget file present: budget line + recommendation]

Reply:  go / a   — proceed
        b        — CHECK-only (no external actions)
        c        — preview instead of production  (production mode only)
        tweak    — edit target platform / branch / scope
        cancel
```

Reply parsing per §3.4 of the approval-gate skill.
On cancel: append cancelled-run entry to `.hub/usage.json`, print `🚫 Cancelled. Nothing deployed.` and stop.

**Step 7 — Pre-flight checklist (all modes except rollback).**

Before dispatching the devops-engineer, the command runs these main-context Bash calls so the checklist is honest:

```
Code Quality
  [ ] Lint:       npm run lint   | ruff check .
  [ ] Types:      npx tsc --noEmit  | mypy .
  [ ] Tests:      npm test  | pytest

Security
  [ ] No hardcoded secrets (grep for common patterns)
  [ ] .env.example present and current
  [ ] Dependency audit: npm audit | pip-audit
  [ ] Kit scanner: python ${CLAUDE_PLUGIN_ROOT}/skills/vulnerability-scanner/scripts/security_scan.py .

Artifacts
  [ ] README current
  [ ] CHANGELOG current
```

Any red item → report to the user, STOP. Do not proceed to deploy. User fixes and re-runs.

**Step 8 — Dispatch (DEPLOY / ROLLBACK modes, only if checklist green and gate approved).**

```
Agent(
  subagent_type="hub:devops-engineer",
  description="Deploy <mode> to <platform>",
  prompt=<<
    PLATFORM: <detected from Step 4>
    MODE: <preview | production | rollback>
    SCOPE: <chosen alternative — full or MUST-only>
    BRANCH: <current branch>
    PRE-FLIGHT: <PASS/FAIL summary from Step 7>

    TASK:
    1. Run the platform's deploy command (table at bottom of this file).
    2. Wait for build/deploy to finish. Stream logs to the user.
    3. Post-deploy: hit the public health endpoint and verify 200 + expected payload shape.
    4. Report success or failure with the exact commands and URLs used.
    5. On failure, recommend the rollback command — do not auto-rollback.
  >>
)
```

For DEPLOY-PROD, run `hub:security-auditor` first with a quick final-scan prompt; only proceed to `hub:devops-engineer` if it returns clean.

**Step 9 — Write usage log (MANDATORY — use the Write tool, do not skip).**

Path: `.hub/usage.json` in the **user's current working directory** (their project), NOT inside `${CLAUDE_PLUGIN_ROOT}`.

1. Read `.hub/usage.json` if it exists → parse the JSON. If absent → start with `{"runs": []}`.
2. Append one entry to `runs`:
   - `id`: `"r_<YYYY-MM-DD>_<NNN>"` (today + zero-padded seq = existing length + 1)
   - `started_at` / `ended_at`: ISO-8601 UTC, `command`: `"/hub:deploy"`, `args`: stripped args
   - `tier_declared`: `"HEAVY"` (or `"MEDIUM"` for check mode), `tier_observed`: recomputed
   - `approved`: `true` (or `false` if cancelled), `chosen_alternative`: `null`
   - `agents`: array of `{"name": "hub:<name>", "approx_tokens": <N>}` for each dispatched agent
   - `skills`: array of skills consumed, `files_written`: integer, `approx_total_tokens`: integer
   - `user_verdict`: `null`, `notes`: `"<platform> — <deployment URL or version>"` (or null if check-only)
3. Write the updated JSON back using the **Write tool**.

**Step 10 — Print the inline HEAVY ledger.**

```
📒  /hub:deploy <mode> ledger
Ran: <N> of <M> planned agents
Pre-flight: <PASS|FAIL>  ·  platform: <detected>
Skills: hub:deployment-procedures, <…>
Files changed: <N> (usually 0 for deploy; rollback may revert files)
External actions: <bullet list of what actually happened>
Approximate token share: <per-agent>
Tier declared: HEAVY (40k–100k) · observed: ~<N>k (<in-tier ✓ | drift ✗>) · duration: <Xm Ys>
Logged to .hub/usage.json (<run-id>)
Status: ✅ deployed v<version> to <url>   |   ❌ failed at <step>
Next suggested: /hub:preview check (verify local still works) | /hub:deploy rollback (HEAVY)
```

---

## Platform reference

| Platform | Deploy command |
|---|---|
| Vercel | `vercel --prod` (prod) / `vercel` (preview) |
| Railway | `railway up` |
| Fly.io | `fly deploy` |
| Render | `render deploy` |
| Heroku | `git push heroku main` |
| Docker | `docker compose up -d --build` |
| Kubernetes | `kubectl apply -f k8s/` |
| FastAPI + gunicorn | `gunicorn app.main:app -c gunicorn.conf.py` |

---

## Examples

```
/hub:deploy                              # interactive (asks mode in gate)
/hub:deploy check                        # MEDIUM one-liner, no external actions
/hub:deploy preview                      # HEAVY gate, deploys to staging
/hub:deploy production                   # HEAVY gate + security sweep + deploy
/hub:deploy rollback                     # HEAVY gate, reverts to previous version
/hub:deploy -y check                     # bypass gate, just run checklist
```
