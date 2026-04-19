---
description: View or set the user's optional kit budget level. Fully opt-in — nothing else in the kit prompts for this.
argument-hint: [low|medium|ok|clear]
tier: LIGHT
tier-rationale: Read/write a single small JSON file at ~/.hub/budget.json. No agents, no skills beyond file I/O.
estimated-tokens: "<2k"
risk: None — local file only, no network, no side effects outside the budget file.
---

# /hub:budget — Optional budget declaration

$ARGUMENTS

> The kit never requires a budget. If you never run this command, the approval gate behaves identically to a world where this feature didn't exist. Setting a budget only **enriches** the HEAVY gate with an extra line and a default-alternative bias.

---

## Flow

**Step 1 — Resolve file path.**
- Project-local: `<project-root>/.hub/budget.json`
- Home-level:    `~/.hub/budget.json`

Project-local takes precedence on read. This command writes to **home** by default so the setting follows the user across projects. Pass `--here` (as a trailing flag) to write to the project file instead.

**Step 2 — Parse the sub-command.**

| `$ARGUMENTS` | Action |
|---|---|
| *empty*                     | SHOW — print current level from the effective file, or `no budget set` |
| `low` / `medium` / `ok`     | SET — write `{ "level": "<value>" }` (creates file if absent) |
| `clear`                     | CLEAR — delete the effective file (confirm first) |
| anything else               | Print usage help |

**Step 3 — SHOW mode.**

```
💰  /hub:budget

Effective file: <path>   |   (no budget set)
Level:          <low | medium | ok>
Reset day:      <monday | ... | unset>
Notes:          <free text | none>

The gate will: <one-line description of current behaviour>
  low     → recommend alternative (c) on HEAVY, warn explicitly
  medium  → show budget line, default to main plan
  ok      → minimal gate on HEAVY, default to main plan
  unset   → no budget-derived output at all
```

**Step 4 — SET mode.**

1. Read existing file (if any) to preserve `weekly_reset_day` and `notes`.
2. Merge `{ "level": "<value>" }`.
3. Create the directory and write the file (UTF-8, 2-space indent).
4. Print:

```
✅ Budget set to <level> at <path>
   Next HEAVY /hub:* command will show: <1-line preview of new gate behaviour>
```

**Step 5 — CLEAR mode.**

1. Resolve the effective file. If none exists, print `No budget file to clear.` and stop.
2. Show the file contents and ask: `Delete <path>? (y/N)`
3. On `y`: delete the file and print `🧹 Removed <path>. Budget is now unset.`
4. On anything else: print `Cancelled.` and stop.

**Step 6 — Schema (reference).**

```json
{
  "level": "low" | "medium" | "ok",
  "weekly_reset_day": "monday" | "tuesday" | ... | null,
  "notes": "free text" | null
}
```

Edit the file directly if you want to set `weekly_reset_day` or `notes` — this command only manages `level`, by design. No extra prompts, no wizards.

---

## Usage

```
/hub:budget                 # show current state
/hub:budget low             # set home-level budget to low
/hub:budget medium --here   # set project-level budget to medium
/hub:budget ok              # set home-level budget to ok
/hub:budget clear           # remove the effective budget file
```

---

## What this does NOT do

- Does not phone home or send any data anywhere
- Does not auto-prompt on other commands
- Does not learn, infer, or adapt the budget from your history
- Does not interact with Anthropic billing — we have no access to that

Fully local, fully optional, fully deletable (`rm ~/.hub/budget.json` works too).
