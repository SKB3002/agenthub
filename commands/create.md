---
description: Create a new application. Triggers the app-builder skill and coordinates project-planner, database-architect, backend-specialist, and frontend-specialist.
argument-hint: <what to build>
tier: HEAVY
tier-rationale: Dispatches 4–5 agents (planner + db + backend + frontend + optional devops), scaffolds 15–40 files.
estimated-tokens: "80k–200k"
risk: Balloons if auth provider / hosting / db flavour isn't specified — expect clarifying round-trips.
---

# /hub:create — New Application

$ARGUMENTS

---

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Load the approval-gate skill.**
Read `skills/approval-gate/SKILL.md`.

**Step 3 — Socratic mini-gate for missing essentials (cheap, in main context).**

`/hub:create` is the most scope-sensitive command in the kit. Before the big gate, confirm the essentials in 2–4 short questions, main-context (no agents). Ask only the ones you can't infer from `$ARGUMENTS`:

- **Stack preference?** (e.g. Next.js + FastAPI + Postgres, or SvelteKit + SQLite, or user-specified) — propose a sensible default for the request.
- **Auth needed?** (none / email+password / OAuth provider) — default: none if not mentioned.
- **Hosting target?** (Vercel / Fly / Railway / local-only) — default: local-only.
- **Database flavour?** (Postgres / SQLite / none) — default: SQLite.

If the user's request already specifies these, skip the question. Never ask more than 4.

Skip this step entirely if `bypass = true`.

**Step 4 — Build the agent plan** based on Step 3 answers.

Canonical order (parallel where independent):

1. `hub:project-planner` — task breakdown, file plan, docs/PLAN-<slug>.md
2. `hub:database-architect` — schema + migrations (skip if no DB)
3. `hub:backend-specialist` — API routes + services
4. `hub:frontend-specialist` — UI pages + components
5. `hub:devops-engineer` — deploy config (skip if local-only)

Skills likely loaded:
`hub:app-builder`, `hub:socratic-gate`, `hub:plan-writing`, `hub:clean-code`,
`hub:nextjs-react-expert` (if Next.js), `hub:fastapi-expert` (if FastAPI),
`hub:database-design`, `hub:sqlalchemy-expert` (if SQLAlchemy),
`hub:tailwind-patterns` (if Tailwind), `hub:api-patterns`.

**Step 5 — Render the HEAVY gate (skip if `bypass`).**

```
⚖️  Kit dispatch preview — /hub:create

Task: "<stripped args>"
Resolved: <stack> + <auth> + <hosting> + <db>  (from Step 3 or inference)

Planned agents (in order):
  hub:project-planner       — task breakdown + PLAN file
  hub:database-architect    — schema + migrations         [skip if no DB]
  hub:backend-specialist    — API + services
  hub:frontend-specialist   — UI + pages
  hub:devops-engineer       — deploy config               [skip if local-only]

Planned skills: <from Step 4>

Tier: HEAVY  (80k–200k tokens, ~6–14 min wall-clock)
Why:  4–5 specialists scaffolding 15–40 files across full stack.
Risk: Ballooning if the request is fuzzy; re-clarifying mid-scaffold is expensive.

MoSCoW for this task:
  MUST    — working scaffold, DB schema, one end-to-end feature, README
  SHOULD  — tests, CI, one seed record, .env.example
  COULD   — Dockerfile, CI config, example docs
  WON'T   — actual deployment (run /hub:deploy separately), analytics, i18n

Alternatives:
  (a) Proceed as-is                                           ~80k–200k
  (b) MUST-only: drop SHOULD/COULD → scaffold + 1 feature     ~40k–90k  (≈MEDIUM)
  (c) Plan-only: run hub:project-planner, review plan first   ~15k–40k  (≈MEDIUM)
      → review docs/PLAN-create-<slug>.md, then run /hub:create -y
        or /hub:enhance to implement in slices.

[if budget file present: budget line + recommendation — typically (c) for low, (a)/(b) for medium/ok]

Reply:  go / a   — proceed full build
        b        — MUST-only scaffold
        c        — plan-only  [recommended if first time with this stack]
        tweak    — edit stack / scope / agent list
        cancel
```

Reply parsing per §3.4 of the approval-gate skill.
On cancel: append cancelled-run entry to `.hub/usage.json`, print `🚫 Cancelled. No files created.` and stop.

**Step 6 — Dispatch per the chosen alternative.**

- **(a) Full build** — dispatch agents in order from Step 4. Planner first (writes plan file). Database, backend, frontend in parallel where the planner's output permits. Devops last.
- **(b) MUST-only** — same dispatch order but each agent prompt starts with `SCOPE: MUSTs only — <list>. Do NOT implement SHOULDs/COULDs. Leave TODO markers where appropriate.`
- **(c) Plan-only** — dispatch only `hub:project-planner` to write `docs/PLAN-create-<slug>.md`. Return.

Per-agent prompt template:

```
Agent(
  subagent_type="<hub:...>",
  description="Create: <slice>",
  prompt=<<
    PROJECT: "$ARGUMENTS" (resolved: <stack>, <auth>, <hosting>, <db>)
    YOUR SLICE: <what this agent owns>
    SCOPE: <full | MUST-only>
    CONVENTIONS:
    - Follow the stack's idiomatic layout
    - Commit each logical milestone separately
    - Reference docs/PLAN-create-<slug>.md for integration points
    - Do not write files outside your slice
  >>
)
```

**Step 7 — Verification (all modes except plan-only).**
After the last specialist returns, run co-located validation scripts:

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/lint-and-validate/scripts/lint_runner.py .
python ${CLAUDE_PLUGIN_ROOT}/skills/testing-patterns/scripts/test_runner.py .
```

Report any reds to the user before finishing. Do not auto-fix at this step — surface and defer to the user.

**Step 8 — Write usage log (MANDATORY — use the Write tool, do not skip).**

Path: `.hub/usage.json` in the **user's current working directory** (their project), NOT inside `${CLAUDE_PLUGIN_ROOT}`.

1. Read `.hub/usage.json` if it exists → parse the JSON. If absent → start with `{"runs": []}`.
2. Append one entry to `runs`:
   - `id`: `"r_<YYYY-MM-DD>_<NNN>"` (today + zero-padded seq = existing length + 1)
   - `started_at` / `ended_at`: ISO-8601 UTC, `command`: `"/hub:create"`, `args`: stripped args
   - `tier_declared`: `"HEAVY"`, `tier_observed`: recomputed from output size
   - `approved`: `true` (or `false` if cancelled), `chosen_alternative`: `"a"` | `"b"` | `"c"`
   - `agents`: array of `{"name": "hub:<name>", "approx_tokens": <N>}` for each agent dispatched
   - `skills`: array of skills consumed, `files_written`: total integer sum across all agents
   - `approx_total_tokens`: sum across agents, `user_verdict`: `null`, `notes`: `null`
3. Write the updated JSON back using the **Write tool**.

**Step 9 — Print the inline HEAVY ledger.**

```
📒  /hub:create ledger
Ran: <N> of <M> planned agents <(+ any skipped, e.g. "devops skipped — local-only")>
Skills: <list>
Files written: <N>  (example: 23)
Approximate token share:
  hub:project-planner      <N>%   (~<N>k)
  hub:database-architect   <N>%   (~<N>k)
  hub:backend-specialist   <N>%   (~<N>k)
  hub:frontend-specialist  <N>%   (~<N>k)
  other (tooling, reads)   <N>%   (~<N>k)
Tier declared: HEAVY (80k–200k) · observed: ~<N>k (<in-tier ✓ | drift ✗>) · duration: <Xm Ys>
Lint/tests: <PASS | <N> issues>
Logged to .hub/usage.json (<run-id>)
Worth it? — you now have: <1-sentence summary of what exists on disk>.
    Tag later with /hub:ledger verdict <run-id> useful|wasted|partial
Next suggested: /hub:preview start   (LIGHT)  →  /hub:test <feature>   (MEDIUM)
```

---

## Usage

```
/hub:create blog site
/hub:create e-commerce app with product listing and cart
/hub:create todo app with auth and deploy to vercel
/hub:create CRM with customer management
/hub:create FastAPI service that exposes Gemini with function calling
/hub:create -y simple static portfolio site   (bypass gate)
```

---

## Cautions

- **If `pyproject.toml` / `package.json` already exists in the cwd, stop at the mini-gate and ask.** `/hub:create` is for greenfield. Enhancing an existing repo is `/hub:enhance`.
- **Never install dependencies or run `npm create` / `poetry new` without the user seeing the gate.**
- **Plan-only (c) is the safest default for unfamiliar stacks** — it's the cheapest way to surface scope surprises before committing to a full HEAVY run.
