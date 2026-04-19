---
name: hookify
description: Convert natural language to a Codex hook/trigger snippet. Never writes hook config itself.
argument-hint: <nl description of what to automate>
tier: LIGHT
estimated-tokens: "<2k"
platform: codex
---

# /hub:hookify — Hook Snippet Generator

$ARGUMENTS

Generate a Codex-compatible hook/trigger snippet from a natural language description.

Mapping table:
- lint → `skills/lint-and-validate/scripts/lint_runner.py`
- security → `skills/vulnerability-scanner/scripts/security_scan.py`
- tests → `skills/testing-patterns/scripts/test_runner.py`
- accessibility → `skills/frontend-design/scripts/accessibility_checker.py`

Guardrails:
- Never write to the hook config file directly
- Warn on shell commands with high blast radius (rm, sudo)
- Remind the user to set `${CODEX_PLUGIN_ROOT}` correctly

Output: the snippet only. User copies it into their Codex trigger config manually.
