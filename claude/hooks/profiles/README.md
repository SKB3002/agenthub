# KIT_HOOK_PROFILE — Hook intensity profiles

> An **agent-layer contract**, not a JSON loader. `claude/hooks/hooks.json` still ships empty on purpose. This directory documents four intensity levels that Claude applies through `PROTOCOL.md §6` — so users get predictable validation behaviour without editing JSON.

---

## Why not real Claude Code hooks?

Claude Code's hook config is read literally — it doesn't support includes or references. Shipping four pre-wired `hooks.json` variants would force users to either:

1. Copy-paste from a file every time they want to switch profile, or
2. Run a generator script that rewrites their `hooks.json` (destructive, surprising)

Both violate the kit's opt-in, no-surprises consent model. Instead, `KIT_HOOK_PROFILE` is an env var **Claude reads**. When set, the session runs the matching validation scripts at the right moments by protocol — not by Claude Code's hook loader.

Trade-off: the behaviour depends on Claude remembering `PROTOCOL.md §6` through the session. If context gets compacted aggressively, the contract can drift. If we see drift in practice, v0.4 will ship a real `apply-profile.py` that generates `hooks.json` on demand.

---

## Profiles

| Profile    | What Claude runs, when |
|---|---|
| `off` (default, or var unset) | Nothing. Current opt-in-via-copy-paste behaviour. |
| `minimal`  | After every `Edit` / `Write` / `MultiEdit` → `lint_runner.py` on the touched file. |
| `standard` | `minimal` + after every `Edit` / `Write` → `security_scan.py` on the touched file + at session `Stop` → `test_runner.py --summary`. |
| `strict`   | `standard` + before every `Bash` → quick `security_scan.py --pre-bash` + after DB-schema edits → `schema_validator.py` + after API-route edits → `api_validator.py`. |

Scripts live in `skills/<skill>/scripts/` and are referenced via `${CLAUDE_PLUGIN_ROOT}`. Same scripts real hooks would call — the only difference is that the agent invokes them on behalf of the user rather than Claude Code's hook loader firing them.

---

## Setting the profile

### Shell (temporary, for one session)

```bash
# bash/zsh
KIT_HOOK_PROFILE=standard claude

# PowerShell
$env:KIT_HOOK_PROFILE = "standard"; claude
```

### Shell (persistent)

Add one line to your shell rc:

```bash
export KIT_HOOK_PROFILE=standard
```

### Claude Code project config

If you want the profile to apply only to a specific project, put it in `.env` at the project root and source it from your shell before launching Claude Code. The kit does not auto-load `.env` — that's the shell's job.

---

## Checking the active profile

Inside Claude Code, ask: *"What KIT_HOOK_PROFILE is active this session?"* — Claude reads the env var and reports. There is intentionally no `/hub:profile` command — `KIT_HOOK_PROFILE` is a single-variable contract, and adding a slash command for it would put us over the 17-command cap for a trivial gain.

---

## Failure mode

If Claude doesn't run the expected script for your profile:

1. Check the env var is visible to Claude Code's process (not just your shell): `echo $KIT_HOOK_PROFILE` in the same terminal you launched Claude Code from.
2. Remind Claude in-session: "Reread `PROTOCOL.md §6` — what should run on the next Edit?" — this is the agent-layer equivalent of restarting a hook loader.
3. If drift persists across multiple sessions, drop back to `off` and copy the matching entries from [`claude/hooks/hooks.example.json`](../hooks.example.json) into [`claude/hooks/hooks.json`](../hooks.json). Real Claude Code hooks are deterministic; the agent-layer approach is not.

---

## Why no `.json` profile files ship here

Shipping `minimal.json`, `standard.json`, `strict.json` would tempt users to copy them into `hooks.json` directly — which then bypasses the consent model and the opt-in `hooks.example.json` curation. The profile definitions live in [`PROTOCOL.md §6`](../../PROTOCOL.md), the scripts live where they always have, and the env var connects them. Minimal new surface, no orphaned files.

If we move to real hooks in v0.4, the `.json` variants will live here and the README will point to a generator. Not yet.
