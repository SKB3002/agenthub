---
description: Translate a natural-language hook intent into a ready-to-paste hooks.json snippet that matches our schema. Never writes to hooks.json directly.
argument-hint: <what you want the hook to do>
tier: LIGHT
tier-rationale: One-pass generation of a JSON snippet. No agent dispatch, no file writes — user pastes manually.
estimated-tokens: "5k–10k"
risk: Generating a bad matcher regex or an unsafe Bash PreToolUse hook. Mitigated by guardrails + warnings in §3.
---

# /hub:hookify — Natural-language hook generator

$ARGUMENTS

> This command **never** writes to `claude/hooks/hooks.json`. It emits a JSON snippet and you paste it in yourself. That's the consent model — same as `.mcp.json` and `hooks.example.json`.

---

## Flow

**Step 1 — Parse intent.**

Extract from `$ARGUMENTS`:
- **Event:** `PreToolUse` / `PostToolUse` / `Stop` / `UserPromptSubmit` / `SessionStart`
- **Matcher:** tool name(s) the hook should fire for (e.g. `Edit`, `Write`, `Bash`, `Edit|Write|MultiEdit`)
- **File pattern:** if the user mentions file types (`.py`, `*.ts`), turn that into a matcher refinement
- **Action:** what to run — lint / test / security scan / custom shell command
- **Scope:** hook should be plugin-level (ships in `claude/hooks/hooks.json`) or project-level (user's own `.claude/settings.json`)

If any essential is unclear, ask **one** clarifying question max. Skip the question if the user's phrasing is unambiguous (e.g. `/hub:hookify on every Edit to a .py file, run ruff check --fix` — all essentials present).

**Step 2 — Map action → command.**

Prefer existing kit validation scripts over shell one-liners. The lookup table:

| User intent | Command to emit |
|---|---|
| lint / ruff / pylint / eslint     | `python ${CLAUDE_PLUGIN_ROOT}/skills/lint-and-validate/scripts/lint_runner.py` |
| type-check / mypy / tsc           | `python ${CLAUDE_PLUGIN_ROOT}/skills/lint-and-validate/scripts/type_coverage.py` |
| security scan / secrets / owasp   | `python ${CLAUDE_PLUGIN_ROOT}/skills/vulnerability-scanner/scripts/security_scan.py` |
| tests / pytest / jest             | `python ${CLAUDE_PLUGIN_ROOT}/skills/testing-patterns/scripts/test_runner.py` |
| schema validation                 | `python ${CLAUDE_PLUGIN_ROOT}/skills/database-design/scripts/schema_validator.py` |
| api contract                      | `python ${CLAUDE_PLUGIN_ROOT}/skills/api-patterns/scripts/api_validator.py` |
| accessibility / a11y              | `python ${CLAUDE_PLUGIN_ROOT}/skills/frontend-design/scripts/accessibility_checker.py` |
| seo                               | `python ${CLAUDE_PLUGIN_ROOT}/skills/seo-fundamentals/scripts/seo_checker.py` |
| lighthouse / perf                 | `python ${CLAUDE_PLUGIN_ROOT}/skills/performance-profiling/scripts/lighthouse_audit.py` |
| anything else                     | Emit the user's raw command, wrapped in a shell-safe way |

If the user's intent doesn't match the table, emit their literal command verbatim — do not invent.

**Step 3 — Safety guardrails (MANDATORY).**

Before printing the snippet, check for these red flags and warn:

1. **Bash `PreToolUse` hooks** — these can mutate or block Bash commands silently. Warn:
   ```
   ⚠  PreToolUse + Bash matcher can block or modify every Bash command the
      assistant runs. Keep the script fast (<500ms) and make sure it exits 0
      on the happy path — otherwise legitimate tool calls will be rejected.
   ```

2. **Absolute-path shell commands** — if the action includes `rm`, `sudo`, `> /`, or shell redirects with side effects, refuse to generate and ask the user to reformulate.

3. **Missing `${CLAUDE_PLUGIN_ROOT}`** — if the user supplies a custom Python script path, remind them the plugin-scope convention is `${CLAUDE_PLUGIN_ROOT}/path/to/script.py`. Never hardcode `C:\` or `/home/...` paths.

4. **Duplicate against `hooks.example.json`** — read `claude/hooks/hooks.example.json` once and, if the same matcher+command pair already exists there, point it out: `This hook is already in hooks.example.json at line N — you can copy it directly.`

**Step 4 — Emit the snippet.**

Output shape (always):

````
## Generated snippet

Paste this into `claude/hooks/hooks.json` (plugin-scope) or your project's
`.claude/settings.json` under the matching event:

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<matcher>",
        "hooks": [
          {
            "type": "command",
            "command": "<resolved command>"
          }
        ]
      }
    ]
  }
}
```

## Where to paste

- **Plugin-scope (affects every project that loads this plugin):** [claude/hooks/hooks.json](../claude/hooks/hooks.json) — currently ships empty on purpose
- **Project-scope (this repo only):** `.claude/settings.json` at the project root
- **User-scope (every project you work on):** `~/.claude/settings.json`

## How to test

1. Paste the snippet into the file above
2. Restart Claude Code (hooks are read at startup)
3. Trigger the matcher (e.g. edit a `.py` file for an `Edit`-matched PostToolUse)
4. Look for the hook's stdout in the Claude Code log

Rollback = delete the entry. Hooks are pure text.
````

If there were guardrail warnings in §3, print them above the snippet in a `⚠ Warnings` block. Never silently emit an unsafe hook.

**Step 5 — Footer (always).**

```
Related:
  claude/hooks/hooks.example.json  — reference catalog of pre-validated hooks
  claude/hooks/README.md           — full opt-in guide (matchers, events, examples)
  /hub:help hookify         — re-read this command
```

---

## What this does NOT do

- Does **not** write to `claude/hooks/hooks.json` or any `settings.json`
- Does **not** restart Claude Code for the user
- Does **not** register a hook with an event name it doesn't recognize — if the user says `on save`, it asks which Claude Code event they mean
- Does **not** generate hooks for non-existent validation scripts — the mapping table is checked against actual files in `skills/<skill>/scripts/` at invocation time

---

## Usage

```
/hub:hookify on every Edit to a .py file, run ruff check --fix
/hub:hookify after any Write, run the security scan
/hub:hookify on Stop, run the test summary
/hub:hookify before any Bash command, check for dangerous operations
/hub:hookify on UserPromptSubmit, echo "active"
```
