# Instincts YAML Schema

> Authoritative reference for `.hub/instincts.yaml` (project scope) and `~/.claude/kit/instincts.yaml` (global scope).

The file is a YAML sequence of instinct entries. No wrapper object, no version header — entries are self-describing.

---

## Entry shape

```yaml
- id: <kebab-case slug, unique within the file>
  trigger: <short phrase describing when the instinct applies>
  action: <imperative phrase describing what to do>
  domain: <dotted or hyphenated domain tag>
  confidence: <float 0.0–1.0>
  evidence:
    - <one-line note>
    - <one-line note>
  scope: project | global
  project_id: <repo name or slug; optional for global>
  created: <YYYY-MM-DD>
  last_seen: <YYYY-MM-DD>
```

### Field rules

| Field | Required | Notes |
|---|---|---|
| `id`         | yes | Kebab-case, ≤ 40 chars. Must be unique within the file. Pick a slug that reads well in a log line: `prefer-httpx-over-requests`, not `instinct-7`. |
| `trigger`    | yes | When the instinct applies. One clause. Good: "writing Python HTTP client code". Bad: "all the time". |
| `action`     | yes | What to do. Imperative. Good: "use httpx, not requests". Bad: "consider httpx maybe". |
| `domain`     | yes | One of: `python-backend`, `frontend-react`, `frontend-vue`, `mobile-ios`, `mobile-android`, `devops`, `database`, `testing`, `docs`, or a custom slug. Agents filter by this. |
| `confidence` | yes | 0.0–1.0 float. Minted by `@hub instincts promote` from session evidence (see SKILL.md §5). |
| `evidence`   | yes | ≥1 short note. Evidence is user-readable — aim for something that still makes sense in six months. |
| `scope`      | yes | `project` or `global`. Must match the file the entry lives in. |
| `project_id` | conditional | Required on global entries (to show which project(s) sourced it). Optional on project entries. |
| `created`    | yes | ISO date when the entry was first promoted. |
| `last_seen`  | yes | ISO date when the instinct was most recently cited or re-confirmed. Updated manually or by future tooling. |

---

## Worked example — project scope

`/path/to/my-fastapi-app/.hub/instincts.yaml`:

```yaml
- id: prefer-httpx-over-requests
  trigger: writing Python HTTP client code
  action: use httpx, not requests
  domain: python-backend
  confidence: 0.75
  evidence:
    - replaced requests with httpx in commits a1b2c3, d4e5f6, g7h8i9
    - pyproject.toml declares httpx as direct dep
    - team chose httpx for async support
  scope: project
  project_id: my-fastapi-app
  created: 2026-04-19
  last_seen: 2026-04-19

- id: integration-tests-hit-real-db
  trigger: writing integration tests for data-layer code
  action: use a real database, not a mock
  domain: testing
  confidence: 0.95
  evidence:
    - mock-based test passed while prod migration broke in Q1 2026
    - team decision — see docs/DECISIONS-2026-Q1.md
  scope: project
  created: 2026-04-19
  last_seen: 2026-04-19
```

---

## Worked example — global scope

`~/.claude/kit/instincts.yaml`:

```yaml
- id: prefer-httpx-over-requests
  trigger: writing Python HTTP client code
  action: use httpx, not requests
  domain: python-backend
  confidence: 0.82
  evidence:
    - saw this pattern in projects: my-fastapi-app, llm-gateway, internal-tools
    - all three standardized on httpx independently
  scope: global
  project_id: my-fastapi-app  # first project where it was seen
  created: 2026-04-19
  last_seen: 2026-04-19
```

Note: global entries only come into being when the same `trigger` + `action` exists in ≥2 project files at confidence ≥ 0.8 (see SKILL.md §5).

---

## Invariants (validated by `@hub instincts promote` at write time)

1. `id` is unique within the file
2. `confidence` ∈ [0.0, 1.0]
3. `scope` matches the file the entry lives in
4. `created` ≤ `last_seen`
5. `evidence` is non-empty
6. YAML is valid (no tabs, no duplicate keys)

If any invariant is violated at read time, `@hub instincts show` reports the specific entry and refuses to render it — but does not modify the file. User fixes manually.

---

## Editing the file by hand

Safe. The format is plain YAML. Rules:

- Don't delete entries you want to keep — use `@hub instincts clear <id>` or just remove the YAML block
- Don't raise `confidence` above what the evidence supports — defeats the purpose
- If you edit, bump `last_seen` to today
- Don't share the global file via dotfiles repos that sync across machines — it's machine-scope by design

If you change the file and it breaks YAML, `@hub instincts show` will tell you which line. No silent corruption.
