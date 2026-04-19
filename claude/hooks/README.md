---
description: How to enable optional automation hooks — off by default.
---

# Hooks — Opt-In Automation

`hooks.json` ships **empty on purpose**. The kit never runs scripts on your code without consent. Enable only the hooks you want.

---

## What are hooks?

Claude Code hooks fire on specific events (`PostToolUse`, `PreToolUse`, `Stop`, `UserPromptSubmit`, etc.) and run shell commands. They let you wire in lint, security scans, or test summaries automatically.

See: https://docs.claude.com/en/docs/claude-code/hooks

---

## How to enable

1. Open `claude/hooks/hooks.example.json` and pick the entries you want
2. Copy them into `claude/hooks/hooks.json` (replacing the empty arrays)
3. Restart Claude Code (or reload the plugin) so the new config is picked up

> JSON does **not** support comments. Do not copy the `_doc` key into `hooks.json` — remove it when you move entries across.

---

## Available hooks

| Event | Script | What it does | When it fires |
|-------|--------|--------------|---------------|
| `PostToolUse` | `skills/lint-and-validate/scripts/lint_runner.py` | Auto-lint files after edits | After `Edit`, `Write`, `MultiEdit` |
| `PostToolUse` | `skills/vulnerability-scanner/scripts/security_scan.py` | Scan changed files for secrets / unsafe patterns | After `Edit`, `Write` |
| `PreToolUse` | `skills/vulnerability-scanner/scripts/security_scan.py --pre-bash` | Warn before dangerous bash commands | Before `Bash` |
| `Stop` | `skills/testing-patterns/scripts/test_runner.py --summary` | Print test status at end of turn | Session end |
| `UserPromptSubmit` | `echo "agenthub active"` | Trivial banner — useful for verifying the plugin loaded | Every user message |

---

## Writing your own hook

Point the command at any script inside `skills/<skill>/scripts/`, or to your own project. Use the `${CLAUDE_PLUGIN_ROOT}` env var so the config is portable:

```json
{
  "matcher": "Edit",
  "hooks": [
    {
      "type": "command",
      "command": "python ${CLAUDE_PLUGIN_ROOT}/skills/my-skill/scripts/my_script.py"
    }
  ]
}
```

---

## Why off by default

Auto-runs on every edit are noisy and slow — they can add seconds to each tool call and flood the transcript with output. The kit prefers that you **opt in per hook**, so every automation you get is one you asked for.

---

## Troubleshooting

- **Hook not firing:** check the `matcher` regex and confirm Claude Code picked up `hooks.json` (restart the session)
- **Python not found:** ensure `python` resolves on your PATH, or replace `python` with `python3` or an absolute interpreter path
- **Windows line endings / paths:** the `${CLAUDE_PLUGIN_ROOT}` variable is expanded by Claude Code, not the shell — use it exactly as shown
